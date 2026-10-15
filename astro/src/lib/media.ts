/* global process */
export const getServiceImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const envBaseUrl =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_R2_PUBLIC_BASE_URL
      : typeof process !== 'undefined' && process.env
        ? process.env.VITE_R2_PUBLIC_BASE_URL
        : undefined;

  if (!envBaseUrl) {
    console.warn('Missing R2 base URL environment variable, falling back to local path');
    if (!imagePath) return '/';
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }

  const cleaned = imagePath.replace(/^\/?images\//, '').replace(/^\/+/, '');
  const baseUrl = envBaseUrl.replace(/\/$/, '');

  return cleaned ? `${baseUrl}/${cleaned}` : `${baseUrl}/`;
};
