/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'node:buffer';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handler } from '../../../netlify/functions/me';
import { db } from '../../../netlify/functions/lib/db';

describe('/api/me authentication guard', () => {
  const mockCustomer = {
    id: 'cust_123',
    firstName: 'Sarah',
    lastName: 'Miller',
    email: 'sarah.m@gmail.com',
    phone: '555-382-9012',
    street: '742 Evergreen Terrace',
    city: 'Concord Township',
    state: 'OH',
    zip: '44077',
    joinDate: '2026-01-01T00:00:00.000Z',
    tier: 'Shipper' as const,
    multiplier: 1.2,
    points: 342,
    ytdPoints: 680,
    referralCode: 'SARAH-M',
  };

  const mockActivities = [
    {
      id: 'tx_1',
      customerId: 'cust_123',
      date: '2026-06-25',
      type: 'Earned' as const,
      desc: 'FedEx Ground',
      amount: 27,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects non-GET HTTP methods with 405', async () => {
    const event = { httpMethod: 'POST' };
    const response: any = await handler(event, {});

    expect(response.statusCode).toBe(405);
    expect(JSON.parse(response.body)).toEqual({ error: 'Method Not Allowed' });
  });

  it('rejects unauthenticated requests missing clientContext user with 401 and prevents DB lookup', async () => {
    const getCustomerSpy = vi.spyOn(db, 'getCustomer');
    const getCustomerByRefSpy = vi.spyOn(db, 'getCustomerByReferralCode');

    const event = {
      httpMethod: 'GET',
      queryStringParameters: { id: 'cust_123' },
      headers: {},
    };

    const response: any = await handler(event, {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ error: 'Unauthorized' });
    expect(getCustomerSpy).not.toHaveBeenCalled();
    expect(getCustomerByRefSpy).not.toHaveBeenCalled();
  });

  it('rejects requests with forged bearer token payloads in Authorization header with 401 and prevents DB lookup', async () => {
    const getCustomerSpy = vi.spyOn(db, 'getCustomer');
    const getCustomerByRefSpy = vi.spyOn(db, 'getCustomerByReferralCode');

    // Forged JWT with victim id in sub and arbitrary signature
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const forgedPayload = Buffer.from(
      JSON.stringify({
        sub: 'cust_123',
        id: 'cust_123',
        email: 'sarah.m@gmail.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    ).toString('base64url');
    const forgedToken = `${header}.${forgedPayload}.garbage-signature`;

    const event = {
      httpMethod: 'GET',
      queryStringParameters: { id: 'cust_123' },
      headers: { authorization: `Bearer ${forgedToken}` },
    };

    // Passed without Netlify runtime's verified context.clientContext.user
    const response: any = await handler(event, {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ error: 'Unauthorized' });
    expect(getCustomerSpy).not.toHaveBeenCalled();
    expect(getCustomerByRefSpy).not.toHaveBeenCalled();
  });

  it('rejects requests with arbitrary non-JWT bearer tokens with 401 and prevents DB lookup', async () => {
    const getCustomerSpy = vi.spyOn(db, 'getCustomer');

    const event = {
      httpMethod: 'GET',
      queryStringParameters: { id: 'cust_123' },
      headers: { authorization: 'Bearer cust_123' },
    };

    const response: any = await handler(event, {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ error: 'Unauthorized' });
    expect(getCustomerSpy).not.toHaveBeenCalled();
  });

  it('rejects authenticated non-staff user attempting to access another user data with 401 and prevents DB lookup', async () => {
    const getCustomerSpy = vi.spyOn(db, 'getCustomer');

    const context = {
      clientContext: {
        user: {
          sub: 'cust_123',
          email: 'sarah.m@gmail.com',
          user_metadata: { id: 'cust_123' },
        },
      },
    };

    // Non-staff user cust_123 attempts to request cust_999
    const event = {
      httpMethod: 'GET',
      queryStringParameters: { id: 'cust_999' },
      headers: {},
    };

    const response: any = await handler(event, context);

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ error: 'Unauthorized' });
    expect(getCustomerSpy).not.toHaveBeenCalled();
  });

  it('grants access to matching customer record for authenticated user in clientContext', async () => {
    vi.spyOn(db, 'getCustomer').mockResolvedValue(mockCustomer);
    vi.spyOn(db, 'getTransactions').mockResolvedValue(mockActivities);

    const context = {
      clientContext: {
        user: {
          sub: 'cust_123',
          email: 'sarah.m@gmail.com',
          user_metadata: { id: 'cust_123' },
        },
      },
    };

    const event = {
      httpMethod: 'GET',
      queryStringParameters: { id: 'cust_123' },
      headers: {},
    };

    const response: any = await handler(event, context);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.id).toBe('cust_123');
    expect(body.firstName).toBe('Sarah');
    expect(body.activities).toHaveLength(1);
  });

  it('grants access to matching customer record by referral code for authenticated user in clientContext', async () => {
    vi.spyOn(db, 'getCustomerByReferralCode').mockResolvedValue(mockCustomer);
    vi.spyOn(db, 'getTransactions').mockResolvedValue(mockActivities);

    const context = {
      clientContext: {
        user: {
          sub: 'cust_123',
          user_metadata: { referralCode: 'SARAH-M' },
        },
      },
    };

    const event = {
      httpMethod: 'GET',
      queryStringParameters: { code: 'SARAH-M' },
      headers: {},
    };

    const response: any = await handler(event, context);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.referralCode).toBe('SARAH-M');
  });

  it('grants staff context access to any customer profile', async () => {
    vi.spyOn(db, 'getCustomer').mockResolvedValue(mockCustomer);
    vi.spyOn(db, 'getTransactions').mockResolvedValue(mockActivities);

    const context = {
      clientContext: {
        user: {
          email: 'staff@mailboxplusohio.com',
          app_metadata: { roles: ['staff'] },
        },
      },
    };

    const event = {
      httpMethod: 'GET',
      queryStringParameters: { id: 'cust_123' },
      headers: {},
    };

    const response: any = await handler(event, context);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.id).toBe('cust_123');
  });
});
