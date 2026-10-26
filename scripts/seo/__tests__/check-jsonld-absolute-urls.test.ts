import { describe, it, expect } from 'vitest';
import { checkJsonLdAbsoluteUrls, validateJsonLdContent } from '../check-jsonld-absolute-urls.mjs';

describe('SEO JSON-LD Absolute URLs Check', () => {
  describe('validateJsonLdContent', () => {
    it('passes for JSON-LD blocks with valid absolute http/https URLs', () => {
      const html = `
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://mailboxplusohio.com/#website",
            "url": "https://mailboxplusohio.com/"
          }
        </script>
      `;
      const res = validateJsonLdContent(html);
      expect(res.ok).toBe(true);
      expect(res.failures).toBe(0);
      expect(res.scriptsChecked).toBe(1);
    });

    it('fails for JSON-LD blocks containing relative paths in @id or url', () => {
      const html = `
        <script type="application/ld+json">
          {
            "@type": "Organization",
            "@id": "/#organization",
            "url": "/about-us/"
          }
        </script>
      `;
      const res = validateJsonLdContent(html);
      expect(res.ok).toBe(false);
      expect(res.failures).toBe(2);
      expect(res.scriptsChecked).toBe(1);
    });

    it('fails for invalid or non-http/https protocol URLs', () => {
      const html = `
        <script type="application/ld+json">
          {
            "@type": "Service",
            "url": "ftp://mailboxplusohio.com/service"
          }
        </script>
      `;
      const res = validateJsonLdContent(html);
      expect(res.ok).toBe(false);
      expect(res.failures).toBe(1);
    });

    it('handles nested objects and arrays within JSON-LD', () => {
      const html = `
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": "https://mailboxplusohio.com/services/#webpage",
                "url": "https://mailboxplusohio.com/services/"
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "item": {
                      "@id": "https://mailboxplusohio.com/",
                      "name": "Home"
                    }
                  }
                ]
              }
            ]
          }
        </script>
      `;
      const res = validateJsonLdContent(html);
      expect(res.ok).toBe(true);
      expect(res.failures).toBe(0);
    });

    it('fails for malformed JSON-LD script content', () => {
      const html = `
        <script type="application/ld+json">
          { unquoted_key: "value" }
        </script>
      `;
      const res = validateJsonLdContent(html);
      expect(res.ok).toBe(false);
      expect(res.failures).toBe(1);
      expect(res.scriptsChecked).toBe(1);
    });
  });

  describe('checkJsonLdAbsoluteUrls filesystem evaluation', () => {
    it('returns ok: false and clean error message when directory does not exist', () => {
      const res = checkJsonLdAbsoluteUrls('/tmp/non-existent-dist-dir-12345');
      expect(res.ok).toBe(false);
      expect(res.failures).toBe(0);
      expect(res.error).toContain('does not exist');
    });
  });
});
