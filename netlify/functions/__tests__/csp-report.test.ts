import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import handler from '../csp-report';
import { createMockNetlifyRequest, createMockNetlifyContext } from './helpers/test-harness';

// Mock @netlify/blobs so rate limiter doesn't fail on missing store in test environment
vi.mock('@netlify/blobs', () => ({
  getStore: vi.fn().mockImplementation(() => {
    throw new Error('Blobs store disabled in test environment');
  }),
}));

describe('csp-report function handler', () => {
  let ipCounter = 1;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('handles OPTIONS preflight request and returns status 204 with CORS headers', async () => {
    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/csp-report',
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

  it('returns status 405 for non-POST HTTP methods', async () => {
    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/csp-report',
      method: 'GET',
      clientIp: `10.4.0.${ipCounter++}`,
    });
    const ctx = createMockNetlifyContext();

    const res = await handler(req, ctx);
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ error: 'Method not allowed' });
  });

  it('handles nested csp-report payload and returns status 204', async () => {
    const nestedPayload = {
      'csp-report': {
        'document-uri': 'https://example.com/page',
        'violated-directive': 'script-src',
        'blocked-uri': 'https://eval.com/malicious.js',
        'source-file': 'https://example.com/script.js',
        'line-number': 42,
      },
    };

    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/csp-report',
      method: 'POST',
      clientIp: `10.4.0.${ipCounter++}`,
      body: nestedPayload,
      headers: {
        'User-Agent': 'Test-Agent/1.0',
      },
    });
    const ctx = createMockNetlifyContext();

    const res = await handler(req, ctx);

    expect(res.status).toBe(204);
    expect(await res.text()).toBe('');
  });

  it('handles flat CSP report payload and returns status 204', async () => {
    const flatPayload = {
      documentUri: 'https://example.com/page',
      violatedDirective: 'style-src',
      blockedUri: 'https://cdn.com/bad.css',
      sourceFile: 'https://example.com/app.js',
      lineNumber: 10,
    };

    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/csp-report',
      method: 'POST',
      clientIp: `10.4.0.${ipCounter++}`,
      body: flatPayload,
      headers: {
        'User-Agent': 'Test-Agent/1.0',
      },
    });
    const ctx = createMockNetlifyContext();

    const res = await handler(req, ctx);

    expect(res.status).toBe(204);
    expect(await res.text()).toBe('');
  });

  it('returns status 400 for invalid JSON payload', async () => {
    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/csp-report',
      method: 'POST',
      clientIp: `10.4.0.${ipCounter++}`,
      body: '{ malformed json: ',
      headers: {
        'User-Agent': 'Test-Agent/1.0',
      },
    });
    const ctx = createMockNetlifyContext();

    const res = await handler(req, ctx);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Bad Request' });
  });

  it('enforces rate limiting of 10 requests per minute and returns status 429 on 11th attempt', async () => {
    const clientIp = '203.0.113.101';

    const flatPayload = {
      documentUri: 'https://example.com/page',
      violatedDirective: 'style-src',
    };

    for (let i = 0; i < 10; i++) {
      const req = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/csp-report',
        method: 'POST',
        clientIp,
        body: flatPayload,
      });
      const ctx = createMockNetlifyContext({ ip: clientIp });
      const res = await handler(req, ctx);
      expect(res.status).toBe(204);
    }

    const req11 = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/csp-report',
      method: 'POST',
      clientIp,
      body: flatPayload,
    });
    const ctx11 = createMockNetlifyContext({ ip: clientIp });
    const res11 = await handler(req11, ctx11);

    expect(res11.status).toBe(429);
    expect(res11.headers.get('Retry-After')).toBeTruthy();
    expect(res11.headers.get('X-RateLimit-Limit')).toBe('10');
    expect(res11.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(res11.headers.get('X-RateLimit-Reset')).toBeTruthy();
    expect(await res11.json()).toEqual({ error: 'Too many requests. Please try again later.' });
  });
});
