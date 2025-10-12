import { siteConfig } from "../config/siteConfig";

export const getGoogleMapsLink = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${siteConfig.geo.lat},${siteConfig.geo.lng}`;