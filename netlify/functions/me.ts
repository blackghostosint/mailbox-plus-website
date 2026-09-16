import { Handler } from '@netlify/functions';
import { db } from './lib/db';

export interface AuthenticatedUser {
  sub?: string;
  id?: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  exp?: number;
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
 * Extract identity claims for matching non-staff users against customer records.
 * Only server-verified claims (sub, id, email, app_metadata) are trusted.
 * user_metadata is user-editable and must never be trusted for authorization.
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

  if (user.app_metadata) {
    add(user.app_metadata.id);
    add(user.app_metadata.customer_id);
    add(user.app_metadata.customerId);
    add(user.app_metadata.referralCode);
    add(user.app_metadata.referral_code);
    add(user.app_metadata.code);
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
            statusCode: 403,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Forbidden' }),
          };
        }
      } else if (code) {
        if (!claims.includes(code.toLowerCase())) {
          return {
            statusCode: 403,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Forbidden' }),
          };
        }
      } else {
        // Derive parameter if omitted by non-staff authenticated user
        const derivedId =
          user.sub || user.id || user.app_metadata?.id || user.app_metadata?.customer_id;
        if (derivedId) {
          id = derivedId;
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
          statusCode: 403,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Forbidden' }),
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
