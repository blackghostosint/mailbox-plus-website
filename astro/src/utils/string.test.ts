import { describe, it, expect } from 'vitest';
import { extractPhoneDigits, slugify, formatCategoryTitle, cleanImagePath } from './string';

describe('extractPhoneDigits', () => {
  it('extracts numerical digits from a standard formatted phone number', () => {
    expect(extractPhoneDigits('(440) 709-1946')).toBe('4407091946');
  });

  it('extracts digits when country code or extension formatting is present', () => {
    expect(extractPhoneDigits('+1 (800) 555-0199 ext. 12')).toBe('1800555019912');
  });

  it('returns digits as-is when input contains only numerical digits', () => {
    expect(extractPhoneDigits('4407091946')).toBe('4407091946');
  });

  it('returns empty string when input has no digits', () => {
    expect(extractPhoneDigits('Call Us Today!')).toBe('');
  });

  it('handles empty, null, and undefined input gracefully', () => {
    expect(extractPhoneDigits('')).toBe('');
    expect(extractPhoneDigits(null)).toBe('');
    expect(extractPhoneDigits(undefined)).toBe('');
  });
});

describe('slugify', () => {
  it('converts titles to lowercase hyphenated slugs', () => {
    expect(slugify('Private Mailbox Rental')).toBe('private-mailbox-rental');
  });

  it('replaces ampersands with "and"', () => {
    expect(slugify('Pack & Ship Services')).toBe('pack-and-ship-services');
  });

  it('removes non-alphanumeric characters and trims outer hyphens', () => {
    expect(slugify('  --Concord Township, OH!  ')).toBe('concord-township-oh');
  });

  it('handles consecutive spaces and special symbols', () => {
    expect(slugify('UPS @ Store / Drop-off #1')).toBe('ups-store-drop-off-1');
  });

  it('handles empty, null, and undefined input gracefully', () => {
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
  });
});

describe('formatCategoryTitle', () => {
  it('formats known category slugs to human-readable titles', () => {
    expect(formatCategoryTitle('pack-ship')).toBe('Pack & Ship');
    expect(formatCategoryTitle('copy-print')).toBe('Copy & Print');
    expect(formatCategoryTitle('mailbox-rentals')).toBe('Mailbox Rentals');
    expect(formatCategoryTitle('document-services')).toBe('Document Services');
    expect(formatCategoryTitle('notary')).toBe('Notary');
    expect(formatCategoryTitle('printing')).toBe('Printing');
  });

  it('capitalizes and formats arbitrary hyphenated category slugs', () => {
    expect(formatCategoryTitle('shipping-supplies')).toBe('Shipping Supplies');
    expect(formatCategoryTitle('local-seo-services')).toBe('Local Seo Services');
  });

  it('handles empty, null, and undefined input gracefully', () => {
    expect(formatCategoryTitle('')).toBe('');
    expect(formatCategoryTitle(null)).toBe('');
    expect(formatCategoryTitle(undefined)).toBe('');
  });
});

describe('cleanImagePath', () => {
  it('strips leading slashes and images/ prefix from relative paths', () => {
    expect(cleanImagePath('/images/logo.png')).toBe('logo.png');
    expect(cleanImagePath('images/logo.png')).toBe('logo.png');
    expect(cleanImagePath('/images/articles/hero.webp')).toBe('articles/hero.webp');
  });

  it('strips leading slash when images/ prefix is omitted', () => {
    expect(cleanImagePath('/logo.png')).toBe('logo.png');
    expect(cleanImagePath('logo.png')).toBe('logo.png');
  });

  it('preserves absolute HTTP and HTTPS URLs', () => {
    const httpUrl = 'http://example.com/images/banner.jpg';
    const httpsUrl = 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/banner.jpg';
    expect(cleanImagePath(httpUrl)).toBe(httpUrl);
    expect(cleanImagePath(httpsUrl)).toBe(httpsUrl);
  });

  it('handles empty, null, and undefined input gracefully', () => {
    expect(cleanImagePath('')).toBe('');
    expect(cleanImagePath(null)).toBe('');
    expect(cleanImagePath(undefined)).toBe('');
  });
});
