import { describe, it, expect } from 'vitest';
import {
  getLocalBusinessSchema,
  getWebSiteSchema,
  getWebPageSchema,
  getServiceSchema,
  getFAQSchema,
  getProductSchema,
  getArticleSchema,
  getTrackingSchema,
} from './schema';
import type { SiteConfig } from '../types/siteConfig';

const mockSiteConfig: SiteConfig = {
  name: 'Mailbox Plus',
  legalName: 'Mailbox Plus LLC',
  tagline: 'Your Packing & Shipping Partner',
  description: 'Full-service packing, shipping, and mailbox rental.',
  domain: 'https://mailboxplusohio.com',
  logo: '/images/logo.png',
  favicon: {
    default: '/favicon.ico',
    appleTouch: '/apple-touch-icon.png',
    android192: '/android-chrome-192x192.png',
    android512: '/android-chrome-512x512.png',
    icon16: '/favicon-16x16.png',
    icon32: '/favicon-32x32.png',
  },
  contact: {
    phone: '(440) 350-1900',
    email: 'info@mailboxplusohio.com',
    address: {
      street: '7683 Crile Rd',
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
    saturday: '10:00 AM - 2:00 PM',
    sunday: 'Closed',
  },
  social: {
    facebook: 'https://facebook.com/mailboxplusohio',
    instagram: 'https://instagram.com/mailboxplusohio',
  },
  geo: {
    lat: 41.66497,
    lng: -81.24164,
  },
  mapUrl: 'https://maps.google.com/?q=Mailbox+Plus',
  areaServed: ['Concord Township', 'Painesville', 'Mentor'],
  knowsAbout: ['Shipping', 'Notary', 'Mailbox Rental'],
  deliveryAddress: {
    '@type': 'PostalAddress',
    addressLocality: 'Concord Township',
    addressRegion: 'OH',
    addressCountry: 'US',
  },
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 120,
    bestRating: 5,
    worstRating: 1,
  },
};

