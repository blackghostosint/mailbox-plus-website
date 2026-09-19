import siteStructure from '../data/siteStructure.json';
import internalLinks from '../data/internalLinks.json';
import { services } from '../config/services';
import type { Service } from '../types/services';

export type PillarNode = (typeof siteStructure.pillars)[0];

export interface ChildNode {
  id: string;
  title: string;
  url: string;
  pillarTitle: string;
  pillarUrl: string;
}

export interface GenericPageNode {
  id: string;
  title: string;
  url: string;
}

export interface InternalLinkNode {
  id: string;
  url: string;
  title: string;
}

export const toPathKey = (path: string): string => {
  if (!path) return '';
  const trimmed = path.trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '';
};

// O(1) Map Indices
export const serviceByIdMap = new Map<string, Service>();
export const serviceBySlugMap = new Map<string, Service>();
export const pillarByIdMap = new Map<string, PillarNode>();
export const pillarByUrlMap = new Map<string, PillarNode>();
export const childByUrlMap = new Map<string, ChildNode>();
export const subSupportingByUrlMap = new Map<string, GenericPageNode>();
export const seoLandingByUrlMap = new Map<string, GenericPageNode>();
export const internalLinkMap = new Map<string, InternalLinkNode>();
export const parentPillarByChildIdMap = new Map<string, PillarNode>();
export const parentPillarByServiceIdMap = new Map<string, PillarNode>();

// Single-pass indexing over services.ts
for (const s of services) {
  serviceByIdMap.set(s.id, s);
  if (s.slug) {
    serviceBySlugMap.set(s.slug, s);
  }
}

// Single-pass indexing over siteStructure.json
for (const p of siteStructure.pillars) {
  pillarByIdMap.set(p.id, p);
  internalLinkMap.set(p.id, { id: p.id, url: p.url, title: p.title });
  const pKey = toPathKey(p.url);
  if (pKey) {
    pillarByUrlMap.set(pKey, p);
  }

  for (const c of p.children) {
    parentPillarByChildIdMap.set(c.id, p);
    internalLinkMap.set(c.id, { id: c.id, url: c.url, title: c.title });
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

if (Array.isArray(siteStructure.subSupporting)) {
  for (const sub of siteStructure.subSupporting) {
    internalLinkMap.set(sub.id, { id: sub.id, url: sub.url, title: sub.title });
    const key = toPathKey(sub.url);
    if (key) {
      subSupportingByUrlMap.set(key, { id: sub.id, title: sub.title, url: sub.url });
    }
  }
}

if (Array.isArray(siteStructure['seo-landing'])) {
  for (const seo of siteStructure['seo-landing']) {
    internalLinkMap.set(seo.id, { id: seo.id, url: seo.url, title: seo.title });
    const key = toPathKey(seo.url);
    if (key) {
      seoLandingByUrlMap.set(key, { id: seo.id, title: seo.title, url: seo.url });
    }
  }
}

// Index internalLinks.json parent relationships
for (const [id, data] of Object.entries(
  internalLinks as Record<string, { parent?: string | null }>
)) {
  if (data.parent) {
    const parentPillar = pillarByIdMap.get(data.parent);
    if (parentPillar) {
      parentPillarByServiceIdMap.set(id, parentPillar);
    }
  }
}

// O(1) Accessor Functions
export const getServiceById = (id: string): Service | undefined => serviceByIdMap.get(id);

export const getServiceBySlug = (slug: string): Service | undefined => serviceBySlugMap.get(slug);

export const getInternalLinkNode = (id: string): InternalLinkNode | undefined =>
  internalLinkMap.get(id);

export const getParentPillarByChildId = (childId: string): PillarNode | undefined =>
  parentPillarByChildIdMap.get(childId);

export const getPillarById = (id: string): PillarNode | undefined => pillarByIdMap.get(id);

export const getPillarByUrl = (url: string): PillarNode | undefined =>
  pillarByUrlMap.get(toPathKey(url));

export const getChildByUrl = (url: string): ChildNode | undefined =>
  childByUrlMap.get(toPathKey(url));

export const getSubSupportingByUrl = (url: string): GenericPageNode | undefined =>
  subSupportingByUrlMap.get(toPathKey(url));

export const getSeoLandingByUrl = (url: string): GenericPageNode | undefined =>
  seoLandingByUrlMap.get(toPathKey(url));

export const getParentPillarByServiceId = (serviceId: string): PillarNode | undefined =>
  parentPillarByServiceIdMap.get(serviceId);
