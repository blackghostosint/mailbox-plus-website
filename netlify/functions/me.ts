import { Handler } from '@netlify/functions';
import { db } from './lib/db';
import type { Customer } from './lib/db';
import { generateCustomerToken, verifyCustomerToken } from './lib/auth';

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

function isStaff(context: any): boolean {
  return !!(context && context.clientContext && context.clientContext.user);
}

function getTokenFromEvent(event: any): string | null {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const xSessionToken = event.headers?.['x-session-token'] || event.headers?.['X-Session-Token'];
  if (xSessionToken) {
    return xSessionToken.trim();
  }
  const queryToken = event.queryStringParameters?.token;
  if (queryToken) {
    return queryToken.trim();
  }
  return null;
}

export const handler: Handler = async (event: any, context: any) => {
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

      // Authorization Check
      const token = getTokenFromEvent(event);
      const staff = isStaff(context);
      const isAuthorized = staff || (!!token && verifyCustomerToken(token, customer.id));

      if (!isAuthorized) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Session token or staff login required' }),
        };
      }

      // Fetch transactions
      const activities = await db.getTransactions(customer.id);
      const sessionToken =
        token && verifyCustomerToken(token, customer.id)
          ? token
          : generateCustomerToken(customer.id);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customer,
          activities,
          token: sessionToken,
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

      // Authorization Check
      const token = getTokenFromEvent(event);
      const staff = isStaff(context);
      const isAuthorized = staff || (!!token && verifyCustomerToken(token, existingCustomer.id));

      if (!isAuthorized) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Session token or staff login required' }),
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
      const sessionToken =
        token && verifyCustomerToken(token, updatedCustomer.id)
          ? token
          : generateCustomerToken(updatedCustomer.id);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedCustomer,
          activities,
          token: sessionToken,
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
