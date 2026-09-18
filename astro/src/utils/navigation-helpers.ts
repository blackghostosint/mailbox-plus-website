import siteStructure from '../data/siteStructure.json';
import { serviceAreas } from '../config/serviceAreas';
import { services } from '../config/services';
import { normalizePathname } from './canonical-url';

// O(1) Map Indices
const serviceAreaBySlugMap = new Map(serviceAreas.map((sa) => [sa.slug, sa]));
const serviceAreaByPathMap = new Map<string, (typeof serviceAreas)[0]>();
serviceAreas.forEach((sa) => {
  if (sa.canonicalUrl) serviceAreaByPathMap.set(sa.canonicalUrl.replace(/\/$/, ''), sa);
  if (sa.slug) serviceAreaByPathMap.set(`/service-area/${sa.slug}`, sa);
});

const serviceByIdMap = new Map(services.map((s) => [s.id, s]));

interface PillarBreadcrumb {
  title: string;
  url: string;
}

interface ChildBreadcrumb {
  pillarTitle: string;
  pillarUrl: string;
  childTitle: string;
  childUrl: string;
}

const pillarByUrlMap = new Map<string, PillarBreadcrumb>();
const childByUrlMap = new Map<string, ChildBreadcrumb>();

for (const p of siteStructure.pillars) {
  const pUrl = p.url.replace(/\/$/, '');
  pillarByUrlMap.set(pUrl, { title: p.title, url: p.url });
  for (const c of p.children) {
    const cUrl = c.url.replace(/\/$/, '');
    childByUrlMap.set(cUrl, {
      pillarTitle: p.title,
      pillarUrl: p.url,
      childTitle: c.title,
      childUrl: c.url,
    });
  }
}

const seoLandingByUrlMap = new Map<string, string>();
if (Array.isArray(siteStructure['seo-landing'])) {
  for (const item of siteStructure['seo-landing']) {
    seoLandingByUrlMap.set(item.url.replace(/\/$/, ''), item.title);
  }
}

export const getLocalPriorityServices = (citySlug: string) => {
  const city = serviceAreaBySlugMap.get(citySlug);
  if (!city || !city.priorityServices) return [];
  return city.priorityServices.map((id) => serviceByIdMap.get(id)).filter(Boolean);
};

export const getBreadcrumbs = (pathname: string) => {
  const path = pathname.replace(/\/$/, ''); // Remove trailing slash

  if (path === '') return [];

  // Check Pillars
  const pillar = pillarByUrlMap.get(path);
  if (pillar) {
    return [
      { label: 'Home', url: '/' },
      { label: pillar.title, url: normalizePathname(pillar.url), active: true },
    ];
  }

  // Check Children
  const childMatch = childByUrlMap.get(path);
  if (childMatch) {
    return [
      { label: 'Home', url: '/' },
      { label: childMatch.pillarTitle, url: normalizePathname(childMatch.pillarUrl) },
      { label: childMatch.childTitle, url: normalizePathname(childMatch.childUrl), active: true },
    ];
  }

  // Check Local Pages
  const local = serviceAreaByPathMap.get(path);
  if (local) {
    return [
      { label: 'Home', url: '/' },
      { label: 'Service Areas', url: '/service-area' },
      { label: local.city, url: normalizePathname(local.canonicalUrl || local.slug), active: true },
    ];
  }

  // Check Landing Pages
  const landingTitle = seoLandingByUrlMap.get(path);
  if (landingTitle) {
    return [
      { label: 'Home', url: '/' },
      { label: landingTitle, url: path, active: true },
    ];
  }

  return [{ label: 'Home', url: '/' }];
};
