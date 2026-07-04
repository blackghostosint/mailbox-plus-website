import { describe, it, expect } from 'vitest';
import { getServiceImageUrl } from './getServiceImageUrl';

describe('getServiceImageUrl', () => {
  it('returns absolute URLs unchanged', () => {
    expect(getServiceImageUrl('https://example.com/image.webp')).toBe(
      'https://example.com/image.webp'
    );
  });

  it('returns paths with leading slash unchanged', () => {
    expect(getServiceImageUrl('/images/test.webp')).toBe('/images/test.webp');
  });

  it('adds leading slash to paths without one', () => {
    expect(getServiceImageUrl('images/test.webp')).toBe('/images/test.webp');
  });

  it('handles empty string', () => {
    expect(getServiceImageUrl('')).toBe('/');
  });
});
