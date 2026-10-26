/* global process */

const PRODUCTION_CDN_ORIGINS = [
  'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev',
  'http://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev',
];

function getEnvBaseUrl(): string | undefined {
  return typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_R2_PUBLIC_BASE_URL
    : typeof process !== 'undefined' && process.env
      ? process.env.VITE_R2_PUBLIC_BASE_URL
      : undefined;
}

export const getServiceImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    const envBaseUrl = getEnvBaseUrl();
    if (!envBaseUrl) {
      console.warn('Missing R2 base URL environment variable, falling back to local path');
      return '/';
    }
    return `${envBaseUrl.replace(/\/$/, '')}/`;
  }

  let path = imagePath.trim();

  // Strip configured and production CDN origins
  const envBaseUrl = getEnvBaseUrl();
  const cdnOrigins = [...PRODUCTION_CDN_ORIGINS];
  if (envBaseUrl) {
    const trimmedEnv = envBaseUrl.trim().replace(/\/$/, '');
    if (trimmedEnv) {
      cdnOrigins.push(trimmedEnv);
      if (trimmedEnv.startsWith('https://')) {
        cdnOrigins.push(`http://${trimmedEnv.slice(8)}`);
      } else if (trimmedEnv.startsWith('http://')) {
        cdnOrigins.push(`https://${trimmedEnv.slice(7)}`);
      }
    }
  }

  for (const origin of cdnOrigins) {
    if (path.toLowerCase().startsWith(origin.toLowerCase())) {
      path = path.slice(origin.length);
      break;
    }
  }

  // If after stripping recognized CDN origins, it is still an absolute http/https URL,
  // it is an external third-party URL — return it unchanged.
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (!envBaseUrl) {
    console.warn('Missing R2 base URL environment variable, falling back to local path');
    if (!path) return '/';
    return path.startsWith('/') ? path : `/${path}`;
  }

  const cleaned = path.replace(/^\/?images\//, '').replace(/^\/+/, '');
  const baseUrl = envBaseUrl.replace(/\/$/, '');

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
