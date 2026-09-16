import { Handler } from '@netlify/functions';
import { db, Customer } from './lib/db';
import { verifyRecaptchaToken } from './lib/recaptcha';
import crypto from 'crypto';
import { z } from 'zod';
import { registry, createValidationErrorResponse, ErrorResponseSchema } from './lib/openapi-registry';

export const CustomerSchema = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    birthday: z.string().optional(),
    joinDate: z.string().optional(),
    tier: z.string().optional(),
    multiplier: z.number().optional(),
    points: z.number().optional(),
    ytdPoints: z.number().optional(),
    referralCode: z.string().optional(),
    referredBy: z.string().optional(),
  })
  .openapi('Customer');

export const CustomerCreateRequestSchema = z
  .object({
    firstName: z.string().min(1, 'firstName is required'),
    lastName: z.string().min(1, 'lastName is required'),
    phone: z.string().min(1, 'phone is required'),
    email: z.string().email('Invalid email address'),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    birthday: z.string().optional(),
    referredBy: z.string().optional(),
    recaptchaToken: z.string().optional(),
    token: z.string().optional(),
    'g-recaptcha-response': z.string().optional(),
  })
  .openapi('CustomerCreateRequest');

export const CustomerPatchRequestSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    birthday: z.string().optional(),
    points: z.number().optional(),
    tier: z.string().optional(),
  })
  .openapi('CustomerPatchRequest');

export const CustomerQuerySchema = z
  .object({
    q: z.string().optional(),
  })
  .openapi('CustomerQuery');

export type CustomerType = z.infer<typeof CustomerSchema>;
export type CustomerCreateRequest = z.infer<typeof CustomerCreateRequestSchema>;
export type CustomerPatchRequest = z.infer<typeof CustomerPatchRequestSchema>;

registry.registerPath({
  method: 'post',
  path: '/.netlify/functions/customer',
  summary: 'Create new customer profile',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CustomerCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Customer created',
      content: {
        'application/json': {
          schema: CustomerSchema,
        },
      },
    },
    400: {
      description: 'Validation failed or duplicate phone',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/.netlify/functions/customer',
  summary: 'List or search customer profiles',
  request: {
    query: CustomerQuerySchema,
  },
  responses: {
    200: {
      description: 'Customer list',
      content: {
        'application/json': {
          schema: z.array(CustomerSchema),
        },
      },
    },
    401: {
      description: 'Unauthorized: Staff login required',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

export const handler: Handler = async (event: any, context: any) => {
  const method = event.httpMethod;
  const path = event.path;
  const segments = path.split('/').filter(Boolean);

  const idFromPath =
    segments[segments.length - 1] !== 'customer' ? segments[segments.length - 1] : null;

  const isStaff = () => {
    return !!(context.clientContext && context.clientContext.user);
  };

  try {
    if (method === 'POST') {
      let bodyData: any;
      try {
        bodyData = JSON.parse(event.body || '{}');
      } catch (e) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid JSON body' }),
        };
      }

      const parseResult = CustomerCreateRequestSchema.safeParse(bodyData);
      if (!parseResult.success) {
        return createValidationErrorResponse(parseResult.error);
      }

      const data = parseResult.data;

      if (!isStaff()) {
        const token = data.recaptchaToken || data.token || data['g-recaptcha-response'];
        const clientIp =
          event.headers?.['client-ip'] || event.headers?.['x-forwarded-for']?.split(',')[0]?.trim();
        const isValid = await verifyRecaptchaToken(token, clientIp);
        if (!isValid) {
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'reCAPTCHA verification failed' }),
          };
        }
      }

      const { firstName, lastName, phone, email, street, city, state, zip, birthday, referredBy } =
        data;

      const existing = await db.getCustomerByPhone(phone);
      if (existing) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'A customer with this phone number already exists' }),
        };
      }

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

      if (referredBy) {
        await db.logReferralClaim(referredBy, newCustomer.id);
      }

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      };
    }

    if (method === 'GET') {
      if (!isStaff()) {
        return {
          statusCode: 401,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Unauthorized: Staff login required' }),
        };
      }

      if (idFromPath) {
        const customer = await db.getCustomer(idFromPath);
        if (!customer) {
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Customer not found' }),
          };
        }
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer),
        };
      }

      const queryParams = event.queryStringParameters || {};
      const queryParse = CustomerQuerySchema.safeParse(queryParams);
      if (!queryParse.success) {
        return createValidationErrorResponse(queryParse.error);
      }

      const search = queryParse.data.q || '';

      if (search) {
        const byPhone = await db.getCustomerByPhone(search);
        if (byPhone) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([byPhone]),
          };
        }

        const byRef = await db.getCustomerByReferralCode(search);
        if (byRef) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([byRef]),
          };
        }
      }

      const list = await db.customers.list();
      const customers: Customer[] = [];
      for (const blob of list.blobs) {
        const c = await db.getCustomer(blob.key);
        if (c) customers.push(c);
      }

      const filtered = customers.filter((c) => {
        const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase()) || c.phone.includes(search);
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtered),
      };
    }

    if (method === 'PATCH') {
      if (!isStaff()) {
        return {
          statusCode: 401,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Unauthorized: Staff login required' }),
        };
      }

      if (!idFromPath) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Customer ID required in path' }),
        };
      }

      const existing = await db.getCustomer(idFromPath);
      if (!existing) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Customer not found' }),
        };
      }

      let bodyData: any;
      try {
        bodyData = JSON.parse(event.body || '{}');
      } catch (e) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid JSON body' }),
        };
      }

      const parseResult = CustomerPatchRequestSchema.safeParse(bodyData);
      if (!parseResult.success) {
        return createValidationErrorResponse(parseResult.error);
      }

      const updates = parseResult.data;
      const updatedCustomer: Customer = {
        ...existing,
        ...updates,
        id: existing.id,
        joinDate: existing.joinDate,
        referralCode: existing.referralCode,
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  } catch (error) {
    console.error('Customer API error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export default handler;
