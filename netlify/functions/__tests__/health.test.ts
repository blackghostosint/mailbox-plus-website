import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import handler from '../health';
import { createMockNetlifyRequest, createMockNetlifyContext } from './helpers/test-harness';

// Mock @netlify/blobs so rate limiter doesn't fail on missing store in test environment
vi.mock('@netlify/blobs', () => ({
  getStore: vi.fn().mockImplementation(() => {
    throw new Error('Blobs store disabled in test environment');
  }),
}));

describe('health function handler', () => {
  const originalEnv = process.env;
  let ipCounter = 1;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...originalEnv, CONTEXT: 'test' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('handles OPTIONS preflight request and returns status 204 with CORS headers', async () => {
    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/health',
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

  it('returns HTTP 200 with health details, custom headers, and CORS headers on GET', async () => {
    const req = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/health',
      method: 'GET',
      headers: {
        Origin: 'https://mailboxplusohio.com',
      },
      clientIp: `10.5.0.${ipCounter++}`,
    });
    const ctx = createMockNetlifyContext();

    const res = await handler(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get('X-Health-Check')).toBe('true');
    expect(res.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://mailboxplusohio.com');

    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.environment).toBe('test');
    expect(body.checks).toEqual({ server: 'ok' });
    expect(typeof body.responseTime).toBe('number');
    expect(new Date(body.timestamp).getTime()).not.toBeNaN();
  });

  it('enforces rate limiting of 60 requests per minute and returns status 429 on 61st attempt', async () => {
    const clientIp = '203.0.113.88';

    // Make 60 requests
    for (let i = 0; i < 60; i++) {
      const req = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/health',
        method: 'GET',
        clientIp,
      });
      const ctx = createMockNetlifyContext({ ip: clientIp });
      const res = await handler(req, ctx);
      expect(res.status).toBe(200);
    }

    // 61st request should be rate limited
    const req61 = createMockNetlifyRequest({
      url: 'https://example.com/.netlify/functions/health',
      method: 'GET',
      clientIp,
    });
    const ctx61 = createMockNetlifyContext({ ip: clientIp });
    const res61 = await handler(req61, ctx61);

    expect(res61.status).toBe(429);
    expect(res61.headers.get('Retry-After')).toBeTruthy();
    expect(res61.headers.get('X-RateLimit-Limit')).toBe('60');
    expect(res61.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(res61.headers.get('X-RateLimit-Reset')).toBeTruthy();
    expect(await res61.json()).toEqual({
      error: 'Too many requests. Please try again later.',
    });
  });
});
