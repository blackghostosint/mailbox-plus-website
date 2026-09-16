import { Handler } from '@netlify/functions';
import { db, Transaction } from './lib/db';
import crypto from 'crypto';
import { z } from 'zod';
import { registry, createValidationErrorResponse, ErrorResponseSchema } from './lib/openapi-registry';

export const TransactRequestSchema = z
  .object({
    customerId: z.string().min(1, 'customerId is required'),
    type: z.enum(['Earned', 'Redeemed']),
    desc: z.string().min(1, 'desc is required'),
    amount: z.number().min(0.01, 'amount must be greater than 0'),
  })
  .openapi('TransactRequest');

export const TransactionSchema = z
  .object({
    id: z.string(),
    customerId: z.string(),
    date: z.string(),
    type: z.string(),
    desc: z.string(),
    amount: z.number(),
  })
  .openapi('Transaction');

export type TransactRequest = z.infer<typeof TransactRequestSchema>;
export type TransactionType = z.infer<typeof TransactionSchema>;

registry.registerPath({
  method: 'post',
  path: '/.netlify/functions/transact',
  summary: 'Record a points transaction (earned or redeemed)',
  request: {
    body: {
      content: {
        'application/json': {
          schema: TransactRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Transaction recorded successfully',
      content: {
        'application/json': {
          schema: TransactionSchema,
        },
      },
    },
    400: {
      description: 'Validation failed or insufficient points balance',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized: Staff login required',
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

export const handler: Handler = async (event: any, context: any) => {
  const method = event.httpMethod;

  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized: Staff login required' }),
    };
  }

  try {
    if (method !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    let bodyData: any;
    try {
      bodyData = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }

    const parseResult = TransactRequestSchema.safeParse(bodyData);
    if (!parseResult.success) {
      return createValidationErrorResponse(parseResult.error);
    }

    const { customerId, type, desc, amount } = parseResult.data;

    const customer = await db.getCustomer(customerId);
    if (!customer) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Customer not found' }),
      };
    }

    if (type === 'Redeemed' && customer.points < Math.abs(amount)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `Insufficient points balance. Customer has ${customer.points} points.`,
        }),
      };
    }

    const transaction: Transaction = {
      id: `tx_${crypto.randomUUID().slice(0, 8)}`,
      customerId,
      date: new Date().toISOString(),
      type,
      desc,
      amount: type === 'Redeemed' ? -Math.abs(amount) : amount,
    };

    await db.addTransaction(transaction);

    if (customer.referredBy && type === 'Earned') {
      const txs = await db.getTransactions(customerId);
      const earnedTxs = txs.filter((t) => t.type === 'Earned');
      if (earnedTxs.length === 1) {
        const referrer = await db.getCustomerByReferralCode(customer.referredBy);
        if (referrer) {
          const referralBonus: Transaction = {
            id: `tx_${crypto.randomUUID().slice(0, 8)}`,
            customerId: referrer.id,
            date: new Date().toISOString(),
            type: 'Earned',
            desc: `Referral Bonus: ${customer.firstName} ${customer.lastName}`,
            amount: 500,
          };
          await db.addTransaction(referralBonus);
        }
      }
    }

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    };
  } catch (error) {
    console.error('Transact API error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export default handler;
