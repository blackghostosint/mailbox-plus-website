/**
 * Shared URL normalization library providing canonical URL path formatting,
 * route key abstractions, and route registry lookup helpers across Astro
 * runtime and Node.js audit scripts.
 */

const ASSET_EXT_REGEX = /\.(webp|png|jpg|jpeg|svg|gif|ico|xml|pdf|json|css|js)$/i;

export interface DynamicPrefix {
  prefix: string;
  catchAll: boolean;
}

export interface RouteRegistry {
  validRoutes: Set<string>;
  dynamicPrefixes: DynamicPrefix[];
  intentKeyMap: Map<string, string[]>;
}

/**
 * Standardizes a URL path or relative href into a canonical trailing-slash path.
 *
 * Examples:
 * - "" / "/" -> "/"
 * - "pack-ship" / "/pack-ship" / "/pack-ship/" -> "/pack-ship/"
 * - "/pack-ship#section" -> "/pack-ship/#section"
 * - "/pack-ship?ref=footer" -> "/pack-ship/?ref=footer"
 * - "/images/logo.webp" -> "/images/logo.webp"
 */
export function toCanonicalUrlPath(path: string): string {
  if (!path) return '/';

  let cleanPath = path.trim();

  // Extract absolute URL pathname + search + hash if full URL
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    try {
      const url = new URL(cleanPath);
      cleanPath = url.pathname + url.search + url.hash;
    } catch {
      // fallback to path as-is
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

  // Handle .html extension on pathname
  if (cleanPath.endsWith('.html')) {
    cleanPath = cleanPath.slice(0, -5);
  }

  // Ensure leading slash
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  // De-duplicate multiple slashes
  cleanPath = cleanPath.replace(/\/+/g, '/');

  // Trailing slash policy:
  // - '/' -> remains '/'
  // - Asset extension -> no trailing slash
  // - Other paths -> ends with '/'
  if (cleanPath !== '/') {
    if (ASSET_EXT_REGEX.test(cleanPath)) {
      // Keep asset file path as is
    } else if (!cleanPath.endsWith('/')) {
      cleanPath = cleanPath + '/';
    }
  }

  return cleanPath + search + hash;
}

/**
 * Standardizes a URL or path string to a canonical route key for Map indexing,
 * route comparisons, and registry lookups.
 *
 * Rules:
 * - Falsy/empty input -> returns input as-is (e.g. "", null, undefined)
 * - Root path "/" -> "/"
 * - Strips protocol, hostname, query params, hash fragments, and trailing slashes.
 * - Strips trailing .html extension.
 * - Ensures single leading slash.
 */
export function toRouteKey<T extends string | null | undefined>(path: T): T {
  if (!path) return path;

  let clean = (path as string).trim();

  // Extract pathname if absolute URL
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    try {
      const url = new URL(clean);
      clean = url.pathname;
    } catch {
      // ignore
    }
  }

  // Strip query parameters and hash fragments
  clean = clean.split('?')[0].split('#')[0].trim();

  if (!clean) return clean as T;

  // Strip trailing .html extension
  if (clean.endsWith('.html')) {
    clean = clean.slice(0, -5);
  }

  // Ensure leading slash
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }

  // De-duplicate multiple slashes
  clean = clean.replace(/\/+/g, '/');

  // Strip trailing slashes if length > 1
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  return clean as T;
}

/**
 * Backwards-compatibility aliases.
 */
export const toPathKey = toRouteKey;
export const normalizeRoute = toRouteKey;
export const normalizePath = toRouteKey;

/**
 * Checks if target route matches any exact valid route or dynamic route prefix.
 */
export function isKnownRoute(target: string, registry: RouteRegistry): boolean {
  const norm = toRouteKey(target);
  if (registry.validRoutes.has(norm)) return true;

  for (const { prefix, catchAll } of registry.dynamicPrefixes) {
    if (norm === prefix) return true;
    if (prefix === '/' || !norm.startsWith(prefix + '/')) continue;
    const rest = norm.slice(prefix.length + 1);
    if (catchAll || !rest.includes('/')) return true;
  }

  return false;
}
