import type {
  WithContext,
  LocalBusiness,
  WebSite,
  WebPage,
  Service,
  SearchAction,
  FAQPage,
  Product,
  Article,
  ParcelDelivery,
  Offer,
  ItemAvailability,
  AggregateRating,
  ContactPoint,
  OpeningHoursSpecification,
} from 'schema-dts';

import type { SiteConfig } from '../types/siteConfig';

/** ---------- Small helpers ---------- */
const getOrigin = (config: SiteConfig) => (config.domain || '').replace(/\/+$/, '');

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const dayName = (d: string) => {
  const map: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };
  const key = (d || '').toLowerCase();
  return map[key] || d.charAt(0).toUpperCase() + d.slice(1);
};

// Normalize "9:00 AM" / "09:00" to "HH:MM"
const toHHMM = (t: string) => {
  if (!t) return t;

  const ampm = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = parseInt(ampm[2] || '0', 10);
    const isPM = /pm/i.test(ampm[3]);
    if (h === 12) h = isPM ? 12 : 0;
    else if (isPM) h += 12;
    if (h < 0 || h > 23 || m < 0 || m > 59) return t;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  const hhmm = t.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (hhmm) {
    const h = parseInt(hhmm[1], 10);
    const m = parseInt(hhmm[2], 10);
    if (h < 0 || h > 23 || m < 0 || m > 59) return t;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  return t;
};

/** ---------- LocalBusiness ---------- */
export const getLocalBusinessSchema = (config: SiteConfig): WithContext<LocalBusiness> => {
  const socialLinks = Object.values(config.social || {}).filter(Boolean) as string[];

  const openingHoursSpecification = Object.entries(config.hours || {}).flatMap(([day, hours]) => {
    if (!hours || /closed/i.test(hours)) return [];
    const parts = hours.split(/\s*-\s*/);
    if (parts.length !== 2) return [];
    const [opensRaw, closesRaw] = parts;
    return [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayName(day),
        opens: toHHMM(opensRaw),
        closes: toHHMM(closesRaw),
      } as OpeningHoursSpecification,
    ];
  });

  // Service types from Source of Truth
  const serviceTypes = [
    'Mailbox rental',
    'Shipping service',
    'Printing service',
    'Notary public',
    'Document shredding',
    'Fax service',
    'Document scanning',
    'Business services',
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${getOrigin(config)}#localbusiness`,
    name: config.name,
    image: config.logo,
    url: getOrigin(config),
    telephone: config.contact?.phone,
    priceRange: '$35 - $600',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.contact?.address?.street,
      addressLocality: config.contact?.address?.city,
      addressRegion: config.contact?.address?.state,
      postalCode: config.contact?.address?.zip,
      addressCountry: config.contact?.address?.country,
    },
    geo: config.geo && {
      '@type': 'GeoCoordinates',
      latitude: config.geo.lat,
      longitude: config.geo.lng,
    },
    ...(config.mapUrl && { hasMap: config.mapUrl }),
    ...(config.areaServed && {
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: config.geo?.lat ?? 41.66497,
          longitude: config.geo?.lng ?? -81.24164,
        },
        geoRadius: '32187', // 20 miles in meters
      },
    }),
    ...(config.knowsAbout && { knowsAbout: config.knowsAbout }),
    serviceType: serviceTypes,
    ...(config.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: config.aggregateRating.ratingValue,
        reviewCount: config.aggregateRating.reviewCount,
        bestRating: config.aggregateRating.bestRating,
        worstRating: config.aggregateRating.worstRating,
      },
    }),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: config.contact?.phone,
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    } as ContactPoint,
    ...(openingHoursSpecification.length ? { openingHoursSpecification } : {}),
    ...(socialLinks.length ? { sameAs: socialLinks } : {}),
    foundingDate: '2024',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: config.contact?.address?.street,
        addressLocality: config.contact?.address?.city,
        addressRegion: config.contact?.address?.state,
        postalCode: config.contact?.address?.zip,
        addressCountry: config.contact?.address?.country,
      },
    },
  } as WithContext<LocalBusiness>;
};

/** ---------- WebSite ---------- */
export const getWebSiteSchema = (
  config: SiteConfig,
  searchUrlTemplate?: string
): WithContext<WebSite> => {
  const schema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getOrigin(config)}#website`,
    url: getOrigin(config),
    name: config.name,
    publisher: { '@id': `${getOrigin(config)}#localbusiness` },
    inLanguage: 'en-US',
  };

  if (searchUrlTemplate) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: searchUrlTemplate,
      queryInput: 'required name=search_term_string',
    } as SearchAction;
  }

  return schema;
};

/** ---------- WebPage ---------- */
export const getWebPageSchema = (
  config: SiteConfig,
  {
    name,
    description,
    url,
    breadcrumbItems,
    datePublished,
    dateModified,
    aboutLocalBusiness = true,
  }: {
    name: string;
    description: string;
    url: string;
    breadcrumbItems?: { name: string; url: string }[];
    datePublished?: string;
    dateModified?: string;
    aboutLocalBusiness?: boolean;
  }
): WithContext<WebPage> => {
  const pageUrl = url.replace(/\/+$/, '');
  const schema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    name,
    description,
    url: pageUrl,
    inLanguage: 'en-US',
    publisher: { '@id': `${getOrigin(config)}#localbusiness` },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(aboutLocalBusiness && { about: { '@id': `${getOrigin(config)}#localbusiness` } }),
  };

  if (breadcrumbItems?.length) {
    schema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  return schema;
};

