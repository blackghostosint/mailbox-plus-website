import { describe, it, expect } from 'vitest';
import { toCanonicalUrlPath, toRouteKey } from './url-normalization';

describe('url-normalization module', () => {
  describe('toCanonicalUrlPath', () => {
    it('normalizes relative paths with trailing slashes', () => {
      expect(toCanonicalUrlPath('pack-ship')).toBe('/pack-ship/');
      expect(toCanonicalUrlPath('/pack-ship')).toBe('/pack-ship/');
      expect(toCanonicalUrlPath('/pack-ship/')).toBe('/pack-ship/');
    });

    it('handles root path and empty inputs', () => {
      expect(toCanonicalUrlPath('/')).toBe('/');
      expect(toCanonicalUrlPath('')).toBe('/');
      expect(toCanonicalUrlPath(null as unknown as string)).toBe('/');
      expect(toCanonicalUrlPath(undefined as unknown as string)).toBe('/');
    });

    it('preserves hash fragments and query strings', () => {
      expect(toCanonicalUrlPath('pack-ship#section')).toBe('/pack-ship/#section');
      expect(toCanonicalUrlPath('/pack-ship?ref=footer')).toBe('/pack-ship/?ref=footer');
      expect(toCanonicalUrlPath('/pack-ship?ref=footer#top')).toBe('/pack-ship/?ref=footer#top');
    });

    it('handles absolute URLs', () => {
      expect(toCanonicalUrlPath('https://mailboxplusohio.com/pack-ship')).toBe('/pack-ship/');
      expect(toCanonicalUrlPath('https://mailboxplusohio.com/pack-ship?ref=footer')).toBe(
        '/pack-ship/?ref=footer'
      );
    });

    it('exempts static asset extensions from trailing slashes', () => {
      expect(toCanonicalUrlPath('/images/logo.webp')).toBe('/images/logo.webp');
      expect(toCanonicalUrlPath('/documents/guide.pdf')).toBe('/documents/guide.pdf');
      expect(toCanonicalUrlPath('/sitemap.xml')).toBe('/sitemap.xml');
    });

    it('deduplicates multiple slashes', () => {
      expect(toCanonicalUrlPath('//pack-ship//subpath')).toBe('/pack-ship/subpath/');
    });
  });

  describe('toRouteKey', () => {
    it('normalizes routes by stripping query strings, hash tags, and trailing slashes', () => {
      expect(toRouteKey('/services/mailbox/')).toBe('/services/mailbox');
      expect(toRouteKey('/contact?src=footer#form')).toBe('/contact');
      expect(toRouteKey('about/us/')).toBe('/about/us');
      expect(toRouteKey('/')).toBe('/');
    });

    it('returns falsy values for empty/falsy inputs', () => {
      expect(toRouteKey('')).toBe('');
      expect(toRouteKey(null as unknown as string)).toBe(null);
      expect(toRouteKey(undefined as unknown as string)).toBe(undefined);
    });

    it('strips absolute domains, html extensions, and query parameters', () => {
      expect(toRouteKey('https://mailboxplusohio.com/pack-ship/?ref=footer#top')).toBe(
        '/pack-ship'
      );
      expect(toRouteKey('/about-us.html')).toBe('/about-us');
      expect(toRouteKey('/pack-ship/index.html')).toBe('/pack-ship/index');
    });
  });
});
