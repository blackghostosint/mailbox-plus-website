/* global process */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getClientEnv, getRecaptchaSiteKey, getR2PublicBaseUrl, clientEnv } from '../env';

describe('Frontend Client Environment Utility (astro/src/lib/env.ts)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('reads process.env in Node/test runtime', () => {
    process.env.VITE_TEST_KEY = 'test_value';
    expect(getClientEnv('VITE_TEST_KEY')).toBe('test_value');
  });

  it('returns default value when environment variable is missing', () => {
    delete process.env.VITE_NON_EXISTENT;
    expect(getClientEnv('VITE_NON_EXISTENT', 'fallback_val')).toBe('fallback_val');
  });

  it('getRecaptchaSiteKey prioritizes VITE_RECAPTCHA_SITE_KEY over RECAPTCHA_SITE_KEY', () => {
    process.env.VITE_RECAPTCHA_SITE_KEY = 'vite_site_key_123';
    process.env.RECAPTCHA_SITE_KEY = 'legacy_site_key_456';
    expect(getRecaptchaSiteKey()).toBe('vite_site_key_123');
  });

  it('getRecaptchaSiteKey falls back to legacy RECAPTCHA_SITE_KEY if VITE_RECAPTCHA_SITE_KEY is absent', () => {
    delete process.env.VITE_RECAPTCHA_SITE_KEY;
    process.env.RECAPTCHA_SITE_KEY = 'legacy_site_key_456';
    expect(getRecaptchaSiteKey()).toBe('legacy_site_key_456');
  });

  it('getR2PublicBaseUrl returns configured base URL or default CDN URL', () => {
    process.env.VITE_R2_PUBLIC_BASE_URL = 'https://custom-r2.dev';
    expect(getR2PublicBaseUrl()).toBe('https://custom-r2.dev');

    delete process.env.VITE_R2_PUBLIC_BASE_URL;
    expect(getR2PublicBaseUrl()).toBe('https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev');
  });

  it('clientEnv getters dynamically reflect environment changes', () => {
    process.env.VITE_RECAPTCHA_SITE_KEY = 'dyn_site_key';
    expect(clientEnv.VITE_RECAPTCHA_SITE_KEY).toBe('dyn_site_key');
  });
});
