import { services } from '../config/services';
import type { Service, ServiceCategory } from '../types/services';
import siteStructure from '../data/siteStructure.json';
import { normalizePathname } from './canonical-url';
import { hashString } from './hash-helpers';
import { getBreadcrumbs } from './navigation-helpers';

// O(1) Map Indices
const serviceByIdMap = new Map<string, Service>(services.map((s) => [s.id, s]));
const serviceBySlugMap = new Map<string, Service>(services.map((s) => [s.slug, s]));

const servicesByCategoryMap = new Map<ServiceCategory, Service[]>();
services.forEach((s) => {
  const list = servicesByCategoryMap.get(s.category as ServiceCategory) || [];
  list.push(s);
  servicesByCategoryMap.set(s.category as ServiceCategory, list);
});

const parentPillarByChildIdMap = new Map<string, (typeof siteStructure.pillars)[0]>();
for (const p of siteStructure.pillars) {
  for (const c of p.children) {
    parentPillarByChildIdMap.set(c.id, p);
  }
}

/**
 * Get all services that belong to a specific category
 */
export const getServicesByCategory = (category: ServiceCategory): Service[] =>
  servicesByCategoryMap.get(category) || [];

/**
 * Get all services marked as popular/featured
 */
export const getPopularServices = (): Service[] => services.filter((s) => s.popular);

/**
 * Find a service by its unique ID
 */
export const getServiceById = (id: string): Service | undefined => serviceByIdMap.get(id);

/**
 * Find a service by its URL slug/href
 */
export const getServiceByHref = (href: string): Service | undefined => serviceBySlugMap.get(href);

/**
 * Search services by query string
 * Searches: service name, hero subtitle, keywords, meta description, features
 */
export const searchServices = (query: string): Service[] => {
  const lower = query.toLowerCase();

  return services.filter(
    (s) =>
      s.serviceName.toLowerCase().includes(lower) ||
      s.heroSubtitle?.toLowerCase().includes(lower) ||
      s.keywords?.toLowerCase().includes(lower) ||
      s.metaDescription?.toLowerCase().includes(lower) ||
      s.features?.some(
        (f) => f.title.toLowerCase().includes(lower) || f.description.toLowerCase().includes(lower)
      )
  );
};

/**
 * Get deterministic "random" services (useful for "related services")
 *
 * Performance Optimization: Use deterministic selection instead of Math.random()
 * to prevent React hydration mismatches and ensure UI consistency.
 * The optional `seed` (e.g. current path) allows rotation across pages while
 * staying stable for a given page. Mirrors internal-links.ts selection logic.
 */
export const getRandomServices = (
  count: number,
  excludeId?: string,
  seed: string = ''
): Service[] => {
  const pool = excludeId ? services.filter((s) => s.id !== excludeId) : services;
  if (pool.length === 0) return [];

  const hashSeed = (excludeId || '') + seed;
  const hash = hashString(hashSeed);
  const start = Math.abs(hash) % pool.length;

  // Take `count` services starting from the hashed index, wrapping around
  const result: Service[] = [];
  for (let i = 0; i < count && i < pool.length; i++) {
    result.push(pool[(start + i) % pool.length]);
  }
  return result;
};

/**
 * Sort services alphabetically by name
 */
export const sortServicesByName = (): Service[] =>
  [...services].sort((a, b) => a.serviceName.localeCompare(b.serviceName));

/**
 * Sort services by rating (highest first) if aggregateRating is present
 */
export const sortServicesByRating = (): Service[] =>
  [...services].sort((a, b) => {
    const ratingA = a.aggregateRating?.ratingValue || 0;
    const ratingB = b.aggregateRating?.ratingValue || 0;
    return ratingB - ratingA;
  });

/**
 * Get services that include FAQs
 */
export const getServicesWithFAQs = (): Service[] =>
  services.filter((s) => s.faqs && s.faqs.length > 0);

/**
 * Validate service data structure (basic fields check)
 */
export const validateService = (service: Service): boolean => {
  return !!(
    service.id &&
    service.serviceName &&
    service.slug &&
    service.pageTitle &&
    service.metaDescription &&
    service.heroTitle &&
    service.heroSubtitle &&
    service.category
  );
};

/**
 * Returns breadcrumb items for a given service with canonical trailing-slash URLs.
 * Delegates directly to unified navigation resolver `getBreadcrumbs`.
 */
export const getServiceBreadcrumbs = (
  service: Service,
  baseUrl: string = '',
  baseLabel: string = 'Services'
): { label: string; url: string; name: string; active?: boolean }[] => {
  const serviceUrl = service.canonicalUrl || service.slug;
  const crumbs = getBreadcrumbs(serviceUrl);

  if (crumbs.length > 1) {
    return crumbs.map((crumb) => ({
      ...crumb,
      name: crumb.label,
    }));
  }

  // Fallback if getBreadcrumbs returned single node or unknown
  const homeNode = { label: 'Home', url: normalizePathname('/'), name: 'Home' };
  const parentPillar = parentPillarByChildIdMap.get(service.id);

  if (parentPillar) {
    return [
      homeNode,
      { label: parentPillar.title, url: normalizePathname(parentPillar.url), name: parentPillar.title },
      { label: service.serviceName, url: normalizePathname(serviceUrl), name: service.serviceName, active: true },
    ];
  } else if (baseUrl) {
    return [
      homeNode,
      { label: baseLabel, url: normalizePathname(baseUrl), name: baseLabel },
      { label: service.serviceName, url: normalizePathname(serviceUrl), name: service.serviceName, active: true },
    ];
  }

  return [
    homeNode,
    { label: service.serviceName, url: normalizePathname(serviceUrl), name: service.serviceName, active: true },
  ];
};

/**
 * Group services by category
 * Returns an object with category IDs as keys and arrays of services as values
 */
export const groupServicesByCategory = (): Record<ServiceCategory, Service[]> => {
  const grouped: Record<string, Service[]> = {};

  services.forEach((service) => {
    if (!grouped[service.category]) {
      grouped[service.category] = [];
    }
    grouped[service.category].push(service);
  });

  return grouped as Record<ServiceCategory, Service[]>;
};
