import { describe, it, expect } from 'vitest';
import { decodeHtml } from '../check-seo-metadata';

describe('check-seo-metadata', () => {
  describe('decodeHtml', () => {
    it('decodes standard HTML entities correctly', () => {
      expect(decodeHtml('Mailbox &amp; Shipping')).toBe('Mailbox & Shipping');
      expect(decodeHtml('&lt;div&gt;')).toBe('<div>');
      expect(decodeHtml('&quot;Hello&quot;')).toBe('"Hello"');
      expect(decodeHtml('It&#39;s or &#x27;s')).toBe("It's or 's");
    });

    it('prevents double-unescaping bugs', () => {
      expect(decodeHtml('&amp;lt;')).toBe('&lt;');
      expect(decodeHtml('&amp;quot;')).toBe('&quot;');
    });

    it('leaves unencoded text intact', () => {
      expect(decodeHtml('Mailbox Plus Ohio')).toBe('Mailbox Plus Ohio');
    });
  });
});
