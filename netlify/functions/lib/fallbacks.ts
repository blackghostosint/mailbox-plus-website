/**
 * Centralized Fallback Configurations and Shared Helper Utilities
 * for Netlify Serverless Endpoints.
 */

export const DEFAULT_SITE_URL = 'https://mailboxplusohio.com';
export const DUMMY_STRIPE_SECRET_KEY = 'dummy_stripe_secret_key';
export const DEFAULT_PRODUCT_NAME = 'Mailbox Rental';
export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_RECAPTCHA_MIN_SCORE = 0.5;
export const DEFAULT_CLIENT_IP = '127.0.0.1';
export const DEFAULT_CUSTOMER_NAME = 'Customer';
export const DEFAULT_REVIEW_AUTHOR = 'Google User';
export const DEFAULT_REVIEW_RATING = 5;

export interface TierConfig {
  lookupKey: string;
  name: string;
  label: string;
  monthlyPrice: number;
  source: string;
  cancelUrl: string;
  hasSms: boolean;
}

export const TIER_CONFIG: Record<string, TierConfig> = {
  small_mail_only: {
    lookupKey: 'pmb_small_mail_only_monthly',
    name: 'Small · Mail Only',
    label: 'Small Mail Only',
    monthlyPrice: 15,
    source: 'private-mailbox-rental',
    cancelUrl: '/private-mailbox-rental/',
    hasSms: false,
  },
  small_packages10: {
    lookupKey: 'pmb_small_packages10_monthly',
    name: 'Small · +10 Packages',
    label: 'Small +10 Packages',
    monthlyPrice: 25,
    source: 'private-mailbox-rental',
    cancelUrl: '/private-mailbox-rental/',
    hasSms: true,
  },
  large_mail_only: {
    lookupKey: 'pmb_large_mail_only_monthly',
    name: 'Large · Mail Only',
    label: 'Large Mail Only',
    monthlyPrice: 30,
    source: 'private-mailbox-rental',
    cancelUrl: '/private-mailbox-rental/',
    hasSms: false,
  },
  large_packages10: {
    lookupKey: 'pmb_large_packages10_monthly',
    name: 'Large · +10 Packages',
    label: 'Large +10 Packages',
    monthlyPrice: 40,
    source: 'private-mailbox-rental',
    cancelUrl: '/private-mailbox-rental/',
    hasSms: true,
  },
  business_small: {
    lookupKey: 'pmb_biz_small_monthly',
    name: 'Business Small',
    label: 'Business Small',
    monthlyPrice: 35,
    source: 'home-business-mailbox-rental',
    cancelUrl: '/home-business/mailbox-rental/',
    hasSms: true,
  },
  business_large: {
    lookupKey: 'pmb_biz_large_monthly',
    name: 'Business Large',
    label: 'Business Large',
    monthlyPrice: 50,
    source: 'home-business-mailbox-rental',
    cancelUrl: '/home-business/mailbox-rental/',
    hasSms: true,
  },
};

/**
 * Returns the site base URL from environment or default fallback.
 */
export function getSiteUrl(): string {
  return process.env.SITE_URL || DEFAULT_SITE_URL;
}

/**
 * Returns the Stripe secret key or dummy fallback.
 */
export function getStripeSecretKey(): string {
  return process.env.STRIPE_SECRET_KEY || DUMMY_STRIPE_SECRET_KEY;
}

/**
 * Returns the reCAPTCHA minimum score threshold from environment or default 0.5.
 */
export function getRecaptchaMinScore(): number {
  const envVal = process.env.RECAPTCHA_MIN_SCORE;
  if (!envVal) return DEFAULT_RECAPTCHA_MIN_SCORE;
  const parsed = Number.parseFloat(envVal);
  return Number.isFinite(parsed) ? parsed : DEFAULT_RECAPTCHA_MIN_SCORE;
}

/**
 * Returns the Netlify execution context environment string or default 'unknown'.
 */
export function getEnvironmentContext(): string {
  const netlifyGlobal = (
    globalThis as unknown as { Netlify?: { env?: { get: (key: string) => string | undefined } } }
  ).Netlify;

  return (
    (typeof netlifyGlobal !== 'undefined' && netlifyGlobal.env?.get('CONTEXT')) ||
    process.env.CONTEXT ||
    'unknown'
  );
}

/**
 * Safely looks up configuration for a given tier key.
 * Returns null if the tier key is missing or unknown.
 */
export function getTierConfig(tierKey?: string | null): TierConfig | null {
  if (!tierKey || typeof tierKey !== 'string') return null;
  const key = tierKey.trim();
  if (!Object.hasOwn(TIER_CONFIG, key)) return null;
  return TIER_CONFIG[key] || null;
}

/**
 * Returns a product display name, falling back to tier label or DEFAULT_PRODUCT_NAME.
 */
export function getFallbackProductName(
  productName?: string | null,
  tierConfig?: TierConfig | null
): string {
  if (productName && typeof productName === 'string' && productName.trim() !== '') {
    return productName.trim();
  }
  if (tierConfig?.label) {
    return tierConfig.label;
  }
  if (tierConfig?.name) {
    return tierConfig.name;
  }
  return DEFAULT_PRODUCT_NAME;
}

/**
 * Returns payment amount in dollars, falling back to tier monthly price or 0.
 */
export function getFallbackAmount(
  amountInDollars?: number | null,
  tierConfig?: TierConfig | null
): number {
  if (
    typeof amountInDollars === 'number' &&
    Number.isFinite(amountInDollars) &&
    amountInDollars >= 0
  ) {
    return amountInDollars;
  }
  if (typeof tierConfig?.monthlyPrice === 'number' && Number.isFinite(tierConfig.monthlyPrice)) {
    return tierConfig.monthlyPrice;
  }
  return 0;
}

/**
 * Returns uppercase 3-letter currency code, falling back to DEFAULT_CURRENCY ('USD').
 */
export function getFallbackCurrency(currency?: string | null): string {
  if (currency && typeof currency === 'string' && currency.trim() !== '') {
    return currency.trim().toUpperCase();
  }
  return DEFAULT_CURRENCY;
}

/**
 * Returns sanitized customer name, falling back to DEFAULT_CUSTOMER_NAME ('Customer').
 */
export function getFallbackCustomerName(name?: string | null): string {
  if (name && typeof name === 'string' && name.trim() !== '') {
    return name.trim();
  }
  return DEFAULT_CUSTOMER_NAME;
}

/**
 * Returns review author display name, falling back to DEFAULT_REVIEW_AUTHOR ('Google User').
 */
export function getFallbackReviewAuthor(author?: string | null): string {
  if (author && typeof author === 'string' && author.trim() !== '') {
    return author.trim();
  }
  return DEFAULT_REVIEW_AUTHOR;
}

/**
 * Returns review numerical rating, falling back to DEFAULT_REVIEW_RATING (5).
 */
export function getFallbackReviewRating(rating?: number | null): number {
  if (typeof rating === 'number' && Number.isFinite(rating) && rating > 0) {
    return rating;
  }
  return DEFAULT_REVIEW_RATING;
}
