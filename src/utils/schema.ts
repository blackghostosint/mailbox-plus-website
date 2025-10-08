import { siteConfig } from "../config/siteConfig";

/**
 * LocalBusiness schema from siteConfig
 */
export const getLocalBusinessSchema = () => {
  const socialLinks = Object.values(siteConfig.social || {}).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.domain}#localbusiness`,
    "name": siteConfig.name,
    "image": siteConfig.logo,
    "url": siteConfig.domain,
    "telephone": siteConfig.contact.phone,
    "priceRange": "$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card, Debit Card",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.contact.address.street,
      "addressLocality": siteConfig.contact.address.city,
      "addressRegion": siteConfig.contact.address.state,
      "postalCode": siteConfig.contact.address.zip,
      "addressCountry": siteConfig.contact.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": siteConfig.geo.lat,
      "longitude": siteConfig.geo.lng
    },
    "hasMap": siteConfig.mapUrl, // Add Google Maps URL in siteConfig
    "areaServed": ["Concord Township", "Mentor", "Painesville", "Lake County"],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteConfig.contact.phone,
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": "English"
    },
    "openingHoursSpecification": Object.entries(siteConfig.hours).map(
      ([day, hours]) => {
        if (hours === "Closed") {
          return {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1)
          };
        }
        const [opens, closes] = hours.split(" - ");
        return {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
          "opens": opens,
          "closes": closes
        };
      }
    ),
    ...(socialLinks.length > 0 && { "sameAs": socialLinks })
  };
};

/**
 * Service schema tied to LocalBusiness, with offers, reviews, ratings
 */
export const getServiceSchema = ({
  serviceName,
  offers,
  reviews,
  aggregateRating
}: {
  serviceName: string;
  offers?: { name: string; price: string; currency?: string }[];
  reviews?: {
    author: string;
    datePublished: string;
    reviewBody: string;
    ratingValue: number;
  }[];
  aggregateRating?: { ratingValue: number; reviewCount: number };
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.domain}/#service-${serviceName.toLowerCase().replace(/\s+/g, "-")}`,
    "serviceType": serviceName,
    "provider": { "@id": `${siteConfig.domain}#localbusiness` }
  };

  if (offers) {
    schema.offers = offers.map(o => ({
      "@type": "Offer",
      "name": o.name,
      "price": o.price,
      "priceCurrency": o.currency || "USD"
    }));
  }

  if (reviews) {
    schema.review = reviews.map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.author },
      "datePublished": r.datePublished,
      "reviewBody": r.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.ratingValue,
        "bestRating": 5,
        "worstRating": 1
      }
    }));
  }

  if (aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  return schema;
};

/**
 * FAQ schema
 */
export const getFAQSchema = (
  faqs: { question: string; answer: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteConfig.domain}#faq`,
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * WebPage schema with publisher + optional breadcrumbs
 */
export const getWebPageSchema = ({
  name,
  description,
  url,
  breadcrumbItems,
  datePublished,
  dateModified
}: {
  name: string;
  description: string;
  url: string;
  breadcrumbItems?: { name: string; url: string }[];
  datePublished?: string;
  dateModified?: string;
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    "name": name,
    "description": description,
    "url": url,
    "inLanguage": "en-US",
    "publisher": {
      "@type": "Organization",
      "@id": `${siteConfig.domain}#localbusiness`,
      "name": siteConfig.name,
      "url": siteConfig.domain,
      "logo": { "@type": "ImageObject", "url": siteConfig.logo }
    },
    ...(datePublished && { "datePublished": datePublished }),
    ...(dateModified && { "dateModified": dateModified })
  };

  if (breadcrumbItems && breadcrumbItems.length > 0) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  }

  return schema;
};

/**
 * Product schema (for pricing info)
 */
export const getProductSchema = ({
  name,
  description,
  sku,
  brand,
  image,
  offers,
  aggregateRating
}: {
  name: string;
  description: string;
  sku?: string;
  brand?: string;
  image?: string;
  offers?: { price: string; currency?: string; availability?: string }[];
  aggregateRating?: { ratingValue: number; reviewCount: number };
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${siteConfig.domain}/#product-${name.toLowerCase().replace(/\s+/g, "-")}`,
  "name": name,
  "description": description,
  ...(sku && { "sku": sku }),
  ...(brand && { "brand": { "@type": "Brand", "name": brand } }),
  ...(image && { "image": image }),
  ...(offers && {
    "offers": offers.map(o => ({
      "@type": "Offer",
      "price": o.price,
      "priceCurrency": o.currency || "USD",
      "availability": o.availability || "https://schema.org/InStock"
    }))
  }),
  ...(aggregateRating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    }
  })
});

/**
 * ParcelDelivery schema (for tracking numbers)
 */
export const getTrackingSchema = (
  trackingNumber: string,
  carrierName: string,
  trackingUrl: string
) => {
  if (!trackingNumber) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ParcelDelivery",
    "@id": `${siteConfig.domain}/#parcel-${trackingNumber}`,
    "trackingNumber": trackingNumber,
    "provider": {
      "@type": "Organization",
      "name": carrierName
    },
    "trackingUrl": trackingUrl,
    "deliveryAddress": {
      "@type": "PostalAddress",
      "addressLocality": "Concord Township",
      "addressRegion": "OH",
      "addressCountry": "US"
    }
  };
};
