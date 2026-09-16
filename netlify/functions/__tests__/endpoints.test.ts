import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as recaptchaLib from '../lib/recaptcha';
import { db } from '../lib/db';
import { handler as customerHandler } from '../customer';
import { handler as sendEmailTsHandler } from '../sendEmail';
import { handler as sendEmailJsHandler } from '../sendEmail.js';
import { handler as sendReservationEmailHandler } from '../sendReservationEmail.js';
import { handler as verifyRecaptchaHandler } from '../verifyRecaptcha.js';

describe('Serverless Handler reCAPTCHA Guards', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('customer.ts (POST /api/customer)', () => {
    it('rejects public POST request without valid reCAPTCHA token with 400', async () => {
      vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(false);

      const event = {
        httpMethod: 'POST',
        path: '/api/customer',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          phone: '5551234567',
          email: 'john@example.com',
        }),
      };

      const res = await customerHandler(event as any, {} as any);
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body)).toEqual({ error: 'reCAPTCHA verification failed' });
    });

    it('bypasses reCAPTCHA verification for staff requests', async () => {
      vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(false);
      vi.spyOn(db, 'getCustomerByPhone').mockResolvedValue(null);
      vi.spyOn(db, 'getCustomerByReferralCode').mockResolvedValue(null);
      vi.spyOn(db, 'saveCustomer').mockResolvedValue(undefined);

      const event = {
        httpMethod: 'POST',
        path: '/api/customer',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          phone: '5551234567',
          email: 'john@example.com',
        }),
      };

      const context = {
        clientContext: {
          user: { id: 'staff_user' },
        },
      };

      const res = await customerHandler(event as any, context as any);
      // Because staff auth bypasses reCAPTCHA, it proceeds to customer creation
      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res.body)).not.toEqual({ error: 'reCAPTCHA verification failed' });
    });
  });

  describe('sendEmail.ts & sendEmail.js', () => {
    it('sendEmail.ts rejects request missing valid reCAPTCHA token', async () => {
      vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(false);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', message: 'Hello' }),
      };

      const res = await sendEmailTsHandler(event as any);
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body)).toEqual({ error: 'reCAPTCHA verification failed' });
    });

    it('sendEmail.js rejects request missing valid reCAPTCHA token', async () => {
      vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(false);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', message: 'Hello' }),
      };

      const res = await sendEmailJsHandler(event as any);
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body)).toEqual({ error: 'reCAPTCHA verification failed' });
    });
  });

  describe('sendReservationEmail.js', () => {
    it('rejects request missing valid reCAPTCHA token', async () => {
      vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(false);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          name: 'Bob',
          email: 'bob@example.com',
          phone: '5550001',
          plan: 'Small Mail',
        }),
      };

      const res = await sendReservationEmailHandler(event as any);
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body)).toEqual({ error: 'reCAPTCHA verification failed' });
    });
  });

  describe('verifyRecaptcha.js', () => {
    it('delegates to verifyRecaptchaToken and returns 400 on failure', async () => {
      vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(false);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({ token: 'bad_token' }),
      };

      const res = await verifyRecaptchaHandler(event as any);
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body)).toEqual({
        success: false,
        error: 'reCAPTCHA verification failed',
      });
    });

    it('returns 200 on successful verification', async () => {
      vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(true);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({ token: 'good_token' }),
      };

      const res = await verifyRecaptchaHandler(event as any);
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body)).toEqual({ success: true });
    });
  });
});
