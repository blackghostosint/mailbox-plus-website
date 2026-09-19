import { getClientEnv } from './env';

export const getServiceImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const envBaseUrl = getClientEnv('VITE_R2_PUBLIC_BASE_URL');

  if (!envBaseUrl) {
    console.warn('Missing R2 base URL environment variable, falling back to local path');
    if (!imagePath) return '/';
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }

  const cleaned = imagePath.replace(/^\/?images\//, '').replace(/^\/+/, '');
  const baseUrl = envBaseUrl.replace(/\/$/, '');

  return cleaned ? `${baseUrl}/${cleaned}` : `${baseUrl}/`;
};
