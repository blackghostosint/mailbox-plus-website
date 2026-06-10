import { services } from '../config/services';
import { serviceAreas } from '../config/serviceAreas';

export interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
}

export const getSearchData = (): SearchResult[] => {
  const serviceResults: SearchResult[] = services.map((service) => ({
    title: service.serviceName,
    description: service.heroSubtitle || service.metaDescription,
    href: service.slug || service.id || '#',
    category: service.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  }));

  const locationResults: SearchResult[] = serviceAreas.map((page) => ({
    title: `Shipping & Printing in ${page.city}`,
    description: `Local services for ${page.city}, Ohio`,
    href: page.canonicalUrl || page.slug || '#',
    category: 'Locations',
  }));

  const generalResults: SearchResult[] = [
    {
      title: 'Track a Package',
      description: 'Track your FedEx, UPS, USPS, or DHL shipment',
      href: '/tracking',
      category: 'Tools',
    },
    {
      title: 'About Us',
      description: 'Learn more about Mailbox Plus and our team',
      href: '/about-us',
      category: 'Company',
    },
    {
      title: 'Contact Us',
      description: 'Get in touch with us or find our location',
      href: '/contact-us',
      category: 'Company',
    },
    {
      title: 'Shipping Partners',
      description: 'View our carrier partners and shipping options',
      href: '/shipping-partners',
      category: 'Company',
    },
  ];

  return [...serviceResults, ...locationResults, ...generalResults];
};
