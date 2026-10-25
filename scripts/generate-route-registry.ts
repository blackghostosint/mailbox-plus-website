import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prettier from 'prettier';
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

if (!process.env.VITE_R2_PUBLIC_BASE_URL) {
  process.env.VITE_R2_PUBLIC_BASE_URL = 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev';
}

const ROOT_DIR = getWorkspaceRoot();
const SITE_STRUCTURE_PATH = path.join(ROOT_DIR, 'astro/src/data/siteStructure.json');
const LOCAL_PAGES_PATH = path.join(ROOT_DIR, 'astro/src/data/localPages.json');
const INTERNAL_LINKS_PATH = path.join(ROOT_DIR, 'astro/src/data/internalLinks.json');
const ANCHOR_TEXT_PATH = path.join(ROOT_DIR, 'astro/src/data/anchorText.json');

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
  if (id === 'ship-a-return-with-strict-size-or-weight-limits')
    return 'ship-return-strict-size-weight-limits';
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

    if (isGeoDropoff(s, competitiveIds)) {
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

  if (!pillarChildrenMap['micro-problems'].some((c) => c.id === 'ask-mailbox-plus')) {
    pillarChildrenMap['micro-problems'].push({
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
  )
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

  internalLinksMap['homepage'] = {
    parent: null,
    related: [
      'pack-ship',
      'copy-print',
      'home-business',
      'mailbox-rental',
      'fedex-shipping',
      'ups-shipping',
      'notary-services',
    ].map(getId),
    priority: true,
  };

  for (const p of pillarConfigsList) {
    internalLinksMap[getId(p.id)] = {
      parent: p.internalLink?.parent ? getId(p.internalLink.parent) : null,
      related: (p.internalLink?.related || []).map(getId),
      priority: p.internalLink?.priority ?? true,
    };
  }

  for (const sub of subSupportingList) {
    internalLinksMap[getId(sub.id)] = {
      parent: getId(sub.internalLink?.parent ?? 'pack-ship'),
      related: (sub.internalLink?.related || []).map(getId),
      priority: sub.internalLink?.priority ?? false,
    };
  }

  for (const seo of standaloneSeoList) {
    internalLinksMap[getId(seo.id)] = {
      parent: getId(seo.internalLink?.parent ?? 'home-business'),
      related: (seo.internalLink?.related || []).map(getId),
      priority: seo.internalLink?.priority ?? false,
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
      related: (s.internalLink?.related || []).map(getId),
      priority: s.internalLink?.priority ?? false,
    };
  }

  if (childToPillarMap.has('ask-mailbox-plus') && !internalLinksMap['ask-mailbox-plus']) {
    internalLinksMap['ask-mailbox-plus'] = {
      parent: getId(childToPillarMap.get('ask-mailbox-plus') || 'micro-problems'),
      related: [
        'mailbox-rental',
        'notary-services',
        'pack-ship',
        'copy-print',
        'drop-off-a-prepaid-label-from-your-phone',
        'fix-a-return-that-was-rejected-due-to-packaging-issues-in-concord-township',
        'get-help-choosing-the-right-box-for-shipping-in-concord-township',
        'ship-with-guaranteed-proof-and-tracking-concord-township',
      ].map(getId),
      priority: false,
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

  const localPages = generateLocalPages();
  const siteStructure = buildSiteStructure();
  const internalLinks = buildInternalLinks(
    services,
    pillarConfigs,
    subSupportingConfigs,
    standaloneSeoLandingConfigs,
    siteStructure
  );
  const anchorText = buildAnchorText();

  if (shouldWrite) {
    const formattedLocalPages = await prettier.format(JSON.stringify(localPages), {
      parser: 'json',
      printWidth: 100,
    });
    const formattedSiteStructure = await prettier.format(JSON.stringify(siteStructure), {
      parser: 'json',
      printWidth: 100,
    });
    const formattedInternalLinks = await prettier.format(JSON.stringify(internalLinks), {
      parser: 'json',
      printWidth: 100,
    });
    const formattedAnchorText = await prettier.format(JSON.stringify(anchorText), {
      parser: 'json',
      printWidth: 100,
    });

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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateRouteRegistry();
}
