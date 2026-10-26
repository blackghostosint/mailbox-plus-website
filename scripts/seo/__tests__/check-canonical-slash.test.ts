import { describe, it, expect } from 'vitest';
import { checkCanonicalSlash, validateCanonicalHtml } from '../check-canonical-slash.mjs';

describe('SEO Canonical Trailing Slash Check', () => {
  describe('validateCanonicalHtml', () => {
    it('passes for valid canonical URL with trailing slash on target host', () => {
      const html = `
        <html>
          <head>
            <link rel="canonical" href="https://mailboxplusohio.com/services/shipping/" />
          </head>
        </html>
      `;
      const res = validateCanonicalHtml(html, 'mailboxplusohio.com');
      expect(res.ok).toBe(true);
      expect(res.failures).toBe(0);
    });

    it('passes for root canonical URL https://mailboxplusohio.com/', () => {
      const html = `
        <link rel="canonical" href="https://mailboxplusohio.com/" />
      `;
      const res = validateCanonicalHtml(html, 'mailboxplusohio.com');
      expect(res.ok).toBe(true);
      expect(res.failures).toBe(0);
    });

    it('fails for canonical URL missing trailing slash on target host', () => {
      const html = `
        <link rel="canonical" href="https://mailboxplusohio.com/services/shipping" />
      `;
      const res = validateCanonicalHtml(html, 'mailboxplusohio.com');
      expect(res.ok).toBe(false);
      expect(res.failures).toBe(1);
    });

    it('ignores canonical URLs for non-target hosts', () => {
      const html = `
        <link rel="canonical" href="https://otherdomain.com/no-slash" />
      `;
      const res = validateCanonicalHtml(html, 'mailboxplusohio.com');
      expect(res.ok).toBe(true);
      expect(res.failures).toBe(0);
    });

    it('fails for malformed or non-http/https canonical URLs', () => {
      const html = `
        <link rel="canonical" href="ftp://mailboxplusohio.com/services/" />
      `;
      const res = validateCanonicalHtml(html, 'mailboxplusohio.com');
      expect(res.ok).toBe(false);
      expect(res.failures).toBe(1);
    });

    it('passes for valid JSON-LD @id and url with trailing slash', () => {
      const html = `
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://mailboxplusohio.com/about/",
            "url": "https://mailboxplusohio.com/about/"
          }
        </script>
      `;
      const res = validateCanonicalHtml(html, 'mailboxplusohio.com');
      expect(res.ok).toBe(true);
      expect(res.failures).toBe(0);
    });

    it('fails for JSON-LD url missing trailing slash on target host', () => {
      const html = `
        <script type="application/ld+json">
          {
            "@type": "WebPage",
            "url": "https://mailboxplusohio.com/about"
          }
        </script>
      `;
      const res = validateCanonicalHtml(html, 'mailboxplusohio.com');
      expect(res.ok).toBe(false);
      expect(res.failures).toBe(1);
    });

    it('allows image file extensions in JSON-LD url/id without trailing slash', () => {
      const html = `
        <script type="application/ld+json">
          {
            "@type": "ImageObject",
            "url": "https://mailboxplusohio.com/images/logo.png"
          }
        </script>
      `;
      const res = validateCanonicalHtml(html, 'mailboxplusohio.com');
      expect(res.ok).toBe(true);
      expect(res.failures).toBe(0);
    });

    it('fails for malformed JSON-LD script tags', () => {
      const html = `
        <script type="application/ld+json">
          { invalid json }
        </script>
      `;
      const res = validateCanonicalHtml(html, 'mailboxplusohio.com');
      expect(res.ok).toBe(false);
      expect(res.failures).toBe(1);
    });
  });

  describe('checkCanonicalSlash filesystem evaluation', () => {
    it('returns ok: false and clean error message when directory does not exist', () => {
      const res = checkCanonicalSlash('/tmp/non-existent-dist-dir-12345');
      expect(res.ok).toBe(false);
      expect(res.failures).toBe(0);
      expect(res.error).toContain('does not exist');
    });
  });
});
