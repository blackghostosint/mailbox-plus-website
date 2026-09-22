/* global process, RequestInfo, RequestInit */
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

import { createCheckoutSession } from '../checkout';
import { submitContactForm } from '../contact-form';
import { fetchReviews } from '../reviews';
import { verifyCheckoutSession } from '../verify-session';
import { sendCspReport } from '../csp-report';
import { apiFetch, ApiClientError } from '../api-client';

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

    vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
      let req: Request;
      if (input instanceof Request) {
        req = input;
      } else {
        const urlStr = input.toString();
        const fullUrl = urlStr.startsWith('/') ? 'https://mailboxplusohio.com' + urlStr : urlStr;
        req = new Request(fullUrl, init);
      }

      const url = new URL(req.url, 'https://mailboxplusohio.com');

      if (url.origin === 'https://places.googleapis.com') {
        return new Response(JSON.stringify(mockPlacesResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (url.pathname === '/.netlify/functions/create-checkout') {
        return createCheckoutHandler(req, dummyContext);
      }
      if (url.pathname === '/.netlify/functions/sendEmail') {
        return sendEmailHandler(req, dummyContext);
      }
      if (url.pathname === '/api/reviews') {
        return reviewsHandler(req, dummyContext);
      }
      if (url.pathname === '/.netlify/functions/verify-session') {
        return verifySessionHandler(req, dummyContext);
      }
      if (url.pathname === '/.netlify/functions/csp-report') {
        return cspReportHandler(req, dummyContext);
      }
      if (url.pathname === '/.netlify/functions/health') {
        return healthHandler(req, dummyContext);
      }

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  describe('create-checkout contract', () => {
    it('returns a response conforming to CreateCheckoutSuccessSchema when called via client helper', async () => {
      mockPricesList
        .mockResolvedValueOnce({ data: [{ id: 'price_small_mail_only' }] })
        .mockResolvedValueOnce({ data: [{ id: 'price_key_deposit' }] });

      mockCheckoutSessionsCreate.mockResolvedValueOnce({
        url: 'https://checkout.stripe.com/c/pay/cs_test_123',
      });

      const result = await createCheckoutSession('small_mail_only');
      expect(result.url).toBe('https://checkout.stripe.com/c/pay/cs_test_123');
    });

    it('returns backward-compatible ErrorResponseSchema on invalid request body via client helper', async () => {
      let thrownError: ApiClientError | undefined;
      try {
        await createCheckoutSession('invalid_tier_name');
      } catch (err) {
        if (err instanceof ApiClientError) {
          thrownError = err;
        }
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.status).toBe(400);
      const parsed = ErrorResponseSchema.safeParse(thrownError?.data);
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
    it('returns a response conforming to SendEmailSuccessSchema when called via client helper', async () => {
      const result = await submitContactForm({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'I would like to rent a mailbox.',
        recaptchaToken: 'mock_token',
      });

      expect(result.success).toBe(true);
    });

    it('returns ErrorResponseSchema on invalid email input via client helper', async () => {
      let thrownError: ApiClientError | undefined;
      try {
        await submitContactForm({ email: 'not-an-email' });
      } catch (err) {
        if (err instanceof ApiClientError) {
          thrownError = err;
        }
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.status).toBe(400);
      const parsed = ErrorResponseSchema.safeParse(thrownError?.data);
      expect(parsed.success).toBe(true);
    });

    it('detects schema drift if serverless function output structure is altered', () => {
      const mutatedBackendOutput = { status: 'sent' };
      const parsed = SendEmailSuccessSchema.safeParse(mutatedBackendOutput);
      expect(parsed.success).toBe(false);
    });
  });

  describe('reviews contract', () => {
    it('returns a response conforming to ReviewsSuccessSchema via client helper', async () => {
      const result = await fetchReviews();
      expect(result.rating).toBe(4.9);
      expect(result.userRatingCount).toBe(120);
      expect(result.reviews.length).toBe(1);
      expect(result.reviews[0].author).toBe('John Smith');
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
    it('returns a response conforming to VerifySessionSuccessSchema when called via client helper', async () => {
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

      const result = await verifyCheckoutSession('cs_test_a1b2c3d4');
      expect(result.ok).toBe(true);
      expect(result.tier).toBe('small_packages10');
      expect(result.amount).toBe(25);
      expect(result.currency).toBe('USD');
    });

    it('returns ErrorResponseSchema on invalid session_id query param via client helper', async () => {
      let thrownError: ApiClientError | undefined;
      try {
        await verifyCheckoutSession('invalid_id');
      } catch (err) {
        if (err instanceof ApiClientError) {
          thrownError = err;
        }
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.status).toBe(400);
      const parsed = ErrorResponseSchema.safeParse(thrownError?.data);
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
    it('handles valid CSP report request via client helper', async () => {
      await expect(
        sendCspReport({
          'csp-report': {
            'document-uri': 'https://mailboxplusohio.com/services/',
            'violated-directive': 'script-src',
            'blocked-uri': 'https://evil.example.com/script.js',
          },
        })
      ).resolves.toBeUndefined();
    });

    it('handles valid flat CSP report request via client helper', async () => {
      await expect(
        sendCspReport({
          'document-uri': 'https://mailboxplusohio.com/services/',
          'violated-directive': 'script-src',
        })
      ).resolves.toBeUndefined();
    });

    it('handles valid modern report-to array payload via client helper', async () => {
      await expect(
        sendCspReport([
          {
            type: 'csp-violation',
            age: 10,
            url: 'https://mailboxplusohio.com/services/',
            user_agent: 'Mozilla/5.0',
            body: {
              documentURL: 'https://mailboxplusohio.com/services/',
              violatedDirective: 'script-src',
              blockedURL: 'https://evil.example.com/script.js',
            },
          },
        ])
      ).resolves.toBeUndefined();
    });

    it('handles valid modern report-to single item payload via client helper', async () => {
      await expect(
        sendCspReport({
          type: 'csp-violation',
          age: 5,
          url: 'https://mailboxplusohio.com/services/',
          body: {
            documentURL: 'https://mailboxplusohio.com/services/',
            violatedDirective: 'img-src',
            blockedURL: 'http://insecure.example.com/image.png',
          },
        })
      ).resolves.toBeUndefined();
    });

    it('rejects empty array [] and returns 400 Bad Request', async () => {
      let thrownError: ApiClientError | undefined;
      try {
        await apiFetch('/.netlify/functions/csp-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([]),
        });
      } catch (err) {
        if (err instanceof ApiClientError) {
          thrownError = err;
        }
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.status).toBe(400);
      const parsed = ErrorResponseSchema.safeParse(thrownError?.data);
      expect(parsed.success).toBe(true);
    });

    it('rejects empty object {} and returns 400 Bad Request', async () => {
      let thrownError: ApiClientError | undefined;
      try {
        await apiFetch('/.netlify/functions/csp-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
      } catch (err) {
        if (err instanceof ApiClientError) {
          thrownError = err;
        }
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.status).toBe(400);
      const parsed = ErrorResponseSchema.safeParse(thrownError?.data);
      expect(parsed.success).toBe(true);
    });

    it('rejects garbage object with unknown keys and returns 400 Bad Request', async () => {
      let thrownError: ApiClientError | undefined;
      try {
        await apiFetch('/.netlify/functions/csp-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foo: 'bar', garbage: 123 }),
        });
      } catch (err) {
        if (err instanceof ApiClientError) {
          thrownError = err;
        }
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.status).toBe(400);
      const parsed = ErrorResponseSchema.safeParse(thrownError?.data);
      expect(parsed.success).toBe(true);
    });

    it('rejects { "csp-report": {} } and returns 400 Bad Request', async () => {
      let thrownError: ApiClientError | undefined;
      try {
        await apiFetch('/.netlify/functions/csp-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'csp-report': {} }),
        });
      } catch (err) {
        if (err instanceof ApiClientError) {
          thrownError = err;
        }
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.status).toBe(400);
      const parsed = ErrorResponseSchema.safeParse(thrownError?.data);
      expect(parsed.success).toBe(true);
    });

    it('returns ErrorResponseSchema on malformed JSON payload', async () => {
      let thrownError: ApiClientError | undefined;
      try {
        await apiFetch('/.netlify/functions/csp-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid-json',
        });
      } catch (err) {
        if (err instanceof ApiClientError) {
          thrownError = err;
        }
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.status).toBe(400);
      const parsed = ErrorResponseSchema.safeParse(thrownError?.data);
      expect(parsed.success).toBe(true);
    });
  });

  describe('health contract', () => {
    it('returns a response conforming to HealthSuccessSchema', async () => {
      const data = await apiFetch<unknown>('/.netlify/functions/health');
      const parsed = HealthSuccessSchema.safeParse(data);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.status).toBe('healthy');
        expect(typeof parsed.data.responseTime).toBe('number');
      }
    });
  });
});
