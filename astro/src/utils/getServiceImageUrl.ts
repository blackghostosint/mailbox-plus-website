/**
 * Helper to ensure image URLs are absolute or properly formatted.
 * Currently a pass-through, but useful for future CDN or path normalization logic.
 */
export const getServiceImageUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  // Ensure leading slash
  return path.startsWith('/') ? path : `/${path}`;
};
