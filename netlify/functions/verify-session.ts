// verify-session.ts — Netlify Function: server-side retrieval of a completed
// Stripe Checkout Session so the thank-you page can fire an ACCURATE Purchase
// event (Meta pixel + GA4) with the real tier name and amount.
//
// Why server-side: the page must never hold the Stripe secret key, and session
// IDs in the URL are client-editable — the function treats them as untrusted.
//
// Security posture:
// - GET only; session_id must match Stripe's cs_... format (rejects injection).
// - Returns ONLY the non-sensitive fields the pixel needs (tier name, display
//   amount, currency). Never returns customer PII (email, address, phone).
// - Payment status must be "paid" (or the subscription's initial invoice paid).

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { withCors, jsonResponse, jsonError, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';
import { logger } from './lib/logger';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_stripe_secret_key');

// Tier metadata → human name + monthly display price (for pixel value).
// Amount is NOT trusted from here for revenue reporting — Stripe is the source
// of truth at webhook time; this is the client-side pixel value only.
const TIER_LABELS: Record<string, { name: string; monthly: number }> = {
  small_mail_only: { name: 'Small Mail Only', monthly: 15 },
  small_packages10: { name: 'Small +10 Packages', monthly: 25 },
  large_mail_only: { name: 'Large Mail Only', monthly: 30 },
  large_packages10: { name: 'Large +10 Packages', monthly: 40 },
  business_small: { name: 'Business Small', monthly: 35 },
  business_large: { name: 'Business Large', monthly: 50 },
};

const NO_CACHE_HEADERS = { 'Cache-Control': 'no-store' };

export default withCors(
  async (request: Request) => {
    if (request.method !== 'GET') {
      return jsonError('Method not allowed', { status: 405, headers: NO_CACHE_HEADERS });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return jsonError('Stripe is not configured', { status: 500, headers: NO_CACHE_HEADERS });
    }

    const url = new URL(request.url);
    const sessionId = (url.searchParams.get('session_id') || '').trim();
    // Stripe session IDs: cs_test_... / cs_live_..., alphanumeric + underscore
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      return jsonError('Invalid session_id', { status: 400, headers: NO_CACHE_HEADERS });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription'],
      });

      const paid = session.payment_status === 'paid' || session.status === 'complete';
      if (!paid) {
        return jsonError('Session not paid', { status: 402, headers: NO_CACHE_HEADERS });
      }

      const tier = (session.metadata?.tier || '').trim();
      const tierInfo = TIER_LABELS[tier];

      // Prefer the actual amount from Stripe; fall back to the tier table.
      let amount = tierInfo?.monthly ?? 0;
      if (typeof session.amount_total === 'number' && session.amount_total > 0) {
        // amount_total includes the key deposit line on first invoice — that's
        // what the customer actually paid, so it's the honest pixel value.
        amount = session.amount_total / 100;
      }

      return jsonResponse(
        {
          ok: true,
          tier: tier || null,
          product: session.metadata?.product || tierInfo?.name || 'Mailbox Rental',
          amount,
          currency: (session.currency || 'usd').toUpperCase(),
        },
        { status: 200, headers: NO_CACHE_HEADERS }
      );
    } catch (err: any) {
      // Invalid/unknown session → 404 without detail (don't leak error strings)
      logger.error('verify-session error', { sessionId }, err);
      return jsonError('Session not found', { status: 404, headers: NO_CACHE_HEADERS });
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS, rateLimit: { maxRequests: 10, windowMs: 60 * 1000 } }
);
