import { describe, it, expect } from 'vitest';
import {
  getServicesByCategory,
  getPopularServices,
  getServiceById,
  getServiceByHref,
  searchServices,
  sortServicesByName,
  validateService,
} from './services-helpers';
import type { Service, ServiceCategory } from '../types/services';

describe('services-helpers', () => {
  describe('getServicesByCategory', () => {
    it('returns services matching the category', () => {
      const result = getServicesByCategory('pack-ship');
      expect(result.length).toBeGreaterThan(0);
      result.forEach((s) => expect(s.category).toBe('pack-ship'));
    });

    it('returns empty array for unknown category', () => {
      const result = getServicesByCategory('nonexistent' as unknown as ServiceCategory);
      expect(result).toEqual([]);
    });
  });

  describe('getPopularServices', () => {
    it('returns only services marked as popular', () => {
      const result = getPopularServices();
      result.forEach((s) => expect(s.popular).toBe(true));
    });
  });

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
  });

  describe('getServiceByHref', () => {
    it('finds a service by slug', () => {
      const result = getServiceByHref('/amazon-returns');
      expect(result).toBeDefined();
      expect(result?.slug).toBe('/amazon-returns');
    });

    it('returns undefined for unknown slug', () => {
      const result = getServiceByHref('/nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('searchServices', () => {
    it('finds services by name', () => {
      const result = searchServices('shipping');
      expect(result.length).toBeGreaterThan(0);
    });

    it('finds services by keyword', () => {
      const result = searchServices('UPS');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns empty array for no matches', () => {
      const result = searchServices('xyznonexistent123');
      expect(result).toEqual([]);
    });

    it('is case-insensitive', () => {
      const lower = searchServices('shipping');
      const upper = searchServices('SHIPPING');
      expect(lower.length).toBe(upper.length);
    });
  });

  describe('sortServicesByName', () => {
    it('returns services sorted alphabetically', () => {
      const sorted = sortServicesByName();
      for (let i = 1; i < sorted.length; i++) {
        expect(
          sorted[i].serviceName.localeCompare(sorted[i - 1].serviceName)
        ).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('validateService', () => {
    it('returns true for valid service', () => {
      const service = getServiceById('amazon-returns');
      expect(service).toBeDefined();
      expect(validateService(service!)).toBe(true);
    });

    it('returns false for incomplete service', () => {
      expect(validateService({} as Partial<Service> as Service)).toBe(false);
    });

    it('returns false when id is missing', () => {
      const service = getServiceById('amazon-returns');
      expect(validateService({ ...service!, id: '' } as Partial<Service> as Service)).toBe(false);
    });
  });
});
