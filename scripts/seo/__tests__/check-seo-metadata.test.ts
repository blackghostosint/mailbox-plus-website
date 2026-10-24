import { describe, it, expect } from 'vitest';
import { resolveDistDir } from '../../lib/dist-path.mjs';
import { checkSeoMetadata, discoverServiceMetadata, decodeHtml } from '../check-seo-metadata.ts';

describe('SEO Metadata Verification Check', () => {
  const distDir = resolveDistDir();

  it('discovers service metadata rules', () => {
    const { ogImageChecks, imageObjectSchemaChecks } = discoverServiceMetadata();
    expect(ogImageChecks.length).toBeGreaterThan(0);
    expect(imageObjectSchemaChecks.length).toBeGreaterThan(0);
  });

  it('runs seo metadata check on build output directory', () => {
    const res = checkSeoMetadata(distDir);
    expect(res.ok, res.error || 'SEO metadata check failed').toBe(true);
    expect(res.errors).toBe(0);
  });

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
