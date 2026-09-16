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

export function isStaff(context: any): boolean {
  const roles = context?.clientContext?.user?.app_metadata?.roles;
  return Array.isArray(roles) && (roles.includes('staff') || roles.includes('admin'));
}

export function getTokenFromEvent(event: any): string | null {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const xSessionToken = event.headers?.['x-session-token'] || event.headers?.['X-Session-Token'];
  if (xSessionToken) {
    return xSessionToken.trim();
  }
  return null;
}

function validatePatchFields(updates: Record<string, any>): string | null {
  if (updates.email !== undefined) {
    if (typeof updates.email !== 'string' || updates.email.length > 254) {
      return 'Email exceeds maximum length';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updates.email)) {
      return 'Invalid email format';
    }
  }
  if (updates.phone !== undefined) {
    if (
      typeof updates.phone !== 'string' ||
      updates.phone.length > 30 ||
      updates.phone.length < 7
    ) {
      return 'Invalid phone number format';
    }
  }
  if (updates.zip !== undefined) {
    if (typeof updates.zip !== 'string' || updates.zip.length > 10) {
      return 'Invalid ZIP code format';
    }
  }
  if (
    updates.firstName !== undefined &&
    (typeof updates.firstName !== 'string' || updates.firstName.length > 100)
  ) {
    return 'First name exceeds maximum length';
  }
  if (
    updates.lastName !== undefined &&
    (typeof updates.lastName !== 'string' || updates.lastName.length > 100)
  ) {
    return 'Last name exceeds maximum length';
  }
  if (
    updates.street !== undefined &&
    (typeof updates.street !== 'string' || updates.street.length > 200)
  ) {
    return 'Street address exceeds maximum length';
  }
  if (
    updates.city !== undefined &&
    (typeof updates.city !== 'string' || updates.city.length > 200)
  ) {
    return 'City exceeds maximum length';
  }
  if (
    updates.state !== undefined &&
    (typeof updates.state !== 'string' || updates.state.length > 50)
  ) {
    return 'State exceeds maximum length';
  }
  if (
    updates.birthday !== undefined &&
    (typeof updates.birthday !== 'string' || updates.birthday.length > 20)
  ) {
    return 'Birthday exceeds maximum length';
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

      const token = getTokenFromEvent(event);
      const staff = isStaff(context);

      // Perform authorization check BEFORE fetching customer record if target ID is directly specified
      if (id && !staff && (!token || !verifyCustomerToken(token, id))) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Session token or staff login required' }),
        };
      }

      if (code && !staff && !token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Session token or staff login required' }),
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

      if (code && !staff && (!token || !verifyCustomerToken(token, customer.id))) {
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

      const token = getTokenFromEvent(event);
      const staff = isStaff(context);

      // Perform authorization check BEFORE fetching existing customer
      if (!staff && (!token || !verifyCustomerToken(token, id))) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Session token or staff login required' }),
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

      const validationError = validatePatchFields(updates);
      if (validationError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: validationError }),
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
