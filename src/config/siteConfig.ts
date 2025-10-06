import type { CTA } from "../types/services";

export const siteConfig = {
  name: "Mailbox Plus Ohio",
  tagline: "Let Us Handle Your Package!",
  description:
    "Community-focused pack & ship retail store in Concord Township, Ohio. FedEx, UPS, USPS shipping, mailbox rentals, printing, and fingerprinting services.",
  domain: "https://mailboxplusohio.com",
  logo: "/logo.png",
  contact: {
    phone: "440-709-1946",
    email: "help@mailboxplusohio.com",
    address: {
      street: "7554 Fredle Drive",
      city: "Concord Township",
      state: "OH",
      zip: "44077",
      country: "US"
    }
  },
  hours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "9:00 AM - 2:00 PM",
    sunday: "Closed"
  },
  social: {
    facebook: "https://www.facebook.com/mailboxplusohio",
    instagram: "https://www.instagram.com/mailboxplusohio",
    nextdoor: "https://nextdoor.com/pages/mailbox-plus-concord-township-oh"
  },
  geo: {
    lat: 41.664959,
    lng: -81.246493
  }
};

// Default CTA for site-wide fallback
export const defaultCTA: CTA = {
  title: "Ready to get started?",
  subtitle: "Stop in today or message us—let us handle your package!",
  buttonText: "Visit Us in Concord Township",
  buttonLink: "/contact",
  variant: "brand",
  align: "center"
};
