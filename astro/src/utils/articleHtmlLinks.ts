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

      // Check for existing screen reader disclosure or aria-label announcing new tab / window
      const hasDisclosure = hasNewTabDisclosure(attributes, innerHtml);

      if (!hasDisclosure) {
        const ariaLabelAttr = attributes.find((a) => a.name === 'aria-label');
        if (ariaLabelAttr) {
          const val = ariaLabelAttr.value ?? '';
          ariaLabelAttr.value = val ? `${val} (opens in a new tab)` : '(opens in a new tab)';
        }
        innerHtml += '<span class="sr-only">(opens in a new tab)</span>';
      }
    }

    const newAttrsStr = serializeHtmlAttributes(attributes);
    result += `<a${newAttrsStr}>${innerHtml}</a>`;

    currentIndex = closeTagEndIndex;
  }

  return result;
}

/**
 * Extracts accessible text strings and accessible attribute values (aria-label, alt, title)
 * from an inner HTML string. Ignores HTML comments, tag markup, and non-accessible attribute
 * names/values (such as data-*, class, id, src, href, etc.).
 */
export function extractAccessibleTextsFromInnerHtml(innerHtml: string): string[] {
  if (!innerHtml) return [];

  // Strip HTML comments <!-- ... -->
  const cleanHtml = innerHtml.replace(/<!--[\s\S]*?-->/g, '');
  const accessibleTexts: string[] = [];

  let currentIndex = 0;
  while (currentIndex < cleanHtml.length) {
    const nextTagIndex = cleanHtml.indexOf('<', currentIndex);
    if (nextTagIndex === -1) {
      const text = cleanHtml.substring(currentIndex);
      if (text.trim()) accessibleTexts.push(text);
      break;
    }

    if (nextTagIndex > currentIndex) {
      const text = cleanHtml.substring(currentIndex, nextTagIndex);
      if (text.trim()) accessibleTexts.push(text);
    }

    let inQuote: string | null = null;
    let tagEndIndex = -1;

    for (let j = nextTagIndex + 1; j < cleanHtml.length; j++) {
      const char = cleanHtml[j];
      if (inQuote) {
        if (char === inQuote) {
          inQuote = null;
        }
      } else {
        if (char === '"' || char === "'") {
          inQuote = char;
        } else if (char === '>') {
          tagEndIndex = j;
          break;
        }
      }
    }

    if (tagEndIndex === -1) {
      break;
    }

    const tagContent = cleanHtml.substring(nextTagIndex + 1, tagEndIndex);
    if (!tagContent.startsWith('/')) {
      const spaceMatch = /^[^\s/]+(?:\s+([\s\S]*))?$/.exec(tagContent);
      if (spaceMatch && spaceMatch[1]) {
        const parsedAttrs = parseHtmlAttributes(spaceMatch[1]);
        for (const attr of parsedAttrs) {
          if (
            (attr.name === 'aria-label' || attr.name === 'alt' || attr.name === 'title') &&
            attr.value !== null
          ) {
            if (attr.value.trim()) {
              accessibleTexts.push(attr.value);
            }
          }
        }
      }
    }

    currentIndex = tagEndIndex + 1;
  }

  return accessibleTexts;
}

/**
 * Checks whether an anchor tag already contains an accessible disclosure
 * announcing that it opens in a new tab or new window.
 *
 * This includes:
 * 1. `aria-label` attribute on the anchor tag containing explicit new-tab/window wording.
 * 2. Inner HTML accessible text content or accessible attributes (aria-label, alt, title)
 *    containing an existing new-tab or new-window disclosure phrase (e.g., "(opens in a new tab)").
 */
export function hasNewTabDisclosure(attributes: ParsedAttr[], innerHtml: string): boolean {
  const disclosureRegex =
    /(?:opens[-_\s]+(?:in[-_\s]+)?(?:a[-_\s]+)?|(?:\(|\[)\s*)new[-_\s]+(?:tab|window)|\bnew[-_\s]+(?:tab|window)\b/i;

  // 1. Check if aria-label on the anchor tag explicitly announces new tab or window behavior
  const hasAriaLabelDisclosure = attributes.some(
    (a) => a.name === 'aria-label' && a.value !== null && disclosureRegex.test(a.value)
  );
  if (hasAriaLabelDisclosure) return true;

  // 2. Check extracted accessible texts from innerHtml (text nodes and accessible attributes)
  if (innerHtml) {
    const accessibleTexts = extractAccessibleTextsFromInnerHtml(innerHtml);
    if (accessibleTexts.some((text) => disclosureRegex.test(text))) {
      return true;
    }
  }

  return false;
}
