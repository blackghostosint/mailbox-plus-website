import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { handler } from '../verifyRecaptcha.js';

describe('verifyRecaptcha Netlify Function', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('verifies recaptcha token successfully using RECAPTCHA_SECRET_KEY', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test_secret_key_123';

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const event = {
      body: JSON.stringify({ token: 'test_user_token' }),
    };

    const response = await handler(event);

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'secret=test_secret_key_123&response=test_user_token',
      })
    );

    expect(response).toEqual({
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    });
  });

  it('returns status 400 when reCAPTCHA verification fails', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test_secret_key_123';

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
    });

    const event = {
      body: JSON.stringify({ token: 'invalid_token' }),
    };

    const response = await handler(event);

    expect(response).toEqual({
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'reCAPTCHA verification failed' }),
    });
  });

  it('handles invalid json body and returns status 500', async () => {
    const event = {
      body: 'invalid-json-{',
    };

    const response = await handler(event);

    expect(response.statusCode).toEqual(500);
    expect(response.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(response.body).success).toBe(false);
  });
});
