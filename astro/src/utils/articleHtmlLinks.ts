export const DEFAULT_ARTICLE_LINK_CLASS =
  'text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] underline decoration-[var(--color-border-blue)] underline-offset-2';

interface ParsedAttr {
  rawName: string;
  name: string;
  value: string | null;
  quote: string;
}

/**
 * Parses raw HTML attribute string of an element into individual attribute tokens.
 */
export function parseHtmlAttributes(attrsStr: string): ParsedAttr[] {
  if (!attrsStr || !attrsStr.trim()) return [];

  const attrRegex = /(?:^|\s+)([^\s=/>"']+)(?:\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+)))?/g;
  const attributes: ParsedAttr[] = [];
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(attrsStr)) !== null) {
    const rawName = match[1];
    const name = rawName.toLowerCase();
    const quote = match[2] || '';
    const value = match[2] !== undefined ? match[3] : match[4] !== undefined ? match[4] : null;

    attributes.push({ rawName, name, value, quote });
  }

  return attributes;
}

/**
 * Serializes parsed HTML attribute tokens back to an HTML attribute string.
 */
export function serializeHtmlAttributes(attributes: ParsedAttr[]): string {
  if (attributes.length === 0) return '';

  const parts = attributes.map((attr) => {
    if (attr.value === null) {
      return attr.rawName;
    }
    const q = attr.quote || '"';
    return `${attr.rawName}=${q}${attr.value}${q}`;
  });

  return ' ' + parts.join(' ');
}

/**
 * Locates the next opening <a ...> tag starting at or after startIndex in html.
 * Respects single and double quotes and HTML comments so that '>' characters inside
 * quoted attribute values do not prematurely close the opening tag.
 */
function findOpeningAnchorTag(
  html: string,
  startIndex: number
): { tagStartIndex: number; openTagEndIndex: number; attrsStr: string } | null {
  let inComment = false;

  for (let i = startIndex; i < html.length; i++) {
    if (inComment) {
      if (html.substring(i, i + 3) === '-->') {
        inComment = false;
        i += 2;
      }
      continue;
    }

    if (html.substring(i, i + 4) === '<!--') {
      inComment = true;
      i += 3;
      continue;
    }

    if (html[i] === '<' && /^<a\b/i.test(html.substring(i))) {
      const tagStartIndex = i;
      let inQuote: string | null = null;
      let openTagEndIndex = -1;

      for (let j = tagStartIndex + 2; j < html.length; j++) {
        const char = html[j];
        if (inQuote) {
          if (char === inQuote) {
            inQuote = null;
          }
        } else {
          if (char === '"' || char === "'") {
            inQuote = char;
          } else if (char === '>') {
            openTagEndIndex = j;
            break;
          }
        }
      }

      if (openTagEndIndex !== -1) {
        const attrsStr = html.substring(tagStartIndex + 2, openTagEndIndex);
        return { tagStartIndex, openTagEndIndex, attrsStr };
      }
    }
  }

  return null;
}

/**
 * Locates the matching closing anchor tag (e.g. </a> or </a >) starting at startIndex in html.
 * Tracks HTML context (tags, quotes, comments) so that literal </a> substrings inside quoted
 * attribute values or HTML comments (e.g. <span data-note="</a>">) are ignored.
 */
function findClosingAnchorTag(
  html: string,
  startIndex: number
): { closeTagStartIndex: number; closeTagEndIndex: number } | null {
  let inQuote: string | null = null;
  let inTag = false;
  let inComment = false;

  for (let i = startIndex; i < html.length; i++) {
    if (inComment) {
      if (html.substring(i, i + 3) === '-->') {
        inComment = false;
        i += 2;
      }
      continue;
    }

    if (inTag) {
      if (inQuote) {
        if (html[i] === inQuote) {
          inQuote = null;
        }
      } else {
        if (html[i] === '"' || html[i] === "'") {
          inQuote = html[i];
        } else if (html[i] === '>') {
          inTag = false;
        }
      }
      continue;
    }

    if (html.substring(i, i + 4) === '<!--') {
      inComment = true;
      i += 3;
      continue;
    }

    if (html[i] === '<') {
      const closingMatch = /^<\/a\s*>/i.exec(html.substring(i));
      if (closingMatch) {
        return {
          closeTagStartIndex: i,
          closeTagEndIndex: i + closingMatch[0].length,
        };
      }
      inTag = true;
    }
  }

  return null;
}

