import { describe, it, expect } from 'vitest';
import {
  resolveParentPillar,
  getLocalPriorityServices,
  getBreadcrumbs,
} from './navigation-helpers';
import { getServiceBreadcrumbs } from './services-helpers';
import siteStructure from '../data/siteStructure.json';
import { services } from '../config/services';

describe('navigation-helpers', () => {
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

    it('resolves parent pillar via structured ID and URL prefix matching for pack-ship', () => {
      expect(resolveParentPillar('pack-and-ship-custom', '/pack-and-ship-custom/', 'P&S').id).toBe(
        'pack-ship'
      );
      expect(resolveParentPillar('shipping-custom', '/shipping-custom/', 'Shipping').id).toBe(
        'pack-ship'
      );
      expect(resolveParentPillar('post-office-alternative-box', '/po-alt/', 'PO Alt').id).toBe(
        'pack-ship'
      );
      expect(resolveParentPillar('fedex-dropoff', '/fedex/', 'FedEx').id).toBe('pack-ship');
      expect(resolveParentPillar('ups-ground', '/ups/', 'UPS').id).toBe('pack-ship');
      expect(resolveParentPillar('dhl-express', '/dhl/', 'DHL').id).toBe('pack-ship');
      expect(resolveParentPillar('unmapped-id', '/pack-ship/custom/', 'Custom').id).toBe(
        'pack-ship'
      );
      expect(resolveParentPillar('unmapped-id', '/custom-pack-and-ship-page/', 'Custom').id).toBe(
        'pack-ship'
      );
    });

    it('resolves parent pillar via structured ID and URL prefix matching for home-business (mailbox-rentals)', () => {
      expect(
        resolveParentPillar('mailbox-rental-concord', '/mailbox-rental-concord/', 'Mailbox').id
      ).toBe('home-business');
      expect(
        resolveParentPillar('mail-boxes-etc-alternative-service', '/mbe-alt/', 'MBE Alt').id
      ).toBe('home-business');
      expect(resolveParentPillar('private-mailbox-rental', '/pmb/', 'PMB').id).toBe(
        'home-business'
      );
      expect(
        resolveParentPillar('unmapped-id', '/mailbox-rentals/standard/', 'Mailbox Rentals').id
      ).toBe('home-business');
      expect(
        resolveParentPillar('unmapped-id', '/custom-mailbox-rental-page/', 'Mailbox Rental').id
      ).toBe('home-business');
    });

    it('resolves parent pillar via structured ID and URL prefix matching for copy-print', () => {
      expect(resolveParentPillar('printing-flyers', '/printing-flyers/', 'Printing').id).toBe(
        'copy-print'
      );
      expect(resolveParentPillar('copy-documents', '/copy-documents/', 'Copy').id).toBe(
        'copy-print'
      );
      expect(resolveParentPillar('unmapped-id', '/copy-print/banners/', 'Banners').id).toBe(
        'copy-print'
      );
      expect(
        resolveParentPillar('unmapped-id', '/custom-copy-and-print-page/', 'Copy Print').id
      ).toBe('copy-print');
    });

    it('resolves parent pillar via structured ID and URL prefix matching for specialty', () => {
      expect(
        resolveParentPillar('digital-fingerprint', '/digital-fingerprint/', 'Fingerprint').id
      ).toBe('specialty');
      expect(resolveParentPillar('notary-public', '/notary-public/', 'Notary').id).toBe(
        'specialty'
      );
      expect(
        resolveParentPillar('unmapped-id', '/fingerprinting-service/', 'Fingerprinting').id
      ).toBe('specialty');
      expect(resolveParentPillar('unmapped-id', '/notary-signing/', 'Notary').id).toBe('specialty');
    });

    it('falls back to pack-ship pillar for completely unmapped route ID and URL', () => {
      const fallback = resolveParentPillar(
        'unmapped-unknown-id-123',
        '/unknown-route-xyz/',
        'Unknown Page'
      );
      expect(fallback.id).toBe('pack-ship');
      expect(fallback.title).toBe('Pack & Ship');
      expect(fallback.url).toBe('/pack-ship');
    });

    it('handles empty or null/undefined strings gracefully and returns default fallback pillar', () => {
      const fallback = resolveParentPillar('', '', '');
      expect(fallback.id).toBe('pack-ship');
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

  describe('getLocalPriorityServices', () => {
    it('returns array of priority services for valid city slugs', () => {
      const concordServices = getLocalPriorityServices('concord-township');
      expect(Array.isArray(concordServices)).toBe(true);
      expect(concordServices.length).toBeGreaterThan(0);
      expect(concordServices[0]).toBeDefined();
      expect(concordServices[0]?.id).toBeDefined();
      expect(concordServices[0]?.serviceName).toBeDefined();

      const concordIds = concordServices.map((s) => s?.id);
      expect(concordIds).toContain('pack-ship');
      expect(concordIds).toContain('mailbox-rental');
    });

    it('returns empty array for invalid or unknown city slugs', () => {
      expect(getLocalPriorityServices('nonexistent-city-slug-xyz')).toEqual([]);
      expect(getLocalPriorityServices('')).toEqual([]);
    });

    it('returns empty array for city slugs that have no priority services', () => {
      expect(getLocalPriorityServices('unknown-slug')).toEqual([]);
    });
  });

  describe('getBreadcrumbs', () => {
    it('returns empty array for root path empty input', () => {
      expect(getBreadcrumbs('')).toEqual([]);
    });

    it('returns breadcrumbs for pillar pages', () => {
      const result = getBreadcrumbs('/pack-ship');
      expect(result.length).toBe(2);
      expect(result[0].label).toBe('Home');
      expect(result[0].url).toBe('/');
      expect(result[1].label).toBe('Pack & Ship');
      expect(result[1].url).toBe('/pack-ship/');
      expect(result[1].active).toBe(true);
    });

    it('returns breadcrumbs for child pages', () => {
      const result = getBreadcrumbs('/pack-ship/fedex-shipping');
      expect(result.length).toBe(3);
      expect(result[0].label).toBe('Home');
      expect(result[1].label).toBe('Pack & Ship');
      expect(result[2].active).toBe(true);
    });

    it('returns breadcrumbs for service area overview page', () => {
      const result = getBreadcrumbs('/service-area');
      expect(result.length).toBe(2);
      expect(result[0].label).toBe('Home');
      expect(result[1].label).toBe('Service Areas');
      expect(result[1].url).toBe('/service-area/');
      expect(result[1].active).toBe(true);
    });

    it('returns breadcrumbs for specific local service area pages', () => {
      const result = getBreadcrumbs('/service-area/concord-township');
      expect(result.length).toBe(3);
      expect(result[0].label).toBe('Home');
      expect(result[1].label).toBe('Service Areas');
      expect(result[2].label).toBe('Concord Township');
      expect(result[2].active).toBe(true);
    });

    it('returns breadcrumbs for dynamic service URLs', () => {
      const result = getBreadcrumbs('/amazon-returns');
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result[0].label).toBe('Home');
      expect(result[result.length - 1].active).toBe(true);
    });

    it('returns home fallback for unknown paths', () => {
      const result = getBreadcrumbs('/unknown-page');
      expect(result.length).toBe(1);
      expect(result[0].label).toBe('Home');
      expect(result[0].url).toBe('/');
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
});
