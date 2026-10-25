import { services } from './services';
import { siteConfig, phoneFormatted } from './siteConfig';
import { getLocalBusinessSchema, getWebPageSchema, getServiceSchema } from '../utils/schema';
import type { WithContext, LocalBusiness, WebPage, Service } from 'schema-dts';

const localBusinessSchema = getLocalBusinessSchema(siteConfig);

// Geo meta tags for local SEO (from siteConfig)
const geoMeta = {
  geoRegion: 'US-OH',
  geoPlacename: 'Concord Township',
  geoPosition: `${siteConfig.geo.lat};${siteConfig.geo.lng}`,
  icbm: `${siteConfig.geo.lat}, ${siteConfig.geo.lng}`,
};

const serviceSchemaMap: Record<string, WithContext<Service>> = services.reduce(
  (acc, service) => {
    acc[service.slug] = getServiceSchema(siteConfig, {
      serviceName: service.serviceName,
      url: `${siteConfig.domain}${service.slug}`,
      areaServed: ['Concord Township', 'Lake County', 'Ohio'],
      category: service.category,
    });
    return acc;
  },
  {} as Record<string, WithContext<Service>>
);

export const pageMeta: Record<
  string,
  {
    title: string;
    description: string;
    schema?: (WithContext<LocalBusiness> | WithContext<WebPage> | WithContext<Service>)[];
    geoRegion?: string;
    geoPlacename?: string;
    geoPosition?: string;
    icbm?: string;
  }
