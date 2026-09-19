import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

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

import handler from '../verify-session';

describe('verify-session function handler', () => {
  const originalEnv = process.env;
  let ipCounter = 1;

  const createRequest = (method: string, sessionId?: string) => {
    const url = new URL('https://example.com/.netlify/functions/verify-session');
    if (sessionId !== undefined) {
      url.searchParams.set('session_id', sessionId);
    }
    return new Request(url.toString(), {
      method,
      headers: {
        'x-nf-client-connection-ip': `10.2.0.${ipCounter++}`,
      },
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

  it('returns 405 if HTTP method is not GET', async () => {
    const req = createRequest('POST', 'cs_test_12345');
    const res = await handler(req);
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ error: 'Method not allowed' });
  });

  it('returns 500 if STRIPE_SECRET_KEY is missing', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const req = createRequest('GET', 'cs_test_12345');
    const res = await handler(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Stripe is not configured' });
  });

  it('returns 400 for missing or invalid session_id format', async () => {
    const reqMissing = createRequest('GET');
    const resMissing = await handler(reqMissing);
    expect(resMissing.status).toBe(400);
    expect(await resMissing.json()).toEqual({ error: 'Invalid session_id' });

    const reqInvalid = createRequest('GET', 'invalid_session_id_format');
    const resInvalid = await handler(reqInvalid);
    expect(resInvalid.status).toBe(400);
    expect(await resInvalid.json()).toEqual({ error: 'Invalid session_id' });
  });

  it('returns 402 if session is unpaid and not complete', async () => {
    mockCheckoutSessionsRetrieve.mockResolvedValueOnce({
      payment_status: 'unpaid',
      status: 'open',
    });

    const req = createRequest('GET', 'cs_test_a1b2c3d4e5');
    const res = await handler(req);
    expect(res.status).toBe(402);
    expect(await res.json()).toEqual({ error: 'Session not paid' });
  });

  it('returns 404 if Stripe session retrieval throws', async () => {
    mockCheckoutSessionsRetrieve.mockRejectedValueOnce(new Error('No such checkout session'));

    const req = createRequest('GET', 'cs_test_nonexistent123');
    const res = await handler(req);
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
    const res = await handler(req);

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

  it('successfully verifies complete session and falls back to tier monthly price when amount_total is missing', async () => {
    mockCheckoutSessionsRetrieve.mockResolvedValueOnce({
      payment_status: 'unpaid',
      status: 'complete',
      amount_total: null,
      currency: 'usd',
      metadata: {
        tier: 'business_large',
      },
    });

    const req = createRequest('GET', 'cs_live_a9b8c7d6e5f4');
    const res = await handler(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      tier: 'business_large',
      product: 'Business Large',
      amount: 50,
      currency: 'USD',
    });
  });

  it('handles session with missing metadata gracefully', async () => {
    mockCheckoutSessionsRetrieve.mockResolvedValueOnce({
      payment_status: 'paid',
      status: 'complete',
      amount_total: 0,
      metadata: null,
    });

    const req = createRequest('GET', 'cs_live_z1y2x3w4v5u6');
    const res = await handler(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      tier: null,
      product: 'Mailbox Rental',
      amount: 0,
      currency: 'USD',
    });
  });
});
