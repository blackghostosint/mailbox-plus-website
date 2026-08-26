// create-checkout.ts — Netlify Function: creates a Stripe Checkout Session for a PMB tier
// Direct-to-Stripe flow (Frank, 2026-08-23): the sales page "Choose [tier]" button posts here,
// this builds a Checkout Session with the tier's Price, and redirects the customer to Stripe.
// Stripe Checkout captures email + current address + phone (per the locked capture split).
// Centralized config: tier → lookup key (matches vault _config/PRICING-AND-FEES.md).

import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Tier → Stripe Price lookup key (single source: vault _config/PRICING-AND-FEES.md)
const TIER_LOOKUP_KEYS: Record<string, string> = {
  small_mail_only: 'pmb_small_mail_only_monthly',
  small_packages10: 'pmb_small_packages10_monthly',
  large_mail_only: 'pmb_large_mail_only_monthly',
  large_packages10: 'pmb_large_packages10_monthly',
  // Business tiers (2026-08-25) — prices live in Stripe: pmb_biz_small_monthly / pmb_biz_large_monthly
  business_small: 'pmb_biz_small_monthly',
  business_large: 'pmb_biz_large_monthly',
};

const TIER_NAMES: Record<string, string> = {
  small_mail_only: 'Small · Mail Only',
  small_packages10: 'Small · +10 Packages',
  large_mail_only: 'Large · Mail Only',
  large_packages10: 'Large · +10 Packages',
  business_small: 'Business Small',
  business_large: 'Business Large',
};

// Where the checkout came from — distinguishes consumer vs business signups in Stripe
const TIER_SOURCES: Record<string, string> = {
  small_mail_only: 'private-mailbox-rental',
  small_packages10: 'private-mailbox-rental',
  large_mail_only: 'private-mailbox-rental',
  large_packages10: 'private-mailbox-rental',
  business_small: 'home-business-mailbox-rental',
  business_large: 'home-business-mailbox-rental',
};

// Cancel URL per tier — business checkouts return to the business page
const TIER_CANCEL_URLS: Record<string, string> = {
  small_mail_only: '/private-mailbox-rental/',
  small_packages10: '/private-mailbox-rental/',
  large_mail_only: '/private-mailbox-rental/',
  large_packages10: '/private-mailbox-rental/',
  business_small: '/home-business/mailbox-rental/',
  business_large: '/home-business/mailbox-rental/',
};

// One-time key deposit, charged on the FIRST invoice at account creation (2026-08-25).
// Lookup key lives on the one-time price under the "Mailbox Plus Fees" product.
const KEY_DEPOSIT_LOOKUP_KEY = 'pmb_fee_key_deposit';
const KEY_DEPOSIT_DISPLAY_NAME = 'Key deposit (refundable)';

// Tiers that include "Text + email alerts on every item" (per PRICING-AND-FEES.md).
// Only these require the A2P 10DLC SMS consent affirmation at checkout (Clause 13).
// Mail-only tiers never send SMS and do NOT show the consent field.
const TIER_HAS_SMS: Record<string, boolean> = {
  small_packages10: true,
  large_packages10: true,
  business_small: true,
  business_large: true,
};

export const handler: Handler = async (event) => {
  // CORS headers (needed if called cross-origin; same-origin via /api/* proxy)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Stripe is not configured on the server' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { tier } = body;

    if (!tier || !TIER_LOOKUP_KEYS[tier]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: `Invalid tier. Must be one of: ${Object.keys(TIER_LOOKUP_KEYS).join(', ')}`,
        }),
      };
    }

    // Success/cancel URLs — use SITE_URL (set by Netlify context) or default to production
    const siteUrl = process.env.SITE_URL || 'https://mailboxplusohio.com';

    // Resolve the tier's lookup key to a Price ID (Checkout line_items.price needs the ID)
    const prices = await stripe.prices.list({
      lookup_keys: [TIER_LOOKUP_KEYS[tier]],
      limit: 1,
      expand: ['data'],
    });
    const price = prices.data[0];
    if (!price) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Price not found for tier: ${tier}` }),
      };
    }

    // Resolve the one-time key deposit price (billed on the first invoice at account creation)
    const depositPrices = await stripe.prices.list({
      lookup_keys: [KEY_DEPOSIT_LOOKUP_KEY],
      limit: 1,
    });
    const depositPrice = depositPrices.data[0];
    if (!depositPrice) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Price not found for: ${KEY_DEPOSIT_LOOKUP_KEY}` }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: price.id, quantity: 1 },
        // One-time key deposit — shows at checkout, charged on the initial invoice only
        { price: depositPrice.id, quantity: 1 },
      ],
      // Per locked capture split: email + current address + phone
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      // A2P 10DLC SMS consent (Clause 13) — required ONLY on tiers that include text alerts.
      // Records an affirmative typed consent + phone + timestamp on the session for Twilio.
      custom_fields: TIER_HAS_SMS[tier]
        ? [
            {
              key: 'sms_consent',
              label: { type: 'custom', custom: 'Type YES to consent to SMS text alerts' },
              optional: false,
              type: 'text',
              text: { minimum_length: 1, maximum_length: 100 },
            },
          ]
        : [],
      // Per "Completely risk-free / no lock-in": month-to-month subscription, cancel anytime
      subscription_data: {
        metadata: {
          tier,
          product: TIER_NAMES[tier],
          source: TIER_SOURCES[tier],
        },
      },
      metadata: {
        tier,
        product: TIER_NAMES[tier],
        source: TIER_SOURCES[tier],
      },
      success_url: `${siteUrl}/thank-you/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${TIER_CANCEL_URLS[tier]}`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err: any) {
    console.error('create-checkout error:', err?.message || err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
};
