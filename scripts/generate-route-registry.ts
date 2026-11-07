import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import type { Service } from '../astro/src/types/services.ts';
import { toRouteKey } from '../astro/src/utils/url-normalization.ts';
import { services } from '../astro/src/config/services.js';
import { serviceAreas } from '../astro/src/config/serviceAreas.js';
import { competitivePages } from '../astro/src/config/services/competitive/index.js';
import {
  pillarConfigs,
  subSupportingConfigs,
  standaloneSeoLandingConfigs,
} from '../astro/src/config/pillars.js';
import { getWorkspaceRoot, atomicWriteFileSync } from './lib/workspace-paths.ts';
import { isMainModule, parseScriptArgs } from './lib/cli-utils.ts';

if (!process.env.VITE_R2_PUBLIC_BASE_URL) {
  process.env.VITE_R2_PUBLIC_BASE_URL = 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev';
}

const ROOT_DIR = getWorkspaceRoot();
const SITE_STRUCTURE_PATH = path.join(ROOT_DIR, 'astro/src/data/siteStructure.json');
const LOCAL_PAGES_PATH = path.join(ROOT_DIR, 'astro/src/data/localPages.json');
const INTERNAL_LINKS_PATH = path.join(ROOT_DIR, 'astro/src/data/internalLinks.json');
const ANCHOR_TEXT_PATH = path.join(ROOT_DIR, 'astro/src/data/anchorText.json');

export async function loadMicroProblems(
  microProblemsDir = path.join(ROOT_DIR, 'astro/src/config/micro-problems')
): Promise<Service[]> {
  if (!fs.existsSync(microProblemsDir)) {
    return [];
  }
  const KNOWN_ORDER = ['returns.ts', 'shipping.ts', 'packaging.ts', 'misc.ts', 'regulated.ts'];
  const files = fs
    .readdirSync(microProblemsDir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .sort((a, b) => {
      const idxA = KNOWN_ORDER.indexOf(a);
      const idxB = KNOWN_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

  const microProblemsList: Service[] = [];
  for (const file of files) {
    const filePath = path.join(microProblemsDir, file);
    const mod = await import(filePath);
    for (const val of Object.values(mod)) {
      if (Array.isArray(val)) {
        microProblemsList.push(...(val as Service[]));
      }
    }
  }
  return microProblemsList;
}

export const formatUrl = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url);
      const routeKey = toRouteKey(parsed.pathname + parsed.search + parsed.hash);
      return `${parsed.origin}${routeKey === '/' ? '' : routeKey}`;
    } catch {
      // ignore parsing error, fallback to toRouteKey
    }
  }
  return toRouteKey(url);
};

export const getId = (id: string): string => {
  if (id === 'ups-authorized-shipper-outlet') return 'ups-shipping';
  if (id === 'ship-return-strict-size-weight-limits')
    return 'ship-a-return-with-strict-size-or-weight-limits';
  return id;
};

export const getTitle = (id: string, serviceName: string): string => {
  if (id === 'ups-authorized-shipper-outlet') return 'UPS Shipping';
  if (id === 'usps-services') return 'USPS Services';
  return serviceName;
};

export const isGeoDropoff = (
  s: { id: string },
  compIds: Set<string> = new Set(competitivePages.map((p) => p.id))
): boolean => {
  if (!compIds.has(s.id)) return false;
  const id = s.id;
  return (
    id.includes('drop-off') || id.includes('happy-returns') || id.startsWith('package-receiving')
  );
};

export function generateLocalPages(areas = serviceAreas) {
  return areas
    .filter((area) => !area.id.startsWith('faq-'))
    .map((area) => {
      const city = area.city || area.serviceName.replace(/ Services$/, '');
      return {
        slug: area.slug,
        city: city,
        state: 'OH',
        introTitle: `Shipping & Business Services in ${city}, OH`,
        introductoryContent: `Mailbox Plus is proud to be the trusted shipping and business services partner for the residents and businesses of <strong>${city}, OH</strong>. We are conveniently located just a short drive away, offering a reliable alternative for all your FedEx, UPS, and USPS needs.`,
        metaTitle: area.pageTitle || '',
        metaDescription: area.metaDescription || '',
        canonical: area.canonicalUrl || `/service-area/${area.slug}`,
        heroImage: area.heroImage || `/images/${area.slug}.webp`,
        services: area.priorityServices || [],
      };
    });
}