/** ---------- Service ---------- */
export const getServiceSchema = (
  config: SiteConfig,
  {
    serviceName,
    url,
    offers,
    reviews,
    // aggregateRating removed — see type comment below
    areaServed,
    category,
    serviceOutput,
  }: {
    serviceName: string;
    url?: string;
    offers?: { name: string; price: string; currency?: string; availability?: string }[];
    reviews?: {
      author: string;
      datePublished: string;
      reviewBody: string;
      ratingValue: number;
    }[];
    // ⚠️ aggregateRating intentionally removed from Service schema (Nov 2025 Google change).
    // Service is no longer a supported parent type for nested AggregateRating review snippets.
    // Keep it on LocalBusiness (rendered via Layout.tsx) instead.
    areaServed?: string[];
    category?: string;
    serviceOutput?: string;
  }
): WithContext<Service> => {
  const id = `${getOrigin(config)}#service-${slugify(serviceName)}`;
  const schema: WithContext<Service> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': id,
    serviceType: serviceName,
    provider: { '@id': `${getOrigin(config)}#localbusiness` },
    ...(url && { url }),
    ...(areaServed?.length ? { areaServed } : {}),
    ...(category && { category }),
    ...(serviceOutput && { serviceOutput }),
  };

  if (offers?.length) {
    schema.offers = offers.map<Offer>((o) => ({
      '@type': 'Offer',
      name: o.name,
      price: o.price,
      priceCurrency: o.currency || 'USD',
      availability: (o.availability as ItemAvailability) || 'https://schema.org/InStock',
      url: url || getOrigin(config),
    }));
  }

  if (reviews?.length) {
    schema.review = reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.datePublished,
      reviewBody: r.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.ratingValue,
        bestRating: 5,
        worstRating: 1,
      },
    }));

    // ⚠️ aggregateRating intentionally removed for Service — Google deprecated Service
    // as a parent type for nested AggregateRating review snippets (Nov 2025).
    // Keep it on LocalBusiness (via Layout.tsx) instead.
  }

  return schema;
};

/** ---------- FAQ ---------- */
export const getFAQSchema = (
  config: SiteConfig,
  faqs: { question: string; answer: string }[]
): WithContext<FAQPage> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${getOrigin(config)}#faq`,
  mainEntity: faqs.map((faq, i) => ({
    '@type': 'Question',
    '@id': `${getOrigin(config)}#faq-q${i + 1}`,
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/** ---------- Product ---------- */
export const getProductSchema = (
  config: SiteConfig,
  {
    name,
    description,
    sku,
    brand,
    image,
    offers,
    aggregateRating,
  }: {
    name: string;
    description: string;
    sku?: string;
    brand?: string;
    image?: string | string[];
    offers?: { price: string; currency?: string; availability?: string }[];
    aggregateRating?: { ratingValue: number; reviewCount: number };
  }
): WithContext<Product> => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${getOrigin(config)}#product-${slugify(name)}`,
  name,
  description,
  ...(sku && { sku }),
  ...(brand && { brand: { '@type': 'Brand', name: brand } }),
  ...(image && { image }),
  ...(offers?.length && {
    offers: offers.map<Offer>((o) => ({
      '@type': 'Offer',
      price: o.price,
      priceCurrency: o.currency || 'USD',
      availability: (o.availability as ItemAvailability) || 'https://schema.org/InStock',
      url: getOrigin(config),
    })),
  }),
  ...(aggregateRating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    } as AggregateRating,
  }),
});

/** ---------- Article ---------- */
export const getArticleSchema = (
  config: SiteConfig,
  {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    authorName,
    articleSection,
    keywords,
    url,
  }: {
    headline: string;
    description: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    authorName?: string;
    articleSection?: string;
    keywords?: string[];
    url: string;
  }
): WithContext<Article> => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${url}#article`,
  headline,
  description,
  ...(image && { image }),
  datePublished,
  ...(dateModified && { dateModified }),
  author: {
    '@type': 'Person',
    name: authorName || config.name,
  },
  publisher: {
    '@type': 'Organization',
    '@id': `${getOrigin(config)}#localbusiness`,
    name: config.name,
    logo: {
      '@type': 'ImageObject',
      url: config.logo,
    },
  },
  ...(articleSection && { articleSection }),
  ...(keywords?.length && { keywords: keywords.join(', ') }),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url,
  },
});

/** ---------- ParcelDelivery ---------- */
export const getTrackingSchema = (
  config: SiteConfig,
  trackingNumber: string,
  carrierName: string,
  trackingUrl: string
): WithContext<ParcelDelivery> | null => {
  if (!trackingNumber) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ParcelDelivery',
    '@id': `${getOrigin(config)}#parcel-${trackingNumber}`,
    trackingNumber,
    provider: { '@type': 'Organization', name: carrierName },
    trackingUrl,
    deliveryAddress: config.deliveryAddress || {
      '@type': 'PostalAddress',
      addressLocality: 'Concord Township',
      addressRegion: 'OH',
      addressCountry: 'US',
    },
  } as WithContext<ParcelDelivery>;
};
