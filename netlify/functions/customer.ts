import { Handler } from '@netlify/functions';
import { db, Customer } from './lib/db';
import crypto from 'crypto';

export const handler: Handler = async (event: any, context: any) => {
  const method = event.httpMethod;
  const path = event.path;
  const segments = path.split('/').filter(Boolean);
  
  // Extract custom ID from path if present (e.g. /api/customer/cust_123)
  const idFromPath = segments[segments.length - 1] !== 'customer' ? segments[segments.length - 1] : null;

  // 1. Staff Authentication Helper
  const isStaff = () => {
    return !!(context.clientContext && context.clientContext.user);
  };

  try {
    // --- POST /api/customer (Public Sign-up / Counter Create) ---
    if (method === 'POST') {
      const data = JSON.parse(event.body || '{}');
      const { firstName, lastName, phone, email, street, city, state, zip, birthday, referredBy } = data;

      if (!firstName || !lastName || !phone || !email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields: firstName, lastName, phone, email' }),
        };
      }

      // Check if customer already exists by phone
      const existing = await db.getCustomerByPhone(phone);
      if (existing) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'A customer with this phone number already exists' }),
        };
      }

      // Generate a unique referral code: FIRSTNAME-LASTINITIAL + unique differentiator if duplicate
      let referralCode = `${firstName.toUpperCase()}-${lastName[0].toUpperCase()}`;
      let checkCode = await db.getCustomerByReferralCode(referralCode);
      if (checkCode) {
        const randomChar = crypto.randomBytes(2).toString('hex').slice(0, 3).toUpperCase();
        referralCode = `${firstName.toUpperCase()}-${randomChar}`;
      }

      const newCustomer: Customer = {
        id: `cust_${crypto.randomUUID().slice(0, 8)}`,
        firstName,
        lastName,
        email,
        phone,
        street: street || '',
        city: city || '',
        state: state || '',
        zip: zip || '',
        birthday: birthday || '',
        joinDate: new Date().toISOString(),
        tier: 'Sender',
        multiplier: 1.0,
        points: 0,
        ytdPoints: 0,
        referralCode,
        referredBy: referredBy || undefined,
      };

      await db.saveCustomer(newCustomer);

      // Handle referral claim logging if referredBy code is present
      if (referredBy) {
        await db.logReferralClaim(referredBy, newCustomer.id);
      }

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      };
    }

    // --- GET /api/customer or /api/customer/:id (Search / Read) ---
    if (method === 'GET') {
      // Accessing full database search or specific records requires staff auth
      if (!isStaff()) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Staff login required' }),
        };
      }

      if (idFromPath) {
        const customer = await db.getCustomer(idFromPath);
        if (!customer) {
          return { statusCode: 404, body: JSON.stringify({ error: 'Customer not found' }) };
        }
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer),
        };
      }

      // Search parameters (query params)
      const params = event.queryStringParameters || {};
      const search = params.q || '';
      
      if (search) {
        // Quick phone search
        const byPhone = await db.getCustomerByPhone(search);
        if (byPhone) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([byPhone]),
          };
        }

        // Quick referral code search
        const byRef = await db.getCustomerByReferralCode(search);
        if (byRef) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([byRef]),
          };
        }
      }

      // List all or fall back to empty list (scanning/listing Netlify Blobs requires pagination but we can list keys)
      const list = await db.customers.list();
      const customers: Customer[] = [];
      for (const blob of list.blobs) {
        const c = await db.getCustomer(blob.key);
        if (c) customers.push(c);
      }

      // Filter in-memory if query parameter exists (Fuzzy Name search)
      const filtered = customers.filter(c => {
        const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase()) || c.phone.includes(search);
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtered),
      };
    }

    // --- PATCH /api/customer/:id (Update) ---
    if (method === 'PATCH') {
      if (!isStaff()) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Staff login required' }),
        };
      }

      if (!idFromPath) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Customer ID required in path' }) };
      }

      const existing = await db.getCustomer(idFromPath);
      if (!existing) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Customer not found' }) };
      }

      const updates = JSON.parse(event.body || '{}');
      const updatedCustomer: Customer = {
        ...existing,
        ...updates,
        id: existing.id, // Cannot change ID
        joinDate: existing.joinDate, // Cannot change join date
        referralCode: existing.referralCode, // Cannot change referral code
      };

      await db.saveCustomer(updatedCustomer);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };

  } catch (error) {
    console.error('Customer API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