/**
 * Inspects rendered article HTML content and transforms raw HTML anchor tags.
 * Ensures external/new-tab links (`target="_blank"`) contain security attributes (`rel="noopener noreferrer"`),
 * screen reader disclosure (`<span class="sr-only">(opens in a new tab)</span>`), and default styling classes.
 */
export function normalizeArticleHtmlLinks(html: string): string {
  if (!html) return html;

  let result = '';
  let currentIndex = 0;

  while (currentIndex < html.length) {
    const openingTag = findOpeningAnchorTag(html, currentIndex);
    if (!openingTag) {
      result += html.substring(currentIndex);
      break;
    }

    // Append everything preceding this opening tag
    result += html.substring(currentIndex, openingTag.tagStartIndex);

    // Search for the matching closing anchor tag following openingTag.openTagEndIndex
    const closingTag = findClosingAnchorTag(html, openingTag.openTagEndIndex + 1);

    if (!closingTag) {
      // If no matching </a> tag is found, append opening tag as-is and continue
      result += html.substring(openingTag.tagStartIndex, openingTag.openTagEndIndex + 1);
      currentIndex = openingTag.openTagEndIndex + 1;
      continue;
    }

    const { closeTagStartIndex, closeTagEndIndex } = closingTag;
    let innerHtml = html.substring(openingTag.openTagEndIndex + 1, closeTagStartIndex);

    const attributes = parseHtmlAttributes(openingTag.attrsStr);

    // 1. Check if link opens in a new tab (exact 'target' attribute equal to '_blank')
    const targetAttr = attributes.find((a) => a.name === 'target');
    const isNewTab = targetAttr?.value?.trim().toLowerCase() === '_blank';

    // 2. Ensure default styling classes are present on exact 'class' attribute
    const classAttr = attributes.find((a) => a.name === 'class');
    if (!classAttr) {
      attributes.push({
        rawName: 'class',
        name: 'class',
        value: DEFAULT_ARTICLE_LINK_CLASS,
        quote: '"',
      });
    } else {
      const existingClasses = classAttr.value ?? '';
      if (!existingClasses.includes('text-[')) {
        const updatedClasses = `${existingClasses} ${DEFAULT_ARTICLE_LINK_CLASS}`.trim();
        classAttr.value = updatedClasses;
        if (!classAttr.quote) classAttr.quote = '"';
      }
    }

    // 3. Handle target="_blank" links (rel & screen reader text)
    if (isNewTab) {
      // Ensure exact 'rel' attribute contains noopener and noreferrer
      const relAttr = attributes.find((a) => a.name === 'rel');
      if (!relAttr) {
        attributes.push({
          rawName: 'rel',
          name: 'rel',
          value: 'noopener noreferrer',
          quote: '"',
        });
      } else {
        const rawRel = relAttr.value ?? '';
        const currentRelTokens = rawRel.split(/\s+/).filter(Boolean);
        if (!currentRelTokens.includes('noopener')) {
          currentRelTokens.push('noopener');
        }
        if (!currentRelTokens.includes('noreferrer')) {
          currentRelTokens.push('noreferrer');
        }
        relAttr.value = currentRelTokens.join(' ');
        if (!relAttr.quote) relAttr.quote = '"';
      }

      // Check for screen reader disclosure or aria label on exact attribute names
      const hasSrOnlyInClass = attributes
        .find((a) => a.name === 'class')
        ?.value?.toLowerCase()
        .includes('sr-only');
      const hasSrOnly = /sr-only/i.test(innerHtml) || Boolean(hasSrOnlyInClass);
      const hasAriaLabel = attributes.some(
        (a) => a.name === 'aria-label' || a.name === 'aria-labelledby'
      );

      if (!hasSrOnly && !hasAriaLabel) {
        innerHtml += '<span class="sr-only">(opens in a new tab)</span>';
      }
    }

    const newAttrsStr = serializeHtmlAttributes(attributes);
    result += `<a${newAttrsStr}>${innerHtml}</a>`;

    currentIndex = closeTagEndIndex;
  }

  return result;
}
