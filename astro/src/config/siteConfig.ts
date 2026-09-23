/* global process */
import type { CTA } from '../types/services';
import type { SiteConfig } from '../types/siteConfig';

function getNetlifyContext(): string | undefined {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_NETLIFY_CONTEXT) return import.meta.env.VITE_NETLIFY_CONTEXT;
    if (import.meta.env.CONTEXT) return import.meta.env.CONTEXT;
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_NETLIFY_CONTEXT) return process.env.VITE_NETLIFY_CONTEXT;
    if (process.env.CONTEXT) return process.env.CONTEXT;
  }
  return undefined;
}

function getSiteDomain(): string {
  const explicitSiteUrl =
    (typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SITE_URL || import.meta.env.SITE_URL
      : undefined) ||
    (typeof process !== 'undefined' && process.env
      ? process.env.VITE_SITE_URL || process.env.SITE_URL
      : undefined);

  if (explicitSiteUrl) {
    const url =
      explicitSiteUrl.startsWith('http://') || explicitSiteUrl.startsWith('https://')
        ? explicitSiteUrl
        : `https://${explicitSiteUrl}`;
    return url.replace(/\/+$/, '');
  }

  const context = getNetlifyContext();
  const isPreview = context === 'deploy-preview' || context === 'branch-deploy';

  if (isPreview) {
    const previewUrl =
      (typeof import.meta !== 'undefined' && import.meta.env
        ? import.meta.env.DEPLOY_PRIME_URL || import.meta.env.URL
        : undefined) ||
      (typeof process !== 'undefined' && process.env
        ? process.env.DEPLOY_PRIME_URL || process.env.URL
        : undefined);

    if (previewUrl) {
      const url =
        previewUrl.startsWith('http://') || previewUrl.startsWith('https://')
          ? previewUrl
          : `https://${previewUrl}`;
      return url.replace(/\/+$/, '');
    }
  }

  return 'https://mailboxplusohio.com';
}

export const siteConfig: SiteConfig = {
  name: 'Mailbox Plus',
  legalName: 'Mailbox Plus of Ohio, LLC',
  tagline: "Shipping shouldn't cost you an hour.",
  description:
    'Community-focused pack & ship retail store in Concord Township, Ohio. FedEx, UPS, USPS shipping, mailbox rentals, printing, and fingerprinting services.',
  get domain(): string {
    return getSiteDomain();
  },
  logo: '/mailbox_plus_logo.webp',
  favicon: {
    default: `${typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_R2_PUBLIC_BASE_URL : process.env.VITE_R2_PUBLIC_BASE_URL || ''}/favicon_io/favicon-32x32.png`,
    appleTouch: `${typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_R2_PUBLIC_BASE_URL : process.env.VITE_R2_PUBLIC_BASE_URL || ''}/favicon_io/apple-touch-icon.png`,
    android192: `${typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_R2_PUBLIC_BASE_URL : process.env.VITE_R2_PUBLIC_BASE_URL || ''}/favicon_io/android-chrome-192x192.png`,
    android512: `${typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_R2_PUBLIC_BASE_URL : process.env.VITE_R2_PUBLIC_BASE_URL || ''}/favicon_io/android-chrome-512x512.png`,
    icon16: `${typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_R2_PUBLIC_BASE_URL : process.env.VITE_R2_PUBLIC_BASE_URL || ''}/favicon_io/favicon-16x16.png`,
    icon32: `${typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_R2_PUBLIC_BASE_URL : process.env.VITE_R2_PUBLIC_BASE_URL || ''}/favicon_io/favicon-32x32.png`,
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
  accessibility: {
    complianceStandard: 'WCAG 2.1 AA',
    contactEmail: 'help@mailboxplusohio.com',
    phone: '440-709-1946',
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
    yelp: 'https://www.yelp.com/biz/mailbox-plus-concord-township',
    linkedin: 'https://www.linkedin.com/company/mailboxplusohio',
    googleBusiness: 'https://maps.google.com/?cid=14933291064823483788',
  },
  geo: {
    lat: 41.66497,
    lng: -81.24164,
  },

  // ✅ new fields
  mapUrl: 'https://maps.app.goo.gl/Rs1NQkR6gRrtxAq37',
  areaServed: [
    'Concord Township',
    'Mentor',
    'Painesville',
    'Eastlake',
    'Lake County',
    'Chardon',
    'Willoughby',
    'Madison',
    'Perry',
    'Kirtland',
    'Fairport Harbor',
    'Geneva',
    'Wickliffe',
    'Willoughby Hills',
  ],
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

  // Source of Truth fields
  foundingYear: 2024,
  openingDate: '2025-05-05',

  // Google Business Profile review data for LocalBusiness schema
  aggregateRating: {
    ratingValue: 5.0,
    reviewCount: 37,
    bestRating: 5,
    worstRating: 1,
  },
};

export const fullAddressSingleLine = `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.zip}`;

export const fullAddressMultiLine = `${siteConfig.contact.address.street}\n${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.zip}`;

export const phoneFormatted = `(${siteConfig.contact.phone.slice(0, 3)}) ${siteConfig.contact.phone.slice(4)}`;

export const phoneTelLink = `tel:${siteConfig.contact.phone.replace(/[^0-9]/g, '')}`;

export const storeHoursList = [
  `Monday - Friday: ${siteConfig.hours.monday}`,
  `Saturday: ${siteConfig.hours.saturday}`,
  `Sunday: ${siteConfig.hours.sunday}`,
];

export const formattedHoursList = storeHoursList;

export const hoursSummary = `Mon-Fri: ${siteConfig.hours.monday}, Sat: ${siteConfig.hours.saturday}, Sun: ${siteConfig.hours.sunday}`;

siteConfig.phoneFormatted = phoneFormatted;
siteConfig.phoneTelLink = phoneTelLink;
siteConfig.fullAddressSingleLine = fullAddressSingleLine;
siteConfig.fullAddressMultiLine = fullAddressMultiLine;
siteConfig.storeHoursList = storeHoursList;
siteConfig.formattedHoursList = formattedHoursList;
siteConfig.hoursSummary = hoursSummary;

export const defaultCTA: CTA = {
  title: 'Ready to get started?',
  subtitle: 'Stop in today or message us—let us handle your package!',
  buttonText: 'Visit Us in Concord Township',
  buttonLink: '/contact-us',
  variant: 'brand',
  align: 'center',
};
