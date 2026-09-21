import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  withCors,
  jsonResponse,
  DEFAULT_CORS_HEADERS,
  DEFAULT_ALLOWED_ORIGINS,
  isDevelopmentEnvironment,
  getDefaultAllowedOrigins,
  resetDefaultAllowedOriginsState,
} from './cors';

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
        jsonResponse(
          { ok: true },
          {
            status: 200,
            headers: { 'Netlify-CDN-Cache-Control': 'max-age=3600' },
          }
        )
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

      // Official Netlify production subdomains are explicitly allowlisted
      const reqOfficialNetlify = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'https://mailboxplus.netlify.app' },
      });
      const resOfficialNetlify = await wrapped(reqOfficialNetlify, {});
      expect(resOfficialNetlify.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://mailboxplus.netlify.app'
      );

      const reqOfficialNetlifyOhio = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'https://mailboxplusohio.netlify.app' },
      });
      const resOfficialNetlifyOhio = await wrapped(reqOfficialNetlifyOhio, {});
      expect(resOfficialNetlifyOhio.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://mailboxplusohio.netlify.app'
      );

      // Malicious or unanchored subdomains must NOT receive reflected headers
      const maliciousOrigins = [
        'https://evil--mailboxplus.netlify.app',
        'https://evil--mailboxplusohio.netlify.app',
        'https://mailboxplus-attacker.netlify.app',
        'https://attacker-mailboxplus.netlify.app',
        'http://mailboxplus.netlify.app',
        'http://deploy-preview-12--mailboxplus.netlify.app',
        'https://mailboxplus.netlify.app.attacker.com',
      ];

      for (const origin of maliciousOrigins) {
        const reqDisallowed = new Request('https://example.com/api/test', {
          method: 'POST',
          headers: { origin },
        });
        const resDisallowed = await wrapped(reqDisallowed, {});
        expect(resDisallowed.headers.get('Access-Control-Allow-Origin')).toBe(
          'https://mailboxplusohio.com'
        );
      }
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

  describe('Dynamic Environment Origin Filtering', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      resetDefaultAllowedOriginsState();
      delete process.env.NETLIFY_DEV;
      delete process.env.CONTEXT;
      delete process.env.NODE_ENV;
    });

    afterEach(() => {
      process.env = { ...originalEnv };
    });

    it('rejects localhost and 127.0.0.1 origins when CONTEXT=production or NODE_ENV=production, even if SITE_URL is configured as http://localhost:8888', async () => {
      process.env.CONTEXT = 'production';
      process.env.NODE_ENV = 'production';
      process.env.SITE_URL = 'http://localhost:8888';

      expect(isDevelopmentEnvironment()).toBe(false);
      expect(
        getDefaultAllowedOrigins().some((pattern) =>
          typeof pattern === 'string'
            ? pattern.includes('localhost') || pattern.includes('127.0.0.1')
            : pattern.test('http://localhost:3000')
        )
      ).toBe(false);

      const innerHandler = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
      const wrapped = withCors(innerHandler, { allowOrigin: DEFAULT_ALLOWED_ORIGINS });

      const reqLocalhost = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'http://localhost:8888' },
      });
      const resLocalhost = await wrapped(reqLocalhost, {});
      expect(resLocalhost.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://mailboxplusohio.com'
      );

      const reqLoopback = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'http://127.0.0.1:8080' },
      });
      const resLoopback = await wrapped(reqLoopback, {});
      expect(resLoopback.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://mailboxplusohio.com'
      );
    });

    it('rejects localhost and 127.0.0.1 origins in deploy-preview and staging contexts', async () => {
      process.env.CONTEXT = 'deploy-preview';

      expect(isDevelopmentEnvironment()).toBe(false);

      const innerHandler = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
      const wrapped = withCors(innerHandler, { allowOrigin: DEFAULT_ALLOWED_ORIGINS });

      const reqLocalhost = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'http://localhost:4321' },
      });
      const resLocalhost = await wrapped(reqLocalhost, {});
      expect(resLocalhost.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://mailboxplusohio.com'
      );
    });

    it('allows localhost and 127.0.0.1 origins when NETLIFY_DEV=true', async () => {
      process.env.NETLIFY_DEV = 'true';

      expect(isDevelopmentEnvironment()).toBe(true);

      const innerHandler = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
      const wrapped = withCors(innerHandler, { allowOrigin: DEFAULT_ALLOWED_ORIGINS });

      const reqLocalhost = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
      });
      const resLocalhost = await wrapped(reqLocalhost, {});
      expect(resLocalhost.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');

      const reqLoopback = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'http://127.0.0.1:8080' },
      });
      const resLoopback = await wrapped(reqLoopback, {});
      expect(resLoopback.headers.get('Access-Control-Allow-Origin')).toBe('http://127.0.0.1:8080');
    });

    it('allows localhost and 127.0.0.1 origins when NODE_ENV=development', async () => {
      process.env.NODE_ENV = 'development';

      expect(isDevelopmentEnvironment()).toBe(true);

      const innerHandler = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
      const wrapped = withCors(innerHandler, { allowOrigin: DEFAULT_ALLOWED_ORIGINS });

      const reqLocalhost = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'http://localhost:5173' },
      });
      const resLocalhost = await wrapped(reqLocalhost, {});
      expect(resLocalhost.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173');
    });

    it('defaults securely to production origin filtering when environment variables are unset or ambiguous', async () => {
      expect(isDevelopmentEnvironment()).toBe(false);

      const innerHandler = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
      const wrapped = withCors(innerHandler, { allowOrigin: DEFAULT_ALLOWED_ORIGINS });

      const reqLocalhost = new Request('https://example.com/api/test', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
      });
      const resLocalhost = await wrapped(reqLocalhost, {});
      expect(resLocalhost.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://mailboxplusohio.com'
      );
    });
  });

  describe('Proxy Array Signature & Downstream Introspection Compatibility', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      resetDefaultAllowedOriginsState();
      delete process.env.NETLIFY_DEV;
      delete process.env.CONTEXT;
      delete process.env.NODE_ENV;
    });

    afterEach(() => {
      process.env = { ...originalEnv };
    });

    it('supports Object.keys without throwing TypeError and returns array index keys', () => {
      expect(() => Object.keys(DEFAULT_ALLOWED_ORIGINS)).not.toThrow();
      const keys = Object.keys(DEFAULT_ALLOWED_ORIGINS);
      const expectedKeys = getDefaultAllowedOrigins().map((_, i) => String(i));
      expect(keys).toEqual(expectedKeys);
    });

    it('supports array spread operator [...DEFAULT_ALLOWED_ORIGINS]', () => {
      const spreadArray = [...DEFAULT_ALLOWED_ORIGINS];
      expect(spreadArray).toEqual(getDefaultAllowedOrigins());
    });

    it('supports Object.values and Object.entries', () => {
      const values = Object.values(DEFAULT_ALLOWED_ORIGINS);
      expect(values).toEqual(getDefaultAllowedOrigins());

      const entries = Object.entries(DEFAULT_ALLOWED_ORIGINS);
      expect(entries).toEqual(getDefaultAllowedOrigins().map((val, idx) => [String(idx), val]));
    });

    it('provides correct property descriptors for length and index properties', () => {
      const descriptors: Record<string, PropertyDescriptor> =
        Object.getOwnPropertyDescriptors(DEFAULT_ALLOWED_ORIGINS);
      expect(descriptors.length).toBeDefined();
      expect(descriptors.length.configurable).toBe(false);
      expect(descriptors.length.enumerable).toBe(false);
      expect(descriptors.length.writable).toBe(true);
      expect(descriptors.length.value).toBe(getDefaultAllowedOrigins().length);

      expect(descriptors['0']).toBeDefined();
      expect(descriptors['0'].configurable).toBe(true);
      expect(descriptors['0'].enumerable).toBe(true);
    });

    it('identifies as an array via Array.isArray and supports JSON serialization', () => {
      expect(Array.isArray(DEFAULT_ALLOWED_ORIGINS)).toBe(true);
      expect(() => JSON.stringify(DEFAULT_ALLOWED_ORIGINS)).not.toThrow();
    });

    it('supports standard Array prototype methods (.slice, .concat, .map, .filter, .reduce)', () => {
      expect(DEFAULT_ALLOWED_ORIGINS.slice()).toEqual(getDefaultAllowedOrigins());
      expect(DEFAULT_ALLOWED_ORIGINS.concat(['https://extra.com'])).toEqual([
        ...getDefaultAllowedOrigins(),
        'https://extra.com',
      ]);
      const mapped = DEFAULT_ALLOWED_ORIGINS.map((item) => typeof item);
      expect(mapped).toEqual(getDefaultAllowedOrigins().map((item) => typeof item));
      const filtered = DEFAULT_ALLOWED_ORIGINS.filter((item) => typeof item === 'string');
      expect(filtered).toEqual(
        getDefaultAllowedOrigins().filter((item) => typeof item === 'string')
      );
    });

    it('dynamically reflects environment context changes across introspection calls', () => {
      process.env.CONTEXT = 'production';
      const prodOrigins = [...DEFAULT_ALLOWED_ORIGINS];
      const prodKeys = Object.keys(DEFAULT_ALLOWED_ORIGINS);
      expect(prodOrigins.length).toBe(5);
      expect(prodKeys).toEqual(['0', '1', '2', '3', '4']);

      process.env.NETLIFY_DEV = 'true';
      const devOrigins = [...DEFAULT_ALLOWED_ORIGINS];
      const devKeys = Object.keys(DEFAULT_ALLOWED_ORIGINS);
      expect(devOrigins.length).toBe(7);
      expect(devKeys).toEqual(['0', '1', '2', '3', '4', '5', '6']);
    });

    it('preserves mutable-array semantics when mutators like .push(), [i]=val, .unshift(), .splice(), .pop() are called', () => {
      const initialLen = DEFAULT_ALLOWED_ORIGINS.length;

      // Test .push()
      const newLen = DEFAULT_ALLOWED_ORIGINS.push('https://pushed-origin.com');
      expect(newLen).toBe(initialLen + 1);
      expect(DEFAULT_ALLOWED_ORIGINS.length).toBe(initialLen + 1);
      expect(DEFAULT_ALLOWED_ORIGINS[initialLen]).toBe('https://pushed-origin.com');
      expect([...DEFAULT_ALLOWED_ORIGINS]).toContain('https://pushed-origin.com');

      // Test direct index assignment
      DEFAULT_ALLOWED_ORIGINS[0] = 'https://custom-override.com';
      expect(DEFAULT_ALLOWED_ORIGINS[0]).toBe('https://custom-override.com');

      // Test .unshift()
      DEFAULT_ALLOWED_ORIGINS.unshift('https://prepended-origin.com');
      expect(DEFAULT_ALLOWED_ORIGINS[0]).toBe('https://prepended-origin.com');

      // Test .splice()
      const removed = DEFAULT_ALLOWED_ORIGINS.splice(0, 1);
      expect(removed).toEqual(['https://prepended-origin.com']);
      expect(DEFAULT_ALLOWED_ORIGINS[0]).toBe('https://custom-override.com');

      // Test Object.defineProperty
      Object.defineProperty(DEFAULT_ALLOWED_ORIGINS, '0', {
        value: 'https://defined-property.com',
        writable: true,
        enumerable: true,
        configurable: true,
      });
      expect(DEFAULT_ALLOWED_ORIGINS[0]).toBe('https://defined-property.com');

      // Test .pop()
      const popped = DEFAULT_ALLOWED_ORIGINS.pop();
      expect(popped).toBe('https://pushed-origin.com');
    });
  });
});
