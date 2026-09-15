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
 * Extract case-insensitive header value
 */
function getHeader(
  headers: Record<string, string | undefined> | undefined,
  name: string
): string | undefined {
  if (!headers) return undefined;
  const target = name.toLowerCase();
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === target) {
      return headers[key];
    }
  }
  return undefined;
}

/**
 * Extract authenticated user context from Netlify function context or Authorization header
 */
export function getAuthenticatedUser(event: any, context: any): AuthenticatedUser | null {
  // 1. Check Netlify Identity clientContext
  if (context?.clientContext?.user) {
    return context.clientContext.user as AuthenticatedUser;
  }

  // 2. Check Authorization header
  const authHeader = getHeader(event?.headers, 'authorization');
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const token = match[1].trim();
  if (!token) return null;

  // Try decoding as JWT (header.payload.signature)
  const parts = token.split('.');
  if (parts.length === 3) {
    try {
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
      const payload = JSON.parse(jsonPayload);

      // Check expiry if present
      if (typeof payload.exp === 'number' && Date.now() / 1000 > payload.exp) {
        return null; // Expired token
      }

      return payload as AuthenticatedUser;
    } catch {
      return null;
    }
  }

  // Try parsing as JSON token
  try {
    const parsed = JSON.parse(token);
    if (parsed && typeof parsed === 'object') {
      return parsed as AuthenticatedUser;
    }
  } catch {
    // Treat as direct token string identifier if non-empty
  }

  return { sub: token, id: token, token };
}

/**
 * Check if the authenticated user is a staff member
 */
export function isStaffUser(user: AuthenticatedUser, context: any): boolean {
  if (!user) return false;

  const roles = user.app_metadata?.roles || (user as any).roles || [];
  if (Array.isArray(roles) && (roles.includes('staff') || roles.includes('admin'))) {
    return true;
  }

  if ((user as any).role === 'staff' || (user as any).role === 'admin') {
    return true;
  }

  // If Netlify Identity clientContext user is present without specific customer metadata
  if (context?.clientContext?.user && !user.user_metadata?.customer_id && !user.user_metadata?.id) {
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
