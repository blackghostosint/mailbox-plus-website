import { Handler } from '@netlify/functions';
import { db } from './lib/db';

export interface AuthenticatedUser {
  sub?: string;
  id?: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  exp?: number;
  token?: string;
}

/**
 * Extract authenticated user context from Netlify function context.
 * Only context.clientContext.user is trustworthy because Netlify verifies
 * the Identity JWT server-side before populating clientContext.user.
 */
export function getAuthenticatedUser(_event: any, context: any): AuthenticatedUser | null {
  if (context?.clientContext?.user) {
    return context.clientContext.user as AuthenticatedUser;
  }
  return null;
}

/**
 * Check if the authenticated user is a staff member
 */
export function isStaffUser(user: AuthenticatedUser, _context?: any): boolean {
  if (!user) return false;

  const roles = user.app_metadata?.roles || (user as any).roles || [];
  if (Array.isArray(roles) && (roles.includes('staff') || roles.includes('admin'))) {
    return true;
  }

  if ((user as any).role === 'staff' || (user as any).role === 'admin') {
    return true;
  }

  return false;
}

/**
 * Extract identity claims for matching non-staff users against customer records
 */
export function getUserClaims(user: AuthenticatedUser): string[] {
  const claims = new Set<string>();
  if (!user) return [];

  const add = (val: any) => {
    if (val && typeof val === 'string') claims.add(val.toLowerCase());
  };

  add(user.sub);
  add(user.id);
  add(user.email);
  add(user.token);

  if (user.user_metadata) {
    add(user.user_metadata.id);
    add(user.user_metadata.customer_id);
    add(user.user_metadata.customerId);
    add(user.user_metadata.referralCode);
    add(user.user_metadata.referral_code);
    add(user.user_metadata.code);
    add(user.user_metadata.email);
  }

  return Array.from(claims);
}

export const handler: Handler = async (event: any, context: any) => {
  const method = event.httpMethod;

  try {
    if (method !== 'GET') {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    // 1. Verify Authentication BEFORE any DB query
    const user = getAuthenticatedUser(event, context);
    if (!user) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const isStaff = isStaffUser(user, context);

    const params = event.queryStringParameters || {};
    let id = params.id || '';
    let code = params.code || '';

    if (!isStaff) {
      const claims = getUserClaims(user);

      if (id) {
        if (!claims.includes(id.toLowerCase())) {
          return {
            statusCode: 401,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Unauthorized' }),
          };
        }
      } else if (code) {
        if (!claims.includes(code.toLowerCase())) {
          return {
            statusCode: 401,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Unauthorized' }),
          };
        }
      } else {
        // Derive parameter if omitted by non-staff authenticated user
        const derivedId =
          user.sub || user.id || user.user_metadata?.id || user.user_metadata?.customer_id;
        const derivedCode =
          user.user_metadata?.referralCode ||
          user.user_metadata?.referral_code ||
          user.user_metadata?.code;
        if (derivedId) {
          id = derivedId;
        } else if (derivedCode) {
          code = derivedCode;
        } else {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Missing parameter: id or code' }),
          };
        }
      }
    } else {
      if (!id && !code) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing parameter: id or code' }),
        };
      }
    }

    // 2. Execute DB Queries ONLY AFTER Authentication & Authorization checks
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

    if (!isStaff) {
      const claims = getUserClaims(user);
      const custId = (customer.id || '').toLowerCase();
      const custCode = (customer.referralCode || '').toLowerCase();
      const custEmail = (customer.email || '').toLowerCase();

      const matches = claims.some((c) => c === custId || c === custCode || c === custEmail);
      if (!matches) {
        return {
          statusCode: 401,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
