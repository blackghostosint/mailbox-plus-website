import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { z } from 'zod';
import { registry, createValidationErrorResponse, ErrorResponseSchema } from './lib/openapi-registry';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const TIER_LABELS: Record<string, { name: string; monthly: number }> = {
  small_mail_only: { name: 'Small Mail Only', monthly: 15 },
  small_packages10: { name: 'Small +10 Packages', monthly: 25 },
  large_mail_only: { name: 'Large Mail Only', monthly: 30 },
  large_packages10: { name: 'Large +10 Packages', monthly: 40 },
  business_small: { name: 'Business Small', monthly: 35 },
  business_large: { name: 'Business Large', monthly: 50 },
};

export const VerifySessionQuerySchema = z
  .object({
    session_id: z.string().regex(/^cs_(test|live)_[A-Za-z0-9]+$/, 'Invalid session_id format'),
  })
  .openapi('VerifySessionQuery');

export const VerifySessionResponseSchema = z
  .object({
    ok: z.boolean().optional(),
    tier: z.string().nullable().optional(),
    product: z.string().optional(),
    amount: z.number().optional(),
    currency: z.string().optional(),
    error: z.string().optional(),
    details: z.any().optional(),
  })
  .openapi('VerifySessionResponse');

export type VerifySessionQuery = z.infer<typeof VerifySessionQuerySchema>;
export type VerifySessionResponse = z.infer<typeof VerifySessionResponseSchema>;

registry.registerPath({
  method: 'get',
  path: '/.netlify/functions/verify-session',
  summary: 'Verify Stripe Checkout session',
  request: {
    query: VerifySessionQuerySchema,
  },
  responses: {
    200: {
      description: 'Session verification payload',
      content: {
        'application/json': {
          schema: VerifySessionResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid query parameters',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: 'Session not found',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

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

  const queryParams = event.queryStringParameters || {};
  const parseResult = VerifySessionQuerySchema.safeParse(queryParams);
  if (!parseResult.success) {
    return createValidationErrorResponse(parseResult.error);
  }

  const { session_id: sessionId } = parseResult.data;

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

    let amount = tierInfo?.monthly ?? 0;
    if (typeof session.amount_total === 'number' && session.amount_total > 0) {
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
    console.error('verify-session error:', err?.message || err);
    return json(404, { error: 'Session not found' });
  }
};

export default handler;
