import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import handler from '../verify-session';
import { createMockNetlifyRequest, createMockNetlifyContext } from './helpers/test-harness';

const { mockCheckoutSessionsRetrieve } = vi.hoisted(() => ({
  mockCheckoutSessionsRetrieve: vi.fn(),
}));

vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(function (this: any) {
      this.checkout = {
        sessions: {
          retrieve: mockCheckoutSessionsRetrieve,
        },
      };
    }),
  };
});

describe('verify-session function handler', () => {
  const originalEnv = process.env;
  let ipCounter = 1;

  const createRequest = (method: string, sessionId?: string, clientIp?: string) => {
    const queryParams: Record<string, string> = {};
    if (sessionId !== undefined) {
      queryParams['session_id'] = sessionId;
    }
    return createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/verify-session',
      method,
      clientIp: clientIp || `10.2.0.${ipCounter++}`,
      queryParams,
    });
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      STRIPE_SECRET_KEY: 'sk_test_mock_secret_key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('handles OPTIONS preflight request and returns status 204 with CORS headers', async () => {
    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/verify-session',
      method: 'OPTIONS',
      headers: {
        Origin: 'https://mailboxplusohio.com',
      },
    });
    const ctx = createMockNetlifyContext();

    const res = await handler(req, ctx);
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://mailboxplusohio.com');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBeTruthy();
    expect(res.headers.get('Access-Control-Allow-Headers')).toBeTruthy();
  });

  it('returns 405 if HTTP method is not GET', async () => {
    const req = createRequest('POST', 'cs_test_12345');
    const ctx = createMockNetlifyContext();
    const res = await handler(req, ctx);
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ error: 'Method not allowed' });
  });

  it('enforces rate limiting of 10 requests per minute and returns status 429 on 11th attempt', async () => {
    const clientIp = '203.0.113.102';

    for (let i = 0; i < 10; i++) {
      const req = createRequest('GET', 'invalid_session_id', clientIp);
      const ctx = createMockNetlifyContext({ ip: clientIp });
      const res = await handler(req, ctx);
      expect(res.status).toBe(400);
    }

    const req11 = createRequest('GET', 'invalid_session_id', clientIp);
    const ctx11 = createMockNetlifyContext({ ip: clientIp });
    const res11 = await handler(req11, ctx11);

    expect(res11.status).toBe(429);
    expect(res11.headers.get('Retry-After')).toBeTruthy();
    expect(res11.headers.get('X-RateLimit-Limit')).toBe('10');
    expect(res11.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(res11.headers.get('X-RateLimit-Reset')).toBeTruthy();
    expect(await res11.json()).toEqual({ error: 'Too many requests. Please try again later.' });
  });

  it('returns 500 if STRIPE_SECRET_KEY is missing', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const req = createRequest('GET', 'cs_test_12345');
    const ctx = createMockNetlifyContext();
    const res = await handler(req, ctx);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Stripe is not configured' });
  });

  it('returns 400 for missing or invalid session_id format', async () => {
    const ctx = createMockNetlifyContext();
    const invalidSessionIds = [
      '',
      'invalid_session_id',
      'cs_dev_12345',
      'cs_test_123;DROP TABLE',
      'cs_live_123 456',
      'cs_test_hello_world!',
    ];

    const reqMissing = createRequest('GET');
    const resMissing = await handler(reqMissing, ctx);
    expect(resMissing.status).toBe(400);
    expect(await resMissing.json()).toEqual({ error: 'Invalid session_id' });

    for (const badId of invalidSessionIds) {
      const req = createRequest('GET', badId);
      const res = await handler(req, ctx);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Invalid session_id' });
    }
  });

  it('returns 402 if session is unpaid and not complete', async () => {
    mockCheckoutSessionsRetrieve.mockResolvedValueOnce({
      payment_status: 'unpaid',
      status: 'open',
    });

    const req = createRequest('GET', 'cs_test_a1b2c3d4e5');
    const ctx = createMockNetlifyContext();
    const res = await handler(req, ctx);
    expect(res.status).toBe(402);
    expect(await res.json()).toEqual({ error: 'Session not paid' });
  });

  it('returns 404 if Stripe session retrieval throws', async () => {
    mockCheckoutSessionsRetrieve.mockRejectedValueOnce(new Error('No such checkout session'));

    const req = createRequest('GET', 'cs_test_nonexistent123');
    const ctx = createMockNetlifyContext();
    const res = await handler(req, ctx);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Session not found' });
  });

  it('successfully verifies paid session using amount_total in cents', async () => {
    mockCheckoutSessionsRetrieve.mockResolvedValueOnce({
      payment_status: 'paid',
      status: 'complete',
      amount_total: 2500, // $25.00
      currency: 'usd',
      metadata: {
        tier: 'small_packages10',
        product: 'Small +10 Packages',
      },
    });

    const req = createRequest('GET', 'cs_test_a1b2c3d4e5f6g7');
    const ctx = createMockNetlifyContext();
    const res = await handler(req, ctx);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      tier: 'small_packages10',
      product: 'Small +10 Packages',
      amount: 25,
      currency: 'USD',
    });

    expect(mockCheckoutSessionsRetrieve).toHaveBeenCalledWith('cs_test_a1b2c3d4e5f6g7', {
      expand: ['subscription'],
    });
  });

  const tierFallbackCases = [
    { tier: 'small_mail_only', expectedName: 'Small · Mail Only', expectedMonthly: 15 },
    { tier: 'small_packages10', expectedName: 'Small · +10 Packages', expectedMonthly: 25 },
    { tier: 'large_mail_only', expectedName: 'Large · Mail Only', expectedMonthly: 30 },
    { tier: 'large_packages10', expectedName: 'Large · +10 Packages', expectedMonthly: 40 },
    { tier: 'business_small', expectedName: 'Business Small', expectedMonthly: 35 },
    { tier: 'business_large', expectedName: 'Business Large', expectedMonthly: 50 },
  ];

  it.each(tierFallbackCases)(
    'falls back to tier table price and product name when amount_total is missing for $tier',
    async ({ tier, expectedName, expectedMonthly }) => {
      mockCheckoutSessionsRetrieve.mockResolvedValueOnce({
        payment_status: 'unpaid',
        status: 'complete',
        amount_total: null,
        currency: 'usd',
        metadata: { tier },
      });

      const req = createRequest('GET', 'cs_live_a9b8c7d6e5f4');
      const ctx = createMockNetlifyContext();
      const res = await handler(req, ctx);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        ok: true,
        tier,
        product: expectedName,
        amount: expectedMonthly,
        currency: 'USD',
      });
    }
  );

  it('handles session with missing metadata gracefully', async () => {
    mockCheckoutSessionsRetrieve.mockResolvedValueOnce({
      payment_status: 'paid',
      status: 'complete',
      amount_total: 0,
      metadata: null,
    });

    const req = createRequest('GET', 'cs_live_z1y2x3w4v5u6');
    const ctx = createMockNetlifyContext();
    const res = await handler(req, ctx);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      tier: null,
      product: 'Mailbox Rental',
      amount: 0,
      currency: 'USD',
    });
  });

  it('suppresses customer PII and returns strictly non-sensitive fields', async () => {
    mockCheckoutSessionsRetrieve.mockResolvedValueOnce({
      payment_status: 'paid',
      status: 'complete',
      amount_total: 3500,
      currency: 'usd',
      customer: 'cus_N987654321',
      customer_details: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '+12165551234',
        address: {
          line1: '123 Main St',
          city: 'Chardon',
          state: 'OH',
          postal_code: '44024',
          country: 'US',
        },
      },
      customer_email: 'john.doe@example.com',
      metadata: {
        tier: 'business_small',
        product: 'Business Small',
      },
    });

    const req = createRequest('GET', 'cs_test_piicheck123');
    const ctx = createMockNetlifyContext();
    const res = await handler(req, ctx);

    expect(res.status).toBe(200);
    const body: Record<string, any> = await res.json();

    expect(Object.keys(body).sort()).toEqual(['amount', 'currency', 'ok', 'product', 'tier']);
    expect(body).toEqual({
      ok: true,
      tier: 'business_small',
      product: 'Business Small',
      amount: 35,
      currency: 'USD',
    });

    expect(body.email).toBeUndefined();
    expect(body.customer_email).toBeUndefined();
    expect(body.customer_details).toBeUndefined();
    expect(body.customer).toBeUndefined();
    expect(body.phone).toBeUndefined();
    expect(body.address).toBeUndefined();
    expect(body.name).toBeUndefined();
  });
});
