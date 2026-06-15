import siteStructure from '../data/siteStructure.json';
import internalLinks from '../data/internalLinks.json';
import anchorText from '../data/anchorText.json';

type AnchorVariant = 'exact' | 'lsi' | 'geo';
type ServiceId = keyof typeof internalLinks;

/**
 * Lightweight link helpers for the critical path.
 * These avoid importing large config files like services.ts or serviceAreas.ts.
 */

export const getInternalLink = (serviceId: string) => {
  // Find the service in the site structure
  for (const pillar of siteStructure.pillars) {
    if (pillar.id === serviceId) return pillar;
    const child = pillar.children.find((c) => c.id === serviceId);
    if (child) return child;
  }
  // Check sub-supporting
  const sub = siteStructure.subSupporting.find((s) => s.id === serviceId);
  if (sub) return sub;

  return null;
};

export const getAnchorText = (serviceId: string, variant: AnchorVariant = 'exact'): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anchors = (anchorText as any)[serviceId];
  if (!anchors) {
    // Fallback to title if no specific anchors defined
    const link = getInternalLink(serviceId);
    return link ? link.title : serviceId;
  }

  const variants = anchors[variant] || anchors['exact'];

  /**
   * Performance & Hydration Fix:
   * We use a deterministic selection based on the serviceId instead of Math.random().
   * This prevents hydration mismatches between SSR/Build-time and Client-side renders.
   */
  const seed = serviceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return variants[seed % variants.length];
};

export const getRelatedServices = (serviceId: ServiceId) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linkData = (internalLinks as any)[serviceId];
  if (!linkData || !linkData.related) return [];

  return linkData.related.map((id: string) => getInternalLink(id)).filter(Boolean);
};

export const getParentPillar = (serviceId: ServiceId) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linkData = (internalLinks as any)[serviceId];
  if (!linkData || !linkData.parent) return null;
  return siteStructure.pillars.find((p) => p.id === linkData.parent);
};
