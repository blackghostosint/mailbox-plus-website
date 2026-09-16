import { describe, it, expect, vi, beforeEach } from 'vitest';
interface HandlerEvent {
  httpMethod: string;
  queryStringParameters?: Record<string, string> | null;
  body?: string | null;
  headers?: Record<string, string>;
  multiValueHeaders?: Record<string, string[]>;
  isBase64Encoded?: boolean;
  path?: string;
  rawUrl?: string;
  rawQuery?: string;
  multiValueQueryStringParameters?: Record<string, string[]> | null;
}

type HandlerContext = Record<string, unknown>;
import { handler } from '../../../netlify/functions/me';
import { db } from '../../../netlify/functions/lib/db';
import type { Customer } from '../../../netlify/functions/lib/db';

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

const dummyContext = {} as HandlerContext;

function createEvent(
  httpMethod: string,
  queryStringParameters: Record<string, string> = {},
  body?: string
): HandlerEvent {
  return {
    httpMethod,
    queryStringParameters,
    body: body || null,
    headers: {},
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

  it('returns HTTP 400 when PATCH request has no id parameter', async () => {
    const res = await handler(
      createEvent('PATCH', {}, JSON.stringify({ firstName: 'NewName' })),
      dummyContext,
      () => undefined
    );
    expect(res?.statusCode).toBe(400);
    expect(JSON.parse(res?.body || '{}').error).toBe('Missing required parameter: id');
  });

  it('returns HTTP 404 when PATCH customer is not found', async () => {
    const res = await handler(
      createEvent('PATCH', { id: 'non_existent_id' }, JSON.stringify({ firstName: 'NewName' })),
      dummyContext,
      () => undefined
    );
    expect(res?.statusCode).toBe(404);
  });

  it('updates whitelisted contact fields and returns HTTP 200 with updated customer', async () => {
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
      createEvent('PATCH', { id: 'cust_test_123' }, JSON.stringify(patchPayload)),
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

  it('ignores and strips privileged fields in PATCH payloads', async () => {
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
      createEvent('PATCH', { id: 'cust_test_123' }, JSON.stringify(maliciousPayload)),
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
