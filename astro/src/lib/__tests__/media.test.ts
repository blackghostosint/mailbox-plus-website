/* global process */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getServiceImageUrl, normalizeContentMedia, CANONICAL_R2_BASE_URL } from '../media';

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

  it('treats lookalike CDN subdomains/extensions as third-party external URLs', () => {
    const evilUrl =
      'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev.evil.example/shipping.webp';
    expect(getServiceImageUrl(evilUrl)).toBe(evilUrl);
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

  it('falls back gracefully to canonical R2 base URL when env var is missing', () => {
    delete process.env.VITE_R2_PUBLIC_BASE_URL;

    expect(getServiceImageUrl('/images/test.webp')).toBe(`${CANONICAL_R2_BASE_URL}/test.webp`);
    expect(getServiceImageUrl('images/test.webp')).toBe(`${CANONICAL_R2_BASE_URL}/test.webp`);
    expect(getServiceImageUrl('/shipping-alcohol-featured.webp')).toBe(
      `${CANONICAL_R2_BASE_URL}/shipping-alcohol-featured.webp`
    );
    expect(getServiceImageUrl('shipping-alcohol-featured.webp')).toBe(
      `${CANONICAL_R2_BASE_URL}/shipping-alcohol-featured.webp`
    );
    expect(getServiceImageUrl('test.webp')).toBe(`${CANONICAL_R2_BASE_URL}/test.webp`);
    expect(getServiceImageUrl('')).toBe(`${CANONICAL_R2_BASE_URL}/`);
    expect(
      getServiceImageUrl(
        'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/pack-ship/test.webp'
      )
    ).toBe(`${CANONICAL_R2_BASE_URL}/articles/pack-ship/test.webp`);
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

  it('falls back to canonical R2 base URL when env var is missing', () => {
    delete process.env.VITE_R2_PUBLIC_BASE_URL;

    const inputHtml =
      '<img src="/shipping-alcohol-featured.webp" alt="Test" /><img src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/shipping.webp" alt="Test 2" />';

    const normalized = normalizeContentMedia(inputHtml);

    expect(normalized).toBe(
      `<img src="${CANONICAL_R2_BASE_URL}/shipping-alcohol-featured.webp" alt="Test" /><img src="${CANONICAL_R2_BASE_URL}/shipping.webp" alt="Test 2" />`
    );
  });

  it('leaves external third-party image URLs unchanged inside HTML', () => {
    process.env.VITE_R2_PUBLIC_BASE_URL = 'https://cdn.test.com';

    const inputHtml = '<img src="https://external-domain.com/photo.jpg" alt="External" />';
    const normalized = normalizeContentMedia(inputHtml);

    expect(normalized).toBe('<img src="https://external-domain.com/photo.jpg" alt="External" />');
  });
});
