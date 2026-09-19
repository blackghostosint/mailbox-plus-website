import { getR2PublicBaseUrl } from './env';

export const getServiceImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const cleaned = imagePath.replace(/^\/?images\//, '');
  const baseUrl = getR2PublicBaseUrl();

  if (!baseUrl) {
    console.warn('Missing R2 base URL environment variable, falling back to local path');
    return imagePath;
  }

  return `${baseUrl.replace(/\/$/, '')}/${cleaned}`;
};
