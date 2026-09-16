import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from '../../../netlify/functions/me';
import { db } from '../../../netlify/functions/lib/db';
import type { Customer } from '../../../netlify/functions/lib/db';
import { generateCustomerToken } from '../../../netlify/functions/lib/auth';

vi.mock('@netlify/blobs', () => ({
  getStore: vi.fn(),
}));

const initialCustomer: Customer = {
  id: 'cust_test_123',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '555-123-4567',
  street: '123 Main St',
  city: 'Concord Township',
  state: 'OH',
  zip: '44077',
  birthday: '01/01',
  joinDate: '2025-01-01T00:00:00.000Z',
  tier: 'Shipper',
  multiplier: 1.2,
  points: 500,
  ytdPoints: 600,
  referralCode: 'JANE-D',
};

const mockStore: Record<string, Customer> = {};

vi.mock('../../../netlify/functions/lib/db', () => ({
  db: {
    getCustomer: vi.fn(async (id: string) => mockStore[id] || null),
    getCustomerByReferralCode: vi.fn(async (code: string) => {
      return Object.values(mockStore).find((c) => c.referralCode === code) || null;
    }),
    saveCustomer: vi.fn(async (customer: Customer) => {
      mockStore[customer.id] = customer;
    }),
    getTransactions: vi.fn(async () => []),
  },
}));

const dummyContext = {} as any;
const staffContext = {
  clientContext: { user: { email: 'staff@mailboxplus.com', app_metadata: { roles: ['staff'] } } },
} as any;
const nonStaffUserContext = {
  clientContext: { user: { email: 'customer@mailboxplus.com', app_metadata: { roles: [] } } },
} as any;

function createEvent(
  httpMethod: string,
  queryStringParameters: Record<string, string> = {},
  body?: string,
  headers: Record<string, string> = {}
): any {
  return {
    httpMethod,
    queryStringParameters,
    body: body || null,
    headers,
    multiValueHeaders: {},
    isBase64Encoded: false,
    path: '/api/me',
    rawUrl: 'http://localhost/api/me',
    rawQuery: '',
    multiValueQueryStringParameters: null,
  };
}

