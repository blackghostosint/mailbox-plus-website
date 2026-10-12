import { describe, it, expect } from 'vitest';
import {
  normalizeArticleHtmlLinks,
  parseHtmlAttributes,
  serializeHtmlAttributes,
  hasNewTabDisclosure,
  extractAccessibleTextsFromInnerHtml,
  DEFAULT_ARTICLE_LINK_CLASS,
} from './articleHtmlLinks';

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

  it('does not append duplicate screen reader text if link already includes new tab disclosure in text', () => {
    const input =
      '<a href="https://example.com" target="_blank" class="sr-only custom-link">Hidden Link (opens in a new tab)</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result.match(/opens in a new tab/g)).toHaveLength(1);
  });

  it('appends screen reader disclosure when aria-label lacks explicit new tab disclosure', () => {
    const input =
      '<a href="https://example.com" target="_blank" aria-label="Example website">Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toContain('aria-label="Example website (opens in a new tab)"');
    expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('does not append duplicate screen reader disclosure if aria-label already contains new tab disclosure', () => {
    const input =
      '<a href="https://example.com" target="_blank" aria-label="Example website (opens in a new tab)">Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).not.toContain('<span class="sr-only">');
    expect(result).toContain('aria-label="Example website (opens in a new tab)"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('appends screen reader text when aria-labelledby lacks explicit new tab disclosure', () => {
    const input =
      '<a href="https://example.com" target="_blank" aria-labelledby="link-desc">Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    expect(result).toContain('aria-labelledby="link-desc"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('appends screen reader disclosure when aria-labelledby points to an ID without explicit new tab text', () => {
    const input =
      '<a href="https://example.com" target="_blank" aria-labelledby="new-tab-desc">Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    expect(result).toContain('aria-labelledby="new-tab-desc"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('does not append duplicate screen reader disclosure if aria-labelledby target element inside innerHtml contains explicit new tab disclosure', () => {
    const input =
      '<a href="https://example.com" target="_blank" aria-labelledby="new-tab-desc">Link<span id="new-tab-desc" class="sr-only">(opens in a new tab)</span></a>';
    const result = normalizeArticleHtmlLinks(input);

    const matches = result.match(/\(opens in a new tab\)/g);
    expect(matches).toHaveLength(1);
    expect(result).toContain('aria-labelledby="new-tab-desc"');
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

  it('does not duplicate default classes when class already includes custom text-[ class', () => {
    const input = '<a href="/pack-ship/" class="custom-class text-[var(--color-primary)]">Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toBe(
      '<a href="/pack-ship/" class="custom-class text-[var(--color-primary)]">Link</a>'
    );
  });

  it('handles unquoted attribute values and populates default quotes', () => {
    const input =
      '<a href="https://example.com" target="_blank" class=my-link rel=nofollow>Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toContain('class="my-link ' + DEFAULT_ARTICLE_LINK_CLASS + '"');
    expect(result).toContain('rel="nofollow noopener noreferrer"');
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

  it('handles HTML comments containing opening tag candidates correctly', () => {
    const input =
      '<!-- <a href="https://example.com">Comment</a> --> <a href="/real">Real Link</a>';
    const result = normalizeArticleHtmlLinks(input);

    expect(result).toBe(
      `<!-- <a href="https://example.com">Comment</a> --> <a href="/real" class="${DEFAULT_ARTICLE_LINK_CLASS}">Real Link</a>`
    );
  });

  it('handles unclosed opening tag or unclosed closing tag without error', () => {
    const unclosedOpen = 'Text <a href="/test" no closing bracket';
    expect(normalizeArticleHtmlLinks(unclosedOpen)).toBe('Text <a href="/test" no closing bracket');

    const unclosedClose = 'Text <a href="/test">Link without end tag';
    expect(normalizeArticleHtmlLinks(unclosedClose)).toBe(
      'Text <a href="/test">Link without end tag'
    );
  });

  describe('parseHtmlAttributes and serializeHtmlAttributes edge cases', () => {
    it('returns empty array when parsing empty or whitespace attributes', () => {
      expect(parseHtmlAttributes('')).toEqual([]);
      expect(parseHtmlAttributes('   ')).toEqual([]);
    });

    it('parses boolean attributes with null value and serializes them correctly', () => {
      const parsed = parseHtmlAttributes('download href="file.pdf"');
      expect(parsed).toEqual([
        { rawName: 'download', name: 'download', value: null, quote: '' },
        { rawName: 'href', name: 'href', value: 'file.pdf', quote: '"' },
      ]);
      expect(serializeHtmlAttributes(parsed)).toBe(' download href="file.pdf"');
    });

    it('returns empty string when serializing empty attributes array', () => {
      expect(serializeHtmlAttributes([])).toBe('');
    });
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

    it('handles unvalued class, rel, and aria-label attributes on target="_blank" link', () => {
      const input = '<a href="https://example.com" target="_blank" class rel aria-label>Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('aria-label="(opens in a new tab)"');
      expect(result).toContain('rel="noopener noreferrer"');
      expect(result).toContain(`class="${DEFAULT_ARTICLE_LINK_CLASS}"`);
      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
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

  describe('quoted attribute values containing ">" character regression tests', () => {
    it('correctly parses href containing ">" inside double quotes on new-tab link', () => {
      const input = '<a href="https://example.com/?q=>x" target="_blank">Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('href="https://example.com/?q=>x"');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
      expect(result).toContain(`class="${DEFAULT_ARTICLE_LINK_CLASS}"`);
      expect(result).toBe(
        `<a href="https://example.com/?q=>x" target="_blank" class="${DEFAULT_ARTICLE_LINK_CLASS}" rel="noopener noreferrer">Link<span class="sr-only">(opens in a new tab)</span></a>`
      );
    });

    it('correctly parses title containing ">" inside double quotes on internal link', () => {
      const input = '<a title="Go > Next" href="/page">Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('title="Go > Next"');
      expect(result).toContain('href="/page"');
      expect(result).toContain(`class="${DEFAULT_ARTICLE_LINK_CLASS}"`);
      expect(result).not.toContain('rel="noopener noreferrer"');
      expect(result).not.toContain('<span class="sr-only">');
      expect(result).toBe(
        `<a title="Go > Next" href="/page" class="${DEFAULT_ARTICLE_LINK_CLASS}">Link</a>`
      );
    });

    it('correctly parses single-quoted attributes containing ">"', () => {
      const input = "<a href='https://example.com/?q=>x' title='a>b' target='_blank'>Link</a>";
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain("href='https://example.com/?q=>x'");
      expect(result).toContain("title='a>b'");
      expect(result).toContain("target='_blank'");
      expect(result).toContain('rel="noopener noreferrer"');
      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    });
  });

  describe('closing tag parsing and quoted value context regression tests', () => {
    it('handles </a> inside quoted attribute of an inner HTML element without truncating markup', () => {
      const input =
        '<a target="_blank" href="https://example.com"><span data-note="</a>">Link</span></a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toBe(
        `<a target="_blank" href="https://example.com" class="${DEFAULT_ARTICLE_LINK_CLASS}" rel="noopener noreferrer"><span data-note="</a>">Link</span><span class="sr-only">(opens in a new tab)</span></a>`
      );
    });

    it('handles </a> inside single-quoted attribute of an inner HTML element', () => {
      const input =
        "<a target='_blank' href='https://example.com'><span data-note='</a>'>Link</span></a>";
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toBe(
        `<a target='_blank' href='https://example.com' class="${DEFAULT_ARTICLE_LINK_CLASS}" rel="noopener noreferrer"><span data-note='</a>'>Link</span><span class="sr-only">(opens in a new tab)</span></a>`
      );
    });

    it('recognizes closing-tag whitespace such as </a > and normalizes link', () => {
      const input = '<a href="https://example.com" target="_blank">Link</a >';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toBe(
        `<a href="https://example.com" target="_blank" class="${DEFAULT_ARTICLE_LINK_CLASS}" rel="noopener noreferrer">Link<span class="sr-only">(opens in a new tab)</span></a>`
      );
    });

    it('recognizes multiline/extra whitespace in closing tag </a   \\n>', () => {
      const input = '<a href="/page">Link</a   \n>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toBe(`<a href="/page" class="${DEFAULT_ARTICLE_LINK_CLASS}">Link</a>`);
    });

    it('ignores </a> inside HTML comments within the anchor element', () => {
      const input = '<a href="https://example.com" target="_blank">Link <!-- </a> --> content</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toBe(
        `<a href="https://example.com" target="_blank" class="${DEFAULT_ARTICLE_LINK_CLASS}" rel="noopener noreferrer">Link <!-- </a> --> content<span class="sr-only">(opens in a new tab)</span></a>`
      );
    });
  });

  describe('sr-only false positive regression tests and token precision', () => {
    it('does not suppress screen reader disclosure for data-note="sr-only" on inner element', () => {
      const input =
        '<a target="_blank" href="https://example.com"><span data-note="sr-only">Link</span></a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
      expect(result).toBe(
        `<a target="_blank" href="https://example.com" class="${DEFAULT_ARTICLE_LINK_CLASS}" rel="noopener noreferrer"><span data-note="sr-only">Link</span><span class="sr-only">(opens in a new tab)</span></a>`
      );
    });

    it('does not suppress screen reader disclosure when anchor class is "not-sr-only"', () => {
      const input = '<a target="_blank" href="https://example.com" class="not-sr-only">Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
      expect(result).toContain('class="not-sr-only ' + DEFAULT_ARTICLE_LINK_CLASS + '"');
    });

    it('does not suppress screen reader disclosure when inner element class is "not-sr-only"', () => {
      const input =
        '<a target="_blank" href="https://example.com"><span class="not-sr-only">Link</span></a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    });

    it('does not suppress screen reader disclosure when visible inner text contains "sr-only"', () => {
      const input =
        '<a target="_blank" href="https://example.com">Read our sr-only accessibility guide</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    });

    it('does not suppress screen reader disclosure when sr-only element contains unrelated text (e.g. Download icon)', () => {
      const input =
        '<a target="_blank" href="https://example.com"><span class="sr-only">Download icon</span>Link</a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
      expect(result).toBe(
        `<a target="_blank" href="https://example.com" class="${DEFAULT_ARTICLE_LINK_CLASS}" rel="noopener noreferrer"><span class="sr-only">Download icon</span>Link<span class="sr-only">(opens in a new tab)</span></a>`
      );
    });

    it('suppresses duplicate screen reader disclosure when inner element contains existing new tab disclosure text', () => {
      const input =
        '<a target="_blank" href="https://example.com">Link<span class="badge sr-only text-xs">(opens in a new tab)</span></a>';
      const result = normalizeArticleHtmlLinks(input);

      const matches = result.match(/sr-only/g);
      expect(matches).toHaveLength(1);
    });

    it('directly validates hasNewTabDisclosure for existing disclosure text vs unrelated content and attributes', () => {
      const parsedClassNotSrOnly = parseHtmlAttributes('class="not-sr-only"');
      expect(
        hasNewTabDisclosure(parsedClassNotSrOnly, '<span class="sr-only">Download icon</span>Link')
      ).toBe(false);
      expect(hasNewTabDisclosure([], 'Link with sr-only text')).toBe(false);

      const parsedAriaLabelUnrelated = parseHtmlAttributes('aria-label="Example website"');
      expect(hasNewTabDisclosure(parsedAriaLabelUnrelated, 'Link')).toBe(false);

      const parsedAriaLabelledBy = parseHtmlAttributes('aria-labelledby="new-tab-desc"');
      expect(hasNewTabDisclosure(parsedAriaLabelledBy, 'Link')).toBe(false);

      const parsedBoolAria = parseHtmlAttributes('aria-label');
      expect(hasNewTabDisclosure(parsedBoolAria, 'Link')).toBe(false);

      const parsedAriaLabelWithDisclosure = parseHtmlAttributes(
        'aria-label="Example website (opens in a new tab)"'
      );
      expect(hasNewTabDisclosure(parsedAriaLabelWithDisclosure, 'Link')).toBe(true);

      expect(hasNewTabDisclosure([], '<span class="sr-only">(opens in a new tab)</span>')).toBe(
        true
      );
      expect(hasNewTabDisclosure([], 'Open in new window')).toBe(true);

      // Inner alt attribute on img tag
      expect(hasNewTabDisclosure([], 'Link <img src="/icon.png" alt="opens in a new tab" />')).toBe(
        true
      );

      // Inner aria-label attribute on svg tag
      expect(
        hasNewTabDisclosure([], 'Link <svg aria-label="opens in a new tab"><path d=""/></svg>')
      ).toBe(true);

      // Inner title attribute on span tag
      expect(hasNewTabDisclosure([], 'Link <span title="opens in a new tab">Icon</span>')).toBe(
        true
      );

      // False-positive suppressions: data-note, class, id, src, HTML comments must not trigger disclosure
      expect(hasNewTabDisclosure([], '<span data-note="new tab">Link</span>')).toBe(false);
      expect(hasNewTabDisclosure([], '<span class="new-tab-link">Link</span>')).toBe(false);
      expect(hasNewTabDisclosure([], '<span id="new-tab">Link</span>')).toBe(false);
      expect(hasNewTabDisclosure([], '<img src="/images/new-tab.png" alt="icon" />Link')).toBe(
        false
      );
      expect(hasNewTabDisclosure([], 'Link <!-- opens in a new tab -->')).toBe(false);
    });

    it('does not suppress screen reader disclosure for data-note="new tab" on inner element', () => {
      const input =
        '<a target="_blank" href="https://example.com"><span data-note="new tab">Link</span></a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
      expect(result).toBe(
        `<a target="_blank" href="https://example.com" class="${DEFAULT_ARTICLE_LINK_CLASS}" rel="noopener noreferrer"><span data-note="new tab">Link</span><span class="sr-only">(opens in a new tab)</span></a>`
      );
    });

    it('does not suppress screen reader disclosure for HTML comments containing "new tab"', () => {
      const input =
        '<a target="_blank" href="https://example.com">Link <!-- opens in a new tab --></a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    });

    it('does not suppress screen reader disclosure for class="new-tab" or id="new-tab" on inner element', () => {
      const input =
        '<a target="_blank" href="https://example.com"><span id="new-tab" class="new-tab">Link</span></a>';
      const result = normalizeArticleHtmlLinks(input);

      expect(result).toContain('<span class="sr-only">(opens in a new tab)</span>');
    });
  });

  describe('extractAccessibleTextsFromInnerHtml unit tests', () => {
    it('returns empty array when innerHtml is empty or whitespace', () => {
      expect(extractAccessibleTextsFromInnerHtml('')).toEqual([]);
      expect(extractAccessibleTextsFromInnerHtml('   ')).toEqual([]);
    });

    it('extracts plain text and accessible attributes (aria-label, alt, title) while ignoring HTML comments and non-accessible attributes', () => {
      const innerHtml = `
        <!-- HTML Comment: opens in a new tab -->
        <span class="new-tab-class" data-note="new tab">Visible Text</span>
        <img src="/img.png" alt="opens in a new tab" />
        <svg aria-label="opens in a new window"><path d="M0 0" /></svg>
        <span title="opens in new tab">Title Text</span>
      `;

      const extracted = extractAccessibleTextsFromInnerHtml(innerHtml);

      expect(extracted).toContain('Visible Text');
      expect(extracted).toContain('opens in a new tab');
      expect(extracted).toContain('opens in a new window');
      expect(extracted).toContain('opens in new tab');
      expect(extracted).toContain('Title Text');
      expect(extracted).not.toContain('HTML Comment');
      expect(extracted).not.toContain('new-tab-class');
      expect(extracted).not.toContain('data-note');
    });

    it('handles unclosed tag gracefully', () => {
      const innerHtml = 'Text before <span data-attr="test"';
      expect(extractAccessibleTextsFromInnerHtml(innerHtml)).toEqual(['Text before ']);
    });

    it('handles inner tags with boolean or empty accessible attributes', () => {
      const innerHtml = 'Text <span aria-label alt="" title="   ">Label</span>';
      expect(extractAccessibleTextsFromInnerHtml(innerHtml)).toEqual(['Text ', 'Label']);
    });
  });
});
