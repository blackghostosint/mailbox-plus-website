import { siteConfig } from '../config/siteConfig';

/**
 * Normalizes a pathname to always start with a leading slash and,
 * if it's not the root path ('/'), always end with a trailing slash.
 * Query parameters and hash fragments are preserved.
 */
export function normalizePathname(path: string): string {
  if (!path) return '/';

  let cleanPath = path;

  // If it's an absolute URL, extract the pathname + search + hash
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    try {
      const url = new URL(cleanPath);
      cleanPath = url.pathname + url.search + url.hash;
    } catch {
      // fallback
    }
  }

  // Extract hash fragment
  const hashIdx = cleanPath.indexOf('#');
  let hash = '';
  if (hashIdx !== -1) {
    hash = cleanPath.slice(hashIdx);
    cleanPath = cleanPath.slice(0, hashIdx);
  }

  // Extract query parameters
  const queryIdx = cleanPath.indexOf('?');
  let search = '';
  if (queryIdx !== -1) {
    search = cleanPath.slice(queryIdx);
    cleanPath = cleanPath.slice(0, queryIdx);
  }

  // Ensure leading slash
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  // De-duplicate slashes (e.g. // -> /)
  cleanPath = cleanPath.replace(/\/+/g, '/');

  // Trailing slash policy:
  // - pathname === '/' -> remains '/'
  // - any other pathname -> must end with '/'
  if (cleanPath !== '/') {
    if (!cleanPath.endsWith('/')) {
      cleanPath = cleanPath + '/';
    }
  }

  return cleanPath + search + hash;
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

  const baseOrigin = (origin || siteConfig.domain || 'https://mailboxplusohio.com').replace(
    /\/+$/,
    ''
  );
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
