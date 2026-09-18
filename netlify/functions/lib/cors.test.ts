import { describe, it, expect, vi } from 'vitest';
import { withCors, DEFAULT_CORS_HEADERS, DEFAULT_ALLOWED_ORIGINS } from './cors';

describe('CORS Middleware Utility', () => {
  describe('withCors (Web Standard Handler)', () => {
    it('returns HTTP 204 with CORS headers for OPTIONS requests', async () => {
      const innerHandler = vi.fn();
      const wrapped = withCors(innerHandler);

      const request = new Request('https://example.com/api/test', { method: 'OPTIONS' });
      const res = await wrapped(request, {});

      expect(innerHandler).not.toHaveBeenCalled();
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Access-Control-Allow-Methods')).toBe(
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
      expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
        'Content-Type, Authorization, X-Requested-With'
      );
    });

    it('attaches default CORS and Content-Type headers to Web Standard responses', async () => {
      const innerHandler = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Netlify-CDN-Cache-Control': 'max-age=3600' },
        })
      );

      const wrapped = withCors(innerHandler);
      const request = new Request('https://example.com/api/test', { method: 'GET' });

      const res = await wrapped(request, {});

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Netlify-CDN-Cache-Control')).toBe('max-age=3600');
    });

    it('preserves existing custom Content-Type header if provided by inner handler', async () => {
      const innerHandler = vi.fn().mockResolvedValue(
        new Response('Hello World', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        })
      );

      const wrapped = withCors(innerHandler);
      const request = new Request('https://example.com/api/test', { method: 'GET' });

      const res = await wrapped(request, {});

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('text/plain');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(await res.text()).toBe('Hello World');
    });

    it('catches unhandled thrown errors and returns sanitized HTTP 500 JSON response with CORS headers', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const innerHandler = vi.fn().mockRejectedValue(new Error('Fatal edge error'));

      const wrapped = withCors(innerHandler);
      const request = new Request('https://example.com/api/test', { method: 'GET' });

      const res = await wrapped(request, {});

      expect(res.status).toBe(500);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');

      const body = await res.json();
      expect(body).toEqual({ error: 'Internal server error' });

      consoleErrorSpy.mockRestore();
    });

    it('respects custom CorsOptions provided to withCors', async () => {
      const innerHandler = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
      const wrapped = withCors(innerHandler, {
        allowOrigin: 'https://mailboxplusohio.com',
      });

      const request = new Request('https://example.com/api/test', { method: 'POST' });
      const res = await wrapped(request, {});

      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://mailboxplusohio.com');
    });

    it('matches allowed origin patterns dynamically against request Origin header', async () => {
      const innerHandler = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
      const wrapped = withCors(innerHandler, {
        allowOrigin: DEFAULT_ALLOWED_ORIGINS,
      });

      const reqPreview = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'https://deploy-preview-513--mailboxplus.netlify.app' },
      });
      const resPreview = await wrapped(reqPreview, {});
      expect(resPreview.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://deploy-preview-513--mailboxplus.netlify.app'
      );

      const reqDisallowed = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'https://malicious-site.com' },
      });
      const resDisallowed = await wrapped(reqDisallowed, {});
      expect(resDisallowed.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://mailboxplusohio.com'
      );
    });

    it('enforces rate limiting in withCors when rateLimit option is configured', async () => {
      const innerHandler = vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
      const wrapped = withCors(innerHandler, {
        allowOrigin: DEFAULT_ALLOWED_ORIGINS,
        rateLimit: { maxRequests: 2, windowMs: 60000 },
      });

      const req = new Request('https://example.com/api/test', {
        method: 'GET',
        headers: { 'x-nf-client-connection-ip': '203.0.113.20' },
      });

      const res1 = await wrapped(req, {});
      expect(res1.status).toBe(200);

      const res2 = await wrapped(req, {});
      expect(res2.status).toBe(200);

      const res3 = await wrapped(req, {});
      expect(res3.status).toBe(429);
      expect(res3.headers.get('Retry-After')).toBeTruthy();
      expect(res3.headers.get('X-RateLimit-Limit')).toBe('2');
      const body = await res3.json();
      expect(body).toEqual({ error: 'Too many requests. Please try again later.' });
    });
  });
});
