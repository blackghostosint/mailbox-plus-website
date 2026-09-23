// create-checkout.ts — Netlify Function: creates a Stripe Checkout Session for a PMB tier
// Direct-to-Stripe flow (Frank, 2026-08-23): the sales page "Choose [tier]" button posts here,
// this builds a Checkout Session with the tier's Price, and redirects the customer to Stripe.
// Stripe Checkout captures email + current address + phone (per the locked capture split).
// Centralized config: tier → lookup key (matches vault _config/PRICING-AND-FEES.md).

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { withCors, jsonResponse, jsonError, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';
import { logger } from './lib/logger';
import { CreateCheckoutRequestSchema, CreateCheckoutSuccessSchema } from './lib/contracts';
import { getPmbTier, getPmbTierKeys, KEY_DEPOSIT_LOOKUP_KEY } from './lib/pmb-tiers';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_stripe_secret_key');

export default withCors(
  async (request: Request) => {
    if (request.method !== 'POST') {
      return jsonError('Method not allowed', 405);
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return jsonError('Stripe is not configured on the server', 500);
    }

    try {
      const body = await request.json().catch(() => ({}));
      const parsed = CreateCheckoutRequestSchema.safeParse(body);

      if (!parsed.success) {
        return jsonError(`Invalid tier. Must be one of: ${getPmbTierKeys().join(', ')}`, 400);
      }
      const { tier } = parsed.data;
      const tierConfig = getPmbTier(tier);
      if (!tierConfig) {
        return jsonError(`Invalid tier. Must be one of: ${getPmbTierKeys().join(', ')}`, 400);
      }

      // Success/cancel URLs — use SITE_URL (set by Netlify context) or default to production
      const siteUrl = process.env.SITE_URL || 'https://mailboxplusohio.com';

      // Resolve the tier's lookup key to a Price ID (Checkout line_items.price needs the ID)
      const prices = await stripe.prices.list({
        lookup_keys: [tierConfig.lookupKey],
        limit: 1,
        expand: ['data'],
      });
      const price = prices.data[0];
      if (!price) {
        return jsonError(`Price not found for tier: ${tier}`, 500);
      }

      // Resolve the one-time key deposit price (billed on the first invoice at account creation)
      const depositPrices = await stripe.prices.list({
        lookup_keys: [KEY_DEPOSIT_LOOKUP_KEY],
        limit: 1,
      });
      const depositPrice = depositPrices.data[0];
      if (!depositPrice) {
        return jsonError(`Price not found for: ${KEY_DEPOSIT_LOOKUP_KEY}`, 500);
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
        // Native ToS acceptance checkbox (2026-08-26): renders "I agree to the Terms" with a
        // link to the ToS URL set in Stripe Dashboard → Settings → Public details.
        // Acceptance is recorded on the Customer object with IP + user-agent — a stronger
        // audit record than prose, and applies to ALL tiers (everyone signs the rental terms).
        consent_collection: { terms_of_service: 'required' },
        // A2P 10DLC SMS consent (Clause 13) — required ONLY on tiers that include text alerts.
        // Records an affirmative typed consent + phone + timestamp on the session for Twilio.
        custom_fields: tierConfig.hasSmsConsent
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
            product: tierConfig.name,
            source: tierConfig.source,
          },
        },
        metadata: {
          tier,
          product: tierConfig.name,
          source: tierConfig.source,
        },
        success_url: `${siteUrl}/thank-you/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}${tierConfig.cancelUrl}`,
      });

      const responsePayload = CreateCheckoutSuccessSchema.parse({ url: session.url || '' });
      return jsonResponse(responsePayload, 200);
    } catch (err: any) {
      logger.error('create-checkout error', err);
      return jsonError('Failed to create checkout session', 500);
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS, rateLimit: { maxRequests: 10, windowMs: 60 * 1000 } }
);
