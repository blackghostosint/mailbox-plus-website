import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prettier from 'prettier';
import { services } from '../astro/src/config/services.js';
import { serviceAreas } from '../astro/src/config/serviceAreas.js';
import { competitivePages } from '../astro/src/config/services/competitive/index.js';
import {
  pillarConfigs,
  subSupportingConfigs,
  standaloneSeoLandingConfigs,
} from '../astro/src/config/pillars.js';

if (!process.env.VITE_R2_PUBLIC_BASE_URL) {
  process.env.VITE_R2_PUBLIC_BASE_URL = 'https://pub-2e9fe7df089647ee93ea6fa1e7235212.r2.dev';
}

const ROOT_DIR = process.cwd();
const SITE_STRUCTURE_PATH = path.join(ROOT_DIR, 'astro/src/data/siteStructure.json');
const LOCAL_PAGES_PATH = path.join(ROOT_DIR, 'astro/src/data/localPages.json');

export const formatUrl = (url: string): string => url.replace(/\/$/, '');

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
    } else if (s.category === 'pack-ship') {
      pillarChildrenMap['pack-ship'].push(child);
    } else if (s.category === 'copy-print') {
      pillarChildrenMap['copy-print'].push(child);
    } else if (
      s.category === 'mailbox-rentals' ||
      s.category === 'document-services' ||
      s.category === 'notary-services' ||
      s.category === 'additional-services' ||
      s.category === 'home-business'
    ) {
      pillarChildrenMap['home-business'].push(child);
    } else if (s.category === 'micro-problems' || s.category === 'micro-problem') {
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

export async function generateRouteRegistry(options?: {
  localPagesPath?: string;
  siteStructurePath?: string;
  write?: boolean;
}) {
  const startTime = performance.now();
  const localPagesPath = options?.localPagesPath || LOCAL_PAGES_PATH;
  const siteStructurePath = options?.siteStructurePath || SITE_STRUCTURE_PATH;
  const shouldWrite = options?.write ?? true;

  const localPages = generateLocalPages();
  const siteStructure = buildSiteStructure();

  if (shouldWrite) {
    const formattedLocalPages = await prettier.format(JSON.stringify(localPages), {
      parser: 'json',
    });
    const formattedSiteStructure = await prettier.format(JSON.stringify(siteStructure), {
      parser: 'json',
    });

    fs.writeFileSync(localPagesPath, formattedLocalPages);
    fs.writeFileSync(siteStructurePath, formattedSiteStructure);

    const duration = (performance.now() - startTime).toFixed(2);
    console.log(`✅ Route registries emitted successfully in ${duration}ms!`);
    console.log(`   - ${localPagesPath} (${localPages.length} local pages)`);
    console.log(
      `   - ${siteStructurePath} (${siteStructure.pillars.reduce((acc, p) => acc + p.children.length, 0)} pillar items, ${siteStructure['seo-landing'].length} seo-landings)`
    );
  }

  return { localPages, siteStructure };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateRouteRegistry();
}
