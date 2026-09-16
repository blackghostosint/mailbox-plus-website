import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { verifyRecaptchaToken } from './recaptcha';

describe('verifyRecaptchaToken', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('returns false if token is missing or empty', async () => {
    expect(await verifyRecaptchaToken('')).toBe(false);
    expect(await verifyRecaptchaToken(undefined)).toBe(false);
    expect(await verifyRecaptchaToken('   ')).toBe(false);
  });

  it('returns false if no secret key is set in process.env', async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    delete process.env.VITE_RECAPTCHA_SECRET_KEY;
    expect(await verifyRecaptchaToken('valid_token')).toBe(false);
  });

  it('verifies token successfully using RECAPTCHA_SECRET_KEY', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret_123';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
    );

    const result = await verifyRecaptchaToken('test_token', '127.0.0.1');
    expect(result).toBe(true);

    expect(fetch).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'secret=secret_123&response=test_token&remoteip=127.0.0.1',
      })
    );
  });

  it('returns false if RECAPTCHA_SECRET_KEY is missing, even if VITE_RECAPTCHA_SECRET_KEY is set', async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    process.env.VITE_RECAPTCHA_SECRET_KEY = 'vite_secret_456';

    const result = await verifyRecaptchaToken('test_token');
    expect(result).toBe(false);
  });

  it('rejects tokens with reCAPTCHA v3 score below threshold', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret_123';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, score: 0.3 }),
      })
    );

    const result = await verifyRecaptchaToken('low_score_token');
    expect(result).toBe(false);
  });

  it('accepts tokens with reCAPTCHA v3 score at or above threshold', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret_123';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, score: 0.8 }),
      })
    );

    const result = await verifyRecaptchaToken('high_score_token');
    expect(result).toBe(true);
  });

  it('returns false when Google returns success: false', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret_123';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
      })
    );

    const result = await verifyRecaptchaToken('invalid_token');
    expect(result).toBe(false);
  });

  it('returns false on HTTP error response or fetch failure', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'secret_123';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    expect(await verifyRecaptchaToken('some_token')).toBe(false);

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
    expect(await verifyRecaptchaToken('some_token')).toBe(false);
  });
});
