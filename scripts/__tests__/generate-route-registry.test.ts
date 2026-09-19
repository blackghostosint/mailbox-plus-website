import { describe, it, expect } from 'vitest';
import {
  formatUrl,
  getId,
  getTitle,
  isGeoDropoff,
  generateLocalPages,
  buildSiteStructure,
} from '../generate-route-registry.ts';

describe('generate-route-registry', () => {
  describe('formatUrl', () => {
    it('strips trailing slashes from URLs', () => {
      expect(formatUrl('/services/shipping/')).toBe('/services/shipping');
      expect(formatUrl('/about/')).toBe('/about');
      expect(formatUrl('https://example.com/page/')).toBe('https://example.com/page');
    });

    it('returns string unchanged if no trailing slash exists', () => {
      expect(formatUrl('/services/shipping')).toBe('/services/shipping');
      expect(formatUrl('/contact')).toBe('/contact');
    });
  });

  describe('getId', () => {
    it('remaps specific legacy or parity service IDs', () => {
      expect(getId('ups-authorized-shipper-outlet')).toBe('ups-shipping');
      expect(getId('ship-a-return-with-strict-size-or-weight-limits')).toBe(
        'ship-return-strict-size-weight-limits'
      );
    });

    it('passes through unmapped service IDs unchanged', () => {
      expect(getId('fedex-shipping')).toBe('fedex-shipping');
      expect(getId('mailbox-rental')).toBe('mailbox-rental');
    });
  });

  describe('getTitle', () => {
    it('overrides specific service IDs with custom display titles', () => {
      expect(getTitle('ups-authorized-shipper-outlet', 'UPS Outlet')).toBe('UPS Shipping');
      expect(getTitle('usps-services', 'Postal Services')).toBe('USPS Services');
    });

    it('falls back to provided serviceName for other services', () => {
      expect(getTitle('fedex-shipping', 'FedEx Express & Ground')).toBe('FedEx Express & Ground');
      expect(getTitle('custom-notary', 'Mobile Notary')).toBe('Mobile Notary');
    });
  });

  describe('isGeoDropoff', () => {
    const mockCompetitiveSet = new Set([
      'ups-drop-off-location',
      'happy-returns-location',
      'package-receiving-service',
      'fedex-shipping-store',
    ]);

    it('returns true for competitive IDs with drop-off, happy-returns, or package-receiving prefix', () => {
      expect(isGeoDropoff({ id: 'ups-drop-off-location' }, mockCompetitiveSet)).toBe(true);
      expect(isGeoDropoff({ id: 'happy-returns-location' }, mockCompetitiveSet)).toBe(true);
      expect(isGeoDropoff({ id: 'package-receiving-service' }, mockCompetitiveSet)).toBe(true);
    });

    it('returns false for competitive IDs without dropoff characteristics', () => {
      expect(isGeoDropoff({ id: 'fedex-shipping-store' }, mockCompetitiveSet)).toBe(false);
    });

    it('returns false for non-competitive IDs', () => {
      expect(isGeoDropoff({ id: 'ups-drop-off-location' }, new Set())).toBe(false);
    });
  });

  describe('generateLocalPages', () => {
    it('transforms serviceAreas into localPages format', () => {
      const mockAreas = [
        {
          id: 'concord-oh',
          slug: 'concord-township',
          city: 'Concord Township',
          pageTitle: 'Shipping in Concord Township, OH',
          metaDescription: 'Local shipping services in Concord Township.',
          canonicalUrl: '/service-area/concord-township',
          heroImage: '/images/concord.webp',
          priorityServices: ['ups-shipping', 'notary'],
        },
        {
          id: 'faq-service-area',
          slug: 'faq',
          serviceName: 'FAQ Services',
        },
      ];

      const result = generateLocalPages(mockAreas as any);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        slug: 'concord-township',
        city: 'Concord Township',
        state: 'OH',
        introTitle: 'Shipping & Business Services in Concord Township, OH',
        introductoryContent: expect.stringContaining('Concord Township, OH'),
        metaTitle: 'Shipping in Concord Township, OH',
        metaDescription: 'Local shipping services in Concord Township.',
        canonical: '/service-area/concord-township',
        heroImage: '/images/concord.webp',
        services: ['ups-shipping', 'notary'],
      });
    });
  });

  describe('buildSiteStructure', () => {
    it('builds a complete siteStructure object with homepage, pillars, subSupporting, and seo-landing', () => {
      const mockServices = [
        {
          id: 'pack-ship-core',
          serviceName: 'Packing',
          slug: '/pack-ship/',
          category: 'pack-ship',
        },
        {
          id: 'print-flyers',
          serviceName: 'Flyers',
          slug: '/copy-print/flyers/',
          category: 'copy-print',
        },
      ];

      const mockPillarConfigs = [
        {
          id: 'pack-ship',
          title: 'Pack & Ship',
          url: '/pack-ship/',
          description: 'Packing services',
        },
      ];

      const mockSubSupporting = [{ id: 'about', title: 'About Us', url: '/about/' }];

      const mockStandaloneSeo = [
        { id: 'cheap-shipping', title: 'Cheap Shipping', url: '/cheap-shipping/' },
      ];

      const structure = buildSiteStructure(
        mockServices as any,
        [],
        mockPillarConfigs as any,
        mockSubSupporting as any,
        mockStandaloneSeo as any
      );

      expect(structure.homepage.url).toBe('/');
      expect(structure.pillars).toHaveLength(1);
      expect(structure.pillars[0].id).toBe('pack-ship');
      expect(structure.pillars[0].children[0]).toEqual({
        id: 'pack-ship-core',
        url: '/pack-ship',
        title: 'Packing',
      });
      expect(structure.subSupporting[0]).toEqual({
        id: 'about',
        url: '/about',
        title: 'About Us',
      });
      expect(structure['seo-landing'][0]).toEqual({
        id: 'cheap-shipping',
        url: '/cheap-shipping',
        title: 'Cheap Shipping',
      });
    });
  });
});
