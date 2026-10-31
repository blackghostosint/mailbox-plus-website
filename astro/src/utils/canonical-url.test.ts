/* global process */
import { describe, it, expect } from 'vitest';
import {
  normalizeContentHeadings,
  normalizeContentHrefs,
  normalizeContentTables,
  normalizeTableContainers,
  normalizePathname,
  toCanonicalUrl,
} from './canonical-url';

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

  it('should resolve canonical URL using provided origin in staging/preview environments', () => {
    expect(
      toCanonicalUrl('/happy-returns-fairport-harbor', 'https://staging.mailboxplusohio.com')
    ).toBe('https://staging.mailboxplusohio.com/happy-returns-fairport-harbor/');
  });

  it('should automatically resolve canonical URL from environment variables without explicit origin argument', () => {
    const originalSiteUrl = process.env.SITE_URL;
    const originalDeployPrimeUrl = process.env.DEPLOY_PRIME_URL;
    const originalUrl = process.env.URL;
    const originalContext = process.env.CONTEXT;

    try {
      // 1. Explicit SITE_URL override
      process.env.SITE_URL = 'https://staging.mailboxplusohio.com';
      expect(toCanonicalUrl('/happy-returns-fairport-harbor/')).toBe(
        'https://staging.mailboxplusohio.com/happy-returns-fairport-harbor/'
      );

      delete process.env.SITE_URL;

      // 2. Production context with generic URL set: mailboxplusohio.com wins
      process.env.CONTEXT = 'production';
      process.env.URL = 'https://mailboxplus.netlify.app';
      expect(toCanonicalUrl('/dhl-drop-off-chardon/')).toBe(
        'https://mailboxplusohio.com/dhl-drop-off-chardon/'
      );

      // 3. Default context (unset) with generic URL set: mailboxplusohio.com wins
      delete process.env.CONTEXT;
      process.env.URL = 'https://mailboxplus.netlify.app';
      expect(toCanonicalUrl('/dhl-drop-off-chardon/')).toBe(
        'https://mailboxplusohio.com/dhl-drop-off-chardon/'
      );

      // 4. Preview context with DEPLOY_PRIME_URL / URL set
      process.env.CONTEXT = 'deploy-preview';
      process.env.DEPLOY_PRIME_URL = 'https://deploy-preview-123--mailboxplus.netlify.app';
      expect(toCanonicalUrl('/dhl-drop-off-chardon/')).toBe(
        'https://deploy-preview-123--mailboxplus.netlify.app/dhl-drop-off-chardon/'
      );

      delete process.env.DEPLOY_PRIME_URL;
      process.env.URL = 'https://deploy-preview-123--mailboxplus.netlify.app';
      expect(toCanonicalUrl('/dhl-drop-off-chardon/')).toBe(
        'https://deploy-preview-123--mailboxplus.netlify.app/dhl-drop-off-chardon/'
      );
    } finally {
      if (originalSiteUrl !== undefined) process.env.SITE_URL = originalSiteUrl;
      else delete process.env.SITE_URL;

      if (originalDeployPrimeUrl !== undefined)
        process.env.DEPLOY_PRIME_URL = originalDeployPrimeUrl;
      else delete process.env.DEPLOY_PRIME_URL;

      if (originalUrl !== undefined) process.env.URL = originalUrl;
      else delete process.env.URL;

      if (originalContext !== undefined) process.env.CONTEXT = originalContext;
      else delete process.env.CONTEXT;
    }
  });
});

describe('normalizeContentHrefs', () => {
  it('adds trailing slash to internal no-slash hrefs', () => {
    const html = '<a href="/pack-ship/fedex-shipping">FedEx</a> <a href="/contact-us">Contact</a>';
    expect(normalizeContentHrefs(html)).toBe(
      '<a href="/pack-ship/fedex-shipping/">FedEx</a> <a href="/contact-us/">Contact</a>'
    );
  });

  it('leaves already-slash hrefs untouched', () => {
    const html = '<a href="/pack-ship/">Pack</a> <a href="/">Home</a>';
    expect(normalizeContentHrefs(html)).toBe(html);
  });

  it('leaves external, anchor, and protocol-relative URLs untouched', () => {
    const html =
      '<a href="https://example.com/x">Ext</a> <a href="#section">Anchor</a> <a href="//cdn.example.com/a">CDN</a>';
    expect(normalizeContentHrefs(html)).toBe(html);
  });

  it('leaves file, query, and hash hrefs untouched', () => {
    const html =
      '<a href="/images/logo.webp">Img</a> <a href="/guide?q=1">Q</a> <a href="/tracking#x">Hash</a>';
    expect(normalizeContentHrefs(html)).toBe(html);
  });
});

