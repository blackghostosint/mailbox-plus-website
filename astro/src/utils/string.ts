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
 * Converts a string into a schema entity ID slug without converting ampersands to 'and'.
 * Preserves historical schema @id entity identities (e.g. "#service-pack-ship").
 *
 * @param str Input text (e.g. "Pack & Ship Services")
 * @returns Schema ID slug (e.g. "pack-ship-services")
 */
export function slugifySchemaId(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Formats a category slug by replacing hyphens with spaces.
 * Preserves exact behavioral equivalence with inline category string transformations.
 * Note: Rendered visual title casing is provided via Tailwind CSS classes (such as `capitalize` or `uppercase`) on template elements.
 *
 * @param category Category slug or raw category string (e.g. "pack-ship")
 * @returns Formatted category title with hyphens replaced by spaces (e.g. "pack ship")
 */
export function formatCategoryTitle(category?: string | null): string {
  if (!category) return '';
  return category.replace(/-/g, ' ');
}

/**
 * Normalizes image asset path strings by stripping leading '/images/' or 'images/' prefixes.
 * Preserves exact behavioral equivalence with inline `replace(/^\/?images\//, '')` expressions.
 * Leaves absolute HTTP/HTTPS URLs untouched.
 *
 * @param imagePath Relative or absolute image path/URL
 * @returns Cleaned image path (e.g. "mailboxes.webp")
 */
export function cleanImagePath(imagePath?: string | null): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return imagePath.replace(/^\/?images\//, '');
}
