import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as recaptchaLib from '../lib/recaptcha';
import { handler } from '../verifyRecaptcha.js';

describe('verifyRecaptcha Netlify Function', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('verifies recaptcha token successfully using RECAPTCHA_SECRET_KEY', async () => {
    vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(true);

    const event = {
      body: JSON.stringify({ token: 'test_user_token' }),
    };

    const response = await handler(event);

    expect(response).toEqual({
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    });
  });

  it('returns status 400 when reCAPTCHA verification fails', async () => {
    vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(false);

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

  it('handles exception and returns status 500', async () => {
    vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockRejectedValue(new Error('Network error'));

    const event = {
      body: JSON.stringify({ token: 'test_token' }),
    };

    const response = await handler(event);

    expect(response).toEqual({
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Network error' }),
    });
  });
});
