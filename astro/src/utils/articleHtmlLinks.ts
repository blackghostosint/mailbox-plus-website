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
 * Inspects rendered article HTML content and transforms raw HTML anchor tags.
 * Ensures external/new-tab links (`target="_blank"`) contain security attributes (`rel="noopener noreferrer"`),
 * screen reader disclosure (`<span class="sr-only">(opens in a new tab)</span>`), and default styling classes.
 */
export function normalizeArticleHtmlLinks(html: string): string {
  if (!html) return html;

  return html.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (_match, attrsStr: string, innerHtml: string) => {
      const attributes = parseHtmlAttributes(attrsStr);

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
      return `<a${newAttrsStr}>${innerHtml}</a>`;
    }
  );
}
