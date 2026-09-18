import { describe, it, expect, vi } from 'vitest';
import createCheckoutHandler from '../create-checkout';
import sendEmailHandler, { getClientIp } from '../sendEmail';
import verifySessionHandler from '../verify-session';
import cspReportHandler from '../csp-report';
import healthHandler from '../health';
import reviewsHandler from '../reviews';

describe('Netlify Function Endpoints CORS and Header Consistency', () => {
  const mockContext: any = {};
  const EXPECTED_ORIGIN = 'https://mailboxplusohio.com';

  describe('create-checkout', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/create-checkout', {
        method: 'OPTIONS',
      });
      const res = await createCheckoutHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      expect(res.headers.get('Access-Control-Allow-Methods')).toBe(
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
      expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
        'Content-Type, Authorization, X-Requested-With'
      );
    });

    it('returns status 405 for GET request with CORS and Content-Type headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/create-checkout', {
        method: 'GET',
      });
      const res = await createCheckoutHandler(request, mockContext);
      expect(res.status).toBe(405);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
    });

    it('returns status 400 for invalid tier with CORS and Content-Type headers', async () => {
      process.env.STRIPE_SECRET_KEY = 'dummy_stripe_secret_key';
      const request = new Request('https://example.com/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'invalid_tier' }),
      });
      const res = await createCheckoutHandler(request, mockContext);
      expect(res.status).toBe(400);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      const body = await res.json();
      expect(body).toHaveProperty('error');
    });

    it('returns status 429 when rate limit is exceeded', async () => {
      const rateLimitIp = '198.51.100.10';
      const makeRequest = () =>
        new Request('https://example.com/.netlify/functions/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-nf-client-connection-ip': rateLimitIp,
          },
          body: JSON.stringify({ tier: 'invalid_tier' }),
        });

      for (let i = 0; i < 10; i++) {
        await createCheckoutHandler(makeRequest(), mockContext);
      }

      const res = await createCheckoutHandler(makeRequest(), mockContext);
      expect(res.status).toBe(429);
      const body = await res.json();
      expect(body).toEqual({
        error: 'Too many requests. Please try again later.',
      });
    });
  });

  describe('sendEmail', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/sendEmail', {
        method: 'OPTIONS',
      });
      const res = await sendEmailHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      expect(res.headers.get('Access-Control-Allow-Methods')).toBe(
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
      expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
        'Content-Type, Authorization, X-Requested-With'
      );
    });

    it('returns status 405 for GET request with CORS and Content-Type headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/sendEmail', {
        method: 'GET',
      });
      const res = await sendEmailHandler(request, mockContext);
      expect(res.status).toBe(405);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
    });

    it('returns status 400 for failed reCAPTCHA verification with CORS and Content-Type headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John',
          email: 'john@example.com',
          recaptchaToken: 'invalid',
        }),
      });
      const res = await sendEmailHandler(request, mockContext);
      expect(res.status).toBe(400);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      expect(await res.json()).toEqual({ error: 'reCAPTCHA verification failed' });
    });

    it('returns status 429 when IP rate limit is exceeded', async () => {
      const rateLimitIp = '192.168.1.100';

      // Exhaust 5 allowed attempts
      for (let i = 0; i < 5; i++) {
        const req = new Request('https://example.com/.netlify/functions/sendEmail', {
          method: 'POST',
          headers: {
            'client-ip': rateLimitIp,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Spammer',
            email: 'spam@example.com',
            recaptchaToken: 'test',
          }),
        });
        await sendEmailHandler(req, mockContext);
      }

      // 6th attempt should trigger 429 Too Many Requests
      const blockedReq = new Request('https://example.com/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: {
          'client-ip': rateLimitIp,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Spammer',
          email: 'spam@example.com',
          recaptchaToken: 'test',
        }),
      });
      const res = await sendEmailHandler(blockedReq, mockContext);
      expect(res.status).toBe(429);
      expect(await res.json()).toEqual({
        error: 'Too many requests. Please try again later.',
      });
    });

    describe('getClientIp anti-spoofing resilience', () => {
      it('prioritizes x-nf-client-connection-ip over x-forwarded-for and client-ip', () => {
        const headers = {
          'x-forwarded-for': '203.0.113.1, 198.51.100.1',
          'client-ip': '198.51.100.2',
          'x-nf-client-connection-ip': '203.0.113.99',
        };
        expect(getClientIp(headers)).toBe('203.0.113.99');
      });

      it('is case-insensitive when extracting Netlify connection IP headers', () => {
        const headers = {
          'X-Nf-Client-Connection-Ip': '203.0.113.88',
          'X-Forwarded-For': '10.0.0.1',
        };
        expect(getClientIp(headers)).toBe('203.0.113.88');
      });

      it('correctly uses client-ip when x-nf-client-connection-ip is not set', () => {
        const headers = {
          'CLIENT-IP': '198.51.100.42',
          'x-forwarded-for': '10.0.0.1',
        };
        expect(getClientIp(headers)).toBe('198.51.100.42');
      });

      it('extracts the last IP in x-forwarded-for when Edge connection headers are absent', () => {
        const headers = {
          'x-forwarded-for': 'spoofed_ip_1, spoofed_ip_2, trusted_edge_ip',
        };
        expect(getClientIp(headers)).toBe('trusted_edge_ip');
      });

      it('prevents rate limit bypass via x-forwarded-for header spoofing', async () => {
        const realConnectionIp = '198.51.100.150';

        // Attacker attempts to change x-forwarded-for header on each attempt,
        // but Netlify Edge sets x-nf-client-connection-ip to the real client IP.
        for (let i = 0; i < 5; i++) {
          const req = new Request('https://example.com/.netlify/functions/sendEmail', {
            method: 'POST',
            headers: {
              'x-nf-client-connection-ip': realConnectionIp,
              'x-forwarded-for': `1.2.3.${i}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'Spoofer', recaptchaToken: 'token' }),
          });
          const res = await sendEmailHandler(req, mockContext);
          expect(res.status).not.toBe(429);
        }

        // 6th attempt with another spoofed x-forwarded-for should STILL hit rate limit (429)
        const blockedReq = new Request('https://example.com/.netlify/functions/sendEmail', {
          method: 'POST',
          headers: {
            'x-nf-client-connection-ip': realConnectionIp,
            'x-forwarded-for': '9.9.9.9',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'Spoofer', recaptchaToken: 'token' }),
        });
        const blockedRes = await sendEmailHandler(blockedReq, mockContext);

        expect(blockedRes.status).toBe(429);
      });
    });
  });

  describe('verify-session', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/verify-session', {
        method: 'OPTIONS',
      });
      const res = await verifySessionHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      expect(res.headers.get('Access-Control-Allow-Methods')).toBe(
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
      expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
        'Content-Type, Authorization, X-Requested-With'
      );
    });

    it('returns status 405 for POST request with CORS and Content-Type headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/verify-session', {
        method: 'POST',
      });
      const res = await verifySessionHandler(request, mockContext);
      expect(res.status).toBe(405);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
    });

    it('returns status 400 for invalid session_id with CORS and Content-Type headers', async () => {
      process.env.STRIPE_SECRET_KEY = 'dummy_stripe_secret_key';
      const request = new Request(
        'https://example.com/.netlify/functions/verify-session?session_id=bad_session',
        { method: 'GET' }
      );
      const res = await verifySessionHandler(request, mockContext);
      expect(res.status).toBe(400);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      expect(await res.json()).toEqual({ error: 'Invalid session_id' });
    });

    it('returns status 429 when rate limit is exceeded', async () => {
      const rateLimitIp = '198.51.100.20';
      const makeRequest = () =>
        new Request(
          'https://example.com/.netlify/functions/verify-session?session_id=cs_test_invalid',
          {
            method: 'GET',
            headers: {
              'x-nf-client-connection-ip': rateLimitIp,
            },
          }
        );

      for (let i = 0; i < 10; i++) {
        await verifySessionHandler(makeRequest(), mockContext);
      }

      const res = await verifySessionHandler(makeRequest(), mockContext);
      expect(res.status).toBe(429);
      const body = await res.json();
      expect(body).toEqual({
        error: 'Too many requests. Please try again later.',
      });
    });
  });

  describe('csp-report', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/csp-report', {
        method: 'OPTIONS',
      });
      const res = await cspReportHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      expect(res.headers.get('Access-Control-Allow-Methods')).toBe(
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
    });

    it('returns status 405 for GET request with CORS and Content-Type headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/csp-report', {
        method: 'GET',
      });
      const res = await cspReportHandler(request, mockContext);
      expect(res.status).toBe(405);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      expect(res.headers.get('Content-Type')).toBe('application/json');
    });

    it('returns status 204 for valid CSP POST report with CORS headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/csp-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'csp-report': { documentUri: 'https://example.com' } }),
      });
      const res = await cspReportHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
    });

    it('returns status 429 when rate limit is exceeded', async () => {
      const rateLimitIp = '198.51.100.30';
      const request = () =>
        new Request('https://example.com/.netlify/functions/csp-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-nf-client-connection-ip': rateLimitIp,
          },
          body: JSON.stringify({ 'csp-report': { documentUri: 'https://example.com' } }),
        });

      for (let i = 0; i < 10; i++) {
        await cspReportHandler(request(), mockContext);
      }

      const res = await cspReportHandler(request(), mockContext);
      expect(res.status).toBe(429);
      const body = await res.json();
      expect(body).toEqual({
        error: 'Too many requests. Please try again later.',
      });
    });
  });

  describe('health', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/health', {
        method: 'OPTIONS',
      });
      const res = await healthHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
    });

    it('returns status 200 with CORS and custom X-Health-Check headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/health', {
        method: 'GET',
      });
      const res = await healthHandler(request, mockContext);
      expect(res.status).toBe(200);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('X-Health-Check')).toBe('true');
    });
  });

  describe('reviews', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const request = new Request('https://example.com/api/reviews', { method: 'OPTIONS' });
      const res = await reviewsHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
    });

    it('returns status 502 with CORS and Content-Type headers when API key is missing', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      delete process.env.GOOGLE_PLACES_API_KEY;

      const request = new Request('https://example.com/api/reviews', { method: 'GET' });
      const res = await reviewsHandler(request, mockContext);

      expect(res.status).toBe(502);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(EXPECTED_ORIGIN);
      expect(res.headers.get('Content-Type')).toBe('application/json');

      consoleErrorSpy.mockRestore();
    });

    it('returns status 429 when rate limit is exceeded', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const rateLimitIp = '198.51.100.40';
      const request = () =>
        new Request('https://example.com/api/reviews', {
          method: 'GET',
          headers: { 'x-nf-client-connection-ip': rateLimitIp },
        });

      for (let i = 0; i < 10; i++) {
        await reviewsHandler(request(), mockContext);
      }

      const res = await reviewsHandler(request(), mockContext);
      expect(res.status).toBe(429);
      const body = await res.json();
      expect(body).toEqual({
        error: 'Too many requests. Please try again later.',
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
