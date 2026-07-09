import { services } from '../config/services';
import type { Service, ServiceCategory } from '../types/services';
import { siteConfig } from '../config/siteConfig';
import siteStructure from '../data/siteStructure.json';

/**
 * Get all services that belong to a specific category
 */
export const getServicesByCategory = (category: ServiceCategory): Service[] =>
  services.filter((s) => s.category === category);

/**
 * Get all services marked as popular/featured
 */
export const getPopularServices = (): Service[] => services.filter((s) => s.popular);

/**
 * Find a service by its unique ID
 */
export const getServiceById = (id: string): Service | undefined =>
  services.find((s) => s.id === id);

/**
 * Find a service by its URL slug/href
 */
export const getServiceByHref = (href: string): Service | undefined =>
  services.find((s) => s.slug === href);

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
 * Get random services (useful for "related services")
 */
export const getRandomServices = (count: number, excludeId?: string): Service[] => {
  const pool = excludeId ? services.filter((s) => s.id !== excludeId) : services;
  return [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
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
 * Returns breadcrumb items for a given service with absolute URLs.
 * Auto-includes parent pillar landing page based on siteStructure.json.
 */
export const getServiceBreadcrumbs = (
  service: Service,
  baseUrl: string = '',
  baseLabel: string = 'Services'
): { name: string; url: string }[] => {
  const origin = siteConfig.domain.replace(/\/$/, ''); // normalize domain

  const normalize = (path: string): string =>
    path.startsWith('http') ? path : `${origin}${path.startsWith('/') ? path : `/${path}`}`;

  const breadcrumbs = [{ name: 'Home', url: normalize('/') }];

  // Auto-detect parent pillar from siteStructure.json
  const parentPillar = siteStructure.pillars.find((p) =>
    p.children.some((c) => c.id === service.id)
  );

  if (parentPillar) {
    breadcrumbs.push({
      name: parentPillar.title,
      url: normalize(parentPillar.url),
    });
  } else if (baseUrl) {
    breadcrumbs.push({
      name: baseLabel,
      url: normalize(baseUrl),
    });
  }

  breadcrumbs.push({
    name: service.serviceName,
    url: normalize(service.canonicalUrl || service.slug),
  });

  return breadcrumbs;
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
