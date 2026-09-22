/* global process */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Context } from '@netlify/functions';

const { mockPricesList, mockCheckoutSessionsCreate, mockSessionsRetrieve } = vi.hoisted(() => ({
  mockPricesList: vi.fn(),
  mockCheckoutSessionsCreate: vi.fn(),
  mockSessionsRetrieve: vi.fn(),
}));

vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return {
        prices: {
          list: mockPricesList,
        },
        checkout: {
          sessions: {
            create: mockCheckoutSessionsCreate,
            retrieve: mockSessionsRetrieve,
          },
        },
      };
    }),
  };
});

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(function () {
      return {
        emails: {
          send: vi.fn().mockResolvedValue({ id: 'msg_123' }),
        },
      };
    }),
  };
});

vi.mock('../../../../netlify/functions/lib/recaptcha', () => ({
  verifyRecaptchaToken: vi.fn().mockResolvedValue(true),
}));

vi.mock('@netlify/blobs', () => ({
  getStore: vi.fn().mockReturnValue({
    get: vi.fn().mockResolvedValue(null),
    setJSON: vi.fn().mockResolvedValue(undefined),
  }),
}));

import createCheckoutHandler from '../../../../netlify/functions/create-checkout';
import sendEmailHandler from '../../../../netlify/functions/sendEmail';
import reviewsHandler from '../../../../netlify/functions/reviews';
import verifySessionHandler from '../../../../netlify/functions/verify-session';
import cspReportHandler from '../../../../netlify/functions/csp-report';
import healthHandler from '../../../../netlify/functions/health';

import {
  CreateCheckoutSuccessSchema,
  SendEmailSuccessSchema,
  ReviewsSuccessSchema,
  VerifySessionSuccessSchema,
  HealthSuccessSchema,
  ErrorResponseSchema,
} from '../contracts';

