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
 * Respects single and double quotes so that '>' characters inside quoted attribute values
 * do not prematurely close the opening tag.
 */
function findOpeningAnchorTag(
  html: string,
  startIndex: number
): { tagStartIndex: number; openTagEndIndex: number; attrsStr: string } | null {
  const tagRegex = /<a\b/gi;
  tagRegex.lastIndex = startIndex;

  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(html)) !== null) {
    const tagStartIndex = match.index;
    let inQuote: string | null = null;
    let openTagEndIndex = -1;

    for (let i = tagStartIndex + 2; i < html.length; i++) {
      const char = html[i];
      if (inQuote) {
        if (char === inQuote) {
          inQuote = null;
        }
      } else {
        if (char === '"' || char === "'") {
          inQuote = char;
        } else if (char === '>') {
          openTagEndIndex = i;
          break;
        }
      }
    }

    if (openTagEndIndex !== -1) {
      const attrsStr = html.substring(tagStartIndex + 2, openTagEndIndex);
      return { tagStartIndex, openTagEndIndex, attrsStr };
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

    // Search for the closing </a> tag following openingTag.openTagEndIndex
    const closeTagRegex = /<\/a>/gi;
    closeTagRegex.lastIndex = openingTag.openTagEndIndex + 1;
    const closeMatch = closeTagRegex.exec(html);

    if (!closeMatch) {
      // If no matching </a> tag is found, append opening tag as-is and continue
      result += html.substring(openingTag.tagStartIndex, openingTag.openTagEndIndex + 1);
      currentIndex = openingTag.openTagEndIndex + 1;
      continue;
    }

    const closeTagStartIndex = closeMatch.index;
    const closeTagEndIndex = closeTagStartIndex + closeMatch[0].length;
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
