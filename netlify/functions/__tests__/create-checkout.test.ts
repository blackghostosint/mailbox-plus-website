import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const { mockPricesList, mockCheckoutSessionsCreate } = vi.hoisted(() => ({
  mockPricesList: vi.fn(),
  mockCheckoutSessionsCreate: vi.fn(),
}));

vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(function (this: any) {
      this.prices = {
        list: mockPricesList,
      };
      this.checkout = {
        sessions: {
          create: mockCheckoutSessionsCreate,
        },
      };
    }),
  };
});

import handler from '../create-checkout';
import { resetRateLimitMemory } from '../lib/rate-limiter';

describe('create-checkout function handler', () => {
  const originalEnv = process.env;
  let ipCounter = 1;

  const createRequest = (method: string, body?: any, ip?: string) => {
    return new Request('https://example.com/.netlify/functions/create-checkout', {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-nf-client-connection-ip': ip || `10.1.0.${ipCounter++}`,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  };

  beforeEach(() => {
    resetRateLimitMemory();
    vi.resetModules();
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      STRIPE_SECRET_KEY: 'sk_test_mock_secret_key',
      SITE_URL: 'https://mailboxplusohio.com',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns 405 if HTTP method is not POST', async () => {
    const req = createRequest('GET');
    const res = await handler(req);
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ error: 'Method not allowed' });
  });

  it('returns 500 if STRIPE_SECRET_KEY is missing', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const req = createRequest('POST', { tier: 'small_mail_only' });
    const res = await handler(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Stripe is not configured on the server' });
  });

  it('returns 400 if tier is missing or invalid', async () => {
    const reqMissing = createRequest('POST', {});
    const resMissing = await handler(reqMissing);
    expect(resMissing.status).toBe(400);
    expect(await resMissing.json()).toHaveProperty('error');

    const reqInvalid = createRequest('POST', { tier: 'invalid_tier_name' });
    const resInvalid = await handler(reqInvalid);
    expect(resInvalid.status).toBe(400);
    const body = await resInvalid.json();
    expect(body.error).toContain('Invalid tier. Must be one of:');
  });

  it('returns 500 if tier price lookup fails', async () => {
    mockPricesList.mockResolvedValueOnce({ data: [] });

    const req = createRequest('POST', { tier: 'small_mail_only' });
    const res = await handler(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Price not found for tier: small_mail_only' });
    expect(mockPricesList).toHaveBeenCalledWith({
      lookup_keys: ['pmb_small_mail_only_monthly'],
      limit: 1,
      expand: ['data'],
    });
  });

  it('returns 500 if key deposit price lookup fails', async () => {
    mockPricesList.mockResolvedValueOnce({ data: [{ id: 'price_tier_123' }] });
    mockPricesList.mockResolvedValueOnce({ data: [] });

    const req = createRequest('POST', { tier: 'small_mail_only' });
    const res = await handler(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Price not found for: pmb_fee_key_deposit' });
    expect(mockPricesList).toHaveBeenCalledTimes(2);
    expect(mockPricesList).toHaveBeenLastCalledWith({
      lookup_keys: ['pmb_fee_key_deposit'],
      limit: 1,
    });
  });

  it('returns 500 when Stripe API throws an error', async () => {
    mockPricesList.mockRejectedValueOnce(new Error('Stripe API Connection Error'));

    const req = createRequest('POST', { tier: 'small_mail_only' });
    const res = await handler(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Failed to create checkout session' });
  });

  const allTiers = [
    {
      tier: 'small_mail_only',
      expectedLookupKey: 'pmb_small_mail_only_monthly',
      expectedProductName: 'Small · Mail Only',
      expectedSource: 'private-mailbox-rental',
      expectedCancelUrl: 'https://mailboxplusohio.com/private-mailbox-rental/',
      hasSmsConsent: false,
    },
    {
      tier: 'small_packages10',
      expectedLookupKey: 'pmb_small_packages10_monthly',
      expectedProductName: 'Small · +10 Packages',
      expectedSource: 'private-mailbox-rental',
      expectedCancelUrl: 'https://mailboxplusohio.com/private-mailbox-rental/',
      hasSmsConsent: true,
    },
    {
      tier: 'large_mail_only',
      expectedLookupKey: 'pmb_large_mail_only_monthly',
      expectedProductName: 'Large · Mail Only',
      expectedSource: 'private-mailbox-rental',
      expectedCancelUrl: 'https://mailboxplusohio.com/private-mailbox-rental/',
      hasSmsConsent: false,
    },
    {
      tier: 'large_packages10',
      expectedLookupKey: 'pmb_large_packages10_monthly',
      expectedProductName: 'Large · +10 Packages',
      expectedSource: 'private-mailbox-rental',
      expectedCancelUrl: 'https://mailboxplusohio.com/private-mailbox-rental/',
      hasSmsConsent: true,
    },
    {
      tier: 'business_small',
      expectedLookupKey: 'pmb_biz_small_monthly',
      expectedProductName: 'Business Small',
      expectedSource: 'home-business-mailbox-rental',
      expectedCancelUrl: 'https://mailboxplusohio.com/home-business/mailbox-rental/',
      hasSmsConsent: true,
    },
    {
      tier: 'business_large',
      expectedLookupKey: 'pmb_biz_large_monthly',
      expectedProductName: 'Business Large',
      expectedSource: 'home-business-mailbox-rental',
      expectedCancelUrl: 'https://mailboxplusohio.com/home-business/mailbox-rental/',
      hasSmsConsent: true,
    },
  ];

  it.each(allTiers)(
    'creates checkout session with correct pricing key, deposit, ToS, SMS consent, cancel URL, and metadata for $tier',
    async ({
      tier,
      expectedLookupKey,
      expectedProductName,
      expectedSource,
      expectedCancelUrl,
      hasSmsConsent,
    }) => {
      mockPricesList
        .mockResolvedValueOnce({ data: [{ id: `price_${tier}` }] })
        .mockResolvedValueOnce({ data: [{ id: 'price_key_deposit' }] });

      mockCheckoutSessionsCreate.mockResolvedValueOnce({
        url: `https://checkout.stripe.com/c/pay/cs_test_${tier}`,
      });

      const req = createRequest('POST', { tier });
      const res = await handler(req);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        url: `https://checkout.stripe.com/c/pay/cs_test_${tier}`,
      });

      expect(mockPricesList).toHaveBeenNthCalledWith(1, {
        lookup_keys: [expectedLookupKey],
        limit: 1,
        expand: ['data'],
      });

      expect(mockPricesList).toHaveBeenNthCalledWith(2, {
        lookup_keys: ['pmb_fee_key_deposit'],
        limit: 1,
      });

      const expectedSmsCustomField = hasSmsConsent
        ? [
            {
              key: 'sms_consent',
              label: { type: 'custom', custom: 'Type YES to consent to SMS text alerts' },
              optional: false,
              type: 'text',
              text: { minimum_length: 1, maximum_length: 100 },
            },
          ]
        : [];

      expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith({
        mode: 'subscription',
        line_items: [
          { price: `price_${tier}`, quantity: 1 },
          { price: 'price_key_deposit', quantity: 1 },
        ],
        billing_address_collection: 'required',
        phone_number_collection: { enabled: true },
        consent_collection: { terms_of_service: 'required' },
        custom_fields: expectedSmsCustomField,
        subscription_data: {
          metadata: {
            tier,
            product: expectedProductName,
            source: expectedSource,
          },
        },
        metadata: {
          tier,
          product: expectedProductName,
          source: expectedSource,
        },
        success_url: 'https://mailboxplusohio.com/thank-you/?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: expectedCancelUrl,
      });
    }
  );

  it('enforces rate limit of 10 requests per 60 seconds and rejects the 11th request with HTTP 429', async () => {
    mockPricesList.mockResolvedValue({ data: [{ id: 'price_small_mail_only' }] });
    mockCheckoutSessionsCreate.mockResolvedValue({
      url: 'https://checkout.stripe.com/c/pay/cs_test_123',
    });

    const clientIp = '203.0.113.88';

    // Make 10 valid POST requests from clientIp within quota
    for (let i = 0; i < 10; i++) {
      const req = createRequest('POST', { tier: 'small_mail_only' }, clientIp);
      const res = await handler(req);
      expect(res.status).toBe(200);
    }

    // Stripe SDK create sessions should have been called 10 times
    expect(mockCheckoutSessionsCreate).toHaveBeenCalledTimes(10);

    // 11th request from same clientIp within 60s window should be throttled
    const req11 = createRequest('POST', { tier: 'small_mail_only' }, clientIp);
    const res11 = await handler(req11);

    expect(res11.status).toBe(429);
    expect(res11.headers.get('Content-Type')).toBe('application/json');
    expect(res11.headers.get('Retry-After')).toBeTruthy();
    expect(res11.headers.get('X-RateLimit-Limit')).toBe('10');
    expect(res11.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(res11.headers.get('X-RateLimit-Reset')).toBeTruthy();
    expect(await res11.json()).toEqual({ error: 'Too many requests. Please try again later.' });

    // Ensure Stripe API was NOT invoked for the throttled request
    expect(mockCheckoutSessionsCreate).toHaveBeenCalledTimes(10);
  });

  it('tracks rate limits independently per client IP address', async () => {
    mockPricesList.mockResolvedValue({ data: [{ id: 'price_small_mail_only' }] });
    mockCheckoutSessionsCreate.mockResolvedValue({
      url: 'https://checkout.stripe.com/c/pay/cs_test_123',
    });

    const ip1 = '203.0.113.90';
    const ip2 = '203.0.113.91';

    // Exhaust quota for IP 1
    for (let i = 0; i < 10; i++) {
      const res = await handler(createRequest('POST', { tier: 'small_mail_only' }, ip1));
      expect(res.status).toBe(200);
    }

    // IP 1 is now rate limited
    const resIp1Throttled = await handler(createRequest('POST', { tier: 'small_mail_only' }, ip1));
    expect(resIp1Throttled.status).toBe(429);

    // IP 2 is still allowed
    const resIp2 = await handler(createRequest('POST', { tier: 'small_mail_only' }, ip2));
    expect(resIp2.status).toBe(200);
  });
});
