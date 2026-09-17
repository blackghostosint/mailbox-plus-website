import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, resetRateLimitMemory } from './rate-limiter';

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
});
