import { services } from './services';
import { siteConfig } from './siteConfig';
import { getLocalBusinessSchema, getWebPageSchema, getServiceSchema } from '../utils/schema';
import type { WithContext, LocalBusiness, WebPage, Service } from 'schema-dts';

const localBusinessSchema = getLocalBusinessSchema(siteConfig);

const serviceSchemaMap: Record<string, WithContext<Service>> = services.reduce((acc, service) => {
  acc[service.slug] = getServiceSchema(siteConfig, {
    serviceName: service.serviceName,
    url: `${siteConfig.domain}${service.slug}`,
    areaServed: ['Concord Township', 'Lake County', 'Ohio'],
    category: service.category,
  });
  return acc;
}, {} as Record<string, WithContext<Service>>);

export const pageMeta: Record<string, { title: string; description: string; schema?: (WithContext<LocalBusiness> | WithContext<WebPage> | WithContext<Service>)[] }> = {
  // Home page with local business schema
  '/': {
    title: 'Mailbox Plus - Your Shipping and Business Services Partner',
    description: 'Mailbox Plus offers reliable shipping, mailbox rentals, printing, and notary services. Your one-stop shop for personal and business needs.',
    schema: [localBusinessSchema],
  },
  // Services page
  '/services': {
    title: 'Our Services | Mailbox Plus',
    description: 'Explore all the shipping, printing, mailbox rental, and business services offered by Mailbox Plus in Concord Township, Ohio.',
  },
  // About Us page with web page schema
  '/about-us': {
    title: 'About Us | Mailbox Plus',
    description: 'Learn about Mailbox Plus — your trusted local pack-and-ship store in Concord Township, Lake County, Ohio. Family-owned, faith-guided, serving neighbors with care.',
    schema: [getWebPageSchema(siteConfig, {
      name: 'About Mailbox Plus',
      description: 'Learn about Mailbox Plus — your trusted local pack-and-ship store in Concord Township, Lake County, Ohio. Family-owned, faith-guided, serving neighbors with care.',
      url: `${siteConfig.domain}/about-us`,
      breadcrumbItems: [
        { name: 'Home', url: siteConfig.domain },
        { name: 'About Us', url: `${siteConfig.domain}/about-us` },
      ],
    })],
  },
  // Generate from services.ts with service schemas
  ...services.reduce((acc, service) => {
    acc[service.slug] = {
      title: service.pageTitle,
      description: service.metaDescription,
      schema: [serviceSchemaMap[service.slug]],
    };
    return acc;
  }, {} as Record<string, { title: string; description: string; schema?: (WithContext<LocalBusiness> | WithContext<WebPage> | WithContext<Service>)[] }>),
};