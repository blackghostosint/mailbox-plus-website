/* global process */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getEnv, requireEnv, serverEnv } from './env';

describe('Serverless Environment Bootstrapper (netlify/functions/lib/env.ts)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('retrieves environment variable with getEnv', () => {
    process.env.TEST_VAR = 'hello';
    expect(getEnv('TEST_VAR')).toBe('hello');
  });

  it('returns default value when environment variable is missing', () => {
    delete process.env.TEST_VAR;
    expect(getEnv('TEST_VAR', 'default_val')).toBe('default_val');
  });

  it('requireEnv returns value or throws when missing', () => {
    process.env.TEST_VAR = 'exists';
    expect(requireEnv('TEST_VAR')).toBe('exists');

    delete process.env.TEST_VAR;
    expect(() => requireEnv('TEST_VAR')).toThrow(
      'Required environment variable TEST_VAR is missing'
    );
  });

  it('serverEnv getters reflect dynamic process.env values', () => {
    process.env.RESEND_API_KEY = 're_test_123';
    expect(serverEnv.RESEND_API_KEY).toBe('re_test_123');

    process.env.SITE_URL = 'https://staging.mailboxplusohio.com';
    expect(serverEnv.SITE_URL).toBe('https://staging.mailboxplusohio.com');

    delete process.env.SITE_URL;
    expect(serverEnv.SITE_URL).toBe('https://mailboxplusohio.com');
  });
});
