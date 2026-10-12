import { describe, it, expect } from 'vitest';
import { normalizeArticleHtmlLinks, DEFAULT_ARTICLE_LINK_CLASS } from './articleHtmlLinks';

describe('normalizeArticleHtmlLinks', () => {
  it('returns empty string or original html when input is empty', () => {
    expect(normalizeArticleHtmlLinks('')).toBe('');
  });

  it('transforms raw HTML new-tab links lacking screen reader text', () => {
    const input =
      '<p>Check out <a href="https://example.com" target="_blank">Example</a> for info.</p>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain(`class="${DEFAULT_ARTICLE_LINK_CLASS}"`);
    expect(result).toBe(
      `<p>Check out <a href="https://example.com" target="_blank" class="${DEFAULT_ARTICLE_LINK_CLASS}" rel="noopener noreferrer">Example<span class="sr-only">(opens in a new tab)</span></a> for info.</p>`
    );
  });

  it('updates existing rel attribute to include both noopener and noreferrer', () => {
    const input = '<a href="https://example.com" rel="nofollow noopener" target="_blank">Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toContain('rel="nofollow noopener noreferrer"');
    expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
  });

  it('does not append duplicate screen reader text if sr-only is already present', () => {
    const input =
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link<span class="sr-only">(opens in a new tab)</span></a>';
    const result = normalizeArticleHtmlLinks(input);

    const matches = result.match(/sr-only/g);
    expect(matches).toHaveLength(1);
  });

  it('does not append screen reader text if aria-label is present', () => {
    const input =
      '<a href="https://example.com" target="_blank" aria-label="Example website">Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).not.toContain('<span class="sr-only">');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('does not append screen reader text if aria-labelledby is present', () => {
    const input =
      '<a href="https://example.com" target="_blank" aria-labelledby="link-desc">Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).not.toContain('<span class="sr-only">');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('handles single quotes and attribute formatting correctly', () => {
    const input = "<a href='https://example.com' target='_blank' rel='nofollow'>Link</a>";
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toContain("rel='nofollow noopener noreferrer'");
    expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
  });

  it('adds default styling classes to internal HTML links without target="_blank"', () => {
    const input = '<p>Visit our <a href="/pack-ship/">Pack and Ship</a> section.</p>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toContain(`class="${DEFAULT_ARTICLE_LINK_CLASS}"`);
    expect(result).not.toContain('<span class="sr-only">');
    expect(result).not.toContain('target="_blank"');
  });

  it('handles multiline anchor content and nested HTML elements inside link', () => {
    const input = `<a href="https://example.com" target="_blank">
      <span>Nested Content</span>
    </a>`;
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toContain('<span>Nested Content</span>');
    expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  describe('data-* attribute precision and regression tests', () => {
    it('does not treat data-target="_blank" as a target="_blank" new tab link', () => {
      const input = '<a href="https://example.com" data-target="_blank">Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('data-target="_blank"');
      expect(result).not.toContain('rel="noopener noreferrer"');
      expect(result).not.toContain('<span class="sr-only">');
      expect(result).toContain(`class="${DEFAULT_ARTICLE_LINK_CLASS}"`);
    });

    it('adds rel="noopener noreferrer" to genuine rel when data-rel="nofollow" is present on new-tab link', () => {
      const input = '<a href="https://example.com" target="_blank" data-rel="nofollow">Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('data-rel="nofollow"');
      expect(result).toContain('rel="noopener noreferrer"');
      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    });

    it('does not mutate data-rel="nofollow" into data-rel="nofollow noopener noreferrer"', () => {
      const input =
        '<a href="https://example.com" target="_blank" rel="nofollow" data-rel="custom">Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('rel="nofollow noopener noreferrer"');
      expect(result).toContain('data-rel="custom"');
    });

    it('adds real class attribute when data-class is present', () => {
      const input = '<a href="/test" data-class="custom-data-class">Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('data-class="custom-data-class"');
      expect(result).toContain(`class="${DEFAULT_ARTICLE_LINK_CLASS}"`);
    });

    it('does not suppress screen reader disclosure for data-aria-label', () => {
      const input =
        '<a href="https://example.com" target="_blank" data-aria-label="Ignored">Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
      expect(result).toContain('data-aria-label="Ignored"');
    });

    it('handles links with both data-target="_blank" and genuine target="_blank"', () => {
      const input = '<a href="https://example.com" data-target="_blank" target="_blank">Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('data-target="_blank"');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    });
  });
});
