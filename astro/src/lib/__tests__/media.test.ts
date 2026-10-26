/* global process */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getServiceImageUrl, normalizeContentMedia } from '../media';

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

  it('passes through external non-CDN absolute http and https URLs unchanged', () => {
    expect(getServiceImageUrl('https://example.com/image.webp')).toBe(
      'https://example.com/image.webp'
    );
    expect(getServiceImageUrl('http://example.com/image.webp')).toBe(
      'http://example.com/image.webp'
    );
  });

  it('strips production CDN origins and formats paths against R2 CDN base URL when env var is set', () => {
    process.env.VITE_R2_PUBLIC_BASE_URL = 'https://custom-cdn.example.com';

    expect(
      getServiceImageUrl(
        'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/pack-ship/test.webp'
      )
    ).toBe('https://custom-cdn.example.com/articles/pack-ship/test.webp');

    expect(getServiceImageUrl('/images/pack-ship.webp')).toBe(
      'https://custom-cdn.example.com/pack-ship.webp'
    );
    expect(getServiceImageUrl('images/pack-ship.webp')).toBe(
      'https://custom-cdn.example.com/pack-ship.webp'
    );
    expect(getServiceImageUrl('/pack-ship.webp')).toBe(
      'https://custom-cdn.example.com/pack-ship.webp'
    );
    expect(getServiceImageUrl('pack-ship.webp')).toBe(
      'https://custom-cdn.example.com/pack-ship.webp'
    );
    expect(getServiceImageUrl('')).toBe('https://custom-cdn.example.com/');
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
    expect(
      getServiceImageUrl(
        'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/pack-ship/test.webp'
      )
    ).toBe('/articles/pack-ship/test.webp');
    expect(warnSpy).toHaveBeenCalledWith(
      'Missing R2 base URL environment variable, falling back to local path'
    );
  });
});

describe('normalizeContentMedia', () => {
  const originalEnv = process.env.VITE_R2_PUBLIC_BASE_URL;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.VITE_R2_PUBLIC_BASE_URL = originalEnv;
    } else {
      delete process.env.VITE_R2_PUBLIC_BASE_URL;
    }
  });

  it('processes inline HTML img tags and preserves all element attributes', () => {
    process.env.VITE_R2_PUBLIC_BASE_URL = 'https://cdn.test.com';

    const inputHtml =
      '<p>Intro</p><img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/shipping.webp" alt="Shipping service" class="w-full rounded-2xl" loading="lazy" width="1200" height="675" /><p>Outro</p>';

    const normalized = normalizeContentMedia(inputHtml);

    expect(normalized).toContain('src="https://cdn.test.com/shipping.webp"');
    expect(normalized).toContain('alt="Shipping service"');
    expect(normalized).toContain('class="w-full rounded-2xl"');
    expect(normalized).toContain('loading="lazy"');
    expect(normalized).toContain('width="1200"');
    expect(normalized).toContain('height="675"');
  });

  it('falls back to relative path when env var is missing', () => {
    delete process.env.VITE_R2_PUBLIC_BASE_URL;
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const inputHtml =
      '<img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/shipping.webp" alt="Test" />';

    const normalized = normalizeContentMedia(inputHtml);

    expect(normalized).toBe('<img src="/shipping.webp" alt="Test" />');
  });

  it('leaves external third-party image URLs unchanged inside HTML', () => {
    process.env.VITE_R2_PUBLIC_BASE_URL = 'https://cdn.test.com';

    const inputHtml = '<img src="https://external-domain.com/photo.jpg" alt="External" />';
    const normalized = normalizeContentMedia(inputHtml);

    expect(normalized).toBe('<img src="https://external-domain.com/photo.jpg" alt="External" />');
  });
});
