import { describe, it, expect } from 'vitest';
import {
  checkSeoMetadata,
  discoverServiceMetadata,
  decodeHtml,
  validateBaseLayoutProps,
  validateHtmlTitleAndDescription,
  validateOgImageMeta,
  validateImageObjectSchema,
} from '../check-seo-metadata.ts';

describe('SEO Metadata Verification Check', () => {
  it('discovers service metadata rules', () => {
    const { ogImageChecks, imageObjectSchemaChecks } = discoverServiceMetadata();
    expect(ogImageChecks.length).toBeGreaterThan(0);
    expect(imageObjectSchemaChecks.length).toBeGreaterThan(0);
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

  describe('validateBaseLayoutProps', () => {
    it('passes when BaseLayout has no inline title or description props', () => {
      const astroContent = `<BaseLayout metaKey="/contact-us/"><div>Content</div></BaseLayout>`;
      const res = validateBaseLayoutProps(astroContent);
      expect(res.ok).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it('fails when BaseLayout uses inline title or description props', () => {
      const astroContent = `<BaseLayout title="Contact Us" description="Get in touch"><div>Content</div></BaseLayout>`;
      const res = validateBaseLayoutProps(astroContent);
      expect(res.ok).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateHtmlTitleAndDescription', () => {
    it('passes when HTML title, description, and JSON-LD match expected meta', () => {
      const html = `
        <html>
          <head>
            <title>Mailbox &amp; Shipping Services</title>
            <meta name="description" content="Professional mailbox rentals &amp; shipping." />
            <script type="application/ld+json">
              {
                "@type": "WebPage",
                "name": "Mailbox & Shipping Services",
                "description": "Professional mailbox rentals & shipping."
              }
            </script>
          </head>
        </html>
      `;
      const meta = {
        title: 'Mailbox & Shipping Services',
        description: 'Professional mailbox rentals & shipping.',
      };
      const res = validateHtmlTitleAndDescription(html, meta);
      expect(res.ok).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it('fails when HTML title or description differs from expected meta', () => {
      const html = `
        <html>
          <head>
            <title>Wrong Title</title>
            <meta name="description" content="Wrong description" />
          </head>
        </html>
      `;
      const meta = {
        title: 'Mailbox & Shipping Services',
        description: 'Professional mailbox rentals & shipping.',
      };
      const res = validateHtmlTitleAndDescription(html, meta);
      expect(res.ok).toBe(false);
      expect(res.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('validateOgImageMeta', () => {
    it('returns true when og:image meta tag matches expected image path', () => {
      const html = `<meta property="og:image" content="https://example.com/og-shipping.png" />`;
      expect(validateOgImageMeta(html, 'og-shipping.png')).toBe(true);
    });

    it('returns false when og:image tag is missing or mismatched', () => {
      const html = `<meta property="og:image" content="https://example.com/other.png" />`;
      expect(validateOgImageMeta(html, 'og-shipping.png')).toBe(false);
    });
  });

  describe('validateImageObjectSchema', () => {
    it('returns true when HTML contains ImageObject schema', () => {
      const html = `<script type="application/ld+json">{"@type":"ImageObject"}</script>`;
      expect(validateImageObjectSchema(html)).toBe(true);
    });

    it('returns false when ImageObject schema is missing', () => {
      const html = `<script type="application/ld+json">{"@type":"WebPage"}</script>`;
      expect(validateImageObjectSchema(html)).toBe(false);
    });
  });

  describe('checkSeoMetadata filesystem evaluation', () => {
    it('returns ok: false and clean error message when directory does not exist', () => {
      const res = checkSeoMetadata('/tmp/non-existent-dist-dir-12345');
      expect(res.ok).toBe(false);
      expect(res.errors).toBe(0);
      expect(res.error).toContain('does not exist');
    });
  });
});
