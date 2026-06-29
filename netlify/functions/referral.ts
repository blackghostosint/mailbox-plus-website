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
    const code = params.code || '';

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing parameter: code' }),
      };
    }

    const customer = await db.getCustomerByReferralCode(code);
    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Referral code is invalid or expired' }),
      };
    }

    // Log the anonymous visit click
    const clientIp = event.headers['client-ip'] || event.headers['x-nf-client-connection-ip'] || 'unknown';
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
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
