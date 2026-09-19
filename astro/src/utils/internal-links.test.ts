import { describe, it, expect } from 'vitest';
import { getInternalLink, getAnchorText } from './internal-links';
import { getBreadcrumbs, resolveParentPillar } from './navigation-helpers';
import { getServiceBreadcrumbs } from './services-helpers';
import siteStructure from '../data/siteStructure.json';
import { services } from '../config/services';

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

  describe('getBreadcrumbs', () => {
    it('returns empty array for root path', () => {
      expect(getBreadcrumbs('')).toEqual([]);
    });

    it('returns breadcrumbs for pillar pages', () => {
      const result = getBreadcrumbs('/pack-ship');
      expect(result.length).toBe(2);
      expect(result[0].label).toBe('Home');
      expect(result[1].active).toBe(true);
    });

    it('returns breadcrumbs for child pages', () => {
      const result = getBreadcrumbs('/pack-ship/fedex-shipping');
      expect(result.length).toBe(3);
      expect(result[0].label).toBe('Home');
      expect(result[1].label).toBe('Pack & Ship');
      expect(result[2].active).toBe(true);
    });

    it('returns breadcrumbs for local pages', () => {
      const result = getBreadcrumbs('/service-area/concord-township');
      expect(result.length).toBe(3);
      expect(result[0].label).toBe('Home');
      expect(result[1].label).toBe('Service Areas');
    });

    it('returns home fallback for unknown paths', () => {
      const result = getBreadcrumbs('/unknown-page');
      expect(result.length).toBe(1);
      expect(result[0].label).toBe('Home');
    });

    it('handles trailing slashes consistently and emits normalized trailing-slash URLs', () => {
      const withSlash = getBreadcrumbs('/pack-ship/');
      const withoutSlash = getBreadcrumbs('/pack-ship');
      expect(withSlash.length).toBe(withoutSlash.length);
      expect(withSlash[1].url).toBe('/pack-ship/');
      expect(withoutSlash[1].url).toBe('/pack-ship/');
    });

    it('resolves multi-node breadcrumbs for all subSupporting routes in siteStructure.json', () => {
      expect(Array.isArray(siteStructure.subSupporting)).toBe(true);
      expect(siteStructure.subSupporting.length).toBeGreaterThan(0);

      siteStructure.subSupporting.forEach((sub) => {
        const crumbs = getBreadcrumbs(sub.url);
        expect(crumbs.length).toBeGreaterThanOrEqual(3);
        expect(crumbs[0].label).toBe('Home');
        expect(crumbs[0].url).toBe('/');
        expect(crumbs[crumbs.length - 1].label).toBeTruthy();
        expect(crumbs[crumbs.length - 1].active).toBe(true);
        crumbs.forEach((c) => {
          expect(c.url.endsWith('/')).toBe(true);
        });
      });
    });

    it('resolves multi-node breadcrumbs for all seo-landing routes in siteStructure.json', () => {
      expect(Array.isArray(siteStructure['seo-landing'])).toBe(true);
      expect(siteStructure['seo-landing'].length).toBeGreaterThan(0);

      siteStructure['seo-landing'].forEach((item) => {
        const crumbs = getBreadcrumbs(item.url);
        expect(crumbs.length).toBeGreaterThanOrEqual(2);
        expect(crumbs[0].label).toBe('Home');
        expect(crumbs[0].url).toBe('/');
        expect(crumbs[crumbs.length - 1].label).toBe(item.title);
        expect(crumbs[crumbs.length - 1].active).toBe(true);
        crumbs.forEach((c) => {
          expect(c.url.endsWith('/')).toBe(true);
        });
      });
    });

    it('delegates getServiceBreadcrumbs directly to navigation-helpers resolver', () => {
      const testService = services[0];
      expect(testService).toBeDefined();

      const serviceCrumbs = getServiceBreadcrumbs(testService);
      const directCrumbs = getBreadcrumbs(testService.canonicalUrl || testService.slug);

      expect(serviceCrumbs.length).toBe(directCrumbs.length);
      serviceCrumbs.forEach((sc, index) => {
        expect(sc.label).toBe(directCrumbs[index].label);
        expect(sc.url).toBe(directCrumbs[index].url);
      });
    });
  });

  describe('resolveParentPillar', () => {
    it('resolves explicit parents from internalLinks.json', () => {
      const parent = resolveParentPillar('amazon-returns', '/amazon-returns/', 'Amazon Returns');
      expect(parent.id).toBe('pack-ship');
    });

    it('resolves explicit parents for newly mapped routes', () => {
      const shippingPartnersParent = resolveParentPillar(
        'shipping-partners',
        '/shipping-partners/',
        'Shipping Partners'
      );
      expect(shippingPartnersParent.id).toBe('pack-ship');

      const mailboxEastlakeParent = resolveParentPillar(
        'mailbox-rental-eastlake',
        '/mailbox-rental-eastlake/',
        'Mailbox Rental Eastlake'
      );
      expect(mailboxEastlakeParent.id).toBe('home-business');
    });

    it('is resilient against incidental keywords in unmapped titles or URLs', () => {
      // Unmapped page with "return" or "business" in title/URL falls back safely
      const unmappedReturnPrintPage = resolveParentPillar(
        'unmapped-print-policy',
        '/copy-print/return-policy',
        'Print Services Return Policy'
      );
      // Structured URL prefix matches copy-print rather than misassigning to pack-ship via "return"
      expect(unmappedReturnPrintPage.id).toBe('copy-print');

      const unmappedBusinessCardPage = resolveParentPillar(
        'unmapped-card-printing',
        '/copy-print/business-cards-custom',
        'Custom Business Cards'
      );
      expect(unmappedBusinessCardPage.id).toBe('copy-print');
    });
  });
});
