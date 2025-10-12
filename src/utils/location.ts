import { siteConfig } from "../config/siteConfig";

/**
 * Generates a Google Maps URL for the business location.
 *
 * Supports both **directions** and **view** modes, with an optional
 * label (place name). Ensures the "view" mode centers precisely on
 * the store coordinates.
 *
 * @param {"directions" | "view"} [mode="directions"]
 *   The type of Google Maps link to generate:
 *   - `"directions"` → Opens navigation to the store (default)
 *   - `"view"` → Opens a static map centered exactly on coordinates
 * @param {string} [label]
 *   Optional place name label for directions mode.
 *
 * @returns {string} A valid Google Maps URL.
 */
export const getGoogleMapsLink = (
  mode: "directions" | "view" = "directions",
  label?: string
): string => {
  const { lat, lng } = siteConfig.geo;
  const encodedLabel = label ? `+(${encodeURIComponent(label)})` : "";

  if (mode === "view") {
    // ✅ Centers map exactly on coordinates
    return `https://www.google.com/maps/@${lat},${lng},17z`;
  }

  // ✅ Directions mode — with optional business label
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${encodedLabel}`;
};