import { Handler } from '@netlify/functions';
import { db, Transaction } from './lib/db';
import crypto from 'crypto';

export const handler: Handler = async (event: any, context: any) => {
  const method = event.httpMethod;

  // Verify staff auth
  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized: Staff login required' }),
    };
  }

  try {
    if (method !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const data = JSON.parse(event.body || '{}');
    const { customerId, type, desc, amount } = data; // type: 'Earned' | 'Redeemed'

    if (!customerId || !type || !desc || amount === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing fields: customerId, type, desc, amount' }),
      };
    }

    const customer = await db.getCustomer(customerId);
    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Customer not found' }),
      };
    }

    // Double-check points logic for redemption
    if (type === 'Redeemed' && customer.points < Math.abs(amount)) {
      return {
        statusCode: 400,
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

    // If it's a first time transaction and they were referred, we reward the referrer!
    if (customer.referredBy && type === 'Earned') {
      const txs = await db.getTransactions(customerId);
      const earnedTxs = txs.filter((t) => t.type === 'Earned');
      // If this is their first earned transaction, reward the referrer!
      if (earnedTxs.length === 1) {
        const referrer = await db.getCustomerByReferralCode(customer.referredBy);
        if (referrer) {
          const referralBonus: Transaction = {
            id: `tx_${crypto.randomUUID().slice(0, 8)}`,
            customerId: referrer.id,
            date: new Date().toISOString(),
            type: 'Earned',
            desc: `Referral Bonus: ${customer.firstName} ${customer.lastName}`,
            amount: 500, // 500 points for referral!
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
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