> = {
  // Home page with local business schema
  '/': {
    title: 'Mailbox Plus | Stop Running Around Lake County | Shipping & Mailbox Rentals',
    description:
      'Four carriers, one counter, no runaround. Mailbox Plus in Concord Township handles UPS, FedEx, DHL & USPS — plus mailboxes, notary & printing. 5.0★. Call (440) 709-1946.',
    schema: [localBusinessSchema],
    ...geoMeta,
  },
  // 404 Error page
  '/404': {
    title: '404 - Page Not Found | Mailbox Plus',
    description:
      'Sorry, the page you are looking for does not exist. Please check the URL or return to the homepage.',
    ...geoMeta,
  },
  // Services page
  '/services': {
    title: 'Our Services | Mailbox Plus — Concord Township, OH',
    description:
      'Explore our comprehensive business services: shipping, printing, mailbox rentals, notary, shredding, and more. Your local solution in Concord Township, Ohio.',
    ...geoMeta,
  },
  // About Us page with web page schema
  '/about-us': {
    title: 'About Mailbox Plus | Locally Owned Shipping & Business Services in Concord Township',
    description:
      'Learn about Mailbox Plus — your trusted, locally owned partner for shipping, printing, mailbox rentals, and business services in Concord Township and Lake County, Ohio.',
    schema: [
      getWebPageSchema(siteConfig, {
        name: 'About Mailbox Plus',
        description:
          'Learn about Mailbox Plus, your family-owned local pack-and-ship store in Concord Township, Ohio. Faith-guided and dedicated to serving our Lake County neighbors with care.',
        url: `${siteConfig.domain}/about-us`,
        breadcrumbItems: [
          { name: 'Home', url: siteConfig.domain },
          { name: 'About Us', url: `${siteConfig.domain}/about-us` },
        ],
      }),
    ],
    ...geoMeta,
  },
  // Accessibility Statement
  '/accessibility': {
    title: 'Accessibility Statement | Mailbox Plus',
    description:
      'Mailbox Plus is committed to digital accessibility and WCAG 2.1 AA compliance. Report an accessibility barrier or request an accommodation.',
    ...geoMeta,
  },
  // After Signup Guide
  '/after-signup': {
    title: 'After Signing Up for Mailbox Service | Mailbox Plus Next Steps',
    description:
      'See what happens next after signing up for mailbox service at Mailbox Plus. Watch our explainer video and get your Concord Township mailbox setup guide.',
    ...geoMeta,
  },
  // Tailgate Giveaway
  '/tailgate-giveaway': {
    title: 'Win a Cleveland Browns Tailgate Set — November Giveaway at Mailbox Plus',
    description:
      'Enter free in-store to win a Browns 9x9 canopy + 2 quad chairs ($360 value) from Mailbox Plus in Concord Twp. Drawing Nov 27 — winner tailgates Nov 29.',
    ...geoMeta,
  },
  // Amazon Counter Page
  '/amazon-counter': {
    title: 'Amazon Returns Counter for Concord Twp (44077) — Help Us Bring It Home',
    description:
      "Concord Twp, OH — we're pushing to become your official Amazon returns counter. No box, no label, just a QR scan. Here's how you help make it happen.",
    ...geoMeta,
  },
  // Articles & Guides Index
  '/articles': {
    title: 'Articles & Guides | Mailbox Plus',
    description:
      'Read articles and guides about shipping, printing, mailbox rentals, and business services from Mailbox Plus in Concord Township, Ohio.',
    ...geoMeta,
  },
  // Ask Mailbox Plus (FAQ)
  '/ask-mailbox-plus': {
    title: 'Ask Mailbox Plus | FAQ',
    description:
      'Frequently asked questions about our shipping, printing, mailbox, and other services in Concord Township.',
    ...geoMeta,
  },
  // Contact Us
  '/contact-us': {
    title: 'Contact Us - Mailbox Plus',
    description:
      'Get in touch with Mailbox Plus in Concord Township, Ohio. Call, email, or visit us for all your shipping and printing needs.',
    ...geoMeta,
  },
  // Home & Business Hub
  '/home-business': {
    title: 'Home & Business Services | Mailbox Plus',
    description:
      'Mailbox rentals, virtual mailbox, shredding, document scanning, fax, and notary services in Concord Township, Ohio.',
    ...geoMeta,
  },
  // Mailbox Rental Concord Ohio Landing
  '/mailbox-rental-concord-ohio': {
    title: 'Mailbox Rental in Concord Township | Mailbox Plus',
    description: `Rent a private mailbox in Concord Township (44077) for business or personal use. Real street address, package acceptance from all carriers, 24/7 access, and notary services on-site. Rated 5.0★ on Google. Call ${phoneFormatted}.`,
    ...geoMeta,
  },
  // Carrier Pickup Hours
  '/pickup-hours': {
    title: 'Carrier Pickup Hours | Mailbox Plus',
    description:
      "Check daily pickup times for UPS, FedEx, and USPS at Mailbox Plus in Concord Township. Miss the truck? We'll secure your package for the next day.",
    ...geoMeta,
  },
  // Privacy Policy
  '/privacy': {
    title: 'Privacy Policy | Mailbox Plus',
    description:
      'Mailbox Plus privacy policy — how we collect, use, and protect your personal information.',
    ...geoMeta,
  },
  // Private Mailbox Rental Landing Page
  '/private-mailbox-rental': {
    title: 'Private Mailbox Rental in Concord Township | Mailbox Plus',
    description:
      'Stop checking your phone for missed deliveries. Get a real Concord Township street address. All 4 carriers, from $15/month. Month-to-month, cancel anytime. Completely risk-free.',
    ...geoMeta,
  },
  // Rental Agreement
  '/rental-agreement': {
    title: 'Mailbox Service Agreement | Mailbox Plus',
    description:
      'The Mailbox Service Agreement that governs private mailbox rentals at Mailbox Plus of Ohio, LLC in Concord Township, Ohio — including fees, key deposit, delivery terms, and consent to communications.',
    ...geoMeta,
  },
  // OSINT Research Paper
  '/research/shipping-label-osint': {
    title: 'Shipping Label OSINT | Mailbox Plus',
    description:
      'A shipping label has your name and address. A bad actor uses OSINT to turn those two facts into your phone, email, social accounts, and more. See the attack path and how to defend against it.',
    ...geoMeta,
  },
  // Service Area Index
  '/service-area': {
    title: 'Service Area | Mailbox Plus — Concord Township, OH',
    description:
      'Serving Concord Township, Mentor, Painesville, Willoughby, Eastlake, and all of Lake County, Ohio with shipping, printing, mailbox rentals, and more.',
    ...geoMeta,
  },
  // Shipping Partners
  '/shipping-partners': {
    title: 'Shipping Partners | Mailbox Plus',
    description:
      'Authorized shipping services for FedEx, UPS, USPS, and DHL in Concord Township. Compare rates and services at one convenient location.',
    ...geoMeta,
  },
  // SMS & Email Consent (A2P 10DLC)
  '/sms-consent': {
    title: 'SMS & Email Consent (A2P 10DLC) | Mailbox Plus',
    description:
      'The express written consent terms for receiving email and SMS text message communications from Mailbox Plus of Ohio, LLC — service notifications, package arrival alerts, billing reminders, and account updates.',
    ...geoMeta,
  },
  // Terms of Service
  '/terms': {
    title: 'Terms of Service | Mailbox Plus',
    description:
      'Mailbox Plus terms and conditions for website use and services offered at our Concord Township, Ohio location.',
    ...geoMeta,
  },
  // Thank You Confirmation Page
  '/thank-you': {
    title: "You're All Set — Your Mailbox Is Reserved | Mailbox Plus",
    description:
      'Your Mailbox Plus mailbox is reserved. Here is exactly what to bring and what happens next — two IDs, a 10-minute in-store visit, and your key.',
    ...geoMeta,
  },
  // Track Package
  '/tracking': {
    title: 'Track a Package | Mailbox Plus — Concord Township, OH',
    description:
      'Track your FedEx, UPS, USPS, or DHL package dropped off at Mailbox Plus in Concord Township, Ohio. Use carrier tracking portals or contact us for assistance.',
    ...geoMeta,
  },
  // Generate from services.ts with service schemas
  ...services.reduce(
    (acc, service) => {
      acc[service.slug] = {
        title: service.pageTitle,
        description: service.metaDescription,
        schema: [serviceSchemaMap[service.slug]],
        ...geoMeta,
      };
      return acc;
    },
    {} as Record<
      string,
      {
        title: string;
        description: string;
        schema?: (WithContext<LocalBusiness> | WithContext<WebPage> | WithContext<Service>)[];
        geoRegion?: string;
        geoPlacename?: string;
        geoPosition?: string;
        icbm?: string;
      }
    >
  ),
};

export function getPageMeta(pathname: string) {
  if (!pathname) return undefined;
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutSlash =
    cleanPath.length > 1 && cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath;
  const withSlash = withoutSlash === '/' ? '/' : `${withoutSlash}/`;

  return pageMeta[cleanPath] || pageMeta[withoutSlash] || pageMeta[withSlash];
}
