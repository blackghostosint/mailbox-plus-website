/* global process */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getServiceImageUrl } from './storage';

describe('getServiceImageUrl', () => {
  const originalEnv = process.env.VITE_R2_PUBLIC_BASE_URL;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.VITE_R2_PUBLIC_BASE_URL = originalEnv;
    } else {
      delete process.env.VITE_R2_PUBLIC_BASE_URL;
    }
  });

  it('passes through absolute http and https URLs unchanged', () => {
    expect(getServiceImageUrl('https://example.com/image.webp')).toBe(
      'https://example.com/image.webp'
    );
    expect(getServiceImageUrl('http://example.com/image.webp')).toBe(
      'http://example.com/image.webp'
    );
  });

  it('formats relative paths against R2 CDN base URL when env var is set', () => {
    process.env.VITE_R2_PUBLIC_BASE_URL = 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev';

    expect(getServiceImageUrl('/images/pack-ship.webp')).toBe(
      'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/pack-ship.webp'
    );
    expect(getServiceImageUrl('images/pack-ship.webp')).toBe(
      'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/pack-ship.webp'
    );
    expect(getServiceImageUrl('/pack-ship.webp')).toBe(
      'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/pack-ship.webp'
    );
    expect(getServiceImageUrl('pack-ship.webp')).toBe(
      'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/pack-ship.webp'
    );
    expect(getServiceImageUrl('')).toBe('https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/');
  });

  it('strips trailing slashes from CDN base URL to avoid double slashes', () => {
    process.env.VITE_R2_PUBLIC_BASE_URL = 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/';

    expect(getServiceImageUrl('/images/test.webp')).toBe(
      'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/test.webp'
    );
  });

  it('issues a warning and falls back gracefully to local relative path when env var is missing', () => {
    delete process.env.VITE_R2_PUBLIC_BASE_URL;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(getServiceImageUrl('/images/test.webp')).toBe('/images/test.webp');
    expect(getServiceImageUrl('images/test.webp')).toBe('/images/test.webp');
    expect(getServiceImageUrl('test.webp')).toBe('/test.webp');
    expect(getServiceImageUrl('')).toBe('/');
    expect(warnSpy).toHaveBeenCalledWith(
      'Missing R2 base URL environment variable, falling back to local path'
    );
  });
});