describe('normalizeContentHeadings', () => {
  it('replaces plain h4 tags with h3 tags', () => {
    const input = '<h4>Section Title</h4>';
    expect(normalizeContentHeadings(input)).toBe('<h3>Section Title</h3>');
  });

  it('preserves CSS classes, inline styles, and HTML attributes on h4 tags', () => {
    const input =
      '<h4 class="font-bold text-[var(--color-text-primary)] mb-2" style="color: red;" id="feature-1">Carriers Limit Liability</h4>';
    const expected =
      '<h3 class="font-bold text-[var(--color-text-primary)] mb-2" style="color: red;" id="feature-1">Carriers Limit Liability</h3>';
    expect(normalizeContentHeadings(input)).toBe(expected);
  });

  it('handles uppercase tag names', () => {
    const input = '<H4 CLASS="title">Uppercase Header</H4>';
    expect(normalizeContentHeadings(input)).toBe('<h3 CLASS="title">Uppercase Header</h3>');
  });

  it('replaces multiple h4 elements within a single HTML string', () => {
    const input = '<div><h4 class="a">First</h4><p>Text</p><h4 class="b">Second</h4></div>';
    const expected = '<div><h3 class="a">First</h3><p>Text</p><h3 class="b">Second</h3></div>';
    expect(normalizeContentHeadings(input)).toBe(expected);
  });

  it('leaves html without h4 tags untouched', () => {
    const input = '<h2>Heading 2</h2><h3>Heading 3</h3><p>Paragraph</p>';
    expect(normalizeContentHeadings(input)).toBe(input);
  });

  it('does not replace tag names that happen to start with h4 like h40', () => {
    const input = '<h40>Not an H4 tag</h40>';
    expect(normalizeContentHeadings(input)).toBe(input);
  });

  it('handles empty or falsy values gracefully', () => {
    expect(normalizeContentHeadings('')).toBe('');
    expect(normalizeContentHeadings(null as unknown as string)).toBe(null);
    expect(normalizeContentHeadings(undefined as unknown as string)).toBe(undefined);
  });
});

