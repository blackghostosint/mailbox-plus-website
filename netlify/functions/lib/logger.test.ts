import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  logger,
  sanitizeValue,
  sanitizeString,
  sanitizeError,
  isSensitiveKey,
} from './logger';

describe('Centralized Sanitizing Logger Module', () => {
  let consoleInfoSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isSensitiveKey', () => {
    it('identifies sensitive key names regardless of case and separators', () => {
      const sensitiveKeys = [
        'email',
        'EMAIL',
        'phone',
        'Name',
        'address',
        'message',
        'barrier_description',
        'recaptchaToken',
        'g-recaptcha-response',
        'token',
        'secret',
        'authorization',
        'cookie',
        'key',
        'password',
        'stripe_secret_key',
        'resend_api_key',
        'google_places_api_key',
        'x-goog-api-key',
        'x-api-key',
      ];

      for (const k of sensitiveKeys) {
        expect(isSensitiveKey(k)).toBe(true);
      }
    });

    it('returns false for non-sensitive keys', () => {
      expect(isSensitiveKey('statusCode')).toBe(false);
      expect(isSensitiveKey('path')).toBe(false);
      expect(isSensitiveKey('httpMethod')).toBe(false);
      expect(isSensitiveKey('tier')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('redacts email addresses in freeform text', () => {
      const input = 'User test@example.com requested assistance at user.name+tag@domain.co.uk';
      const result = sanitizeString(input);
      expect(result).not.toContain('test@example.com');
      expect(result).not.toContain('user.name+tag@domain.co.uk');
      expect(result).toBe('User [REDACTED] requested assistance at [REDACTED]');
    });

    it('redacts Bearer authorization tokens in text', () => {
      const input = 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.testTokenValue';
      const result = sanitizeString(input);
      expect(result).toBe('Authorization: Bearer [REDACTED]');
    });

    it('redacts sensitive URL query parameters', () => {
      const input = 'https://example.com/api?token=secret123&other=safe&key=abc456';
      const result = sanitizeString(input);
      expect(result).toContain('token=[REDACTED]');
      expect(result).toContain('key=[REDACTED]');
      expect(result).toContain('other=safe');
    });
  });

  describe('sanitizeValue', () => {
    it('recursively redacts values associated with sensitive keys in nested objects', () => {
      const input = {
        publicInfo: 'safe',
        user: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '555-123-4567',
          details: {
            address: '123 Main St',
            barrier_description: 'Front gate code 1234',
            secretKey: 'supersecret',
          },
        },
        credentials: {
          recaptchaToken: 'token_abc123',
          authorization: 'Bearer secret_token',
          stripe_secret_key: 'sk_test_123',
          resend_api_key: 're_123456',
          google_places_api_key: 'AIzaSy1234',
        },
      };

      const sanitized: any = sanitizeValue(input);

      expect(sanitized.publicInfo).toBe('safe');
      expect(sanitized.user.name).toBe('[REDACTED]');
      expect(sanitized.user.email).toBe('[REDACTED]');
      expect(sanitized.user.phone).toBe('[REDACTED]');
      expect(sanitized.user.details.address).toBe('[REDACTED]');
      expect(sanitized.user.details.barrier_description).toBe('[REDACTED]');
      expect(sanitized.user.details.secretKey).toBe('[REDACTED]');
      expect(sanitized.credentials.recaptchaToken).toBe('[REDACTED]');
      expect(sanitized.credentials.authorization).toBe('[REDACTED]');
      expect(sanitized.credentials.stripe_secret_key).toBe('[REDACTED]');
      expect(sanitized.credentials.resend_api_key).toBe('[REDACTED]');
      expect(sanitized.credentials.google_places_api_key).toBe('[REDACTED]');
    });

    it('handles circular object references safely without throwing', () => {
      const obj: any = { name: 'Alice', outer: 'value' };
      obj.self = obj;

      expect(() => sanitizeValue(obj)).not.toThrow();
      const result: any = sanitizeValue(obj);
      expect(result.self).toBe('[CIRCULAR]');
      expect(result.name).toBe('[REDACTED]');
    });

    it('strips third-party request/response headers and body payloads', () => {
      const thirdPartyErr = {
        message: 'Request failed',
        config: {
          headers: { Authorization: 'Bearer 12345', 'Content-Type': 'application/json' },
          data: { email: 'test@domain.com', password: 'password123' },
        },
        response: {
          status: 400,
          headers: { 'set-cookie': 'session=abc' },
          data: { error: 'Bad Request' },
        },
      };

      const result: any = sanitizeValue(thirdPartyErr);

      expect(result.config.headers).toBe('[STRIPPED]');
      expect(result.config.data).toBe('[STRIPPED]');
      expect(result.response.headers).toBe('[STRIPPED]');
      expect(result.response.data).toBe('[STRIPPED]');
      expect(result.response.status).toBe(400);
    });
  });

  describe('sanitizeError', () => {
    it('normalizes Error instances into serializable objects with sanitized message and stack', () => {
      const error = new Error('Failed connecting for user test@example.com');
      error.stack = 'Error: Failed connecting for user test@example.com\n  at /app/netlify/functions/sendEmail.ts:10:15';

      const sanitized = sanitizeError(error);

      expect(sanitized.name).toBe('Error');
      expect(sanitized.message).toBe('Failed connecting for user [REDACTED]');
      expect(sanitized.stack).toContain('[REDACTED]');
      expect(sanitized.stack).not.toContain('test@example.com');
    });

    it('captures status codes and custom properties while redacting secrets', () => {
      const customErr: any = new Error('Stripe API error');
      customErr.statusCode = 402;
      customErr.code = 'card_declined';
      customErr.stripe_secret_key = 'sk_test_secret';

      const sanitized = sanitizeError(customErr);

      expect(sanitized.statusCode).toBe(402);
      expect(sanitized.code).toBe('card_declined');
      expect(sanitized.stripe_secret_key).toBe('[REDACTED]');
    });
  });

  describe('logger methods (info, warn, error)', () => {
    it('emits structured single-line JSON log objects to console', () => {
      logger.info('User action completed', { action: 'signup', tier: 'small_mail_only' });

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      const logStr = consoleInfoSpy.mock.calls[0][0];
      const parsed = JSON.parse(logStr);

      expect(parsed.level).toBe('info');
      expect(parsed.message).toBe('User action completed');
      expect(parsed.context).toEqual({ action: 'signup', tier: 'small_mail_only' });
      expect(parsed.timestamp).toBeDefined();
    });

    it('scrubs PII when logging warning and error events', () => {
      logger.warn('Failed submission', { email: 'user@domain.com', phone: '1234567890' });

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(consoleWarnSpy.mock.calls[0][0]);

      expect(parsed.level).toBe('warn');
      expect(parsed.context.email).toBe('[REDACTED]');
      expect(parsed.context.phone).toBe('[REDACTED]');
    });

    it('handles logging Error instances directly as second or third argument', () => {
      const err = new Error('Database connection timeout for secret key sk_live_999');

      logger.error('Unhandled database error', err);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('Unhandled database error');
      expect(parsed.error.name).toBe('Error');
      expect(parsed.error.message).not.toContain('sk_live_999');
    });

    it('falls back to non-blocking generic message if formatting throws', () => {
      // Pass an object with a throwing getter to trigger fallback catch
      const throwingObj = {
        get badProp() {
          throw new Error('Getter error');
        },
      };

      expect(() => logger.error('Dangerous log', throwingObj)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(parsed.message).toBe('[LOGGING_ERROR] Failed to format error log');
    });
  });
});
