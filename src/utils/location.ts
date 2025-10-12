import { siteConfig } from "../config/siteConfig";

/**
 * Generates a Google Maps URL for the business location.
 *
 * Supports both **directions** and **view** modes, with an optional
 * label (place name) that helps Google Maps show the destination
 * name in the interface or when the link is shared.
 *
 * Example:
 * ```ts
 * import { getGoogleMapsLink } from "../utils/location";
 *
 * // Default (directions link)
 * getGoogleMapsLink();
 * // → "https://www.google.com/maps/dir/?api=1&destination=41.676,-81.245"
 *
 * // View link
 * getGoogleMapsLink("view");
 * // → "https://www.google.com/maps?q=41.676,-81.245"
 *
 * // Directions link with store name label
 * getGoogleMapsLink("directions", "Mailbox Plus Ohio");
 * // → "https://www.google.com/maps/dir/?api=1&destination=41.676,-81.245+(Mailbox+Plus+Ohio)"
 * ```
 *
 * @param {"directions" | "view"} [mode="directions"]
 *   The type of Google Maps link to generate:
 *   - `"directions"` → Opens navigation to the store (default)
 *   - `"view"` → Opens a static map view
 * @param {string} [label]
 *   Optional location label (e.g., store name). When provided,
 *   it's URL-encoded and appended to the query.
 *
 * @returns {string} A valid Google Maps URL.
 */
export const getGoogleMapsLink = (
  mode: "directions" | "view" = "directions",
  label?: string
): string => {
  const { lat, lng } = siteConfig.geo;
  const encodedLabel = label ? `+(${encodeURIComponent(label)})` : "";

  return mode === "view"
    ? `https://www.google.com/maps?q=${lat},${lng}${encodedLabel}`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${encodedLabel}`;
};