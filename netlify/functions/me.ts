import { Handler } from '@netlify/functions';
import { db } from './lib/db';

export const handler: Handler = async (event: any) => {
  const method = event.httpMethod;

  try {
    if (method !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const params = event.queryStringParameters || {};
    const id = params.id || '';
    const code = params.code || '';

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

  } catch (error) {
    console.error('Me API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