describe('normalizeContentTables', () => {
  it('adds tabindex="0", role="region", and aria-label to table containers matching .overflow-x-auto', () => {
    const input =
      '<div class="overflow-x-auto my-6"><table class="w-full"><thead><tr><th scope="col">Plan</th></tr></thead><tbody><tr><td>Basic</td></tr></tbody></table></div>';
    const expected =
      '<div class="overflow-x-auto my-6" tabindex="0" role="region" aria-label="Scrollable table"><table class="w-full"><thead><tr><th scope="col">Plan</th></tr></thead><tbody><tr><td>Basic</td></tr></tbody></table></div>';
    expect(normalizeContentTables(input)).toBe(expected);
  });

  it('preserves all existing inner table elements, scopes, and CSS classes', () => {
    const input =
      '<div class="overflow-x-auto"><table class="min-w-full text-left border-collapse"><thead><tr><th scope="col" class="p-4 font-bold">Col 1</th></tr></thead><tbody><tr><th scope="row" class="font-medium">Row 1</th><td class="text-sm">Data</td></tr></tbody></table></div>';
    const result = normalizeContentTables(input);
    expect(result).toContain('tabindex="0"');
    expect(result).toContain('role="region"');
    expect(result).toContain('aria-label="Scrollable table"');
    expect(result).toContain('<table class="min-w-full text-left border-collapse">');
    expect(result).toContain('<th scope="col" class="p-4 font-bold">Col 1</th>');
    expect(result).toContain('<th scope="row" class="font-medium">Row 1</th>');
    expect(result).toContain('<td class="text-sm">Data</td>');
  });

  it('does not alter existing attributes when container already includes tabindex', () => {
    const input1 =
      '<div class="overflow-x-auto" tabindex="0"><table class="w-full"><tr><td>A</td></tr></table></div>';
    expect(normalizeContentTables(input1)).toBe(input1);

    const input2 =
      '<div class="overflow-x-auto" tabindex="-1" role="group"><table class="w-full"><tr><td>B</td></tr></table></div>';
    expect(normalizeContentTables(input2)).toBe(input2);
  });

  it('preserves existing aria-label or aria-labelledby when adding tabindex and role', () => {
    const input =
      '<div class="overflow-x-auto" aria-label="Lake County Mailbox Pricing"><table class="w-full"><tr><td>A</td></tr></table></div>';
    const expected =
      '<div class="overflow-x-auto" aria-label="Lake County Mailbox Pricing" tabindex="0" role="region"><table class="w-full"><tr><td>A</td></tr></table></div>';
    expect(normalizeContentTables(input)).toBe(expected);
  });

  it('preserves existing role when adding tabindex and aria-label', () => {
    const input =
      '<div class="overflow-x-auto" role="group"><table class="w-full"><tr><td>A</td></tr></table></div>';
    const expected =
      '<div class="overflow-x-auto" role="group" tabindex="0" aria-label="Scrollable table"><table class="w-full"><tr><td>A</td></tr></table></div>';
    expect(normalizeContentTables(input)).toBe(expected);
  });

  it('uses table caption for aria-label if caption element is present', () => {
    const input =
      '<div class="overflow-x-auto"><table><caption>Monthly Box Rental Rates</caption><tr><td>A</td></tr></table></div>';
    const expected =
      '<div class="overflow-x-auto" tabindex="0" role="region" aria-label="Monthly Box Rental Rates"><table><caption>Monthly Box Rental Rates</caption><tr><td>A</td></tr></table></div>';
    expect(normalizeContentTables(input)).toBe(expected);
  });

  it('allows specifying a custom defaultLabel', () => {
    const input = '<div class="overflow-x-auto"><table><tr><td>A</td></tr></table></div>';
    const expected =
      '<div class="overflow-x-auto" tabindex="0" role="region" aria-label="Pricing comparison"><table><tr><td>A</td></tr></table></div>';
    expect(normalizeContentTables(input, 'Pricing comparison')).toBe(expected);
  });

  it('passes non-scrollable content blocks without tables through unmodified', () => {
    const input = '<p>Simple paragraph with <a href="/services/">link</a>.</p>';
    expect(normalizeContentTables(input)).toBe(input);
  });

  it('passes non-scrollable content blocks with tables through unmodified if not matching .overflow-x-auto', () => {
    const input =
      '<div class="static-wrapper"><table class="w-full"><tr><td>A</td></tr></table></div>';
    expect(normalizeContentTables(input)).toBe(input);
  });

  it('does not normalize .overflow-x-auto containers that do not enclose a table', () => {
    const input = '<div class="overflow-x-auto"><p>Just a list or text block</p></div>';
    expect(normalizeContentTables(input)).toBe(input);
  });

  it('handles multiple table containers in a single content string', () => {
    const input =
      '<p>Intro</p><div class="overflow-x-auto"><table><tr><td>First</td></tr></table></div><p>Between</p><div class="overflow-x-auto my-4"><table><tr><td>Second</td></tr></table></div>';
    const result = normalizeContentTables(input);
    expect(result).toContain(
      '<div class="overflow-x-auto" tabindex="0" role="region" aria-label="Scrollable table"><table><tr><td>First</td></tr></table></div>'
    );
    expect(result).toContain(
      '<div class="overflow-x-auto my-4" tabindex="0" role="region" aria-label="Scrollable table"><table><tr><td>Second</td></tr></table></div>'
    );
    expect(result).toContain('<p>Intro</p>');
    expect(result).toContain('<p>Between</p>');
  });

  it('handles empty or falsy values gracefully', () => {
    expect(normalizeContentTables('')).toBe('');
    expect(normalizeContentTables(null as unknown as string)).toBe(null);
    expect(normalizeContentTables(undefined as unknown as string)).toBe(undefined);
  });

  it('provides normalizeTableContainers as an alias', () => {
    expect(normalizeTableContainers).toBe(normalizeContentTables);
  });
});
