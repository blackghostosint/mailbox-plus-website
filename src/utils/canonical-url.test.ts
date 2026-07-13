import { describe, it, expect } from 'vitest';
import { normalizePathname, toCanonicalUrl } from './canonical-url';

describe('normalizePathname', () => {
  it('should normalize relative paths', () => {
    expect(normalizePathname('pack-ship')).toBe('/pack-ship/');
    expect(normalizePathname('/pack-ship')).toBe('/pack-ship/');
    expect(normalizePathname('/pack-ship/')).toBe('/pack-ship/');
  });

  it('should normalize root path to a single slash', () => {
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname('')).toBe('/');
  });

  it('should handle and preserve hash fragments', () => {
    expect(normalizePathname('pack-ship#webpage')).toBe('/pack-ship/#webpage');
    expect(normalizePathname('/pack-ship#webpage')).toBe('/pack-ship/#webpage');
    expect(normalizePathname('/pack-ship/#webpage')).toBe('/pack-ship/#webpage');
  });

  it('should preserve query parameters', () => {
    expect(normalizePathname('pack-ship?q=1')).toBe('/pack-ship/?q=1');
    expect(normalizePathname('/pack-ship?q=1#webpage')).toBe('/pack-ship/?q=1#webpage');
  });

  it('should de-duplicate slashes', () => {
    expect(normalizePathname('//pack-ship//subpath')).toBe('/pack-ship/subpath/');
  });
});

describe('toCanonicalUrl', () => {
  it('should prepend origin for relative paths', () => {
    expect(toCanonicalUrl('pack-ship')).toBe('https://mailboxplusohio.com/pack-ship/');
    expect(toCanonicalUrl('/pack-ship')).toBe('https://mailboxplusohio.com/pack-ship/');
    expect(toCanonicalUrl('/pack-ship/')).toBe('https://mailboxplusohio.com/pack-ship/');
  });

  it('should return external URLs completely untouched', () => {
    expect(toCanonicalUrl('https://www.facebook.com/mailboxplusohio')).toBe(
      'https://www.facebook.com/mailboxplusohio'
    );
    expect(toCanonicalUrl('https://maps.app.goo.gl/Rs1NQkR6gRrtxAq37')).toBe(
      'https://maps.app.goo.gl/Rs1NQkR6gRrtxAq37'
    );
  });

  it('should handle home and origin root properly', () => {
    expect(toCanonicalUrl('/')).toBe('https://mailboxplusohio.com/');
    expect(toCanonicalUrl('')).toBe('https://mailboxplusohio.com/');
  });

  it('should handle pure origin fragment IDs precisely without forcing trailing slash', () => {
    expect(toCanonicalUrl('https://mailboxplusohio.com#localbusiness')).toBe(
      'https://mailboxplusohio.com#localbusiness'
    );
  });

  it('should force trailing slash before non-origin webpage hash fragments', () => {
    expect(toCanonicalUrl('https://mailboxplusohio.com/pack-ship#webpage')).toBe(
      'https://mailboxplusohio.com/pack-ship/#webpage'
    );
  });
});
