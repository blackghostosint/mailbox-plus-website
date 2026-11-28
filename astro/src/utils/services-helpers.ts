import type { Service } from '../types/services';
import { normalizePathname } from './canonical-url';
import { getBreadcrumbs } from './navigation-helpers';
import {
  getServiceById as registryGetServiceById,
  getParentPillarByChildId,
} from './site-registry';

/**
 * Find a service by its unique ID
 */
export const getServiceById = (id: string): Service | undefined => registryGetServiceById(id);

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
  const parentPillar = getParentPillarByChildId(service.id);

  if (parentPillar) {
    return [
      homeNode,
      {
        label: parentPillar.title,
        url: normalizePathname(parentPillar.url),
        name: parentPillar.title,
      },
      {
        label: service.serviceName,
        url: normalizePathname(serviceUrl),
        name: service.serviceName,
        active: true,
      },
    ];
  } else if (baseUrl) {
    return [
      homeNode,
      { label: baseLabel, url: normalizePathname(baseUrl), name: baseLabel },
      {
        label: service.serviceName,
        url: normalizePathname(serviceUrl),
        name: service.serviceName,
        active: true,
      },
    ];
  }

  return [
    homeNode,
    {
      label: service.serviceName,
      url: normalizePathname(serviceUrl),
      name: service.serviceName,
      active: true,
    },
  ];
};
