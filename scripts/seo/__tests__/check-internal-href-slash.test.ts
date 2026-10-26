import { describe, it, expect } from 'vitest';
import {
  checkInternalHrefSlash,
  isBadInternal,
  validateInternalHrefHtml,
} from '../check-internal-href-slash.mjs';

describe('SEO Internal Href Trailing Slash Check', () => {
  describe('isBadInternal', () => {
    it('correctly identifies bad internal URLs lacking trailing slash', () => {
      expect(isBadInternal('/services')).toBe(true);
      expect(isBadInternal('/contact-us')).toBe(true);
    });

    it('correctly exempts valid or non-target URLs', () => {
      expect(isBadInternal('/')).toBe(false);
      expect(isBadInternal('/services/')).toBe(false);
      expect(isBadInternal('/logo.png')).toBe(false);
      expect(isBadInternal('/contact-us#faq')).toBe(false);
      expect(isBadInternal('/search?q=mailbox')).toBe(false);
      expect(isBadInternal('//external.com')).toBe(false);
      expect(isBadInternal('https://example.com')).toBe(false);
    });
  });

  describe('validateInternalHrefHtml', () => {
    it('returns empty array when all internal hrefs have trailing slashes', () => {
      const html = `
        <a href="/services/shipping/">Shipping Services</a>
        <a href="/about-us/">About Us</a>
        <a href="/">Home</a>
      `;
      expect(validateInternalHrefHtml(html)).toEqual([]);
    });

    it('detects internal hrefs missing trailing slashes', () => {
      const html = `
        <a href="/services/shipping">Shipping</a>
        <a href="/about-us/">About Us</a>
        <a href="/contact-us">Contact</a>
      `;
      expect(validateInternalHrefHtml(html)).toEqual(['/services/shipping', '/contact-us']);
    });

    it('ignores anchor tags, query strings, and files in HTML', () => {
      const html = `
        <a href="/services/shipping/#pricing">Pricing Anchor</a>
        <a href="/assets/document.pdf">Download PDF</a>
        <a href="/search?category=mail">Search</a>
      `;
      expect(validateInternalHrefHtml(html)).toEqual([]);
    });
  });

  describe('checkInternalHrefSlash filesystem evaluation', () => {
    it('returns ok: false and clean error message when directory does not exist', () => {
      const res = checkInternalHrefSlash('/tmp/non-existent-dist-dir-12345');
      expect(res.ok).toBe(false);
      expect(res.offenders.size).toBe(0);
      expect(res.error).toContain('does not exist');
    });
  });
});
