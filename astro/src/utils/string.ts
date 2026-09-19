/**
 * Centralized String Formatting Utilities
 *
 * Provides pure helper functions for string manipulations across Astro components,
 * schema builders, and page templates.
 */

/**
 * Extracts numerical digits from a phone number string.
 * Returns an empty string if the input is null, undefined, or contains no digits.
 *
 * @param phone Raw phone string (e.g. "(440) 709-1946")
 * @returns Digits only string (e.g. "4407091946")
 */
export function extractPhoneDigits(phone?: string | null): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Converts a string into a URL-friendly slug.
 * Replaces '&' with 'and', strips non-alphanumeric characters, and normalizes hyphens.
 *
 * @param str Input text (e.g. "Pack & Ship Services")
 * @returns Slugified string (e.g. "pack-and-ship-services")
 */
export function slugify(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Formats a category slug into a human-readable, title-cased category header.
 *
 * @param category Category slug or raw category string (e.g. "pack-ship")
 * @returns Human-readable category title (e.g. "Pack & Ship")
 */
export function formatCategoryTitle(category?: string | null): string {
  if (!category) return '';

  const knownCategories: Record<string, string> = {
    'pack-ship': 'Pack & Ship',
    'copy-print': 'Copy & Print',
    'mailbox-rentals': 'Mailbox Rentals',
    'document-services': 'Document Services',
    notary: 'Notary',
    printing: 'Printing',
  };

  const normalized = category.trim().toLowerCase();
  if (knownCategories[normalized]) {
    return knownCategories[normalized];
  }

  return category.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Normalizes and cleans image asset path strings by stripping leading slashes
 * and 'images/' prefixes. Leaves absolute HTTP/HTTPS URLs untouched.
 *
 * @param imagePath Relative or absolute image path/URL
 * @returns Cleaned image path (e.g. "mailboxes.webp")
 */
export function cleanImagePath(imagePath?: string | null): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return imagePath.replace(/^\/?(images\/)?/, '');
}
