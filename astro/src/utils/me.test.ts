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

  it('rejects authenticated non-staff user attempting to access another user data with 403 and prevents DB lookup', async () => {
    const getCustomerSpy = vi.spyOn(db, 'getCustomer');

    const context = {
      clientContext: {
        user: {
          sub: 'cust_123',
          email: 'sarah.m@gmail.com',
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

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toEqual({ error: 'Forbidden' });
    expect(getCustomerSpy).not.toHaveBeenCalled();
  });

  it('rejects user with planted user_metadata referralCode or id attempting IDOR access with 403 Forbidden and prevents DB lookup', async () => {
    const getCustomerSpy = vi.spyOn(db, 'getCustomer');
    const getCustomerByRefSpy = vi.spyOn(db, 'getCustomerByReferralCode');

    // Attacker sets user_metadata via Netlify Identity client API to victim's referralCode and id
    const context = {
      clientContext: {
        user: {
          sub: 'attacker_uuid_999',
          email: 'attacker@example.com',
          user_metadata: {
            id: 'cust_123',
            customer_id: 'cust_123',
            referralCode: 'SARAH-M',
          },
        },
      },
    };

    // Attacker attempts access via referral code
    const event1 = {
      httpMethod: 'GET',
      queryStringParameters: { code: 'SARAH-M' },
      headers: {},
    };

    const response1: any = await handler(event1, context);
    expect(response1.statusCode).toBe(403);
    expect(JSON.parse(response1.body)).toEqual({ error: 'Forbidden' });
    expect(getCustomerByRefSpy).not.toHaveBeenCalled();

    // Attacker attempts access via customer ID
    const event2 = {
      httpMethod: 'GET',
      queryStringParameters: { id: 'cust_123' },
      headers: {},
    };

    const response2: any = await handler(event2, context);
    expect(response2.statusCode).toBe(403);
    expect(JSON.parse(response2.body)).toEqual({ error: 'Forbidden' });
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

  it('grants access to matching customer record by referral code in app_metadata for authenticated user in clientContext', async () => {
    vi.spyOn(db, 'getCustomerByReferralCode').mockResolvedValue(mockCustomer);
    vi.spyOn(db, 'getTransactions').mockResolvedValue(mockActivities);

    const context = {
      clientContext: {
        user: {
          sub: 'cust_123',
          app_metadata: { referralCode: 'SARAH-M' },
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

  it('grants staff context access to any customer profile when app_metadata.roles contains staff', async () => {
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

  it('rejects staff access when role is in user_metadata or top-level role property', async () => {
    const getCustomerSpy = vi.spyOn(db, 'getCustomer');

    const context = {
      clientContext: {
        user: {
          sub: 'user_456',
          email: 'user@example.com',
          role: 'staff',
          roles: ['staff'],
          user_metadata: { roles: ['staff'], role: 'admin' },
        },
      },
    };

    const event = {
      httpMethod: 'GET',
      queryStringParameters: { id: 'cust_123' },
      headers: {},
    };

    const response: any = await handler(event, context);

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toEqual({ error: 'Forbidden' });
    expect(getCustomerSpy).not.toHaveBeenCalled();
  });

  it('derives customer id from app_metadata.customer_id when query parameters are omitted', async () => {
    vi.spyOn(db, 'getCustomer').mockResolvedValue(mockCustomer);
    vi.spyOn(db, 'getTransactions').mockResolvedValue(mockActivities);

    const context = {
      clientContext: {
        user: {
          sub: 'identity_uuid_888',
          email: 'sarah.m@gmail.com',
          app_metadata: { customer_id: 'cust_123' },
        },
      },
    };

    const event = {
      httpMethod: 'GET',
      queryStringParameters: {},
      headers: {},
    };

    const response: any = await handler(event, context);

    expect(response.statusCode).toBe(200);
    expect(db.getCustomer).toHaveBeenCalledWith('cust_123');
    const body = JSON.parse(response.body);
    expect(body.id).toBe('cust_123');
  });
});
