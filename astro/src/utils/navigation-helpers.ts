import internalLinks from '../data/internalLinks.json';
import { serviceAreas } from '../config/serviceAreas';
import { services } from '../config/services';
import { normalizePathname } from './canonical-url';
import {
  toPathKey,
  getServiceById,
  getPillarById,
  getPillarByUrl,
  getChildByUrl,
  getSubSupportingByUrl,
  getSeoLandingByUrl,
} from './site-registry';

export interface BreadcrumbItem {
  label: string;
  url: string;
  active?: boolean;
}

interface PillarNode {
  id: string;
  title: string;
  url: string;
}

// Map Indices for local service-area and path-based lookups
const serviceAreaBySlugMap = new Map(serviceAreas.map((sa) => [sa.slug, sa]));
const serviceAreaByPathMap = new Map<string, (typeof serviceAreas)[0]>();
const serviceByPathMap = new Map<string, (typeof services)[0]>();

// 1. Service Areas
serviceAreas.forEach((sa) => {
  if (sa.canonicalUrl) serviceAreaByPathMap.set(toPathKey(sa.canonicalUrl), sa);
  if (sa.slug) {
    serviceAreaByPathMap.set(toPathKey(sa.slug), sa);
    serviceAreaByPathMap.set(toPathKey(`/service-area/${sa.slug}`), sa);
  }
});

// 2. Dynamic Services
services.forEach((s) => {
  if (s.canonicalUrl) serviceByPathMap.set(toPathKey(s.canonicalUrl), s);
  if (s.slug) {
    serviceByPathMap.set(toPathKey(s.slug), s);
    serviceByPathMap.set(toPathKey(`/services/${s.slug}`), s);
  }
});

export function resolveParentPillar(id: string, url: string, title: string): PillarNode {
  const linkData = (internalLinks as Record<string, { parent?: string | null }>)[id];
  if (linkData && linkData.parent) {
    const pillar = getPillarById(linkData.parent);
    if (pillar) return pillar;
  }

  const idLower = (id || '').toLowerCase();
  const urlLower = (url || '').toLowerCase();

  // Structured route ID and URL prefix matching
  if (
    idLower.startsWith('pack-and-ship-') ||
    idLower.startsWith('shipping-') ||
    idLower.startsWith('post-office-alternative-') ||
    idLower.startsWith('fedex-') ||
    idLower.startsWith('ups-') ||
    idLower.startsWith('dhl-') ||
    urlLower.includes('/pack-ship/') ||
    urlLower.includes('pack-and-ship')
  ) {
    const p = getPillarById('pack-ship');
    if (p) return p;
  }

  if (
    idLower.startsWith('mailbox-rental-') ||
    idLower.startsWith('mail-boxes-etc-alternative-') ||
    idLower.startsWith('private-mailbox-') ||
    urlLower.includes('/mailbox-rentals/') ||
    urlLower.includes('mailbox-rental')
  ) {
    const p = getPillarById('home-business');
    if (p) return p;
  }

  if (
    idLower.startsWith('printing-') ||
    idLower.startsWith('copy-') ||
    urlLower.includes('/copy-print/') ||
    urlLower.includes('copy-and-print')
  ) {
    const p = getPillarById('copy-print');
    if (p) return p;
  }

  if (
    idLower.includes('fingerprint') ||
    idLower.includes('notary') ||
    urlLower.includes('fingerprinting') ||
    urlLower.includes('notary')
  ) {
    const p = getPillarById('specialty');
    if (p) return p;
  }

  if (import.meta.env.DEV) {
    console.warn(
      `[resolveParentPillar] Unmapped route id '${id}' (url: '${url}', title: '${title}'). Falling back to 'pack-ship' pillar.`
    );
  }

  return (
    getPillarById('pack-ship') || {
      id: 'pack-ship',
      title: 'Pack & Ship',
      url: '/pack-ship',
    }
  );
}

export const getLocalPriorityServices = (citySlug: string) => {
  const city = serviceAreaBySlugMap.get(citySlug);
  if (!city || !city.priorityServices) return [];
  return city.priorityServices.map((id) => getServiceById(id)).filter(Boolean);
};

export const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const key = toPathKey(pathname);

  if (!key) return [];

  const homeNode: BreadcrumbItem = { label: 'Home', url: normalizePathname('/') };

  // 1. Pillars
  const pillar = getPillarByUrl(key);
  if (pillar) {
    return [homeNode, { label: pillar.title, url: normalizePathname(pillar.url), active: true }];
  }

  // 2. Pillar Children
  const childMatch = getChildByUrl(key);
  if (childMatch) {
    return [
      homeNode,
      { label: childMatch.pillarTitle, url: normalizePathname(childMatch.pillarUrl) },
      { label: childMatch.title, url: normalizePathname(childMatch.url), active: true },
    ];
  }

  // 3. SubSupporting Pages
  const subMatch = getSubSupportingByUrl(key);
  if (subMatch) {
    const parent = resolveParentPillar(subMatch.id, subMatch.url, subMatch.title);
    return [
      homeNode,
      { label: parent.title, url: normalizePathname(parent.url) },
      { label: subMatch.title, url: normalizePathname(subMatch.url), active: true },
    ];
  }

  // 4. SEO Landing Pages
  const seoMatch = getSeoLandingByUrl(key);
  if (seoMatch) {
    const parent = resolveParentPillar(seoMatch.id, seoMatch.url, seoMatch.title);
    return [
      homeNode,
      { label: parent.title, url: normalizePathname(parent.url) },
      { label: seoMatch.title, url: normalizePathname(seoMatch.url), active: true },
    ];
  }

  // 5. Service Areas
  if (key === '/service-area') {
    return [
      homeNode,
      { label: 'Service Areas', url: normalizePathname('/service-area'), active: true },
    ];
  }
  const localMatch = serviceAreaByPathMap.get(key);
  if (localMatch) {
    return [
      homeNode,
      { label: 'Service Areas', url: normalizePathname('/service-area') },
      {
        label: localMatch.city,
        url: normalizePathname(localMatch.canonicalUrl || `/service-area/${localMatch.slug}`),
        active: true,
      },
    ];
  }

  // 6. Dynamic Services
  const serviceMatch = serviceByPathMap.get(key);
  if (serviceMatch) {
    const parent = resolveParentPillar(
      serviceMatch.id,
      serviceMatch.canonicalUrl || serviceMatch.slug,
      serviceMatch.serviceName
    );
    return [
      homeNode,
      { label: parent.title, url: normalizePathname(parent.url) },
      {
        label: serviceMatch.serviceName,
        url: normalizePathname(serviceMatch.canonicalUrl || serviceMatch.slug),
        active: true,
      },
    ];
  }

  // 7. Fallback for unknown paths
  return [homeNode];
};
