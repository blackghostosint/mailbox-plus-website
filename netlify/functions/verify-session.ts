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
import { VerifySessionQuerySchema, VerifySessionSuccessSchema } from './lib/contracts';
import { getPmbTier } from './lib/pmb-tiers';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_stripe_secret_key');

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
    const rawSessionId = (url.searchParams.get('session_id') || '').trim();
    const queryParsed = VerifySessionQuerySchema.safeParse({ session_id: rawSessionId });
    if (!queryParsed.success) {
      return jsonError('Invalid session_id', { status: 400, headers: NO_CACHE_HEADERS });
    }
    const sessionId = queryParsed.data.session_id;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription'],
      });

      const paid = session.payment_status === 'paid' || session.status === 'complete';
      if (!paid) {
        return jsonError('Session not paid', { status: 402, headers: NO_CACHE_HEADERS });
      }

      const tier = (session.metadata?.tier || '').trim();
      const tierInfo = getPmbTier(tier);

      // Prefer the actual amount from Stripe; fall back to the tier table.
      let amount = tierInfo?.monthlyPrice ?? 0;
      if (typeof session.amount_total === 'number' && session.amount_total > 0) {
        // amount_total includes the key deposit line on first invoice — that's
        // what the customer actually paid, so it's the honest pixel value.
        amount = session.amount_total / 100;
      }

      const responsePayload = VerifySessionSuccessSchema.parse({
        ok: true as const,
        tier: tier || null,
        product: session.metadata?.product || tierInfo?.name || 'Mailbox Rental',
        amount,
        currency: (session.currency || 'usd').toUpperCase(),
      });

      return jsonResponse(responsePayload, { status: 200, headers: NO_CACHE_HEADERS });
    } catch (err: any) {
      // Invalid/unknown session → 404 without detail (don't leak error strings)
      logger.error('verify-session error', { sessionId }, err);
      return jsonError('Session not found', { status: 404, headers: NO_CACHE_HEADERS });
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS, rateLimit: { maxRequests: 10, windowMs: 60 * 1000 } }
);