export function buildSiteStructure(
  servicesList = services,
  competitiveList = competitivePages,
  pillarConfigsList = pillarConfigs,
  subSupportingList = subSupportingConfigs,
  standaloneSeoList = standaloneSeoLandingConfigs
) {
  const competitiveIds = new Set(competitiveList.map((s) => s.id));

  const pillarChildrenMap: Record<string, { id: string; url: string; title: string }[]> = {
    'pack-ship': [],
    'copy-print': [],
    'home-business': [],
    'micro-problems': [],
    specialty: [],
    'geo-dropoffs': [],
  };

  const seoLanding: { id: string; url: string; title: string }[] = [];

  standaloneSeoList.forEach((item) => {
    seoLanding.push({
      id: item.id,
      url: formatUrl(item.url),
      title: item.title,
    });
  });

  servicesList.forEach((s) => {
    const url = formatUrl(s.slug);
    const child = {
      id: getId(s.id),
      url: url,
      title: getTitle(s.id, s.serviceName),
    };

    if (
      s.id === 'ship-a-return-with-strict-size-or-weight-limits' ||
      child.id === 'ship-a-return-with-strict-size-or-weight-limits'
    ) {
      pillarChildrenMap['micro-problems'].push(child);
    } else if (isGeoDropoff(s, competitiveIds)) {
      pillarChildrenMap['geo-dropoffs'].push(child);
    } else if (competitiveIds.has(s.id)) {
      seoLanding.push(child);
    } else if (s.internalLink?.parent && pillarChildrenMap[s.internalLink.parent]) {
      pillarChildrenMap[s.internalLink.parent].push(child);
    } else if (s.category === 'pack-ship') {
      pillarChildrenMap['pack-ship'].push(child);
    } else if (s.category === 'copy-print') {
      pillarChildrenMap['copy-print'].push(child);
    } else if (
      s.category === 'mailbox-rentals' ||
      s.category === 'document-services' ||
      s.category === 'notary-services' ||
      s.category === 'additional-services' ||
      (s.category as string) === 'home-business'
    ) {
      pillarChildrenMap['home-business'].push(child);
    } else if ((s.category as string) === 'micro-problems' || s.category === 'micro-problem') {
      pillarChildrenMap['micro-problems'].push(child);
    } else if (s.category === 'specialty') {
      pillarChildrenMap['specialty'].push(child);
    }
  });

  if (!pillarChildrenMap['home-business'].some((c) => c.id === 'ask-mailbox-plus')) {
    pillarChildrenMap['home-business'].push({
      id: 'ask-mailbox-plus',
      url: '/ask-mailbox-plus',
      title: 'Ask Mailbox Plus',
    });
  }

  const pillars = pillarConfigsList.map((config) => ({
    id: config.id,
    title: config.title,
    url: formatUrl(config.url),
    description: config.description,
    children: pillarChildrenMap[config.id] || [],
  }));

  const subSupporting = subSupportingList.map((config) => ({
    id: config.id,
    url: formatUrl(config.url),
    title: config.title,
  }));

  return {
    homepage: {
      url: '/',
      title: 'Mailbox Plus - Shipping & Printing in Concord Township',
    },
    pillars,
    subSupporting,
    'seo-landing': seoLanding,
  };
}

