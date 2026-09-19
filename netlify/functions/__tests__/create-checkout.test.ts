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

describe('create-checkout function handler', () => {
  const originalEnv = process.env;
  let ipCounter = 1;

  const createRequest = (method: string, body?: any) => {
    return new Request('https://example.com/.netlify/functions/create-checkout', {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-nf-client-connection-ip': `10.1.0.${ipCounter++}`,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  };

  beforeEach(() => {
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

  it('creates checkout session successfully for mail-only tier (no SMS custom field)', async () => {
    mockPricesList
      .mockResolvedValueOnce({ data: [{ id: 'price_small_mail_only' }] })
      .mockResolvedValueOnce({ data: [{ id: 'price_key_deposit' }] });

    mockCheckoutSessionsCreate.mockResolvedValueOnce({
      url: 'https://checkout.stripe.com/c/pay/cs_test_small_mail_only',
    });

    const req = createRequest('POST', { tier: 'small_mail_only' });
    const res = await handler(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      url: 'https://checkout.stripe.com/c/pay/cs_test_small_mail_only',
    });

    expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith({
      mode: 'subscription',
      line_items: [
        { price: 'price_small_mail_only', quantity: 1 },
        { price: 'price_key_deposit', quantity: 1 },
      ],
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      consent_collection: { terms_of_service: 'required' },
      custom_fields: [],
      subscription_data: {
        metadata: {
          tier: 'small_mail_only',
          product: 'Small · Mail Only',
          source: 'private-mailbox-rental',
        },
      },
      metadata: {
        tier: 'small_mail_only',
        product: 'Small · Mail Only',
        source: 'private-mailbox-rental',
      },
      success_url: 'https://mailboxplusohio.com/thank-you/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://mailboxplusohio.com/private-mailbox-rental/',
    });
  });

  it('creates checkout session successfully for package tier with SMS consent custom field', async () => {
    mockPricesList
      .mockResolvedValueOnce({ data: [{ id: 'price_small_packages' }] })
      .mockResolvedValueOnce({ data: [{ id: 'price_key_deposit' }] });

    mockCheckoutSessionsCreate.mockResolvedValueOnce({
      url: 'https://checkout.stripe.com/c/pay/cs_test_small_packages',
    });

    const req = createRequest('POST', { tier: 'small_packages10' });
    const res = await handler(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      url: 'https://checkout.stripe.com/c/pay/cs_test_small_packages',
    });

    expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        custom_fields: [
          {
            key: 'sms_consent',
            label: { type: 'custom', custom: 'Type YES to consent to SMS text alerts' },
            optional: false,
            type: 'text',
            text: { minimum_length: 1, maximum_length: 100 },
          },
        ],
      })
    );
  });

  it('creates checkout session for business tier with correct cancel_url and source', async () => {
    mockPricesList
      .mockResolvedValueOnce({ data: [{ id: 'price_biz_small' }] })
      .mockResolvedValueOnce({ data: [{ id: 'price_key_deposit' }] });

    mockCheckoutSessionsCreate.mockResolvedValueOnce({
      url: 'https://checkout.stripe.com/c/pay/cs_test_biz_small',
    });

    const req = createRequest('POST', { tier: 'business_small' });
    const res = await handler(req);

    expect(res.status).toBe(200);
    expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        cancel_url: 'https://mailboxplusohio.com/home-business/mailbox-rental/',
        subscription_data: {
          metadata: {
            tier: 'business_small',
            product: 'Business Small',
            source: 'home-business-mailbox-rental',
          },
        },
      })
    );
  });

  it('returns 500 when Stripe API throws an error', async () => {
    mockPricesList.mockRejectedValueOnce(new Error('Stripe API Connection Error'));

    const req = createRequest('POST', { tier: 'small_mail_only' });
    const res = await handler(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Failed to create checkout session' });
  });
});
