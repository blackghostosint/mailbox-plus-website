if (!process.env.VITE_R2_PUBLIC_BASE_URL) {
  process.env.VITE_R2_PUBLIC_BASE_URL = 'https://pub-2e9fe7df089647ee93ea6fa1e7235212.r2.dev';
}

import fs from 'fs';
import path from 'path';
import { services } from '../astro/src/config/services.js';
import { serviceAreas } from '../astro/src/config/serviceAreas.js';
import { competitivePages } from '../astro/src/config/services/competitive/index.js';
import {
  pillarConfigs,
  subSupportingConfigs,
  standaloneSeoLandingConfigs,
} from '../astro/src/config/pillars.js';

const ROOT_DIR = process.cwd();
const SITE_STRUCTURE_PATH = path.join(ROOT_DIR, 'astro/src/data/siteStructure.json');
const LOCAL_PAGES_PATH = path.join(ROOT_DIR, 'astro/src/data/localPages.json');

const startTime = performance.now();

// Set of competitive page IDs for categorization
const competitiveIds = new Set(competitivePages.map((s) => s.id));

// 1. Generate localPages.json
const localPages = serviceAreas
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

// 2. Map TS services to siteStructure pillars and sections
const formatUrl = (url: string) => url.replace(/\/$/, '');

// ID mappings for siteStructure parity
const getId = (id: string) => {
  if (id === 'ups-authorized-shipper-outlet') return 'ups-shipping';
  if (id === 'ship-a-return-with-strict-size-or-weight-limits')
    return 'ship-return-strict-size-weight-limits';
  return id;
};

const getTitle = (id: string, serviceName: string) => {
  if (id === 'ups-authorized-shipper-outlet') return 'UPS Shipping';
  if (id === 'usps-services') return 'USPS Services';
  return serviceName;
};

const isGeoDropoff = (s: (typeof services)[0]) => {
  if (!competitiveIds.has(s.id)) return false;
  const id = s.id;
  return (
    id.includes('drop-off') || id.includes('happy-returns') || id.startsWith('package-receiving')
  );
};

const pillarChildrenMap: Record<string, { id: string; url: string; title: string }[]> = {
  'pack-ship': [],
  'copy-print': [],
  'home-business': [],
  'micro-problems': [],
  specialty: [],
  'geo-dropoffs': [],
};

const seoLanding: { id: string; url: string; title: string }[] = [];

// Add standalone SEO landings first
standaloneSeoLandingConfigs.forEach((item) => {
  seoLanding.push({
    id: item.id,
    url: formatUrl(item.url),
    title: item.title,
  });
});

services.forEach((s) => {
  const url = formatUrl(s.slug);
  const child = {
    id: getId(s.id),
    url: url,
    title: getTitle(s.id, s.serviceName),
  };

  if (isGeoDropoff(s)) {
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

// Ensure ask-mailbox-plus is present in micro-problems if not already
if (!pillarChildrenMap['micro-problems'].some((c) => c.id === 'ask-mailbox-plus')) {
  pillarChildrenMap['micro-problems'].push({
    id: 'ask-mailbox-plus',
    url: '/ask-mailbox-plus',
    title: 'Ask Mailbox Plus',
  });
}

// Build pillars array
const pillars = pillarConfigs.map((config) => ({
  id: config.id,
  title: config.title,
  url: formatUrl(config.url),
  description: config.description,
  children: pillarChildrenMap[config.id] || [],
}));

// Build subSupporting array
const subSupporting = subSupportingConfigs.map((config) => ({
  id: config.id,
  url: formatUrl(config.url),
  title: config.title,
}));

const siteStructure = {
  homepage: {
    url: '/',
    title: 'Mailbox Plus - Shipping & Printing in Concord Township',
  },
  pillars,
  subSupporting,
  'seo-landing': seoLanding,
};

// Write files
fs.writeFileSync(LOCAL_PAGES_PATH, JSON.stringify(localPages, null, 2) + '\n');
fs.writeFileSync(SITE_STRUCTURE_PATH, JSON.stringify(siteStructure, null, 2) + '\n');

const duration = (performance.now() - startTime).toFixed(2);
console.log(`✅ Route registries emitted successfully in ${duration}ms!`);
console.log(`   - ${LOCAL_PAGES_PATH} (${localPages.length} local pages)`);
console.log(
  `   - ${SITE_STRUCTURE_PATH} (${pillars.reduce((acc, p) => acc + p.children.length, 0)} pillar items, ${seoLanding.length} seo-landings)`
);