describe('getLocalBusinessSchema', () => {
  it('generates complete LocalBusiness schema with valid site configuration', () => {
    const schema = getLocalBusinessSchema(mockSiteConfig) as unknown as Record<string, unknown>;

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema['@id']).toBe('https://mailboxplusohio.com#localbusiness');
    expect(schema.name).toBe('Mailbox Plus');
    expect(schema.legalName).toBe('Mailbox Plus LLC');
    expect(schema.image).toBe('/images/logo.png');
    expect(schema.url).toBe('https://mailboxplusohio.com/');
    expect(schema.telephone).toBe('(440) 350-1900');
    expect(schema.priceRange).toBe('$35 - $600');
    expect(schema.currenciesAccepted).toBe('USD');
    expect(schema.paymentAccepted).toBe('Cash, Credit Card, Debit Card');

    expect(schema.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '7683 Crile Rd',
      addressLocality: 'Concord Township',
      addressRegion: 'OH',
      postalCode: '44077',
      addressCountry: 'US',
    });

    expect(schema.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 41.66497,
      longitude: -81.24164,
    });

    expect(schema.hasMap).toBe('https://maps.google.com/?q=Mailbox+Plus');
    expect(schema.servesArea).toEqual(['Concord Township, OH', 'Painesville, OH', 'Mentor, OH']);
    expect(schema.knowsAbout).toEqual(['Shipping', 'Notary', 'Mailbox Rental']);
    expect(schema.sameAs).toEqual([
      'https://facebook.com/mailboxplusohio',
      'https://instagram.com/mailboxplusohio',
    ]);
  });

  it('normalizes operating hours into HH:MM OpeningHoursSpecification', () => {
    const schema = getLocalBusinessSchema(mockSiteConfig) as unknown as Record<string, unknown>;
    const hoursSpec = schema.openingHoursSpecification as Array<Record<string, unknown>>;

    expect(hoursSpec).toBeDefined();
    expect(hoursSpec).toHaveLength(6); // Sunday is Closed and excluded

    // Monday: "9:00 AM - 6:00 PM" -> opens: "09:00", closes: "18:00"
    const monday = hoursSpec.find((h) => h.dayOfWeek === 'Monday');
    expect(monday).toEqual({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Monday',
      opens: '09:00',
      closes: '18:00',
    });

    // Saturday: "10:00 AM - 2:00 PM" -> opens: "10:00", closes: "14:00"
    const saturday = hoursSpec.find((h) => h.dayOfWeek === 'Saturday');
    expect(saturday).toEqual({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '14:00',
    });
  });

  it('handles 24-hour time strings and alternative formats in opening hours', () => {
    const customConfig: SiteConfig = {
      ...mockSiteConfig,
      hours: {
        monday: '08:30 - 17:30',
        tuesday: '8:00 am - 5:00 pm',
        wednesday: '12:00 PM - 8:00 PM',
        thursday: '12:00 AM - 12:00 PM',
        friday: 'Closed',
      },
    };

    const schema = getLocalBusinessSchema(customConfig) as unknown as Record<string, unknown>;
    const hoursSpec = schema.openingHoursSpecification as Array<Record<string, unknown>>;

    const monday = hoursSpec.find((h) => h.dayOfWeek === 'Monday');
    expect(monday?.opens).toBe('08:30');
    expect(monday?.closes).toBe('17:30');

    const tuesday = hoursSpec.find((h) => h.dayOfWeek === 'Tuesday');
    expect(tuesday?.opens).toBe('08:00');
    expect(tuesday?.closes).toBe('17:00');

    const wednesday = hoursSpec.find((h) => h.dayOfWeek === 'Wednesday');
    expect(wednesday?.opens).toBe('12:00');
    expect(wednesday?.closes).toBe('20:00');

    const thursday = hoursSpec.find((h) => h.dayOfWeek === 'Thursday');
    expect(thursday?.opens).toBe('00:00');
    expect(thursday?.closes).toBe('12:00');

    expect(hoursSpec.find((h) => h.dayOfWeek === 'Friday')).toBeUndefined();
  });

  it('handles missing optional fields in SiteConfig gracefully', () => {
    const minimalConfig: SiteConfig = {
      name: 'Mailbox Plus',
      tagline: 'Services',
      description: 'Desc',
      domain: 'https://mailboxplusohio.com',
      logo: '/logo.png',
      favicon: mockSiteConfig.favicon,
      contact: {
        phone: '123-456-7890',
        email: 'test@example.com',
        address: {
          street: '123 Main',
          city: 'Concord',
          state: 'OH',
          zip: '44077',
          country: 'US',
        },
      },
      hours: {},
      geo: { lat: 40, lng: -80 },
    };

    const schema = getLocalBusinessSchema(minimalConfig) as unknown as Record<string, unknown>;
    expect(schema.legalName).toBeUndefined();
    expect(schema.hasMap).toBeUndefined();
    expect(schema.openingHoursSpecification).toBeUndefined();
    expect(schema.sameAs).toBeUndefined();
    expect(schema.knowsAbout).toBeUndefined();
  });
});

describe('getWebSiteSchema', () => {
  it('generates standard WebSite schema without search action', () => {
    const schema = getWebSiteSchema(mockSiteConfig);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
    expect(schema['@id']).toBe('https://mailboxplusohio.com#website');
    expect(schema.url).toBe('https://mailboxplusohio.com/');
    expect(schema.name).toBe('Mailbox Plus');
    expect(schema.publisher).toEqual({
      '@id': 'https://mailboxplusohio.com#localbusiness',
    });
    expect(schema.inLanguage).toBe('en-US');
    expect(schema.potentialAction).toBeUndefined();
  });

  it('includes SearchAction when searchUrlTemplate is provided', () => {
    const searchTemplate = 'https://mailboxplusohio.com/search?q={search_term_string}';
    const schema = getWebSiteSchema(mockSiteConfig, searchTemplate);

    expect(schema.potentialAction).toEqual({
      '@type': 'SearchAction',
      target: searchTemplate,
      queryInput: 'required name=search_term_string',
    });
  });
});

