import siteStructure from '../data/siteStructure.json';
import internalLinks from '../data/internalLinks.json';
import { serviceAreas } from '../config/serviceAreas';
import { services } from '../config/services';
import { normalizePathname } from './canonical-url';

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

interface ChildNode {
  id: string;
  title: string;
  url: string;
  pillarTitle: string;
  pillarUrl: string;
}

interface GenericPageNode {
  id: string;
  title: string;
  url: string;
}

// Map Indices
const pillarByIdMap = new Map<string, PillarNode>();
const pillarByUrlMap = new Map<string, PillarNode>();
const childByUrlMap = new Map<string, ChildNode>();
const subSupportingByUrlMap = new Map<string, GenericPageNode>();
const seoLandingByUrlMap = new Map<string, GenericPageNode>();
const serviceAreaBySlugMap = new Map(serviceAreas.map((sa) => [sa.slug, sa]));
const serviceAreaByPathMap = new Map<string, (typeof serviceAreas)[0]>();
const serviceByPathMap = new Map<string, (typeof services)[0]>();
const serviceByIdMap = new Map(services.map((s) => [s.id, s]));

const toPathKey = (path: string): string => {
  if (!path) return '';
  const trimmed = path.trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '';
};

// 1. Pillars and Pillar Children
for (const p of siteStructure.pillars) {
  const pKey = toPathKey(p.url);
  const pNode: PillarNode = { id: p.id, title: p.title, url: p.url };
  pillarByIdMap.set(p.id, pNode);
  if (pKey) pillarByUrlMap.set(pKey, pNode);

  for (const c of p.children) {
    const cKey = toPathKey(c.url);
    if (cKey) {
      childByUrlMap.set(cKey, {
        id: c.id,
        title: c.title,
        url: c.url,
        pillarTitle: p.title,
        pillarUrl: p.url,
      });
    }
  }
}

// 2. SubSupporting Pages
if (Array.isArray(siteStructure.subSupporting)) {
  for (const item of siteStructure.subSupporting) {
    const key = toPathKey(item.url);
    if (key) {
      subSupportingByUrlMap.set(key, { id: item.id, title: item.title, url: item.url });
    }
  }
}

// 3. SEO Landing Pages
if (Array.isArray(siteStructure['seo-landing'])) {
  for (const item of siteStructure['seo-landing']) {
    const key = toPathKey(item.url);
    if (key) {
      seoLandingByUrlMap.set(key, { id: item.id, title: item.title, url: item.url });
    }
  }
}

// 4. Service Areas
serviceAreas.forEach((sa) => {
  if (sa.canonicalUrl) serviceAreaByPathMap.set(toPathKey(sa.canonicalUrl), sa);
  if (sa.slug) {
    serviceAreaByPathMap.set(toPathKey(sa.slug), sa);
    serviceAreaByPathMap.set(toPathKey(`/service-area/${sa.slug}`), sa);
  }
});

// 5. Dynamic Services
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
    const pillar = pillarByIdMap.get(linkData.parent);
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
    const p = pillarByIdMap.get('pack-ship');
    if (p) return p;
  }

  if (
    idLower.startsWith('mailbox-rental-') ||
    idLower.startsWith('mail-boxes-etc-alternative-') ||
    idLower.startsWith('private-mailbox-') ||
    urlLower.includes('/mailbox-rentals/') ||
    urlLower.includes('mailbox-rental')
  ) {
    const p = pillarByIdMap.get('home-business');
    if (p) return p;
  }

  if (
    idLower.startsWith('printing-') ||
    idLower.startsWith('copy-') ||
    urlLower.includes('/copy-print/') ||
    urlLower.includes('copy-and-print')
  ) {
    const p = pillarByIdMap.get('copy-print');
    if (p) return p;
  }

  if (
    idLower.includes('fingerprint') ||
    idLower.includes('notary') ||
    urlLower.includes('fingerprinting') ||
    urlLower.includes('notary')
  ) {
    const p = pillarByIdMap.get('specialty');
    if (p) return p;
  }

  if (import.meta.env.DEV) {
    console.warn(
      `[resolveParentPillar] Unmapped route id '${id}' (url: '${url}', title: '${title}'). Falling back to 'pack-ship' pillar.`
    );
  }

  return (
    pillarByIdMap.get('pack-ship') || {
      id: 'pack-ship',
      title: 'Pack & Ship',
      url: '/pack-ship',
    }
  );
}

export const getLocalPriorityServices = (citySlug: string) => {
  const city = serviceAreaBySlugMap.get(citySlug);
  if (!city || !city.priorityServices) return [];
  return city.priorityServices.map((id) => serviceByIdMap.get(id)).filter(Boolean);
};

export const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const key = toPathKey(pathname);

  if (!key) return [];

  const homeNode: BreadcrumbItem = { label: 'Home', url: normalizePathname('/') };

  // 1. Pillars
  const pillar = pillarByUrlMap.get(key);
  if (pillar) {
    return [homeNode, { label: pillar.title, url: normalizePathname(pillar.url), active: true }];
  }

  // 2. Pillar Children
  const childMatch = childByUrlMap.get(key);
  if (childMatch) {
    return [
      homeNode,
      { label: childMatch.pillarTitle, url: normalizePathname(childMatch.pillarUrl) },
      { label: childMatch.title, url: normalizePathname(childMatch.url), active: true },
    ];
  }

  // 3. SubSupporting Pages
  const subMatch = subSupportingByUrlMap.get(key);
  if (subMatch) {
    const parent = resolveParentPillar(subMatch.id, subMatch.url, subMatch.title);
    return [
      homeNode,
      { label: parent.title, url: normalizePathname(parent.url) },
      { label: subMatch.title, url: normalizePathname(subMatch.url), active: true },
    ];
  }

  // 4. SEO Landing Pages
  const seoMatch = seoLandingByUrlMap.get(key);
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
