import siteStructure from '../data/siteStructure.json';
import internalLinks from '../data/internalLinks.json';
import anchorText from '../data/anchorText.json';
import { normalizePathname } from './canonical-url';

type AnchorVariant = 'exact' | 'lsi' | 'geo';
export type ServiceId = keyof typeof internalLinks;

/**
 * Lightweight link helpers for the critical path.
 * These avoid importing large config files like services.ts or serviceAreas.ts.
 */

/**
 * Normalizes a siteStructure URL to its trailing-slash canonical form at the
 * emit boundary. siteStructure.json stores no-slash URLs (used by breadcrumb
 * comparisons that strip the slash); hrefs emitted from them MUST carry the
 * trailing slash so internal links agree with the canonical URLs Google chose.
 */
export const normalizeHref = (url: string): string => normalizePathname(url);

interface InternalLinkNode {
  id: string;
  url: string;
  title: string;
}

// O(1) Map Indices
const internalLinkMap = new Map<string, InternalLinkNode>();
const parentPillarMap = new Map<string, (typeof siteStructure.pillars)[0]>();

for (const pillar of siteStructure.pillars) {
  internalLinkMap.set(pillar.id, { id: pillar.id, url: pillar.url, title: pillar.title });
  for (const child of pillar.children) {
    internalLinkMap.set(child.id, { id: child.id, url: child.url, title: child.title });
  }
}
if (Array.isArray(siteStructure.subSupporting)) {
  for (const sub of siteStructure.subSupporting) {
    internalLinkMap.set(sub.id, { id: sub.id, url: sub.url, title: sub.title });
  }
}
if (Array.isArray(siteStructure['seo-landing'])) {
  for (const seo of siteStructure['seo-landing']) {
    internalLinkMap.set(seo.id, { id: seo.id, url: seo.url, title: seo.title });
  }
}

const pillarByIdMap = new Map(siteStructure.pillars.map((p) => [p.id, p]));
for (const [id, data] of Object.entries(internalLinks)) {
  if (data.parent) {
    const parentPillar = pillarByIdMap.get(data.parent);
    if (parentPillar) {
      parentPillarMap.set(id, parentPillar);
    }
  }
}

export const getInternalLink = (serviceId: string) => {
  const node = internalLinkMap.get(serviceId);
  if (!node) return null;
  return { ...node, url: normalizeHref(node.url) };
};

export const getAnchorText = (
  serviceId: string,
  variant: AnchorVariant = 'exact',
  context: string = ''
): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anchors = (anchorText as any)[serviceId];
  if (!anchors) {
    // Fallback to title if no specific anchors defined
    const link = getInternalLink(serviceId);
    return link ? link.title : serviceId;
  }

  const variants = (anchors[variant] || anchors['exact']) as string[];
  if (!variants || variants.length === 0) {
    const link = getInternalLink(serviceId);
    return link ? link.title : serviceId;
  }

  /**
   * Performance Optimization: Use deterministic selection instead of Math.random()
   * to prevent React hydration mismatches and ensure UI consistency.
   * Context (like current path) is included to allow rotation across different pages.
   */
  const seed = serviceId + variant + context;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % variants.length;
  return variants[index];
};

export const getRelatedServices = (serviceId: ServiceId) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linkData = (internalLinks as any)[serviceId];
  if (!linkData || !linkData.related) return [];

  return linkData.related.map((id: string) => getInternalLink(id)).filter(Boolean);
};

export const getParentPillar = (serviceId: ServiceId) => {
  return parentPillarMap.get(serviceId) || null;
};