describe('getWebPageSchema', () => {
  it('generates complete WebPage schema with breadcrumbs and localbusiness association', () => {
    const schema = getWebPageSchema(mockSiteConfig, {
      name: 'Services - Mailbox Plus',
      description: 'Explore our packing and shipping services.',
      url: '/services',
      breadcrumbItems: [
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' },
      ],
      datePublished: '2025-01-01T00:00:00Z',
      dateModified: '2025-02-01T00:00:00Z',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebPage');
    expect(schema['@id']).toBe('https://mailboxplusohio.com/services/#webpage');
    expect(schema.name).toBe('Services - Mailbox Plus');
    expect(schema.description).toBe('Explore our packing and shipping services.');
    expect(schema.url).toBe('https://mailboxplusohio.com/services/');
    expect(schema.inLanguage).toBe('en-US');
    expect(schema.datePublished).toBe('2025-01-01T00:00:00Z');
    expect(schema.dateModified).toBe('2025-02-01T00:00:00Z');
    expect(schema.about).toEqual({
      '@id': 'https://mailboxplusohio.com#localbusiness',
    });

    expect(schema.breadcrumb).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://mailboxplusohio.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: 'https://mailboxplusohio.com/services/',
        },
      ],
    });
  });

  it('allows disabling localbusiness about property', () => {
    const schema = getWebPageSchema(mockSiteConfig, {
      name: 'Contact',
      description: 'Contact us',
      url: '/contact-us',
      aboutLocalBusiness: false,
    });

    expect(schema.about).toBeUndefined();
  });
});

describe('getServiceSchema', () => {
  it('generates Service schema with offers and reviews', () => {
    const schema = getServiceSchema(mockSiteConfig, {
      serviceName: 'Notary Public Services',
      url: '/home-business/notary-services',
      offers: [{ name: 'Standard Notarization', price: '10.00' }],
      reviews: [
        {
          author: 'Jane Doe',
          datePublished: '2025-03-01',
          reviewBody: 'Fast and reliable notary service.',
          ratingValue: 5,
        },
      ],
      areaServed: ['Concord Township', 'Mentor'],
      category: 'Legal Services',
      serviceOutput: 'Notarized Document',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Service');
    expect(schema['@id']).toBe('https://mailboxplusohio.com#service-notary-public-services');
    expect(schema.serviceType).toBe('Notary Public Services');
    expect(schema.provider).toEqual({
      '@id': 'https://mailboxplusohio.com#localbusiness',
    });
    expect(schema.url).toBe('https://mailboxplusohio.com/home-business/notary-services/');
    expect(schema.areaServed).toEqual(['Concord Township', 'Mentor']);
    expect(schema.category).toBe('Legal Services');
    expect(schema.serviceOutput).toBe('Notarized Document');

    expect(schema.offers).toEqual([
      {
        '@type': 'Offer',
        name: 'Standard Notarization',
        price: '10.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://mailboxplusohio.com/home-business/notary-services/',
      },
    ]);

    expect(schema.review).toEqual([
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Jane Doe' },
        datePublished: '2025-03-01',
        reviewBody: 'Fast and reliable notary service.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1,
        },
      },
    ]);
  });

  it('EXCLUDES aggregateRating from Service schema (Google Nov 2025 search policy compliance)', () => {
    const schema = getServiceSchema(mockSiteConfig, {
      serviceName: 'Mailbox Rental',
      reviews: [
        {
          author: 'John Smith',
          datePublished: '2025-02-15',
          reviewBody: 'Great service',
          ratingValue: 5,
        },
      ],
    });

    // Ensure aggregateRating property is not present on Service schema
    expect((schema as unknown as Record<string, unknown>).aggregateRating).toBeUndefined();
    expect(schema).not.toHaveProperty('aggregateRating');
  });
});

describe('getFAQSchema', () => {
  it('generates FAQPage schema from question and answer list', () => {
    const faqs = [
      { question: 'What are your hours?', answer: 'We are open Mon-Fri 9am-6pm.' },
      { question: 'Do you offer passport photos?', answer: 'Yes, we do.' },
    ];

    const schema = getFAQSchema(mockSiteConfig, faqs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema['@id']).toBe('https://mailboxplusohio.com#faq');
    expect(schema.mainEntity).toEqual([
      {
        '@type': 'Question',
        '@id': 'https://mailboxplusohio.com#faq-q1',
        name: 'What are your hours?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We are open Mon-Fri 9am-6pm.',
        },
      },
      {
        '@type': 'Question',
        '@id': 'https://mailboxplusohio.com#faq-q2',
        name: 'Do you offer passport photos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we do.',
        },
      },
    ]);
  });
});

