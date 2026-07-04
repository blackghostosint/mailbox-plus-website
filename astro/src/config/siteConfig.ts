import type { CTA } from '../types/services';
import type { SiteConfig } from '../types/siteConfig';

export const siteConfig: SiteConfig = {
  name: 'Mailbox Plus',
  tagline: "Shipping shouldn't cost you an hour.",
  description:
    'Community-focused pack & ship retail store in Concord Township, Ohio. FedEx, UPS, USPS shipping, mailbox rentals, printing, and fingerprinting services.',
  domain: 'https://mailboxplusohio.com',
  logo: '/mailbox_plus_logo.webp',
  favicon: {
    default: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/favicon-32x32.png`,
    appleTouch: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/apple-touch-icon.png`,
    android192: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/android-chrome-192x192.png`,
    android512: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/android-chrome-512x512.png`,
    icon16: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/favicon-16x16.png`,
    icon32: `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}/favicon_io/favicon-32x32.png`,
  },
  contact: {
    phone: '440-709-1946',
    email: 'help@mailboxplusohio.com',
    address: {
      street: '7554 Fredle Drive',
      city: 'Concord Township',
      state: 'OH',
      zip: '44077',
      country: 'US',
    },
  },
  hours: {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Closed',
  },
  social: {
    facebook: 'https://www.facebook.com/mailboxplusohio',
    instagram: 'https://www.instagram.com/mailboxplusohio',
    nextdoor: 'https://nextdoor.com/pages/mailbox-plus-concord-township-oh',
  },
  geo: {
    lat: 41.66497,
    lng: -81.24164,
  },

  // ✅ new fields
  mapUrl: 'https://maps.app.goo.gl/Rs1NQkR6gRrtxAq37',
  areaServed: ['Concord Township', 'Mentor', 'Painesville', 'Eastlake', 'Lake County'],
  knowsAbout: [
    'USPS services',
    'USPS shipping',
    'USPS package drop',
    'USPS certified mail assistance',
    'USPS Priority Mail help',
    'post office alternative',
    'post office near me services',

    'UPS Store services',
    'UPS Store shipping',
    'UPS Store printing services',
    'UPS Store mailbox rental',
    'UPS Store notary services',
    'UPS Store packaging',
    'UPS Store alternative',

    'FedEx Store services',
    'FedEx Office services',
    'FedEx Office printing',
    'FedEx Office notary',
    'FedEx package drop-off',
    'FedEx returns',
    'FedEx shipping center',
    'FedEx Store alternative',

    'Mail Boxes Etc services',
    'Mail Boxes Etc shipping',
    'Mail Boxes Etc mailbox rental',
    'Mail Boxes Etc printing',
    'Mail Boxes Etc packaging',
    'Mail Boxes Etc alternative',

    'Staples printing services',
    'Staples document services',
    'Staples passport photos',
    'Staples shipping services',
    'Staples alternative',

    'Office Depot printing services',
    'Office Depot document services',
    'Office Depot shipping center',
    'Office Depot alternative',

    'private mailbox rental',
    'virtual mailbox services',
    'mail forwarding services',
    'notary public services',
    'packing and shipping services',
    'local shipping center',
    'small business shipping support',
  ],
  deliveryAddress: {
    '@type': 'PostalAddress',
    addressLocality: 'Concord Township',
    addressRegion: 'OH',
    addressCountry: 'US',
  },
  premierSignupUrl: 'https://mailbox-plus-loyalty-card.web.app/#/register?campaign=website-signup',
  premierSignupModalEnabled: false,
  plusPointsSignupUrl: '/rewards/join',
  plusPointsSignupModalEnabled: false,

  // Source of Truth fields
  foundingYear: 2024,
  openingDate: '2025-05-05',

  // Google Business Profile review data for LocalBusiness schema
  aggregateRating: {
    ratingValue: 5.0,
    reviewCount: 32,
    bestRating: 5,
    worstRating: 1,
  },
};

export const defaultCTA: CTA = {
  title: 'Ready to get started?',
  subtitle: 'Stop in today or message us—let us handle your package!',
  buttonText: 'Visit Us in Concord Township',
  buttonLink: '/contact-us',
  variant: 'brand',
  align: 'center',
};
