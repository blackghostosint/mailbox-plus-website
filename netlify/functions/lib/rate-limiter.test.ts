import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, resetRateLimitMemory, getClientIp } from './rate-limiter';

describe('rate-limiter', () => {
  beforeEach(() => {
    resetRateLimitMemory();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('allows up to 10 requests within a 60 second window', async () => {
    const ip = '192.168.1.100';

    for (let i = 1; i <= 10; i++) {
      const res = await checkRateLimit(ip);
      expect(res.allowed).toBe(true);
      expect(res.count).toBe(i);
      expect(res.remaining).toBe(10 - i);
    }
  });

  it('blocks the 11th request within 60 seconds with 429 rate limit payload', async () => {
    const ip = '192.168.1.100';

    for (let i = 1; i <= 10; i++) {
      await checkRateLimit(ip);
    }

    const blocked = await checkRateLimit(ip);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('resets allowed count after 60 seconds pass', async () => {
    const ip = '192.168.1.100';

    for (let i = 1; i <= 10; i++) {
      await checkRateLimit(ip);
    }

    const blocked = await checkRateLimit(ip);
    expect(blocked.allowed).toBe(false);

    // Advance time by 61 seconds
    vi.advanceTimersByTime(61 * 1000);

    const allowedAgain = await checkRateLimit(ip);
    expect(allowedAgain.allowed).toBe(true);
    expect(allowedAgain.count).toBe(1);
  });

  it('tracks distinct IP addresses independently', async () => {
    const ip1 = '10.0.0.1';
    const ip2 = '10.0.0.2';

    for (let i = 1; i <= 10; i++) {
      await checkRateLimit(ip1);
    }

    expect((await checkRateLimit(ip1)).allowed).toBe(false);
    expect((await checkRateLimit(ip2)).allowed).toBe(true);
  });

  it('respects custom RateLimitOptions (maxRequests and windowMs)', async () => {
    const ip = '192.168.1.200';
    const options = { maxRequests: 3, windowMs: 30000 };

    for (let i = 1; i <= 3; i++) {
      const res = await checkRateLimit(ip, options);
      expect(res.allowed).toBe(true);
    }

    const blocked = await checkRateLimit(ip, options);
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(31000);

    const allowedAgain = await checkRateLimit(ip, options);
    expect(allowedAgain.allowed).toBe(true);
  });

  it('isolates rate limits by keyPrefix so endpoints do not interfere with each other', async () => {
    const ip = '192.168.1.200';
    const optsEndpointA = { maxRequests: 2, windowMs: 60000, keyPrefix: 'endpointA' };
    const optsEndpointB = { maxRequests: 2, windowMs: 60000, keyPrefix: 'endpointB' };

    // Exhaust endpoint A rate limit
    await checkRateLimit(ip, optsEndpointA);
    await checkRateLimit(ip, optsEndpointA);
    expect((await checkRateLimit(ip, optsEndpointA)).allowed).toBe(false);

    // Endpoint B should still be allowed for the same IP
    expect((await checkRateLimit(ip, optsEndpointB)).allowed).toBe(true);
  });

  describe('getClientIp', () => {
    it('extracts IP from plain record object prioritizing x-nf-client-connection-ip', () => {
      const headers = {
        'x-forwarded-for': '1.1.1.1, 2.2.2.2',
        'client-ip': '3.3.3.3',
        'x-nf-client-connection-ip': '4.4.4.4',
      };
      expect(getClientIp(headers)).toBe('4.4.4.4');
    });

    it('extracts IP from Fetch Headers object prioritizing x-nf-client-connection-ip', () => {
      const headers = new Headers({
        'x-forwarded-for': '1.1.1.1, 2.2.2.2',
        'client-ip': '3.3.3.3',
        'x-nf-client-connection-ip': '5.5.5.5',
      });
      expect(getClientIp(headers)).toBe('5.5.5.5');
    });

    it('extracts last IP from x-forwarded-for when edge connection headers are missing', () => {
      const headers = {
        'x-forwarded-for': '10.0.0.1, 10.0.0.2, 203.0.113.50',
      };
      expect(getClientIp(headers)).toBe('203.0.113.50');
    });

    it('returns unknown when no IP headers are present', () => {
      expect(getClientIp({})).toBe('unknown');
    });
  });
});
