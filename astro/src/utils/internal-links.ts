import internalLinks from '../data/internalLinks.json';
import anchorText from '../data/anchorText.json';
import { toCanonicalUrlPath } from './url-normalization';
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
export const normalizeHref = (url: string): string => toCanonicalUrlPath(url);

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

export interface RelatedArticleInput {
  slug: string;
  title: string;
  description?: string;
  category: string;
  keywords?: string[];
  location?: string;
  status?: string;
}

export interface RelatedArticleLink {
  slug: string;
  title: string;
  description: string;
  category: string;
  href: string;
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'how',
  'what',
  'when',
  'where',
  'why',
  'your',
  'near',
  'ohio',
]);

function extractTopicTokens(item: RelatedArticleInput): Set<string> {
  const raw = [item.title || '', ...(item.keywords || [])].join(' ').toLowerCase();
  const matches = raw.match(/[a-z0-9]{3,}/g) || [];
  return new Set(matches.filter((w) => !STOP_WORDS.has(w)));
}

export function selectRelatedArticles(
  current: RelatedArticleInput,
  corpus: RelatedArticleInput[],
  limit = 3
): RelatedArticleLink[] {
  const currentTokens = extractTopicTokens(current);
  const scored: { score: number; tie: number; item: RelatedArticleInput }[] = [];

  for (const cand of corpus) {
    if (!cand?.slug || cand.slug === current.slug) continue;
    const st = (cand.status || 'published').toLowerCase();
    if (st === 'draft' || st === 'draft-noindex') continue;

    let score = 0;
    if (cand.category === current.category) score += 10;

    const candTokens = extractTopicTokens(cand);
    for (const tok of currentTokens) {
      if (candTokens.has(tok)) score += 3;
    }

    if (
      current.location &&
      cand.location &&
      current.location !== 'concord-township' &&
      cand.location === current.location
    ) {
      score += 2;
    }

    const tie = Math.abs(hashString(`${current.slug}:${cand.slug}`));
    scored.push({ score, tie, item: cand });
  }

  scored.sort(
    (a, b) => b.score - a.score || a.tie - b.tie || a.item.slug.localeCompare(b.item.slug)
  );

  return scored.slice(0, limit).map(({ item }) => ({
    slug: item.slug,
    title: item.title,
    description: item.description || '',
    category: item.category,
    href: normalizeHref(`/articles/${item.slug}`),
  }));
}
