import { describe, it, expect } from 'vitest';
import { pillarConfigs } from '../config/pillars';
import { getServiceById, getServiceBreadcrumbs } from './services-helpers';
import type { Service } from '../types/services';

const makeMockService = (overrides: Partial<Service> = {}): Service => ({
  id: 'unmapped-test-service',
  category: 'pack-ship',
  serviceName: 'Unmapped Test Service',
  slug: '/unmapped-test-service',
  city: 'Concord Township',
  pageTitle: 'Unmapped Test Service | Mailbox Plus',
  metaDescription: 'Test description',
  heroTitle: 'Unmapped Test Service',
  heroSubtitle: 'Test subtitle',
  ...overrides,
});

describe('services-helpers', () => {
  describe('getServiceById', () => {
    it('finds a service by ID', () => {
      const result = getServiceById('amazon-returns');
      expect(result).toBeDefined();
      expect(result?.id).toBe('amazon-returns');
    });

    it('returns undefined for unknown ID', () => {
      const result = getServiceById('nonexistent');
      expect(result).toBeUndefined();
    });

    it('asserts exact linking metadata parity between core services and pillar configs', () => {
      for (const pillarId of ['pack-ship', 'copy-print']) {
        const service = getServiceById(pillarId);
        const pillar = pillarConfigs.find((p) => p.id === pillarId);
        expect(service).toBeDefined();
        expect(pillar).toBeDefined();
        expect(service?.internalLink).toBeDefined();
        expect(service?.anchorText).toBeDefined();
        expect(service?.internalLink).toEqual(pillar?.internalLink);
        expect(service?.anchorText).toEqual(pillar?.anchorText);
      }
    });
  });

  describe('getServiceBreadcrumbs', () => {
    it('resolves multi-crumb trail with name alias for registered service routes', () => {
      const registered = getServiceById('amazon-returns');
      expect(registered).toBeDefined();

      const crumbs = getServiceBreadcrumbs(registered!);
      expect(crumbs.length).toBeGreaterThan(1);
      expect(crumbs[0]).toEqual({ label: 'Home', url: '/', name: 'Home' });
      expect(crumbs[crumbs.length - 1].active).toBe(true);
      expect(crumbs[crumbs.length - 1].name).toBe(crumbs[crumbs.length - 1].label);
      crumbs.forEach((crumb) => {
        expect(crumb.url.endsWith('/')).toBe(true);
      });
    });

    it('falls back to parentPillar trail when URL is unmapped in getBreadcrumbs but service ID belongs to a pillar', () => {
      const unmappedUrlKnownChild = makeMockService({
        id: 'fedex-shipping',
        serviceName: 'FedEx Shipping Custom',
        slug: '/custom-unmapped-fedex-route',
        canonicalUrl: '/custom-unmapped-fedex-canonical',
      });

      const crumbs = getServiceBreadcrumbs(unmappedUrlKnownChild);
      expect(crumbs).toEqual([
        { label: 'Home', url: '/', name: 'Home' },
        { label: 'Pack & Ship', url: '/pack-ship/', name: 'Pack & Ship' },
        {
          label: 'FedEx Shipping Custom',
          url: '/custom-unmapped-fedex-canonical/',
          name: 'FedEx Shipping Custom',
          active: true,
        },
      ]);
    });

    it('falls back to baseUrl and baseLabel when URL and service ID are unmapped and baseUrl is provided', () => {
      const unmappedService = makeMockService({
        id: 'custom-standalone-service',
        serviceName: 'Standalone Service',
        slug: '/standalone-service',
      });

      const defaultLabelCrumbs = getServiceBreadcrumbs(unmappedService, '/services');
      expect(defaultLabelCrumbs).toEqual([
        { label: 'Home', url: '/', name: 'Home' },
        { label: 'Services', url: '/services/', name: 'Services' },
        {
          label: 'Standalone Service',
          url: '/standalone-service/',
          name: 'Standalone Service',
          active: true,
        },
      ]);

      const customLabelCrumbs = getServiceBreadcrumbs(
        unmappedService,
        '/specialty/',
        'Specialty Services'
      );
      expect(customLabelCrumbs).toEqual([
        { label: 'Home', url: '/', name: 'Home' },
        { label: 'Specialty Services', url: '/specialty/', name: 'Specialty Services' },
        {
          label: 'Standalone Service',
          url: '/standalone-service/',
          name: 'Standalone Service',
          active: true,
        },
      ]);
    });

    it('falls back to two-node Home + Service trail when URL, parentPillar, and baseUrl are all absent', () => {
      const unmappedService = makeMockService({
        id: 'totally-unmapped-id',
        serviceName: 'Direct Service Page',
        slug: '/direct-service-page',
      });

      const crumbs = getServiceBreadcrumbs(unmappedService);
      expect(crumbs).toEqual([
        { label: 'Home', url: '/', name: 'Home' },
        {
          label: 'Direct Service Page',
          url: '/direct-service-page/',
          name: 'Direct Service Page',
          active: true,
        },
      ]);
    });
  });
});