describe('me.ts serverless function handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of Object.keys(mockStore)) {
      delete mockStore[key];
    }
    mockStore[initialCustomer.id] = { ...initialCustomer };
  });

  it('returns HTTP 405 for unsupported HTTP methods', async () => {
    const res = await handler(createEvent('POST'), dummyContext, () => undefined);
    expect(res?.statusCode).toBe(405);
  });

  it('returns HTTP 400 when GET/PATCH parameter is missing', async () => {
    const resGet = await handler(createEvent('GET', {}), dummyContext, () => undefined);
    expect(resGet?.statusCode).toBe(400);

    const resPatch = await handler(
      createEvent('PATCH', {}, JSON.stringify({ firstName: 'New' })),
      dummyContext,
      () => undefined
    );
    expect(resPatch?.statusCode).toBe(400);
    expect(JSON.parse(resPatch?.body || '{}').error).toBe('Missing required parameter: id');
  });

  it('returns HTTP 401 when non-staff/unauthenticated user queries non-existent customer', async () => {
    const resGet = await handler(
      createEvent('GET', { id: 'non_existent' }),
      dummyContext,
      () => undefined
    );
    expect(resGet?.statusCode).toBe(401);

    const resPatch = await handler(
      createEvent('PATCH', { id: 'non_existent' }, JSON.stringify({ firstName: 'New' })),
      dummyContext,
      () => undefined
    );
    expect(resPatch?.statusCode).toBe(401);
  });

  it('returns HTTP 404 when staff context queries non-existent customer', async () => {
    const resGet = await handler(
      createEvent('GET', { id: 'non_existent' }),
      staffContext,
      () => undefined
    );
    expect(resGet?.statusCode).toBe(404);

    const resPatch = await handler(
      createEvent('PATCH', { id: 'non_existent' }, JSON.stringify({ firstName: 'New' })),
      staffContext,
      () => undefined
    );
    expect(resPatch?.statusCode).toBe(404);
  });

  it('returns HTTP 401 when GET is called without session token or staff auth', async () => {
    const res = await handler(
      createEvent('GET', { id: 'cust_test_123' }),
      dummyContext,
      () => undefined
    );
    expect(res?.statusCode).toBe(401);
    expect(JSON.parse(res?.body || '{}').error).toContain('Unauthorized');
  });

  it('returns HTTP 401 when Netlify Identity user without staff role attempts access', async () => {
    const res = await handler(
      createEvent('GET', { id: 'cust_test_123' }),
      nonStaffUserContext,
      () => undefined
    );
    expect(res?.statusCode).toBe(401);
  });

  it('returns HTTP 401 when token is provided in query string instead of headers', async () => {
    const validToken = generateCustomerToken('cust_test_123');
    const res = await handler(
      createEvent('GET', { id: 'cust_test_123', token: validToken }),
      dummyContext,
      () => undefined
    );
    expect(res?.statusCode).toBe(401);
  });

  it('returns HTTP 401 when PATCH is called without session token or staff auth', async () => {
    const res = await handler(
      createEvent('PATCH', { id: 'cust_test_123' }, JSON.stringify({ firstName: 'Janet' })),
      dummyContext,
      () => undefined
    );
    expect(res?.statusCode).toBe(401);
    expect(JSON.parse(res?.body || '{}').error).toContain('Unauthorized');
  });

  it('returns HTTP 401 when GET / PATCH is called with an invalid or mismatched session token', async () => {
    const wrongToken = generateCustomerToken('cust_other_456');
    const resGet = await handler(
      createEvent('GET', { id: 'cust_test_123' }, undefined, {
        authorization: `Bearer ${wrongToken}`,
      }),
      dummyContext,
      () => undefined
    );
    expect(resGet?.statusCode).toBe(401);

    const resPatch = await handler(
      createEvent('PATCH', { id: 'cust_test_123' }, JSON.stringify({ firstName: 'Hacked' }), {
        authorization: `Bearer ${wrongToken}`,
      }),
      dummyContext,
      () => undefined
    );
    expect(resPatch?.statusCode).toBe(401);
  });

  it('returns HTTP 200 on GET when called with valid session token', async () => {
    const validToken = generateCustomerToken('cust_test_123');
    const res = await handler(
      createEvent('GET', { id: 'cust_test_123' }, undefined, {
        authorization: `Bearer ${validToken}`,
      }),
      dummyContext,
      () => undefined
    );

    expect(res?.statusCode).toBe(200);
    const body = JSON.parse(res?.body || '{}');
    expect(body.firstName).toBe('Jane');
    expect(body.token).toBeDefined();
  });

  it('returns HTTP 200 on GET / PATCH when accessed by staff context with app_metadata roles', async () => {
    const resGet = await handler(
      createEvent('GET', { id: 'cust_test_123' }),
      staffContext,
      () => undefined
    );
    expect(resGet?.statusCode).toBe(200);

    const resPatch = await handler(
      createEvent('PATCH', { id: 'cust_test_123' }, JSON.stringify({ firstName: 'Janet' })),
      staffContext,
      () => undefined
    );
    expect(resPatch?.statusCode).toBe(200);
  });

  it('returns HTTP 400 on PATCH when input validation fails', async () => {
    const validToken = generateCustomerToken('cust_test_123');

    // Invalid email format
    const resEmail = await handler(
      createEvent('PATCH', { id: 'cust_test_123' }, JSON.stringify({ email: 'not-an-email' }), {
        authorization: `Bearer ${validToken}`,
      }),
      dummyContext,
      () => undefined
    );
    expect(resEmail?.statusCode).toBe(400);
    expect(JSON.parse(resEmail?.body || '{}').error).toBe('Invalid email format');

    // Excessive length
    const resLongName = await handler(
      createEvent(
        'PATCH',
        { id: 'cust_test_123' },
        JSON.stringify({ firstName: 'A'.repeat(101) }),
        { authorization: `Bearer ${validToken}` }
      ),
      dummyContext,
      () => undefined
    );
    expect(resLongName?.statusCode).toBe(400);
    expect(JSON.parse(resLongName?.body || '{}').error).toBe('First name exceeds maximum length');
  });

  it('updates whitelisted contact fields and returns HTTP 200 with updated customer when authorized', async () => {
    const validToken = generateCustomerToken('cust_test_123');
    const patchPayload = {
      firstName: 'Janet',
      lastName: 'Smith',
      email: 'janet.smith@example.com',
      phone: '555-999-8888',
      street: '456 Oak Rd',
      city: 'Chardon',
      state: 'OH',
      zip: '44024',
      birthday: '05/15',
    };

    const res = await handler(
      createEvent('PATCH', { id: 'cust_test_123' }, JSON.stringify(patchPayload), {
        authorization: `Bearer ${validToken}`,
      }),
      dummyContext,
      () => undefined
    );

    expect(res?.statusCode).toBe(200);
    const body = JSON.parse(res?.body || '{}') as Customer;
    expect(body.firstName).toBe('Janet');
    expect(body.lastName).toBe('Smith');
    expect(body.email).toBe('janet.smith@example.com');
    expect(body.phone).toBe('555-999-8888');
    expect(body.street).toBe('456 Oak Rd');
    expect(body.city).toBe('Chardon');
    expect(body.state).toBe('OH');
    expect(body.zip).toBe('44024');
    expect(body.birthday).toBe('05/15');
    expect(db.saveCustomer).toHaveBeenCalled();
  });

  it('ignores and strips privileged fields in PATCH payloads even when authorized', async () => {
    const validToken = generateCustomerToken('cust_test_123');
    const maliciousPayload = {
      firstName: 'Janet',
      tier: 'Pro',
      multiplier: 2.0,
      points: 999999,
      ytdPoints: 999999,
      referralCode: 'HACKER',
      joinDate: '1970-01-01',
    };

    const res = await handler(
      createEvent('PATCH', { id: 'cust_test_123' }, JSON.stringify(maliciousPayload), {
        authorization: `Bearer ${validToken}`,
      }),
      dummyContext,
      () => undefined
    );

    expect(res?.statusCode).toBe(200);
    const body = JSON.parse(res?.body || '{}') as Customer;
    expect(body.firstName).toBe('Janet');
    expect(body.tier).toBe('Shipper');
    expect(body.multiplier).toBe(1.2);
    expect(body.points).toBe(500);
    expect(body.ytdPoints).toBe(600);
    expect(body.referralCode).toBe('JANE-D');
    expect(body.joinDate).toBe('2025-01-01T00:00:00.000Z');
  });
});
