import { Handler } from '@netlify/functions';
import { db } from './lib/db';
import { z } from 'zod';
import { registry, createValidationErrorResponse, ErrorResponseSchema } from './lib/openapi-registry';

export const ReferralQuerySchema = z
  .object({
    code: z.string().min(1, 'Referral code is required'),
  })
  .openapi('ReferralQuery');

export const ReferralResponseSchema = z
  .object({
    valid: z.boolean(),
    referrerName: z.string().optional(),
    error: z.string().optional(),
    details: z.any().optional(),
  })
  .openapi('ReferralResponse');

export type ReferralQuery = z.infer<typeof ReferralQuerySchema>;
export type ReferralResponse = z.infer<typeof ReferralResponseSchema>;

registry.registerPath({
  method: 'get',
  path: '/.netlify/functions/referral',
  summary: 'Validate referral code and record referral visit',
  request: {
    query: ReferralQuerySchema,
  },
  responses: {
    200: {
      description: 'Referral code validation response',
      content: {
        'application/json': {
          schema: ReferralResponseSchema,
        },
      },
    },
    400: {
      description: 'Missing or invalid query parameters',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: 'Referral code not found or expired',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

export const handler: Handler = async (event: any) => {
  const method = event.httpMethod;

  try {
    if (method !== 'GET') {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const queryParams = event.queryStringParameters || {};
    const parseResult = ReferralQuerySchema.safeParse(queryParams);
    if (!parseResult.success) {
      return createValidationErrorResponse(parseResult.error);
    }

    const { code } = parseResult.data;

    const customer = await db.getCustomerByReferralCode(code);
    if (!customer) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Referral code is invalid or expired' }),
      };
    }

    const clientIp =
      event.headers['client-ip'] || event.headers['x-nf-client-connection-ip'] || 'unknown';
    await db.logReferralVisit(code, clientIp);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valid: true,
        referrerName: customer.firstName,
      }),
    };
  } catch (error) {
    console.error('Referral API error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export default handler;
