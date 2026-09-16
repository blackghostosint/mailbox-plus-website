import { describe, it, expect, vi } from 'vitest';
import { handler as createCheckoutHandler } from '../create-checkout';
import { handler as sendEmailHandler } from '../sendEmail';
import { handler as verifySessionHandler } from '../verify-session';
import cspReportHandler from '../csp-report';
import healthHandler from '../health';
import reviewsHandler from '../reviews';

describe('Netlify Function Endpoints CORS and Header Consistency', () => {
  const mockContext: any = {};

  describe('create-checkout', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const res = await createCheckoutHandler({ httpMethod: 'OPTIONS' } as any, mockContext);
      expect(res!.statusCode).toBe(204);
      expect(res!.headers).toMatchObject({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      });
    });

    it('returns status 405 for GET request with CORS and Content-Type headers', async () => {
      const res = await createCheckoutHandler({ httpMethod: 'GET' } as any, mockContext);
      expect(res!.statusCode).toBe(405);
      expect(res!.headers).toMatchObject({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
    });

    it('returns status 400 for invalid tier with CORS and Content-Type headers', async () => {
      process.env.STRIPE_SECRET_KEY = 'dummy_stripe_secret_key';
      const res = await createCheckoutHandler(
        { httpMethod: 'POST', body: JSON.stringify({ tier: 'invalid_tier' }) } as any,
        mockContext
      );
      expect(res!.statusCode).toBe(400);
      expect(res!.headers).toMatchObject({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      expect(JSON.parse(res!.body || '{}')).toHaveProperty('error');
    });
  });

  describe('sendEmail', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const res = await sendEmailHandler({ httpMethod: 'OPTIONS' } as any, mockContext);
      expect(res!.statusCode).toBe(204);
      expect(res!.headers).toMatchObject({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      });
    });

    it('returns status 405 for GET request with CORS and Content-Type headers', async () => {
      const res = await sendEmailHandler({ httpMethod: 'GET' } as any, mockContext);
      expect(res!.statusCode).toBe(405);
      expect(res!.headers).toMatchObject({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
    });

    it('returns status 400 for failed reCAPTCHA verification with CORS and Content-Type headers', async () => {
      const res = await sendEmailHandler(
        {
          httpMethod: 'POST',
          body: JSON.stringify({
            name: 'John',
            email: 'john@example.com',
            recaptchaToken: 'invalid',
          }),
        } as any,
        mockContext
      );
      expect(res!.statusCode).toBe(400);
      expect(res!.headers).toMatchObject({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      expect(JSON.parse(res!.body || '{}')).toEqual({ error: 'reCAPTCHA verification failed' });
    });
  });

  describe('verify-session', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const res = await verifySessionHandler({ httpMethod: 'OPTIONS' } as any, mockContext);
      expect(res!.statusCode).toBe(204);
      expect(res!.headers).toMatchObject({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      });
    });

    it('returns status 405 for POST request with CORS and Content-Type headers', async () => {
      const res = await verifySessionHandler({ httpMethod: 'POST' } as any, mockContext);
      expect(res!.statusCode).toBe(405);
      expect(res!.headers).toMatchObject({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
    });

    it('returns status 400 for invalid session_id with CORS and Content-Type headers', async () => {
      process.env.STRIPE_SECRET_KEY = 'dummy_stripe_secret_key';
      const res = await verifySessionHandler(
        {
          httpMethod: 'GET',
          queryStringParameters: { session_id: 'bad_session' },
        } as any,
        mockContext
      );
      expect(res!.statusCode).toBe(400);
      expect(res!.headers).toMatchObject({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      expect(JSON.parse(res!.body || '{}')).toEqual({ error: 'Invalid session_id' });
    });
  });

  describe('csp-report', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/csp-report', {
        method: 'OPTIONS',
      });
      const res = await cspReportHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
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
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
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
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });

  describe('health', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/health', {
        method: 'OPTIONS',
      });
      const res = await healthHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('returns status 200 with CORS and custom X-Health-Check headers', async () => {
      const request = new Request('https://example.com/.netlify/functions/health', {
        method: 'GET',
      });
      const res = await healthHandler(request, mockContext);
      expect(res.status).toBe(200);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('X-Health-Check')).toBe('true');
    });
  });

  describe('reviews', () => {
    it('handles OPTIONS preflight with status 204 and standard CORS headers', async () => {
      const request = new Request('https://example.com/api/reviews', { method: 'OPTIONS' });
      const res = await reviewsHandler(request, mockContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('returns status 502 with CORS and Content-Type headers when API key is missing', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      delete process.env.GOOGLE_PLACES_API_KEY;

      const request = new Request('https://example.com/api/reviews', { method: 'GET' });
      const res = await reviewsHandler(request, mockContext);

      expect(res.status).toBe(502);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Content-Type')).toBe('application/json');

      consoleErrorSpy.mockRestore();
    });
  });
});
