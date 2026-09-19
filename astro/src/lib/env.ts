/* global process */

export type ClientEnvKey =
  | 'VITE_R2_PUBLIC_BASE_URL'
  | 'VITE_RECAPTCHA_SITE_KEY'
  | 'RECAPTCHA_SITE_KEY'
  | string;

/**
 * Encapsulates safe client environment variable resolution across Vite client,
 * Astro server-side rendering, and Node.js testing runtimes.
 */
export function getClientEnv(key: ClientEnvKey, defaultValue = ''): string {
  let value: string | undefined;

  if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
    value = import.meta.env[key];
  }

  if (value === undefined && typeof process !== 'undefined' && process && process.env) {
    value = process.env[key];
  }

  if (value !== undefined && value !== '') {
    return value;
  }

  return defaultValue;
}

/**
 * Retrieves standardized reCAPTCHA v3 site key with clean fallback defaults.
 */
export function getRecaptchaSiteKey(): string {
  return getClientEnv('VITE_RECAPTCHA_SITE_KEY') || getClientEnv('RECAPTCHA_SITE_KEY') || '';
}

/**
 * Retrieves public R2 bucket base URL with fallback default.
 */
export function getR2PublicBaseUrl(): string {
  return getClientEnv(
    'VITE_R2_PUBLIC_BASE_URL',
    'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev'
  );
}

/**
 * Unified client environment object.
 */
export const clientEnv = {
  get VITE_RECAPTCHA_SITE_KEY(): string {
    return getRecaptchaSiteKey();
  },
  get VITE_R2_PUBLIC_BASE_URL(): string {
    return getR2PublicBaseUrl();
  },
};
