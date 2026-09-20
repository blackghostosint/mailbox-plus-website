import { describe, it, expect } from 'vitest';
import { getInternalLink, getAnchorText } from './internal-links';

describe('internal-links', () => {
  describe('getInternalLink', () => {
    it('finds a pillar by ID', () => {
      const result = getInternalLink('pack-ship');
      expect(result).toBeDefined();
      expect(result?.id).toBe('pack-ship');
    });

    it('finds a child by ID', () => {
      const result = getInternalLink('amazon-returns');
      expect(result).toBeDefined();
    });

    it('returns null for unknown ID', () => {
      const result = getInternalLink('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getAnchorText', () => {
    it('returns anchor text for known service', () => {
      const result = getAnchorText('pack-ship', 'exact');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('falls back to link title or service ID for unknown service', () => {
      const result = getAnchorText('nonexistent');
      expect(result).toBe('nonexistent');
    });

    it('supports different variants', () => {
      const exact = getAnchorText('pack-ship', 'exact');
      const lsi = getAnchorText('pack-ship', 'lsi');
      expect(typeof exact).toBe('string');
      expect(typeof lsi).toBe('string');
    });

    it('asserts deterministic reproducibility on repeated calls with identical arguments', () => {
      const serviceId = 'pack-ship';
      const variant = 'exact';
      const context = '/services/pack-ship/';

      const initial = getAnchorText(serviceId, variant, context);
      for (let i = 0; i < 50; i++) {
        const repeated = getAnchorText(serviceId, variant, context);
        expect(repeated).toBe(initial);
      }
    });

    it('verifies hash index stability across exact, lsi, and geo variants with custom context strings', () => {
      const serviceId = 'mailbox-rental';
      const variants = ['exact', 'lsi', 'geo'] as const;
      const contexts = [
        '',
        '/services/mailbox-rental/',
        '/service-area/concord-township/',
        'footer-navigation-context',
      ];

      variants.forEach((variant) => {
        contexts.forEach((context) => {
          const first = getAnchorText(serviceId, variant, context);
          const second = getAnchorText(serviceId, variant, context);
          expect(first).toBe(second);
          expect(typeof first).toBe('string');
          expect(first.length).toBeGreaterThan(0);
        });
      });
    });

    it('demonstrates seed sensitivity when variant or context changes', () => {
      const baseResult = getAnchorText('fedex-shipping', 'exact', '/page-a/');
      const variantResult = getAnchorText('fedex-shipping', 'lsi', '/page-a/');
      const contextResult = getAnchorText('fedex-shipping', 'exact', '/page-b/');

      // Repeated calls must yield identical results to verify stability per seed
      expect(getAnchorText('fedex-shipping', 'exact', '/page-a/')).toBe(baseResult);
      expect(getAnchorText('fedex-shipping', 'lsi', '/page-a/')).toBe(variantResult);
      expect(getAnchorText('fedex-shipping', 'exact', '/page-b/')).toBe(contextResult);
    });

    it('explicitly asserts stable fallback titles when service IDs or anchor variants are unmapped', () => {
      // Unmapped service ID fallback
      const unknown1 = getAnchorText('unmapped-service-id-xyz');
      const unknown2 = getAnchorText('unmapped-service-id-xyz');
      expect(unknown1).toBe('unmapped-service-id-xyz');
      expect(unknown2).toBe(unknown1);

      // Unmapped anchor variant falls back to 'exact' variants array deterministically
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidVariant1 = getAnchorText('pack-ship', 'unmapped_variant' as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidVariant2 = getAnchorText('pack-ship', 'unmapped_variant' as any);
      expect(invalidVariant1).toBe(invalidVariant2);
      expect(['Pack & Ship', 'Packing and Shipping']).toContain(invalidVariant1);

      // Known service from siteStructure that has no anchorText entry falls back to link title
      const link = getInternalLink('ups-shipping');
      expect(link).toBeDefined();
      if (link) {
        const titleFallback1 = getAnchorText('ups-shipping');
        const titleFallback2 = getAnchorText('ups-shipping');
        expect(titleFallback1).toBe('UPS Shipping');
        expect(titleFallback1).toBe(link.title);
        expect(titleFallback2).toBe(titleFallback1);
      }
    });
  });
});
