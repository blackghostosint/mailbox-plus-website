import type { CTA } from "../types/services";
import type { SiteConfig } from "../types/siteConfig";

export const siteConfig: SiteConfig = {
  name: "Mailbox Plus Ohio",
  tagline: "Let Us Handle Your Package!",
  description:
    "Community-focused pack & ship retail store in Concord Township, Ohio. FedEx, UPS, USPS shipping, mailbox rentals, printing, and fingerprinting services.",
  domain: "https://mailboxplusohio.com",
  logo: "/mailbox_plus_logo.jpg",
  favicon: {
    default: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/favicon_io/favicon-32x32.png",
    appleTouch: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/favicon_io/apple-touch-icon.png",
    android192: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/favicon_io/android-chrome-192x192.png",
    android512: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/favicon_io/android-chrome-512x512.png",
    icon16: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/favicon_io/favicon-16x16.png",
    icon32: "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/favicon_io/favicon-32x32.png",
  },
  contact: {
    phone: "440-709-1946",
    email: "help@mailboxplusohio.com",
    address: {
      street: "7554 Fredle Drive",
      city: "Concord Township",
      state: "OH",
      zip: "44077",
      country: "US",
    },
  },
  hours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "9:00 AM - 2:00 PM",
    sunday: "Closed",
  },
  social: {
    facebook: "https://www.facebook.com/mailboxplusohio",
    instagram: "https://www.instagram.com/mailboxplusohio",
    nextdoor: "https://nextdoor.com/pages/mailbox-plus-concord-township-oh",
  },
  geo: {
    lat: 41.66497,
    lng: -81.24164,
  },

  // ✅ new fields
  mapUrl: "https://maps.app.goo.gl/Rs1NQkR6gRrtxAq37",
  areaServed: ["Concord Township", "Mentor", "Painesville", "Eastlake", "Lake County"],
  deliveryAddress: {
    "@type": "PostalAddress",
    addressLocality: "Concord Township",
    addressRegion: "OH",
    addressCountry: "US",
  },
};

export const defaultCTA: CTA = {
  title: "Ready to get started?",
  subtitle: "Stop in today or message us—let us handle your package!",
  buttonText: "Visit Us in Concord Township",
  buttonLink: "/contact",
  variant: "brand",
  align: "center",
};
