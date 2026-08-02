export interface SiteConfig {
  name: string;
  legalName?: string; // legal entity name for schema.org (e.g. "Mailbox Plus of Ohio, LLC")
  tagline: string;
  description: string;
  domain: string;
  logo: string;
  favicon: {
    default: string;
    appleTouch: string;
    android192: string;
    android512: string;
    icon16: string;
    icon32: string;
  };
  contact: {
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  hours: Record<string, string>; // e.g. { monday: "9:00 AM - 6:00 PM", sunday: "Closed" }
  social?: Record<string, string>; // flexible for Facebook, Instagram, etc.
  geo: {
    lat: number;
    lng: number;
  };
  mapUrl?: string; // ✅ added for schema.ts
  areaServed?: string[]; // ✅ added for schema.ts
  knowsAbout?: string[]; // ✅ added for schema.ts
  deliveryAddress?: {
    // ✅ added for tracking schema
    '@type': 'PostalAddress';
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  premierSignupUrl?: string; // ✅ added for Premier signup modal
  premierSignupModalEnabled?: boolean;
  plusPointsSignupUrl?: string; // ✅ Plus Points signup modal
  plusPointsSignupModalEnabled?: boolean;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  }; // ✅ added for LocalBusiness schema
  foundingYear?: number; // ✅ Source of Truth founding year
  openingDate?: string; // ✅ Source of Truth official opening date (ISO format)
}
