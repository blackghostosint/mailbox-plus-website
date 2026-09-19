import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  normalizePath,
  isSeoLandingFile,
  auditInternalLinkStrategy,
} from '../check-internal-link-strategy.mjs';

const CONFIG_DIR = path.resolve(__dirname, '../../../astro/src/config/services');

describe('check-internal-link-strategy', () => {
  describe('normalizePath', () => {
    it('strips query parameters, fragment identifiers, and trailing slashes', () => {
      expect(normalizePath('/services/shipping/?ref=footer#top')).toBe('/services/shipping');
      expect(normalizePath('https://mailboxplusohio.com/notary/index.html?param=1')).toBe(
        '/notary/index'
      );
      expect(normalizePath('contact-us/')).toBe('/contact-us');
      expect(normalizePath('/')).toBe('/');
    });
  });

  describe('isSeoLandingFile', () => {
    it('identifies files under competitive/ or matching SEO landing filenames', () => {
      expect(
        isSeoLandingFile(path.join(CONFIG_DIR, 'competitive/ups-vs-usps.ts'), CONFIG_DIR)
      ).toBe(true);
      expect(isSeoLandingFile(path.join(CONFIG_DIR, 'local-seo.ts'), CONFIG_DIR)).toBe(true);
      expect(isSeoLandingFile(path.join(CONFIG_DIR, 'gsc-landing-pages.ts'), CONFIG_DIR)).toBe(
        true
      );
    });

    it('returns false for core service configuration files', () => {
      expect(isSeoLandingFile(path.join(CONFIG_DIR, 'pack-ship.ts'), CONFIG_DIR)).toBe(false);
      expect(isSeoLandingFile(path.join(CONFIG_DIR, 'mailbox-rentals.ts'), CONFIG_DIR)).toBe(false);
    });
  });

  describe('auditInternalLinkStrategy evaluation', () => {
    it('audits internal link strategy with provided mock structures', () => {
      const mockSiteStructure = {
        homepage: { url: '/', id: 'homepage' },
        pillars: [
          {
            id: 'pack-ship',
            url: '/pack-ship',
            children: [{ id: 'ups-shipping', url: '/ups-shipping' }],
          },
        ],
      };

      const mockInternalLinks = {
        'ups-shipping': {
          related: ['pack-ship'],
          parent: 'homepage',
        },
      };

      const result = auditInternalLinkStrategy({
        siteStructure: mockSiteStructure,
        internalLinks: mockInternalLinks,
      });

      expect(result.knownRoutesCount).toBeGreaterThanOrEqual(2);
      expect(result.internalLinkKeysCount).toBe(1);
    });
  });
});