export function buildInternalLinks(
  servicesList = services,
  pillarConfigsList = pillarConfigs,
  subSupportingList = subSupportingConfigs,
  standaloneSeoList = standaloneSeoLandingConfigs,
  siteStructureObj = buildSiteStructure(
    servicesList,
    competitivePages,
    pillarConfigsList,
    subSupportingList,
    standaloneSeoList
  ),
  existingInternalLinksMap: Record<
    string,
    { parent: string | null; related: string[]; priority: boolean }
  > = {}
) {
  const childToPillarMap = new Map<string, string>();
  for (const pillar of siteStructureObj.pillars) {
    for (const child of pillar.children) {
      childToPillarMap.set(child.id, pillar.id);
    }
  }

  const internalLinksMap: Record<
    string,
    { parent: string | null; related: string[]; priority: boolean }
  > = {};

  const getExistingRelated = (id: string, fallback: string[]): string[] => {
    const existing = existingInternalLinksMap[id];
    if (existing && Array.isArray(existing.related) && existing.related.length > 0) {
      return existing.related.map(getId);
    }
    return fallback.map(getId);
  };

  internalLinksMap['homepage'] = {
    parent: null,
    related: getExistingRelated('homepage', [
      'pack-ship',
      'copy-print',
      'home-business',
      'mailbox-rental',
      'fedex-shipping',
      'ups-shipping',
      'notary-services',
    ]),
    priority: true,
  };

  for (const p of pillarConfigsList) {
    const id = getId(p.id);
    internalLinksMap[id] = {
      parent: p.internalLink?.parent ? getId(p.internalLink.parent) : null,
      related: getExistingRelated(id, p.internalLink?.related || []),
      priority: p.internalLink?.priority ?? existingInternalLinksMap[id]?.priority ?? true,
    };
  }

  for (const sub of subSupportingList) {
    const id = getId(sub.id);
    internalLinksMap[id] = {
      parent: getId(sub.internalLink?.parent ?? 'pack-ship'),
      related: getExistingRelated(id, sub.internalLink?.related || []),
      priority: sub.internalLink?.priority ?? existingInternalLinksMap[id]?.priority ?? false,
    };
  }

  for (const seo of standaloneSeoList) {
    const id = getId(seo.id);
    internalLinksMap[id] = {
      parent: getId(seo.internalLink?.parent ?? 'home-business'),
      related: getExistingRelated(id, seo.internalLink?.related || []),
      priority: seo.internalLink?.priority ?? existingInternalLinksMap[id]?.priority ?? false,
    };
  }

  for (const s of servicesList) {
    const id = getId(s.id);
    const pillarParent = childToPillarMap.get(id);
    const parent =
      pillarParent !== undefined
        ? pillarParent
        : s.internalLink?.parent
          ? getId(s.internalLink.parent)
          : null;

    internalLinksMap[id] = {
      parent,
      related: getExistingRelated(id, s.internalLink?.related || []),
      priority: s.internalLink?.priority ?? existingInternalLinksMap[id]?.priority ?? false,
    };
  }

  if (childToPillarMap.has('ask-mailbox-plus') && !internalLinksMap['ask-mailbox-plus']) {
    const existing = existingInternalLinksMap['ask-mailbox-plus'];
    internalLinksMap['ask-mailbox-plus'] = {
      parent: getId(childToPillarMap.get('ask-mailbox-plus') || 'home-business'),
      related: getExistingRelated('ask-mailbox-plus', [
        'mailbox-rental',
        'notary-services',
        'pack-ship',
        'copy-print',
        'drop-off-a-prepaid-label-from-your-phone',
        'fix-a-return-that-was-rejected-due-to-packaging-issues-in-concord-township',
        'get-help-choosing-the-right-box-for-shipping-in-concord-township',
        'ship-with-guaranteed-proof-and-tracking-concord-township',
      ]),
      priority: existing?.priority ?? false,
    };
  }

  return internalLinksMap;
}

export function buildAnchorText(
  servicesList = services,
  pillarConfigsList = pillarConfigs,
  subSupportingList = subSupportingConfigs,
  standaloneSeoList = standaloneSeoLandingConfigs
) {
  const anchorTextMap: Record<string, { exact?: string[]; lsi?: string[]; geo?: string[] }> = {};

  const registerAnchorText = (
    id: string,
    anchorText?: { exact?: string[]; lsi?: string[]; geo?: string[] }
  ) => {
    if (
      anchorText &&
      (anchorText.exact?.length || anchorText.lsi?.length || anchorText.geo?.length)
    ) {
      anchorTextMap[id] = {
        exact: anchorText.exact || [],
        lsi: anchorText.lsi || [],
        geo: anchorText.geo || [],
      };
    }
  };

  for (const p of pillarConfigsList) {
    registerAnchorText(p.id, p.anchorText);
  }

  for (const sub of subSupportingList) {
    registerAnchorText(sub.id, sub.anchorText);
  }

  for (const seo of standaloneSeoList) {
    registerAnchorText(seo.id, seo.anchorText);
  }

  for (const s of servicesList) {
    const id = getId(s.id);
    registerAnchorText(id, s.anchorText);
  }

  return anchorTextMap;
}

