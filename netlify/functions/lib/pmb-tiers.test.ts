import { describe, it, expect } from 'vitest';
import {
  PMB_TIERS,
  KEY_DEPOSIT_LOOKUP_KEY,
  isValidPmbTier,
  getPmbTier,
  getPmbTierKeys,
} from './pmb-tiers';

describe('PMB Tiers Catalog Module', () => {
  it('defines KEY_DEPOSIT_LOOKUP_KEY constant', () => {
    expect(KEY_DEPOSIT_LOOKUP_KEY).toBe('pmb_fee_key_deposit');
  });

  it('contains all 6 expected PMB subscription tiers', () => {
    const keys = getPmbTierKeys();
    expect(keys).toEqual([
      'small_mail_only',
      'small_packages10',
      'large_mail_only',
      'large_packages10',
      'business_small',
      'business_large',
    ]);
  });

  it('provides complete and valid metadata for every catalog tier', () => {
    for (const key of getPmbTierKeys()) {
      const tier = PMB_TIERS[key];
      expect(tier.key).toBe(key);
      expect(typeof tier.lookupKey).toBe('string');
      expect(tier.lookupKey.length).toBeGreaterThan(0);
      expect(typeof tier.name).toBe('string');
      expect(tier.name.length).toBeGreaterThan(0);
      expect(typeof tier.displayName).toBe('string');
      expect(tier.displayName.length).toBeGreaterThan(0);
      expect(tier.monthlyPrice).toBeGreaterThan(0);
      expect(tier.monthly).toBe(tier.monthlyPrice);
      expect(tier.cancelUrl.startsWith('/')).toBe(true);
      expect(typeof tier.source).toBe('string');
      expect(tier.source.length).toBeGreaterThan(0);
      expect(typeof tier.hasSmsConsent).toBe('boolean');
    }
  });

  describe('isValidPmbTier', () => {
    it('returns true for valid tier keys', () => {
      expect(isValidPmbTier('small_mail_only')).toBe(true);
      expect(isValidPmbTier('business_large')).toBe(true);
    });

    it('returns false for invalid tier keys', () => {
      expect(isValidPmbTier('invalid_tier')).toBe(false);
      expect(isValidPmbTier('')).toBe(false);
      expect(isValidPmbTier('small_mail_only_extra')).toBe(false);
    });
  });

  describe('getPmbTier', () => {
    it('returns correct tier metadata for valid tier key', () => {
      const tier = getPmbTier('small_mail_only');
      expect(tier).toBeDefined();
      expect(tier?.lookupKey).toBe('pmb_small_mail_only_monthly');
      expect(tier?.name).toBe('Small · Mail Only');
      expect(tier?.monthlyPrice).toBe(15);
      expect(tier?.hasSmsConsent).toBe(false);
    });

    it('returns undefined for invalid key, null, or undefined', () => {
      expect(getPmbTier('nonexistent')).toBeUndefined();
      expect(getPmbTier(null)).toBeUndefined();
      expect(getPmbTier(undefined)).toBeUndefined();
      expect(getPmbTier('')).toBeUndefined();
    });
  });
});
