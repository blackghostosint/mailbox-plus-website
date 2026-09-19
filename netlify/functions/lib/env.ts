/* global process */
import * as dotenv from 'dotenv';

// Initialize environment variables from .env if present (safely ignored in production/CI if absent)
try {
  dotenv.config();
} catch {
  // Ignore error if dotenv cannot read .env
}

export type ServerEnvKey =
  | 'RESEND_API_KEY'
  | 'RECAPTCHA_SECRET_KEY'
  | 'RECAPTCHA_MIN_SCORE'
  | 'GOOGLE_PLACES_API_KEY'
  | 'STRIPE_SECRET_KEY'
  | 'SITE_URL'
  | 'CONTACT_EMAIL'
  | 'NETLIFY_SITE_ID'
  | 'NETLIFY_AUTH_TOKEN'
  | 'CONTEXT';

/**
 * Dynamically reads an environment variable from process.env.
 */
export function getEnv(key: ServerEnvKey | string, defaultValue?: string): string | undefined {
  const val = process.env[key];
  if (val !== undefined && val !== '') {
    return val;
  }
  return defaultValue;
}

/**
 * Dynamically reads an environment variable or throws an Error if missing.
 */
export function requireEnv(key: ServerEnvKey | string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Required environment variable ${key} is missing`);
  }
  return val;
}

/**
 * Centralized, validated getters for Netlify serverless environment variables.
 * Uses dynamic getters so that process.env changes in tests/runtimes are immediately reflected.
 */
export const serverEnv = {
  get RESEND_API_KEY(): string | undefined {
    return getEnv('RESEND_API_KEY');
  },
  get RECAPTCHA_SECRET_KEY(): string | undefined {
    return getEnv('RECAPTCHA_SECRET_KEY');
  },
  get RECAPTCHA_MIN_SCORE(): string {
    return getEnv('RECAPTCHA_MIN_SCORE', '0.5')!;
  },
  get GOOGLE_PLACES_API_KEY(): string | undefined {
    return getEnv('GOOGLE_PLACES_API_KEY');
  },
  get STRIPE_SECRET_KEY(): string | undefined {
    return getEnv('STRIPE_SECRET_KEY');
  },
  get SITE_URL(): string {
    return getEnv('SITE_URL', 'https://mailboxplusohio.com')!;
  },
  get CONTACT_EMAIL(): string {
    return getEnv('CONTACT_EMAIL', 'help@mailboxplusohio.com')!;
  },
  get NETLIFY_SITE_ID(): string | undefined {
    return getEnv('NETLIFY_SITE_ID');
  },
  get NETLIFY_AUTH_TOKEN(): string | undefined {
    return getEnv('NETLIFY_AUTH_TOKEN');
  },
  get CONTEXT(): string {
    return getEnv('CONTEXT', 'unknown')!;
  },
};
