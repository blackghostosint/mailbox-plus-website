import { siteConfig } from '../config/siteConfig';
import { toCanonicalUrlPath, toRouteKey } from './url-normalization';

export { toCanonicalUrlPath, toRouteKey };

/**
 * Normalizes a pathname to always start with a leading slash and,
 * if it's not the root path ('/'), always end with a trailing slash.
 * Query parameters and hash fragments are preserved.
 */
export function normalizePathname(path: string): string {
  return toCanonicalUrlPath(path);
}

/**
 * Converts a relative path or absolute URL into a normalized canonical URL
 * for the current site origin.
 *
 * Behavior:
 * - If pathOrUrl is external, returns it completely untouched.
 * - If pathOrUrl is a pure origin fragment (e.g., '#localbusiness' or 'https://mailboxplusohio.com#localbusiness'),
 *   returns it exactly as formatted without forcing a trailing slash on the empty/root path.
 * - Otherwise, normalizes the pathname and prefixes with the site origin.
 */
export function toCanonicalUrl(pathOrUrl: string, origin?: string): string {
  if (!pathOrUrl) {
    pathOrUrl = '/';
  }

  const baseOrigin = (origin || siteConfig.domain).replace(/\/+$/, '');
  const siteHost = new URL(baseOrigin).host;

  // 1. Check if it's an external URL
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    try {
      const parsed = new URL(pathOrUrl);
      if (parsed.host !== siteHost) {
        return pathOrUrl;
      }
    } catch {
      return pathOrUrl;
    }
  }

  // 2. Handle hash-only/fragment-only pathOrUrl
  if (pathOrUrl.startsWith('#')) {
    return `${baseOrigin}/${pathOrUrl}`; // Ensure '/' before hash on pure relative fragments
  }

  // 3. Handle origin-level URLs and hash fragments precisely
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    try {
      const parsed = new URL(pathOrUrl);
      if (parsed.pathname === '/' && !parsed.search) {
        const noProto = pathOrUrl.replace(/^https?:\/\//, '');
        if (noProto.startsWith(siteHost + '#')) {
          // Keep exactly as is, e.g. https://mailboxplusohio.com#localbusiness
          return `${baseOrigin}${parsed.hash}`;
        }
        if (noProto === siteHost || noProto === siteHost + '/') {
          return `${baseOrigin}/`;
        }
      }
    } catch {
      // ignore
    }
  }

  // 4. Normalize pathname and combine with origin
  const normalizedPath = normalizePathname(pathOrUrl);
  return `${baseOrigin}${normalizedPath}`;
}

/**
 * @deprecated Runtime HTML regex patching is deprecated. Standardize internal href emission
 * at construction time through `toCanonicalUrlPath()`.
 */
export function normalizeContentHrefs(html: string): string {
  return html.replace(
    /href="(\/)((?:[a-z0-9][a-z0-9\-/]*?))"/gi,
    (match, slash: string, path: string) => {
      if (
        path &&
        path !== '/' &&
        !path.endsWith('/') &&
        !path.includes('.') &&
        !path.includes('?') &&
        !path.includes('#') &&
        !path.includes(':')
      ) {
        return `href="${slash}${path}/"`;
      }
      return match;
    }
  );
}

/**
 * Normalizes h4 elements in content strings to h3 elements to ensure sequential
 * heading hierarchy (h2 -> h3) for WCAG 2.1 SC 1.3.1 compliance.
 * Preserves all attributes, CSS classes, and inline styles on transformed tags.
 */
export function normalizeContentHeadings(html: string): string {
  if (!html) return html;
  return html.replace(/<(\/?)h4(\s|>|\/)/gi, '<$1h3$2');
}

/**
 * Normalizes table containers in HTML strings for WCAG 2.1 SC 2.1.1 (Keyboard)
 * compliance. Adds tabindex="0", role="region", and an aria-label to table
 * containers matching .overflow-x-auto, enabling keyboard-only scrolling.
 * Preserves all existing attributes when a container already includes tabindex,
 * and passes non-table content blocks through unmodified.
 */
export function normalizeContentTables(html: string, defaultLabel = 'Scrollable table'): string {
  if (!html || typeof html !== 'string') return html;
  if (!/<table\b/i.test(html)) return html;

  const tagRegex = /<([a-zA-Z0-9]+)\b([^>]*?)>/g;
  let match: RegExpExecArray | null;
  const matches: {
    start: number;
    end: number;
    tagName: string;
    attrs: string;
    innerHtml: string;
  }[] = [];

  while ((match = tagRegex.exec(html)) !== null) {
    const tagName = match[1];
    const attrs = match[2];
    const classMatch = attrs.match(/\bclass\s*=\s*(["'])(.*?)\1/i);
    if (!classMatch) continue;
    const classList = classMatch[2].split(/\s+/);
    if (!classList.includes('overflow-x-auto')) continue;

    // Guardrail: do not alter existing attributes when container already includes tabindex
    if (/\btabindex\b/i.test(attrs)) continue;

    const openTagStartIndex = match.index;
    const openTagEndIndex = tagRegex.lastIndex;

    // Find matching closing tag to verify container encloses a table
    let depth = 1;
    const innerSearchRegex = new RegExp(`<(/?)${tagName}\\b([^>]*?)>`, 'gi');
    innerSearchRegex.lastIndex = openTagEndIndex;
    let innerMatch: RegExpExecArray | null;
    let closeTagStartIndex = -1;

    while ((innerMatch = innerSearchRegex.exec(html)) !== null) {
      const isClosing = innerMatch[1] === '/';
      const isSelfClosing = innerMatch[2].endsWith('/');
      if (isClosing) {
        depth--;
        if (depth === 0) {
          closeTagStartIndex = innerMatch.index;
          break;
        }
      } else if (!isSelfClosing) {
        depth++;
      }
    }

    if (closeTagStartIndex === -1) {
      if (!/<table\b/i.test(html.slice(openTagEndIndex))) continue;
    } else {
      const innerHtml = html.slice(openTagEndIndex, closeTagStartIndex);
      if (!/<table\b/i.test(innerHtml)) continue;
    }

    matches.push({
      start: openTagStartIndex,
      end: openTagEndIndex,
      tagName,
      attrs,
      innerHtml:
        closeTagStartIndex !== -1
          ? html.slice(openTagEndIndex, closeTagStartIndex)
          : html.slice(openTagEndIndex),
    });
  }

  if (matches.length === 0) return html;

  // Process matches in reverse order so string indices remain valid
  let result = html;
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    const attrsToAdd: string[] = ['tabindex="0"'];
    if (!/\brole\s*=/i.test(m.attrs)) {
      attrsToAdd.push('role="region"');
    }
    if (!/\baria-label\s*=/i.test(m.attrs) && !/\baria-labelledby\s*=/i.test(m.attrs)) {
      let label = defaultLabel;
      const captionMatch = m.innerHtml.match(/<caption[^>]*>(.*?)<\/caption>/i);
      if (captionMatch && captionMatch[1]?.trim()) {
        label = captionMatch[1].replace(/<[^>]+>/g, '').trim();
      }
      attrsToAdd.push(`aria-label="${label}"`);
    }

    const newOpenTag = `<${m.tagName}${m.attrs} ${attrsToAdd.join(' ')}>`;
    result = result.slice(0, m.start) + newOpenTag + result.slice(m.end);
  }

  return result;
}

export const normalizeTableContainers = normalizeContentTables;
