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

import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

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

const json = (code: number, body: unknown) => ({
  statusCode: code,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: '',
    };
  }
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return json(500, { error: 'Stripe is not configured' });
  }

  const sessionId = (event.queryStringParameters?.session_id || '').trim();
  // Stripe session IDs: cs_test_... / cs_live_..., alphanumeric + underscore
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return json(400, { error: 'Invalid session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    const paid = session.payment_status === 'paid' || session.status === 'complete';
    if (!paid) {
      return json(402, { error: 'Session not paid' });
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

    return json(200, {
      ok: true,
      tier: tier || null,
      product: session.metadata?.product || tierInfo?.name || 'Mailbox Rental',
      amount,
      currency: (session.currency || 'usd').toUpperCase(),
    });
  } catch (err: any) {
    // Invalid/unknown session → 404 without detail (don't leak error strings)
    console.error('verify-session error:', err?.message || err);
    return json(404, { error: 'Session not found' });
  }
};