describe('Cross-Boundary Endpoint Contract Test Suite', () => {
  const dummyContext = {} as Context;
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      STRIPE_SECRET_KEY: 'sk_test_mock_secret',
      RESEND_API_KEY: 're_mock_api_key',
      GOOGLE_PLACES_API_KEY: 'AIzaMockKey',
      SITE_URL: 'https://mailboxplusohio.com',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('create-checkout contract', () => {
    it('returns a response conforming to CreateCheckoutSuccessSchema when given valid input', async () => {
      mockPricesList
        .mockResolvedValueOnce({ data: [{ id: 'price_small_mail_only' }] })
        .mockResolvedValueOnce({ data: [{ id: 'price_key_deposit' }] });

      mockCheckoutSessionsCreate.mockResolvedValueOnce({
        url: 'https://checkout.stripe.com/c/pay/cs_test_123',
      });

      const req = new Request('https://mailboxplusohio.com/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'small_mail_only' }),
      });

      const res = await createCheckoutHandler(req, dummyContext);
      expect(res.status).toBe(200);

      const json = await res.json();
      const parsed = CreateCheckoutSuccessSchema.safeParse(json);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.url).toBe('https://checkout.stripe.com/c/pay/cs_test_123');
      }
    });

    it('returns backward-compatible ErrorResponseSchema on invalid request body', async () => {
      const req = new Request('https://mailboxplusohio.com/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'invalid_tier_name' }),
      });

      const res = await createCheckoutHandler(req, dummyContext);
      expect(res.status).toBe(400);

      const json = await res.json();
      const parsed = ErrorResponseSchema.safeParse(json);
      expect(parsed.success).toBe(true);
    });

    it('detects schema drift if serverless function output structure is altered', () => {
      const mutatedBackendOutput = {
        checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_123',
      };
      const parsed = CreateCheckoutSuccessSchema.safeParse(mutatedBackendOutput);
      expect(parsed.success).toBe(false);
    });
  });

  describe('sendEmail contract', () => {
    it('returns a response conforming to SendEmailSuccessSchema when given valid input', async () => {
      const req = new Request('https://mailboxplusohio.com/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Doe',
          email: 'jane@example.com',
          message: 'I would like to rent a mailbox.',
          recaptchaToken: 'mock_token',
        }),
      });

      const res = await sendEmailHandler(req, dummyContext);
      expect(res.status).toBe(200);

      const json = await res.json();
      const parsed = SendEmailSuccessSchema.safeParse(json);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.success).toBe(true);
      }
    });

    it('returns ErrorResponseSchema on invalid email input', async () => {
      const req = new Request('https://mailboxplusohio.com/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'not-an-email',
        }),
      });

      const res = await sendEmailHandler(req, dummyContext);
      expect(res.status).toBe(400);

      const json = await res.json();
      const parsed = ErrorResponseSchema.safeParse(json);
      expect(parsed.success).toBe(true);
    });

    it('detects schema drift if serverless function output structure is altered', () => {
      const mutatedBackendOutput = { status: 'sent' };
      const parsed = SendEmailSuccessSchema.safeParse(mutatedBackendOutput);
      expect(parsed.success).toBe(false);
    });
  });

  describe('reviews contract', () => {
    it('returns a response conforming to ReviewsSuccessSchema', async () => {
      const mockPlacesResponse = {
        rating: 4.9,
        userRatingCount: 120,
        reviews: [
          {
            authorAttribution: {
              displayName: 'John Smith',
              uri: 'https://maps.google.com/contrib/123',
            },
            rating: 5,
            text: { text: 'Outstanding service!' },
            relativePublishTimeDescription: 'a week ago',
            publishTime: '2026-09-01T00:00:00Z',
          },
        ],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockPlacesResponse,
        })
      );

      const req = new Request('https://mailboxplusohio.com/api/reviews', { method: 'GET' });
      const res = await reviewsHandler(req, dummyContext);
      expect(res.status).toBe(200);

      const json = await res.json();
      const parsed = ReviewsSuccessSchema.safeParse(json);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.rating).toBe(4.9);
        expect(parsed.data.userRatingCount).toBe(120);
        expect(parsed.data.reviews.length).toBe(1);
        expect(parsed.data.reviews[0].author).toBe('John Smith');
      }
    });

    it('detects schema drift if reviews array property name is modified', () => {
      const mutatedBackendOutput = {
        rating: 4.9,
        userRatingCount: 120,
        items: [],
      };
      const parsed = ReviewsSuccessSchema.safeParse(mutatedBackendOutput);
      expect(parsed.success).toBe(false);
    });
  });

  describe('verify-session contract', () => {
    it('returns a response conforming to VerifySessionSuccessSchema when session is valid', async () => {
      mockSessionsRetrieve.mockResolvedValueOnce({
        payment_status: 'paid',
        status: 'complete',
        amount_total: 2500,
        currency: 'usd',
        metadata: {
          tier: 'small_packages10',
          product: 'Small · +10 Packages',
        },
      });

      const req = new Request(
        'https://mailboxplusohio.com/.netlify/functions/verify-session?session_id=cs_test_a1b2c3d4',
        { method: 'GET' }
      );

      const res = await verifySessionHandler(req, dummyContext);
      expect(res.status).toBe(200);

      const json = await res.json();
      const parsed = VerifySessionSuccessSchema.safeParse(json);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.ok).toBe(true);
        expect(parsed.data.tier).toBe('small_packages10');
        expect(parsed.data.amount).toBe(25);
        expect(parsed.data.currency).toBe('USD');
      }
    });

    it('returns ErrorResponseSchema on invalid session_id query param', async () => {
      const req = new Request(
        'https://mailboxplusohio.com/.netlify/functions/verify-session?session_id=invalid_id',
        { method: 'GET' }
      );

      const res = await verifySessionHandler(req, dummyContext);
      expect(res.status).toBe(400);

      const json = await res.json();
      const parsed = ErrorResponseSchema.safeParse(json);
      expect(parsed.success).toBe(true);
    });

    it('detects schema drift if response boolean field is renamed', () => {
      const mutatedBackendOutput = {
        success: true,
        tier: 'small_packages10',
        product: 'Small · +10 Packages',
        amount: 25,
        currency: 'USD',
      };
      const parsed = VerifySessionSuccessSchema.safeParse(mutatedBackendOutput);
      expect(parsed.success).toBe(false);
    });
  });

  describe('csp-report contract', () => {
    it('handles valid CSP report request with HTTP 204 response', async () => {
      const req = new Request('https://mailboxplusohio.com/.netlify/functions/csp-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'csp-report': {
            'document-uri': 'https://mailboxplusohio.com/services/',
            'violated-directive': 'script-src',
            'blocked-uri': 'https://evil.example.com/script.js',
          },
        }),
      });

      const res = await cspReportHandler(req, dummyContext);
      expect(res.status).toBe(204);
    });

    it('returns ErrorResponseSchema on malformed JSON payload', async () => {
      const req = new Request('https://mailboxplusohio.com/.netlify/functions/csp-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json',
      });

      const res = await cspReportHandler(req, dummyContext);
      expect(res.status).toBe(400);

      const json = await res.json();
      const parsed = ErrorResponseSchema.safeParse(json);
      expect(parsed.success).toBe(true);
    });
  });

  describe('health contract', () => {
    it('returns a response conforming to HealthSuccessSchema', async () => {
      const req = new Request('https://mailboxplusohio.com/.netlify/functions/health', {
        method: 'GET',
      });

      const res = await healthHandler(req, dummyContext);
      expect(res.status).toBe(200);

      const json = await res.json();
      const parsed = HealthSuccessSchema.safeParse(json);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.status).toBe('healthy');
        expect(typeof parsed.data.responseTime).toBe('number');
      }
    });
  });
});
