import internalLinks from '../data/internalLinks.json';
import anchorText from '../data/anchorText.json';
import { normalizePathname } from './canonical-url';
import { hashString } from './hash-helpers';
import { getInternalLinkNode, getParentPillarByServiceId } from './site-registry';

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

export const getInternalLink = (serviceId: string) => {
  const node = getInternalLinkNode(serviceId);
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
  const hash = hashString(seed);
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
  return getParentPillarByServiceId(serviceId) || null;
};
