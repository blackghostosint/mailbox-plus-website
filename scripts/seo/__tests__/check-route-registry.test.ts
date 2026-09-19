import { describe, it, expect } from 'vitest';
import {
  normalizePath,
  isPathAllowedOrphan,
  checkRouteRegistry,
} from '../check-route-registry.mjs';

describe('check-route-registry', () => {
  describe('normalizePath', () => {
    it('normalizes various raw route paths', () => {
      expect(normalizePath('https://mailboxplusohio.com/pack-ship/')).toBe('/pack-ship');
      expect(normalizePath('/pack-ship/index.html')).toBe('/pack-ship/index');
      expect(normalizePath('about-us.html')).toBe('/about-us');
      expect(normalizePath('/contact-us/')).toBe('/contact-us');
      expect(normalizePath('/')).toBe('/');
      expect(normalizePath('')).toBe('');
    });
  });

  describe('isPathAllowedOrphan', () => {
    it('returns true for default exact allowed routes', () => {
      expect(isPathAllowedOrphan('/contact-us')).toBe(true);
      expect(isPathAllowedOrphan('/privacy/')).toBe(true);
      expect(isPathAllowedOrphan('/404')).toBe(true);
    });

    it('returns true for allowed prefix paths like /articles and /service-area', () => {
      expect(isPathAllowedOrphan('/articles/ups-guide')).toBe(true);
      expect(isPathAllowedOrphan('/service-area/concord-township')).toBe(true);
    });

    it('returns true for custom allowlist entries', () => {
      expect(isPathAllowedOrphan('/custom-city-landing', ['/custom-city-landing'])).toBe(true);
    });

    it('returns false for unknown unlisted orphan routes', () => {
      expect(isPathAllowedOrphan('/unknown-unlisted-route')).toBe(false);
    });
  });

  describe('checkRouteRegistry evaluation logic', () => {
    it('returns success: false if distDir does not exist', () => {
      const res = checkRouteRegistry({ distDir: '/tmp/non-existent-dist-dir' });
      expect(res.success).toBe(false);
      expect(res.error).toContain('Build output directory');
    });
  });
});
