import { Handler } from '@netlify/functions';
import { db } from './lib/db';
import type { Customer } from './lib/db';

const ALLOWED_CONTACT_FIELDS: Array<keyof Customer> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'street',
  'city',
  'state',
  'zip',
  'birthday',
];

export const handler: Handler = async (event: any) => {
  const method = event.httpMethod;

  try {
    if (method !== 'GET' && method !== 'PATCH') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const params = event.queryStringParameters || {};
    const id = params.id || '';
    const code = params.code || '';

    if (method === 'GET') {
      if (!id && !code) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing parameter: id or code' }),
        };
      }

      let customer = null;
      if (id) {
        customer = await db.getCustomer(id);
      } else if (code) {
        customer = await db.getCustomerByReferralCode(code);
      }

      if (!customer) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Customer not found' }),
        };
      }

      // Fetch transactions
      const activities = await db.getTransactions(customer.id);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customer,
          activities,
        }),
      };
    }

    if (method === 'PATCH') {
      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required parameter: id' }),
        };
      }

      const existingCustomer = await db.getCustomer(id);
      if (!existingCustomer) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Customer not found' }),
        };
      }

      let updates: Record<string, any> = {};
      try {
        updates = JSON.parse(event.body || '{}');
      } catch {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid JSON body' }),
        };
      }

      const cleanUpdates: Partial<Customer> = {};
      for (const field of ALLOWED_CONTACT_FIELDS) {
        if (field in updates && updates[field] !== undefined) {
          cleanUpdates[field] = updates[field];
        }
      }

      const updatedCustomer: Customer = {
        ...existingCustomer,
        ...cleanUpdates,
        // Explicitly retain privileged/system fields to prevent privilege escalation
        id: existingCustomer.id,
        joinDate: existingCustomer.joinDate,
        tier: existingCustomer.tier,
        multiplier: existingCustomer.multiplier,
        points: existingCustomer.points,
        ytdPoints: existingCustomer.ytdPoints,
        referralCode: existingCustomer.referralCode,
        referredBy: existingCustomer.referredBy,
      };

      await db.saveCustomer(updatedCustomer);

      const activities = await db.getTransactions(updatedCustomer.id);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedCustomer,
          activities,
        }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  } catch (error) {
    console.error('Me API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
