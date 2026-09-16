import { Handler } from '@netlify/functions';
import { db } from './lib/db';
import { z } from 'zod';
import { registry, createValidationErrorResponse, ErrorResponseSchema } from './lib/openapi-registry';
import { CustomerSchema } from './customer';

export const MeQuerySchema = z
  .object({
    id: z.string().optional(),
    code: z.string().optional(),
  })
  .refine((data) => !!(data.id || data.code), {
    message: 'Missing parameter: id or code',
  })
  .openapi('MeQuery');

export const MeResponseSchema = CustomerSchema.extend({
  activities: z.array(z.any()).optional(),
}).openapi('MeResponse');

export type MeQuery = z.infer<typeof MeQuerySchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;

registry.registerPath({
  method: 'get',
  path: '/.netlify/functions/me',
  summary: 'Get customer profile and activities by ID or referral code',
  request: {
    query: MeQuerySchema,
  },
  responses: {
    200: {
      description: 'Customer profile with activity history',
      content: {
        'application/json': {
          schema: MeResponseSchema,
        },
      },
    },
    400: {
      description: 'Missing required query parameters',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: 'Customer not found',
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
    const parseResult = MeQuerySchema.safeParse(queryParams);
    if (!parseResult.success) {
      return createValidationErrorResponse(parseResult.error);
    }

    const { id, code } = parseResult.data;

    let customer = null;
    if (id) {
      customer = await db.getCustomer(id);
    } else if (code) {
      customer = await db.getCustomerByReferralCode(code);
    }

    if (!customer) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Customer not found' }),
      };
    }

    const activities = await db.getTransactions(customer.id);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...customer,
        activities,
      }),
    };
  } catch (error) {
    console.error('Me API error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export default handler;
