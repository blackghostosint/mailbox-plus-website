// netlify/functions/lib/pmb-tiers.ts — Centralized Private Mailbox (PMB) subscription tier catalog
// Single authoritative source of truth for tier metadata, lookup keys, pricing, and features.
//
// Endpoint Authorization Context (AGENTS.md rule 7):
// - `create-checkout` & `verify-session` endpoints consuming this module operate as public unauthenticated
//   APIs guarded by Zod schema validation, backend Stripe credential authorization, and sliding-window rate limits.

import { ValidCheckoutTiers, type ValidCheckoutTier } from './contracts';

export type PmbTierKey = ValidCheckoutTier;

export interface PmbTierMetadata {
  key: PmbTierKey;
  lookupKey: string;
  name: string;
  displayName: string;
  monthlyPrice: number;
  monthly: number;
  cancelUrl: string;
  source: string;
  hasSmsConsent: boolean;
}

// One-time key deposit, charged on the FIRST invoice at account creation (2026-08-25).
// Lookup key lives on the one-time price under the "Mailbox Plus Fees" product.
export const KEY_DEPOSIT_LOOKUP_KEY = 'pmb_fee_key_deposit';

export const PMB_TIERS: Record<PmbTierKey, PmbTierMetadata> = {
  small_mail_only: {
    key: 'small_mail_only',
    lookupKey: 'pmb_small_mail_only_monthly',
    name: 'Small · Mail Only',
    displayName: 'Small · Mail Only',
    monthlyPrice: 15,
    monthly: 15,
    cancelUrl: '/private-mailbox-rental/',
    source: 'private-mailbox-rental',
    hasSmsConsent: false,
  },
  small_packages10: {
    key: 'small_packages10',
    lookupKey: 'pmb_small_packages10_monthly',
    name: 'Small · +10 Packages',
    displayName: 'Small · +10 Packages',
    monthlyPrice: 25,
    monthly: 25,
    cancelUrl: '/private-mailbox-rental/',
    source: 'private-mailbox-rental',
    hasSmsConsent: true,
  },
  large_mail_only: {
    key: 'large_mail_only',
    lookupKey: 'pmb_large_mail_only_monthly',
    name: 'Large · Mail Only',
    displayName: 'Large · Mail Only',
    monthlyPrice: 30,
    monthly: 30,
    cancelUrl: '/private-mailbox-rental/',
    source: 'private-mailbox-rental',
    hasSmsConsent: false,
  },
  large_packages10: {
    key: 'large_packages10',
    lookupKey: 'pmb_large_packages10_monthly',
    name: 'Large · +10 Packages',
    displayName: 'Large · +10 Packages',
    monthlyPrice: 40,
    monthly: 40,
    cancelUrl: '/private-mailbox-rental/',
    source: 'private-mailbox-rental',
    hasSmsConsent: true,
  },
  business_small: {
    key: 'business_small',
    lookupKey: 'pmb_biz_small_monthly',
    name: 'Business Small',
    displayName: 'Business Small',
    monthlyPrice: 35,
    monthly: 35,
    cancelUrl: '/home-business/mailbox-rental/',
    source: 'home-business-mailbox-rental',
    hasSmsConsent: true,
  },
  business_large: {
    key: 'business_large',
    lookupKey: 'pmb_biz_large_monthly',
    name: 'Business Large',
    displayName: 'Business Large',
    monthlyPrice: 50,
    monthly: 50,
    cancelUrl: '/home-business/mailbox-rental/',
    source: 'home-business-mailbox-rental',
    hasSmsConsent: true,
  },
};

/**
 * Checks if a given string is a valid PMB tier key.
 */
export function isValidPmbTier(tier: string): tier is PmbTierKey {
  return ValidCheckoutTiers.options.includes(tier as PmbTierKey);
}

/**
 * Retrieves tier metadata for a valid tier key, or undefined if invalid or missing.
 */
export function getPmbTier(tier: string | null | undefined): PmbTierMetadata | undefined {
  if (!tier || !isValidPmbTier(tier)) {
    return undefined;
  }
  return PMB_TIERS[tier];
}

/**
 * Returns an array of all valid PMB tier keys.
 */
export function getPmbTierKeys(): PmbTierKey[] {
  return Object.keys(PMB_TIERS) as PmbTierKey[];
}
