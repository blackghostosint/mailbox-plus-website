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
import { siteConfig } from '../config/siteConfig';
import { toCanonicalUrl } from './canonical-url';
import { slugify } from './string';
// Live review data (refreshed at build by scripts/fetch-reviews.mjs). Keeps the
// LocalBusiness aggregateRating in sync with the visible ReviewSection content —
// Google only shows review stars when schema and on-page content agree.
import reviewsData from '../data/reviews.json';

/** ---------- Small helpers ---------- */
const getOrigin = (config: SiteConfig) => (config.domain || '').replace(/\/+$/, '');

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
    '@id': toCanonicalUrl(`${getOrigin(config)}#localbusiness`),
    name: config.name,
    ...(config.legalName && { legalName: config.legalName }),
    image: config.logo,
    url: toCanonicalUrl('/'),
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
    ...(config.areaServed?.length && {
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: config.geo?.lat ?? 41.66497,
          longitude: config.geo?.lng ?? -81.24164,
        },
        geoRadius: '32187', // 20 miles in meters
      },
      servesArea: config.areaServed.map((area) => `${area}, OH`),
    }),
    ...(config.knowsAbout && { knowsAbout: config.knowsAbout }),
    serviceType: serviceTypes,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: [
        { '@type': 'Offer', name: 'Pack & Ship Services', url: toCanonicalUrl('/pack-ship') },
        {
          '@type': 'Offer',
          name: 'Private Mailbox Rental',
          url: toCanonicalUrl('/home-business/mailbox-rental'),
        },
        {
          '@type': 'Offer',
          name: 'Notary Services',
          url: toCanonicalUrl('/home-business/notary-services'),
        },
        { '@type': 'Offer', name: 'Printing & Copying', url: toCanonicalUrl('/copy-print') },
        {
          '@type': 'Offer',
          name: 'Fingerprinting',
          url: toCanonicalUrl('/specialty/digital-fingerprinting'),
        },
      ],
    },
    ...((config.aggregateRating || reviewsData) && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviewsData?.rating ?? config.aggregateRating?.ratingValue,
        reviewCount: reviewsData?.userRatingCount ?? config.aggregateRating?.reviewCount,
        bestRating: config.aggregateRating?.bestRating ?? 5,
        worstRating: config.aggregateRating?.worstRating ?? 1,
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
    '@id': toCanonicalUrl(`${getOrigin(config)}#website`),
    url: toCanonicalUrl('/'),
    name: config.name,
    publisher: { '@id': toCanonicalUrl(`${getOrigin(config)}#localbusiness`) },
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
    breadcrumbItems?: { name?: string; label?: string; url: string }[];
    datePublished?: string;
    dateModified?: string;
    aboutLocalBusiness?: boolean;
  }
): WithContext<WebPage> => {
  const pageUrl = toCanonicalUrl(url);
  const schema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    name,
    description,
    url: pageUrl,
    inLanguage: 'en-US',
    publisher: { '@id': toCanonicalUrl(`${getOrigin(config)}#localbusiness`) },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(aboutLocalBusiness && {
      about: { '@id': toCanonicalUrl(`${getOrigin(config)}#localbusiness`) },
    }),
  };

  if (breadcrumbItems?.length) {
    schema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name || item.label || '',
        item: toCanonicalUrl(item.url),
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
  const id = toCanonicalUrl(`${getOrigin(config)}#service-${slugify(serviceName)}`);
  const schema: WithContext<Service> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': id,
    serviceType: serviceName,
    provider: { '@id': toCanonicalUrl(`${getOrigin(config)}#localbusiness`) },
    ...(url && { url: toCanonicalUrl(url) }),
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
      url: url ? toCanonicalUrl(url) : toCanonicalUrl('/'),
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
  '@id': toCanonicalUrl(`${getOrigin(config)}#faq`),
  mainEntity: faqs.map((faq, i) => ({
    '@type': 'Question',
    '@id': toCanonicalUrl(`${getOrigin(config)}#faq-q${i + 1}`),
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
  '@id': toCanonicalUrl(`${getOrigin(config)}#product-${slugify(name)}`),
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
      url: toCanonicalUrl('/'),
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
): WithContext<Article> => {
  const canonicalUrl = toCanonicalUrl(url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline,
    description,
    ...(image && {
      image: image.startsWith('http') ? image : `${getOrigin(config)}/${image.replace(/^\//, '')}`,
    }),
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: authorName || config.name,
    },
    publisher: {
      '@type': 'Organization',
      '@id': toCanonicalUrl(`${getOrigin(config)}#localbusiness`),
      name: config.name,
      logo: {
        '@type': 'ImageObject',
        url: config.logo?.startsWith('http')
          ? config.logo
          : `${getOrigin(config)}${config.logo?.startsWith('/') ? '' : '/'}${config.logo || ''}`,
      },
    },
    ...(articleSection && { articleSection }),
    ...(keywords?.length && { keywords: keywords.join(', ') }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };
};

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

/** ---------- ImageObject ---------- */
export const getImageObjectSchema = ({
  contentUrl,
  name,
  description,
  city,
  config = siteConfig,
}: {
  contentUrl: string;
  name: string;
  description?: string;
  city?: string;
  config?: SiteConfig;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl,
  description:
    description || (city ? `${config.name} shipping service for ${city} customers` : name),
  name,
  author: {
    '@type': 'Organization',
    name: config.name,
  },
  copyrightHolder: {
    '@type': 'Organization',
    name: config.name,
  },
});

/** ---------- Unified Schema Graph Builder ---------- */
export interface SchemaPageMeta {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbItems?: { name: string; url: string }[];
  aboutLocalBusiness?: boolean;
}

export const getSchemaGraph = (
  config: SiteConfig = siteConfig,
  inputNodes: Array<unknown> = [],
  pageMeta?: SchemaPageMeta
): { '@context': string; '@graph': Record<string, unknown>[] } => {
  const rawNodes = inputNodes
    .filter((n): n is Record<string, unknown> => Boolean(n) && typeof n === 'object')
    .map((n) => n as Record<string, unknown>);

  const imageObjectNodes: Record<string, unknown>[] = [];
  const otherNodes: Record<string, unknown>[] = [];

  for (const node of rawNodes) {
    if (node['@type'] === 'ImageObject') {
      imageObjectNodes.push(node);
    } else {
      otherNodes.push(node);
    }
  }

  let localBusinessNode = otherNodes.find((n) => n['@type'] === 'LocalBusiness');
  if (!localBusinessNode) {
    localBusinessNode = getLocalBusinessSchema(config) as unknown as Record<string, unknown>;
  }

  let webSiteNode = otherNodes.find((n) => n['@type'] === 'WebSite');
  if (!webSiteNode) {
    webSiteNode = getWebSiteSchema(config) as unknown as Record<string, unknown>;
  }

  let webPageNode = otherNodes.find((n) => n['@type'] === 'WebPage');
  if (!webPageNode && pageMeta?.title && pageMeta?.canonicalUrl) {
    webPageNode = getWebPageSchema(config, {
      name: pageMeta.title,
      description: pageMeta.description || '',
      url: pageMeta.canonicalUrl,
      datePublished: pageMeta.datePublished,
      dateModified: pageMeta.dateModified,
      breadcrumbItems: pageMeta.breadcrumbItems,
      aboutLocalBusiness: pageMeta.aboutLocalBusiness,
    }) as unknown as Record<string, unknown>;
  }

  let serviceNode = otherNodes.find((n) => n['@type'] === 'Service');

  // If an ImageObject is present in input nodes, attach it as a child property
  // to primary nodes (WebPage.primaryImageOfPage, Service.image) rather than
  // rendering as an unlinked top-level node.
  // Note: webPageNode and serviceNode are shallow-copied before property assignment
  // so that caller-provided input schema objects are never mutated.
  if (imageObjectNodes.length > 0) {
    const cleanImageNode = { ...imageObjectNodes[0] };
    delete cleanImageNode['@context'];

    if (webPageNode) {
      const pageIndex = otherNodes.indexOf(webPageNode);
      webPageNode = { ...webPageNode, primaryImageOfPage: cleanImageNode };
      if (pageIndex !== -1) {
        otherNodes[pageIndex] = webPageNode;
      }
    }
    if (serviceNode) {
      const serviceIndex = otherNodes.indexOf(serviceNode);
      serviceNode = { ...serviceNode, image: cleanImageNode };
      if (serviceIndex !== -1) {
        otherNodes[serviceIndex] = serviceNode;
      }
    }
  }

  const graphNodesList: Record<string, unknown>[] = [];
  graphNodesList.push(localBusinessNode);
  graphNodesList.push(webSiteNode);

  if (webPageNode) {
    graphNodesList.push(webPageNode);
  }

  for (const node of otherNodes) {
    if (node === localBusinessNode || node === webSiteNode || node === webPageNode) {
      continue;
    }
    graphNodesList.push(node);
  }

  const seenIds = new Set<string>();
  const finalGraphNodes: Record<string, unknown>[] = [];

  for (const node of graphNodesList) {
    const nodeCopy = { ...node };
    delete nodeCopy['@context'];

    const id = (nodeCopy['@id'] as string) || (nodeCopy['@type'] as string);
    if (id && seenIds.has(id)) {
      continue;
    }
    if (id) {
      seenIds.add(id);
    }
    finalGraphNodes.push(nodeCopy);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': finalGraphNodes,
  };
};
