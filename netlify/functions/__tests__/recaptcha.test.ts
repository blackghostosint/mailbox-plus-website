import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { withRecaptcha, verifyRecaptchaToken } from '../lib/recaptcha';
import { withCors, DEFAULT_ALLOWED_ORIGINS } from '../lib/cors';
import { createMockNetlifyRequest, createMockNetlifyContext } from './helpers/test-harness';

describe('withRecaptcha middleware and verifyRecaptchaToken', () => {
  const originalEnv = process.env;
  let fetchMock: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv, RECAPTCHA_SECRET_KEY: 'test_recaptcha_secret_key' };
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('verifyRecaptchaToken', () => {
    it('returns false if token is missing or empty', async () => {
      expect(await verifyRecaptchaToken('')).toBe(false);
      expect(await verifyRecaptchaToken('   ')).toBe(false);
      expect(await verifyRecaptchaToken(undefined)).toBe(false);
    });

    it('returns false if RECAPTCHA_SECRET_KEY is missing from env', async () => {
      delete process.env.RECAPTCHA_SECRET_KEY;
      expect(await verifyRecaptchaToken('valid_token')).toBe(false);
    });

    it('returns true when Google siteverify returns success true', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, score: 0.9 }),
      });

      const result = await verifyRecaptchaToken('valid_token', '1.2.3.4');
      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: expect.stringContaining('response=valid_token'),
        })
      );
    });

    it('returns false when Google siteverify returns success false or low score', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false }),
      });
      expect(await verifyRecaptchaToken('invalid_token')).toBe(false);

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, score: 0.1 }),
      });
      expect(await verifyRecaptchaToken('low_score_token')).toBe(false);
    });

    it('returns false when fetch throws or HTTP status is not ok', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false });
      expect(await verifyRecaptchaToken('token')).toBe(false);

      fetchMock.mockRejectedValueOnce(new Error('Network error'));
      expect(await verifyRecaptchaToken('token')).toBe(false);
    });
  });

  describe('withRecaptcha middleware wrapper', () => {
    it('passes GET and OPTIONS requests directly to inner handler without checking reCAPTCHA', async () => {
      const innerHandler = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
      const wrapped = withRecaptcha(innerHandler);

      const reqGet = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/test',
        method: 'GET',
      });
      const ctx = createMockNetlifyContext();

      const resGet = await wrapped(reqGet, ctx);
      expect(resGet.status).toBe(200);
      expect(innerHandler).toHaveBeenCalledTimes(1);

      const reqOptions = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/test',
        method: 'OPTIONS',
      });
      const resOptions = await wrapped(reqOptions, ctx);
      expect(resOptions.status).toBe(200);
      expect(innerHandler).toHaveBeenCalledTimes(2);
    });

    it('verifies token from X-Recaptcha-Token header and calls inner handler on success', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, score: 0.9 }),
      });

      const innerHandler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
      const wrapped = withRecaptcha(innerHandler);

      const req = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/test',
        method: 'POST',
        headers: {
          'X-Recaptcha-Token': 'header_valid_token',
        },
        body: { data: 'test' },
      });
      const ctx = createMockNetlifyContext();

      const res = await wrapped(req, ctx);
      expect(res.status).toBe(200);
      expect(innerHandler).toHaveBeenCalledTimes(1);
    });

    it('verifies token from JSON body recaptchaToken field and calls inner handler on success', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, score: 0.9 }),
      });

      const innerHandler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
      const wrapped = withRecaptcha(innerHandler);

      const req = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/test',
        method: 'POST',
        body: { recaptchaToken: 'body_valid_token', data: 'test' },
      });
      const ctx = createMockNetlifyContext();

      const res = await wrapped(req, ctx);
      expect(res.status).toBe(200);
      expect(innerHandler).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when reCAPTCHA token is missing or invalid', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false }),
      });

      const innerHandler = vi.fn();
      const wrapped = withRecaptcha(innerHandler);

      const reqMissing = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/test',
        method: 'POST',
        body: { data: 'test' },
      });
      const ctx = createMockNetlifyContext();

      const resMissing = await wrapped(reqMissing, ctx);
      expect(resMissing.status).toBe(400);
      expect(await resMissing.json()).toEqual({ error: 'reCAPTCHA verification failed' });
      expect(innerHandler).not.toHaveBeenCalled();

      const reqInvalid = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/test',
        method: 'POST',
        body: { recaptchaToken: 'invalid_token' },
      });
      const resInvalid = await wrapped(reqInvalid, ctx);
      expect(resInvalid.status).toBe(400);
      expect(await resInvalid.json()).toEqual({ error: 'reCAPTCHA verification failed' });
      expect(innerHandler).not.toHaveBeenCalled();
    });

    it('composes cleanly with withCors middleware', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, score: 0.9 }),
      });

      const innerHandler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
      const composed = withCors(withRecaptcha(innerHandler), { allowOrigin: DEFAULT_ALLOWED_ORIGINS });

      const reqOptions = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/test',
        method: 'OPTIONS',
        headers: { Origin: 'https://mailboxplusohio.com' },
      });
      const ctx = createMockNetlifyContext();

      const resOptions = await composed(reqOptions, ctx);
      expect(resOptions.status).toBe(204);
      expect(resOptions.headers.get('Access-Control-Allow-Origin')).toBe('https://mailboxplusohio.com');

      const reqPost = createMockNetlifyRequest({
        url: 'https://example.com/.netlify/functions/test',
        method: 'POST',
        headers: { Origin: 'https://mailboxplusohio.com', 'X-Recaptcha-Token': 'valid_token' },
        body: { tier: 'small_mail_only' },
      });

      const resPost = await composed(reqPost, ctx);
      expect(resPost.status).toBe(200);
      expect(resPost.headers.get('Access-Control-Allow-Origin')).toBe('https://mailboxplusohio.com');
      expect(innerHandler).toHaveBeenCalledTimes(1);
    });
  });
});
