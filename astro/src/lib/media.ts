/* global process */

export const CANONICAL_R2_BASE_URL = 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev';

const PRODUCTION_CDN_ORIGINS = [
  CANONICAL_R2_BASE_URL,
  'http://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev',
];

function getEnvBaseUrl(): string | undefined {
  return typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_R2_PUBLIC_BASE_URL
    : typeof process !== 'undefined' && process.env
      ? process.env.VITE_R2_PUBLIC_BASE_URL
      : undefined;
}

function normalizeOrigin(originOrUrl: string): string | undefined {
  try {
    const parsed = new URL(originOrUrl);
    return parsed.origin.toLowerCase();
  } catch {
    return undefined;
  }
}

export const getServiceImageUrl = (imagePath: string): string => {
  const envBaseUrl = getEnvBaseUrl();
  const effectiveBaseUrl =
    envBaseUrl && envBaseUrl.trim() !== '' ? envBaseUrl.trim() : CANONICAL_R2_BASE_URL;

  if (!imagePath) {
    return `${effectiveBaseUrl.replace(/\/$/, '')}/`;
  }

  let path = imagePath.trim();

  // Build recognized origins set with strict origin normalization
  const recognizedOrigins = new Set<string>();
  for (const originStr of PRODUCTION_CDN_ORIGINS) {
    const o = normalizeOrigin(originStr);
    if (o) recognizedOrigins.add(o);
  }

  if (envBaseUrl && envBaseUrl.trim() !== '') {
    const envTrimmed = envBaseUrl.trim();
    const envOrigin = normalizeOrigin(envTrimmed);
    if (envOrigin) {
      recognizedOrigins.add(envOrigin);
      if (envOrigin.startsWith('https://')) {
        recognizedOrigins.add(`http://${envOrigin.slice(8)}`);
      } else if (envOrigin.startsWith('http://')) {
        recognizedOrigins.add(`https://${envOrigin.slice(7)}`);
      }
    }
  }

  // If path is an absolute http/https URL, check if its origin matches a recognized CDN origin
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const pathOrigin = normalizeOrigin(path);
    if (pathOrigin && recognizedOrigins.has(pathOrigin)) {
      try {
        const u = new URL(path);
        path = u.pathname + u.search + u.hash;
      } catch {
        // Fallback if URL parsing fails
      }
    } else {
      // Third-party external URL — return unchanged
      return path;
    }
  }

  const cleaned = path.replace(/^\/?images\//, '').replace(/^\/+/, '');
  const baseUrl = effectiveBaseUrl.replace(/\/$/, '');

  return cleaned ? `${baseUrl}/${cleaned}` : `${baseUrl}/`;
};

/**
 * Normalizes inline HTML image element src attributes using getServiceImageUrl.
 * Preserves all other attributes (classes, loading, width, height, alt, etc.).
 */
export const normalizeContentMedia = (html: string): string => {
  if (!html || typeof html !== 'string') return html;

  return html.replace(/<img\b([^>]*?)>/gi, (imgTag) => {
    return imgTag.replace(
      /src=(["'])(.*?)\1|src=([^\s>]+)/gi,
      (_srcAttr, quote, srcVal1, srcVal2) => {
        const rawSrc = srcVal1 ?? srcVal2 ?? '';
        const resolvedSrc = getServiceImageUrl(rawSrc);
        const q = quote || '"';
        return `src=${q}${resolvedSrc}${q}`;
      }
    );
  });
};
