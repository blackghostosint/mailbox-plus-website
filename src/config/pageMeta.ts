import { services } from './services';
import { siteConfig } from './siteConfig';
import { getWebPageSchema, getServiceSchema } from '../utils/schema';
import type { WithContext, LocalBusiness, WebPage, Service } from 'schema-dts';

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
    title: 'Mailbox Plus - Your Shipping and Business Services Partner',
    description:
      'Mailbox Plus in Concord Township, Ohio is your local partner for shipping (FedEx, UPS, USPS, DHL), mailbox rentals, printing, and business services. Serving Lake County.',
    ...geoMeta,
  },
  // Services page
  '/services': {
    title: 'Our Services | Mailbox Plus',
    description:
      'Explore our comprehensive business services: shipping, printing, mailbox rentals, notary, shredding, and more. Your local solution in Concord Township, Ohio.',
    ...geoMeta,
  },
  // About Us page with web page schema
  '/about-us': {
    title: 'About Us | Mailbox Plus',
    description:
      'Learn about Mailbox Plus, your family-owned local pack-and-ship store in Concord Township, Ohio. Faith-guided and dedicated to serving our Lake County neighbors with care.',
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
