export const DEFAULT_ARTICLE_LINK_CLASS =
  'text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] underline decoration-[var(--color-border-blue)] underline-offset-2';

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
      let newAttrsStr = attrsStr;

      // Check if link opens in a new tab
      const isNewTab = /\btarget\s*=\s*(["'])?\s*_blank\b/i.test(attrsStr);

      // 1. Ensure styling classes are present
      const classMatch = /\bclass\s*=\s*(?:(["'])(.*?)\1|([^\s>]+))/i.exec(newAttrsStr);
      if (!classMatch) {
        newAttrsStr += ` class="${DEFAULT_ARTICLE_LINK_CLASS}"`;
      } else {
        const quote = classMatch[1] || '"';
        const existingClasses = classMatch[2] ?? classMatch[3] ?? '';
        if (!existingClasses.includes('text-[')) {
          const updatedClasses = `${existingClasses} ${DEFAULT_ARTICLE_LINK_CLASS}`.trim();
          newAttrsStr = newAttrsStr.replace(
            /\bclass\s*=\s*(?:(["'])(.*?)\1|([^\s>]+))/i,
            `class=${quote}${updatedClasses}${quote}`
          );
        }
      }

      // 2. Handle target="_blank" links (rel & screen reader text)
      if (isNewTab) {
        // Ensure rel contains noopener and noreferrer
        const relMatch = /\brel\s*=\s*(?:(["'])(.*?)\1|([^\s>]+))/i.exec(newAttrsStr);
        if (!relMatch) {
          newAttrsStr += ' rel="noopener noreferrer"';
        } else {
          const quote = relMatch[1] || '"';
          const rawRel = relMatch[2] ?? relMatch[3] ?? '';
          const currentRelTokens = rawRel.split(/\s+/).filter(Boolean);
          if (!currentRelTokens.includes('noopener')) {
            currentRelTokens.push('noopener');
          }
          if (!currentRelTokens.includes('noreferrer')) {
            currentRelTokens.push('noreferrer');
          }
          const updatedRel = currentRelTokens.join(' ');
          newAttrsStr = newAttrsStr.replace(
            /\brel\s*=\s*(?:(["'])(.*?)\1|([^\s>]+))/i,
            `rel=${quote}${updatedRel}${quote}`
          );
        }

        // Check for screen reader disclosure or aria label
        const hasSrOnly = /sr-only/i.test(innerHtml) || /sr-only/i.test(attrsStr);
        const hasAriaLabel =
          /\baria-label\s*=/i.test(attrsStr) || /\baria-labelledby\s*=/i.test(attrsStr);

        if (!hasSrOnly && !hasAriaLabel) {
          innerHtml += '<span class="sr-only">(opens in a new tab)</span>';
        }
      }

      return `<a${newAttrsStr}>${innerHtml}</a>`;
    }
  );
}
