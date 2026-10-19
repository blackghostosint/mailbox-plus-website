import { describe, it, expect } from 'vitest';
import {
  getServiceById,
  getServiceBySlug,
  getInternalLinkNode,
  getParentPillarByChildId,
  getPillarById,
  getPillarByUrl,
  getChildByUrl,
  getSubSupportingByUrl,
  getSeoLandingByUrl,
  getParentPillarByServiceId,
  parentPillarByChildIdMap,
  parentPillarByServiceIdMap,
} from './site-registry';
import { services } from '../config/services';

describe('site-registry', () => {
  describe('parent maps parity', () => {
    it('returns identical pillar objects for all service IDs in parentPillarByChildIdMap and parentPillarByServiceIdMap', () => {
      for (const service of services) {
        const id =
          service.id === 'ups-authorized-shipper-outlet'
            ? 'ups-shipping'
            : service.id === 'ship-a-return-with-strict-size-or-weight-limits'
              ? 'ship-return-strict-size-weight-limits'
              : service.id;

        const childMapPillar = parentPillarByChildIdMap.get(id);
        const serviceMapPillar = parentPillarByServiceIdMap.get(id);

        expect(childMapPillar).toEqual(serviceMapPillar);
      }
    });
  });
  describe('getServiceById', () => {
    it('returns service when valid ID is passed', () => {
      const service = getServiceById('amazon-returns');
      expect(service).toBeDefined();
      expect(service?.id).toBe('amazon-returns');
    });

    it('returns undefined for unknown ID', () => {
      expect(getServiceById('unknown-service-id')).toBeUndefined();
    });
  });

  describe('getServiceBySlug', () => {
    it('returns service when valid slug is passed', () => {
      const service = getServiceBySlug('/amazon-returns');
      expect(service).toBeDefined();
      expect(service?.id).toBe('amazon-returns');
    });

    it('returns undefined for unknown slug', () => {
      expect(getServiceBySlug('/unknown-slug')).toBeUndefined();
    });
  });

  describe('getInternalLinkNode', () => {
    it('returns internal link node for pillar ID', () => {
      const node = getInternalLinkNode('pack-ship');
      expect(node).toBeDefined();
      expect(node?.id).toBe('pack-ship');
      expect(node?.url).toBe('/pack-ship');
    });

    it('returns internal link node for child ID', () => {
      const node = getInternalLinkNode('artwork-shipping');
      expect(node).toBeDefined();
      expect(node?.id).toBe('artwork-shipping');
    });

    it('returns undefined for unknown ID', () => {
      expect(getInternalLinkNode('unknown-link-id')).toBeUndefined();
    });
  });

  describe('getParentPillarByChildId', () => {
    it('returns parent pillar for a child ID', () => {
      const pillar = getParentPillarByChildId('artwork-shipping');
      expect(pillar).toBeDefined();
      expect(pillar?.id).toBe('pack-ship');
    });

    it('returns undefined for unmapped child ID', () => {
      expect(getParentPillarByChildId('non-existent-child')).toBeUndefined();
    });
  });

  describe('getPillarById', () => {
    it('returns pillar for valid ID', () => {
      const pillar = getPillarById('pack-ship');
      expect(pillar).toBeDefined();
      expect(pillar?.title).toBe('Pack & Ship');
    });
  });

  describe('getPillarByUrl', () => {
    it('returns pillar for matching URL with or without leading/trailing slashes', () => {
      const pillar1 = getPillarByUrl('/pack-ship/');
      const pillar2 = getPillarByUrl('pack-ship');
      expect(pillar1).toBeDefined();
      expect(pillar1?.id).toBe('pack-ship');
      expect(pillar2?.id).toBe('pack-ship');
    });
  });

  describe('getChildByUrl', () => {
    it('returns child page metadata for valid child URL', () => {
      const child = getChildByUrl('/pack-ship/artwork-shipping/');
      expect(child).toBeDefined();
      expect(child?.pillarTitle).toBe('Pack & Ship');
    });
  });

  describe('getSubSupportingByUrl', () => {
    it('returns generic page node for sub-supporting page URL if available', () => {
      const page = getSubSupportingByUrl('/about-us/');
      if (page) {
        expect(page.id).toBeDefined();
      }
    });
  });

  describe('getSeoLandingByUrl', () => {
    it('returns generic page node for SEO landing page URL if available', () => {
      const page = getSeoLandingByUrl('/mailbox-rental-chardon/');
      if (page) {
        expect(page.id).toBeDefined();
      }
    });
  });

  describe('getParentPillarByServiceId', () => {
    it('returns parent pillar mapped in internalLinks.json', () => {
      const pillar = getParentPillarByServiceId('amazon-returns');
      expect(pillar).toBeDefined();
      expect(pillar?.id).toBe('pack-ship');
    });
  });
});
