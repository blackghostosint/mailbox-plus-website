import { siteConfig } from "../config/siteConfig";

/** ---------- Small helpers ---------- */
const origin = (siteConfig.domain || "").replace(/\/+$/, ""); // remove trailing slash
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const dayName = (d: string) => {
  const map: Record<string, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };
  const key = (d || "").toLowerCase();
  return map[key] || (d.charAt(0).toUpperCase() + d.slice(1));
};

// Normalize "9:00 AM" / "09:00" to "HH:MM"
const toHHMM = (t: string) => {
  if (!t) return t;
  const ampm = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = parseInt(ampm[2] || "0", 10);
    const isPM = /pm/i.test(ampm[3]);
    if (h === 12) h = isPM ? 12 : 0;
    else if (isPM) h += 12;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }
  const hhmm = t.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (hhmm) return `${hhmm[1].padStart(2, "0")}:${hhmm[2]}`;
  return t; // fallback unchanged
};

/** ---------- LocalBusiness ---------- */
export const getLocalBusinessSchema = () => {
  const socialLinks = Object.values(siteConfig.social || {}).filter(Boolean) as string[];

  // Expect siteConfig.hours like: { monday: "9:00 AM - 6:00 PM", sunday: "Closed", ... }
  const openingHoursSpecification = Object.entries(siteConfig.hours || {}).flatMap(
    ([day, hours]) => {
      if (!hours || /closed/i.test(hours)) return []; // omit closed days entirely
      const [opensRaw, closesRaw] = hours.split(" - ").map(s => s.trim());
      return [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: dayName(day),
          opens: toHHMM(opensRaw),
          closes: toHHMM(closesRaw),
        },
      ];
    }
  );

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${origin}#localbusiness`,
    name: siteConfig.name,
    image: siteConfig.logo,
    url: origin,
    telephone: siteConfig.contact?.phone,
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Debit Card",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact?.address?.street,
      addressLocality: siteConfig.contact?.address?.city,
      addressRegion: siteConfig.contact?.address?.state,
      postalCode: siteConfig.contact?.address?.zip,
      addressCountry: siteConfig.contact?.address?.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo?.lat,
      longitude: siteConfig.geo?.lng,
    },
    ...(siteConfig.mapUrl && { hasMap: siteConfig.mapUrl }),
    areaServed: ["Concord Township", "Mentor", "Painesville", "Lake County"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact?.phone,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
    ...(openingHoursSpecification.length
      ? { openingHoursSpecification }
      : {}),
    ...(socialLinks.length ? { sameAs: socialLinks } : {}),
  };
};

/** ---------- WebSite (+ SearchAction for site search) ---------- */
export const getWebSiteSchema = (searchUrlTemplate?: string) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}#website`,
    url: origin,
    name: siteConfig.name,
    publisher: { "@id": `${origin}#localbusiness` },
    inLanguage: "en-US",
  };

  if (searchUrlTemplate) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: searchUrlTemplate, // e.g., `${origin}/search?q={search_term_string}`
      "query-input": "required name=search_term_string",
    };
  }
  return schema;
};

/** ---------- WebPage (with optional breadcrumbs & dates) ---------- */
export const getWebPageSchema = ({
  name,
  description,
  url,
  breadcrumbItems,
  datePublished,
  dateModified,
  aboutLocalBusiness = true, // link page to your LocalBusiness by default
}: {
  name: string;
  description: string;
  url: string;
  breadcrumbItems?: { name: string; url: string }[];
  datePublished?: string;
  dateModified?: string;
  aboutLocalBusiness?: boolean;
}) => {
  const pageUrl = url.replace(/\/+$/, "");
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name,
    description,
    url: pageUrl,
    inLanguage: "en-US",
    publisher: { "@id": `${origin}#localbusiness` },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(aboutLocalBusiness && { about: { "@id": `${origin}#localbusiness` } }),
  };

  if (breadcrumbItems?.length) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  return schema;
};

/** ---------- Service (offers/reviews/aggregateRating; optional url/areaServed) ---------- */
export const getServiceSchema = ({
  serviceName,
  url, // optional: canonical URL for this service page
  offers,
  reviews,
  aggregateRating,
  areaServed,
  category,
  serviceOutput,
}: {
  serviceName: string;
  url?: string;
  offers?: { name: string; price: string; currency?: string }[];
  reviews?: {
    author: string;
    datePublished: string;
    reviewBody: string;
    ratingValue: number;
  }[];
  aggregateRating?: { ratingValue: number; reviewCount: number };
  areaServed?: string[]; // e.g., ["Concord Township", "Mentor"]
  category?: string;     // e.g., "Printing", "Shipping"
  serviceOutput?: string; // e.g., "Printed poster", "Shipped parcel"
}) => {
  const id = `${origin}#service-${slugify(serviceName)}`;
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": id,
    serviceType: serviceName,
    provider: { "@id": `${origin}#localbusiness` },
    ...(url && { url }),
    ...(areaServed?.length ? { areaServed } : {}),
    ...(category && { category }),
    ...(serviceOutput && { serviceOutput }),
  };

  if (offers?.length) {
    schema.offers = offers.map(o => ({
      "@type": "Offer",
      name: o.name,
      price: o.price,
      priceCurrency: o.currency || "USD",
      url: url || origin,
    }));
  }

  if (reviews?.length) {
    schema.review = reviews.map(r => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.datePublished,
      reviewBody: r.reviewBody,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.ratingValue,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  if (aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
};

/** ---------- FAQ ---------- */
export const getFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${origin}#faq`,
  mainEntity: faqs.map((faq, i) => ({
    "@type": "Question",
    "@id": `${origin}#faq-q${i + 1}`,
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

/** ---------- Product ---------- */
export const getProductSchema = ({
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
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${origin}#product-${slugify(name)}`,
  name,
  description,
  ...(sku && { sku }),
  ...(brand && { brand: { "@type": "Brand", name: brand } }),
  ...(image && { image }),
  ...(offers?.length && {
    offers: offers.map(o => ({
      "@type": "Offer",
      price: o.price,
      priceCurrency: o.currency || "USD",
      availability: o.availability || "https://schema.org/InStock",
      url: origin,
    })),
  }),
  ...(aggregateRating && {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }),
});

/** ---------- ParcelDelivery (tracking) ---------- */
export const getTrackingSchema = (
  trackingNumber: string,
  carrierName: string,
  trackingUrl: string
) => {
  if (!trackingNumber) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ParcelDelivery",
    "@id": `${origin}#parcel-${trackingNumber}`,
    trackingNumber,
    provider: { "@type": "Organization", name: carrierName },
    trackingUrl,
    deliveryAddress: {
      "@type": "PostalAddress",
      addressLocality: "Concord Township",
      addressRegion: "OH",
      addressCountry: "US",
    },
  };
};
