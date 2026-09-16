import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { z } from 'zod';
import { registry, createValidationErrorResponse, ErrorResponseSchema } from './lib/openapi-registry';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'stripe_key_placeholder');

const TIER_LOOKUP_KEYS: Record<string, string> = {
  small_mail_only: 'pmb_small_mail_only_monthly',
  small_packages10: 'pmb_small_packages10_monthly',
  large_mail_only: 'pmb_large_mail_only_monthly',
  large_packages10: 'pmb_large_packages10_monthly',
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

const TIER_SOURCES: Record<string, string> = {
  small_mail_only: 'private-mailbox-rental',
  small_packages10: 'private-mailbox-rental',
  large_mail_only: 'private-mailbox-rental',
  large_packages10: 'private-mailbox-rental',
  business_small: 'home-business-mailbox-rental',
  business_large: 'home-business-mailbox-rental',
};

const TIER_CANCEL_URLS: Record<string, string> = {
  small_mail_only: '/private-mailbox-rental/',
  small_packages10: '/private-mailbox-rental/',
  large_mail_only: '/private-mailbox-rental/',
  large_packages10: '/private-mailbox-rental/',
  business_small: '/home-business/mailbox-rental/',
  business_large: '/home-business/mailbox-rental/',
};

const KEY_DEPOSIT_LOOKUP_KEY = 'pmb_fee_key_deposit';

const TIER_HAS_SMS: Record<string, boolean> = {
  small_packages10: true,
  large_packages10: true,
  business_small: true,
  business_large: true,
};

export const CreateCheckoutRequestSchema = z
  .object({
    tier: z.string().min(1, 'tier is required'),
  })
  .openapi('CreateCheckoutRequest');

export const CreateCheckoutResponseSchema = z
  .object({
    url: z.string().optional(),
    error: z.string().optional(),
    details: z.any().optional(),
  })
  .openapi('CreateCheckoutResponse');

export type CreateCheckoutRequest = z.infer<typeof CreateCheckoutRequestSchema>;
export type CreateCheckoutResponse = z.infer<typeof CreateCheckoutResponseSchema>;

registry.registerPath({
  method: 'post',
  path: '/.netlify/functions/create-checkout',
  summary: 'Create Stripe Checkout Session for mailbox rental',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCheckoutRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Stripe Checkout URL',
      content: {
        'application/json': {
          schema: CreateCheckoutResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation failed or invalid tier',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Stripe API or server configuration error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

export const handler: Handler = async (event) => {
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

  let bodyData: any;
  try {
    bodyData = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const parseResult = CreateCheckoutRequestSchema.safeParse(bodyData);
  if (!parseResult.success) {
    return createValidationErrorResponse(parseResult.error);
  }

  const { tier } = parseResult.data;

  if (!TIER_LOOKUP_KEYS[tier]) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: `Invalid tier. Must be one of: ${Object.keys(TIER_LOOKUP_KEYS).join(', ')}`,
      }),
    };
  }

  try {
    const siteUrl = process.env.SITE_URL || 'https://mailboxplusohio.com';

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
        { price: depositPrice.id, quantity: 1 },
      ],
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      consent_collection: { terms_of_service: 'required' },
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

export default handler;
