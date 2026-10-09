import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  DEFAULT_SITE_URL,
  DUMMY_STRIPE_SECRET_KEY,
  DEFAULT_PRODUCT_NAME,
  DEFAULT_CURRENCY,
  DEFAULT_RECAPTCHA_MIN_SCORE,
  DEFAULT_CUSTOMER_NAME,
  DEFAULT_REVIEW_AUTHOR,
  DEFAULT_REVIEW_RATING,
  TIER_CONFIG,
  getSiteUrl,
  getStripeSecretKey,
  getRecaptchaMinScore,
  getEnvironmentContext,
  getTierConfig,
  getFallbackProductName,
  getFallbackAmount,
  getFallbackCurrency,
  getFallbackCustomerName,
  getFallbackReviewAuthor,
  getFallbackReviewRating,
} from './fallbacks';

describe('Centralized Fallbacks & Utility Functions', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getSiteUrl', () => {
    it('returns SITE_URL when environment variable is present', () => {
      process.env.SITE_URL = 'https://custom-site.example.com';
      expect(getSiteUrl()).toBe('https://custom-site.example.com');
    });

    it('falls back to DEFAULT_SITE_URL when SITE_URL is unset or empty', () => {
      delete process.env.SITE_URL;
      expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
    });
  });

  describe('getStripeSecretKey', () => {
    it('returns STRIPE_SECRET_KEY when set', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_12345';
      expect(getStripeSecretKey()).toBe('sk_test_12345');
    });

    it('falls back to DUMMY_STRIPE_SECRET_KEY when unset', () => {
      delete process.env.STRIPE_SECRET_KEY;
      expect(getStripeSecretKey()).toBe(DUMMY_STRIPE_SECRET_KEY);
    });
  });

  describe('getRecaptchaMinScore', () => {
    it('parses numeric RECAPTCHA_MIN_SCORE string correctly', () => {
      process.env.RECAPTCHA_MIN_SCORE = '0.7';
      expect(getRecaptchaMinScore()).toBe(0.7);
    });

    it('falls back to DEFAULT_RECAPTCHA_MIN_SCORE on unset or invalid string', () => {
      delete process.env.RECAPTCHA_MIN_SCORE;
      expect(getRecaptchaMinScore()).toBe(DEFAULT_RECAPTCHA_MIN_SCORE);

      process.env.RECAPTCHA_MIN_SCORE = 'invalid_number';
      expect(getRecaptchaMinScore()).toBe(DEFAULT_RECAPTCHA_MIN_SCORE);
    });
  });

  describe('getEnvironmentContext', () => {
    it('returns process.env.CONTEXT when available', () => {
      process.env.CONTEXT = 'deploy-preview';
      expect(getEnvironmentContext()).toBe('deploy-preview');
    });

    it('falls back to "unknown" when CONTEXT is missing', () => {
      delete process.env.CONTEXT;
      expect(getEnvironmentContext()).toBe('unknown');
    });
  });

  describe('getTierConfig', () => {
    it('retrieves config for valid tier keys', () => {
      const config = getTierConfig('small_packages10');
      expect(config).toEqual(TIER_CONFIG.small_packages10);
      expect(config?.monthlyPrice).toBe(25);
    });

    it('handles null, undefined, whitespace, or invalid tier keys gracefully', () => {
      expect(getTierConfig(null)).toBeNull();
      expect(getTierConfig(undefined)).toBeNull();
      expect(getTierConfig('')).toBeNull();
      expect(getTierConfig('  ')).toBeNull();
      expect(getTierConfig('invalid_tier')).toBeNull();
    });
  });

  describe('getFallbackProductName', () => {
    it('returns custom product name if provided', () => {
      expect(getFallbackProductName(' Custom Product ')).toBe('Custom Product');
    });

    it('falls back to tier label or name if custom product name is missing', () => {
      const config = getTierConfig('small_mail_only');
      expect(getFallbackProductName(null, config)).toBe('Small Mail Only');
      expect(getFallbackProductName('', { ...config!, label: '' })).toBe('Small · Mail Only');
    });

    it('falls back to DEFAULT_PRODUCT_NAME if all tier inputs are missing', () => {
      expect(getFallbackProductName(null, null)).toBe(DEFAULT_PRODUCT_NAME);
      expect(getFallbackProductName('', undefined)).toBe(DEFAULT_PRODUCT_NAME);
    });
  });

  describe('getFallbackAmount', () => {
    it('returns actual dollar amount when positive valid number is passed', () => {
      expect(getFallbackAmount(25, null)).toBe(25);
      expect(getFallbackAmount(0, null)).toBe(0);
    });

    it('falls back to tier monthlyPrice when dollar amount is null or undefined', () => {
      const config = getTierConfig('large_packages10');
      expect(getFallbackAmount(null, config)).toBe(40);
      expect(getFallbackAmount(undefined, config)).toBe(40);
    });

    it('falls back to 0 when both dollar amount and tier monthlyPrice are missing', () => {
      expect(getFallbackAmount(null, null)).toBe(0);
      expect(getFallbackAmount(undefined, undefined)).toBe(0);
    });
  });

  describe('getFallbackCurrency', () => {
    it('uppercases valid currency code', () => {
      expect(getFallbackCurrency('usd')).toBe('USD');
      expect(getFallbackCurrency('eur')).toBe('EUR');
    });

    it('falls back to DEFAULT_CURRENCY when currency is null, undefined, or empty', () => {
      expect(getFallbackCurrency(null)).toBe(DEFAULT_CURRENCY);
      expect(getFallbackCurrency(undefined)).toBe(DEFAULT_CURRENCY);
      expect(getFallbackCurrency('')).toBe(DEFAULT_CURRENCY);
      expect(getFallbackCurrency('   ')).toBe(DEFAULT_CURRENCY);
    });
  });

  describe('getFallbackCustomerName', () => {
    it('returns trimmed customer name when passed', () => {
      expect(getFallbackCustomerName('  Jane Doe  ')).toBe('Jane Doe');
    });

    it('falls back to DEFAULT_CUSTOMER_NAME when null, undefined, or empty', () => {
      expect(getFallbackCustomerName(null)).toBe(DEFAULT_CUSTOMER_NAME);
      expect(getFallbackCustomerName(undefined)).toBe(DEFAULT_CUSTOMER_NAME);
      expect(getFallbackCustomerName('')).toBe(DEFAULT_CUSTOMER_NAME);
    });
  });

  describe('getFallbackReviewAuthor', () => {
    it('returns trimmed author name when passed', () => {
      expect(getFallbackReviewAuthor(' John Smith ')).toBe('John Smith');
    });

    it('falls back to DEFAULT_REVIEW_AUTHOR when null, undefined, or empty', () => {
      expect(getFallbackReviewAuthor(null)).toBe(DEFAULT_REVIEW_AUTHOR);
      expect(getFallbackReviewAuthor(undefined)).toBe(DEFAULT_REVIEW_AUTHOR);
      expect(getFallbackReviewAuthor('')).toBe(DEFAULT_REVIEW_AUTHOR);
    });
  });

  describe('getFallbackReviewRating', () => {
    it('returns valid numeric rating when positive', () => {
      expect(getFallbackReviewRating(4)).toBe(4);
      expect(getFallbackReviewRating(5)).toBe(5);
    });

    it('falls back to DEFAULT_REVIEW_RATING when null, undefined, zero, or non-finite', () => {
      expect(getFallbackReviewRating(null)).toBe(DEFAULT_REVIEW_RATING);
      expect(getFallbackReviewRating(undefined)).toBe(DEFAULT_REVIEW_RATING);
      expect(getFallbackReviewRating(0)).toBe(DEFAULT_REVIEW_RATING);
      expect(getFallbackReviewRating(NaN)).toBe(DEFAULT_REVIEW_RATING);
    });
  });
});
