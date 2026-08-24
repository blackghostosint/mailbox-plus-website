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
};

const TIER_NAMES: Record<string, string> = {
  small_mail_only: 'Small · Mail Only',
  small_packages10: 'Small · +10 Packages',
  large_mail_only: 'Large · Mail Only',
  large_packages10: 'Large · +10 Packages',
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

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: price.id, quantity: 1 }],
      // Per locked capture split: email + current address + phone
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      // Per "Completely risk-free / no lock-in": month-to-month subscription, cancel anytime
      subscription_data: {
        metadata: {
          tier,
          product: TIER_NAMES[tier],
          source: 'private-mailbox-rental',
        },
      },
      metadata: {
        tier,
        product: TIER_NAMES[tier],
        source: 'private-mailbox-rental',
      },
      success_url: `${siteUrl}/private-mailbox-rental/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/private-mailbox-rental/`,
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
