import { siteConfig } from "../config/siteConfig";

/**
 * Generates a Google Maps directions link for the business location.
 *
 * This helper builds a preformatted URL pointing to the store's
 * coordinates defined in `siteConfig.geo`. It ensures consistent
 * map link generation across the app and centralizes logic for
 * maintainability.
 *
 * Example:
 * ```ts
 * import { getGoogleMapsLink } from "../utils/location";
 * 
 * const mapUrl = getGoogleMapsLink();
 * // "https://www.google.com/maps/dir/?api=1&destination=41.676,-81.245"
 * ```
 *
 * @returns {string} A complete Google Maps directions URL targeting the store.
 */
export const getGoogleMapsLink = (): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${siteConfig.geo.lat},${siteConfig.geo.lng}`;