import { describe, it, expect } from 'vitest';
import { getInternalLink, getAnchorText, getBreadcrumbs } from './internal-links';

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

    it('falls back to link title for unknown service', () => {
      const result = getAnchorText('nonexistent');
      expect(result).toBe('nonexistent');
    });

    it('supports different variants', () => {
      const exact = getAnchorText('pack-ship', 'exact');
      const lsi = getAnchorText('pack-ship', 'lsi');
      expect(typeof exact).toBe('string');
      expect(typeof lsi).toBe('string');
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

    it('handles trailing slashes', () => {
      const withSlash = getBreadcrumbs('/pack-ship/');
      const withoutSlash = getBreadcrumbs('/pack-ship');
      expect(withSlash.length).toBe(withoutSlash.length);
    });
  });
});