export async function generateRouteRegistry(options?: {
  localPagesPath?: string;
  siteStructurePath?: string;
  internalLinksPath?: string;
  anchorTextPath?: string;
  write?: boolean;
}) {
  const startTime = performance.now();
  const localPagesPath = options?.localPagesPath || LOCAL_PAGES_PATH;
  const siteStructurePath = options?.siteStructurePath || SITE_STRUCTURE_PATH;
  const internalLinksPath = options?.internalLinksPath || INTERNAL_LINKS_PATH;
  const anchorTextPath = options?.anchorTextPath || ANCHOR_TEXT_PATH;
  const shouldWrite = options?.write ?? true;

  let existingInternalLinks: Record<
    string,
    { parent: string | null; related: string[]; priority: boolean }
  > = {};
  if (fs.existsSync(internalLinksPath)) {
    try {
      existingInternalLinks = JSON.parse(fs.readFileSync(internalLinksPath, 'utf-8'));
    } catch {
      // ignore
    }
  }

  const dynamicMicroProblems = await loadMicroProblems();
  const competitiveIds = new Set(competitivePages.map((c) => c.id));
  const compIdx = services.findIndex((s) => competitiveIds.has(s.id));
  const preServices = (compIdx === -1 ? services : services.slice(0, compIdx)).filter(
    (s) => s.category !== 'micro-problem' && (s.category as string) !== 'micro-problems'
  );
  const postServices = compIdx === -1 ? [] : services.slice(compIdx);
  const combinedServices = [...preServices, ...dynamicMicroProblems, ...postServices];

  const localPages = generateLocalPages();
  const siteStructure = buildSiteStructure(combinedServices);
  const internalLinks = buildInternalLinks(
    combinedServices,
    pillarConfigs,
    subSupportingConfigs,
    standaloneSeoLandingConfigs,
    siteStructure,
    existingInternalLinks
  );
  const anchorText = buildAnchorText(combinedServices);

  if (shouldWrite) {
    const fmt = async (p: string, data: unknown) =>
      prettier.format(JSON.stringify(data), {
        // prettier.format() does NOT resolve config files itself — without an
        // explicit config it falls back to printWidth 80, which reflows every
        // regen and dirties the tree (pre-push clean-tree check can never pass).
        ...(await prettier.resolveConfig(p)),
        parser: 'json',
        filepath: p,
      });
    const formattedLocalPages = await fmt(localPagesPath, localPages);
    const formattedSiteStructure = await fmt(siteStructurePath, siteStructure);
    const formattedInternalLinks = await fmt(internalLinksPath, internalLinks);
    const formattedAnchorText = await fmt(anchorTextPath, anchorText);

    atomicWriteFileSync(localPagesPath, formattedLocalPages);
    atomicWriteFileSync(siteStructurePath, formattedSiteStructure);
    atomicWriteFileSync(internalLinksPath, formattedInternalLinks);
    atomicWriteFileSync(anchorTextPath, formattedAnchorText);

    const duration = (performance.now() - startTime).toFixed(2);
    console.log(`✅ Route registries emitted successfully in ${duration}ms!`);
    console.log(`   - ${localPagesPath} (${localPages.length} local pages)`);
    console.log(
      `   - ${siteStructurePath} (${siteStructure.pillars.reduce((acc, p) => acc + p.children.length, 0)} pillar items, ${siteStructure['seo-landing'].length} seo-landings)`
    );
    console.log(`   - ${internalLinksPath} (${Object.keys(internalLinks).length} internal links)`);
    console.log(`   - ${anchorTextPath} (${Object.keys(anchorText).length} anchor text entries)`);
  }

  return { localPages, siteStructure, internalLinks, anchorText };
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  generateRouteRegistry();
}