describe('getProductSchema', () => {
  it('generates Product schema with optional fields', () => {
    const schema = getProductSchema(mockSiteConfig, {
      name: 'Custom Rubber Stamp',
      description: 'Personalized self-inking rubber stamp.',
      sku: 'STAMP-001',
      brand: 'Mailbox Plus',
      image: '/images/stamp.png',
      offers: [{ price: '24.99' }],
      aggregateRating: { ratingValue: 4.8, reviewCount: 15 },
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Product');
    expect(schema['@id']).toBe('https://mailboxplusohio.com#product-custom-rubber-stamp');
    expect(schema.name).toBe('Custom Rubber Stamp');
    expect(schema.description).toBe('Personalized self-inking rubber stamp.');
    expect(schema.sku).toBe('STAMP-001');
    expect(schema.brand).toEqual({ '@type': 'Brand', name: 'Mailbox Plus' });
    expect(schema.image).toBe('/images/stamp.png');
    expect(schema.offers).toEqual([
      {
        '@type': 'Offer',
        price: '24.99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://mailboxplusohio.com/',
      },
    ]);
    expect(schema.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 15,
      bestRating: 5,
      worstRating: 1,
    });
  });

  it('generates Product schema without optional fields', () => {
    const schema = getProductSchema(mockSiteConfig, {
      name: 'Cardboard Box',
      description: 'Heavy duty box',
    });

    expect(schema.sku).toBeUndefined();
    expect(schema.brand).toBeUndefined();
    expect(schema.offers).toBeUndefined();
    expect(schema.aggregateRating).toBeUndefined();
  });
});

describe('getArticleSchema', () => {
  it('generates Article schema with relative image URL normalization', () => {
    const schema = getArticleSchema(mockSiteConfig, {
      headline: 'Shipping Tips for the Holidays',
      description: 'How to ship packages on time during peak season.',
      image: '/images/articles/holiday-shipping.jpg',
      datePublished: '2025-11-01',
      dateModified: '2025-11-05',
      authorName: 'John Editor',
      articleSection: 'Shipping',
      keywords: ['shipping', 'holidays', 'packing'],
      url: '/articles/holiday-shipping',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
    expect(schema['@id']).toBe('https://mailboxplusohio.com/articles/holiday-shipping/#article');
    expect(schema.headline).toBe('Shipping Tips for the Holidays');
    expect(schema.description).toBe('How to ship packages on time during peak season.');
    expect(schema.image).toBe('https://mailboxplusohio.com/images/articles/holiday-shipping.jpg');
    expect(schema.datePublished).toBe('2025-11-01');
    expect(schema.dateModified).toBe('2025-11-05');
    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'John Editor',
    });
    expect(schema.publisher).toEqual({
      '@type': 'Organization',
      '@id': 'https://mailboxplusohio.com#localbusiness',
      name: 'Mailbox Plus',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mailboxplusohio.com/images/logo.png',
      },
    });
    expect(schema.articleSection).toBe('Shipping');
    expect(schema.keywords).toBe('shipping, holidays, packing');
    expect(schema.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://mailboxplusohio.com/articles/holiday-shipping/',
    });
  });

  it('handles absolute image URLs and default author name', () => {
    const schema = getArticleSchema(mockSiteConfig, {
      headline: 'Packing Fragile Glass',
      description: 'Step by step guide to packing glass.',
      image: 'https://images.unsplash.com/photo-12345',
      datePublished: '2025-06-01',
      url: '/articles/packing-glass',
    });

    expect(schema.image).toBe('https://images.unsplash.com/photo-12345');
    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'Mailbox Plus',
    });
  });
});

describe('getTrackingSchema', () => {
  it('generates ParcelDelivery schema when tracking number is present', () => {
    const schema = getTrackingSchema(
      mockSiteConfig,
      '1Z9999999999999999',
      'UPS',
      'https://www.ups.com/track?loc=en_US&tracknum=1Z9999999999999999'
    );

    expect(schema).not.toBeNull();
    expect(schema!['@context']).toBe('https://schema.org');
    expect(schema!['@type']).toBe('ParcelDelivery');
    expect(schema!['@id']).toBe('https://mailboxplusohio.com#parcel-1Z9999999999999999');
    expect(schema!.trackingNumber).toBe('1Z9999999999999999');
    expect(schema!.provider).toEqual({
      '@type': 'Organization',
      name: 'UPS',
    });
    expect(schema!.trackingUrl).toBe(
      'https://www.ups.com/track?loc=en_US&tracknum=1Z9999999999999999'
    );
    expect(schema!.deliveryAddress).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Concord Township',
      addressRegion: 'OH',
      addressCountry: 'US',
    });
  });

  it('returns null if tracking number is empty or falsy', () => {
    expect(getTrackingSchema(mockSiteConfig, '', 'UPS', 'https://ups.com')).toBeNull();
  });
});
