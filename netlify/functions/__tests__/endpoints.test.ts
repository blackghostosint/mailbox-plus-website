import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as recaptchaLib from '../lib/recaptcha';
import { db } from '../lib/db';
import { handler as customerHandler } from '../customer';
import { handler as sendEmailTsHandler } from '../sendEmail';

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

  describe('sendEmail.ts', () => {
    it('rejects request missing valid reCAPTCHA token', async () => {
      vi.spyOn(recaptchaLib, 'verifyRecaptchaToken').mockResolvedValue(false);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', message: 'Hello' }),
      };

      const res = await sendEmailTsHandler(event as any);
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body)).toEqual({ error: 'reCAPTCHA verification failed' });
    });
  });
});
