import type { CTA } from "../types/services";
import type { SiteConfig } from "../types/siteConfig";

export const siteConfig: SiteConfig = {
  name: "Mailbox Plus Ohio",
  tagline: "Let Us Handle Your Package!",
  description:
    "Community-focused pack & ship retail store in Concord Township, Ohio. FedEx, UPS, USPS shipping, mailbox rentals, printing, and fingerprinting services.",
  domain: "https://mailboxplusohio.com",
  logo: "/mailbox_plus_logo.webp",
  favicon: {
    default: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/favicon-32x32.png`,
    appleTouch: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/apple-touch-icon.png`,
    android192: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/android-chrome-192x192.png`,
    android512: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/android-chrome-512x512.png`,
    icon16: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/favicon-16x16.png`,
    icon32: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/favicon-32x32.png`,
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
  knowsAbout: [
    "UPS Store shipping",
    "UPS Store drop-off",
    "UPS Store notary services",
    "UPS Store printing services",
    "UPS Store mailbox rentals",
    "UPS Store packaging",
    "UPS Store address services",
    "UPS Store alternative",
    "UPS Store competitor",

    "Mail Boxes Etc services",
    "Mail Boxes Etc mailbox rental",
    "Mail Boxes Etc shipping",
    "Mail Boxes Etc printing",
    "Mail Boxes Etc notary",
    "Mail Boxes Etc packaging",
    "Mail Boxes Etc alternative",
    "Mail Boxes Etc competitor",

    "USPS services",
    "USPS shipping",
    "USPS package drop",
    "USPS mail acceptance",
    "USPS postal services",
    "USPS certified mail",
    "USPS priority mail",
    "USPS first class mail",
    "USPS PO Box alternative",
    "USPS drop-off alternative",
    "USPS location alternative",
    "post office alternative",
    "post office near me services",
    "postal service support",

    "FedEx shipping services",
    "FedEx returns",
    "FedEx drop off location",
    "FedEx Easy Returns alternative",

    "DHL shipping services",
    "DHL international shipping",
    "DHL express documents",

    "private mailbox rental",
    "virtual mailbox services",
    "mail forwarding services",

    "copy and print services",
    "document shredding services",
    "notary public services",
    "passport photos and mailing",

    "small business shipping support",
    "pack and ship services",
    "local shipping center",
    "local pack and ship alternative to UPS Store",
  ],
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
  buttonLink: "/contact-us",
  variant: "brand",
  align: "center",
};
