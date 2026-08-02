#!/usr/bin/env node
/**
 * SEO INTERNAL LINK STRATEGY AUDIT
 * =================================
 * Verifies the four pillars of the internal linking strategy:
 *
 *  1. CONTENT LINKS (Phase 3.3) — every SEO landing page config (competitive
 *     alternatives, local-seo, gsc-landing) contains >= 1 contextual <a href>
 *     in its body content pointing to a service page.
 *  2. LINK TARGET VALIDITY — every internal href in service configs resolves
 *     to a route that exists (siteStructure.json OR the built dist/).
 *  3. REGISTRY COVERAGE — every route in siteStructure.json has an entry in
 *     internalLinks.json, so the RelatedServices component renders links on
 *     every service page (no dead ends).
 *  4. INBOUND LINKS — every registered page is the target of at least one
 *     link from another page (inline content links + internalLinks "related"
 *     edges + article links). No orphan / link sinks.
 *
 * Usage: node scripts/seo/check-internal-link-strategy.mjs
 * Exit code 0 = pass, 1 = fail. Warnings are non-blocking.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DATA_DIR = path.join(ROOT, 'astro/src/data');
const CONFIG_DIR = path.join(ROOT, 'astro/src/config/services');
const MICRO_PROBLEMS_DIR = path.join(ROOT, 'astro/src/config/micro-problems');
const ARTICLES_DIR = path.join(ROOT, 'content/articles');
const DIST_DIR = path.join(ROOT, 'dist');

const SITE_STRUCTURE = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'siteStructure.json'), 'utf-8')
);
const INTERNAL_LINKS = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'internalLinks.json'), 'utf-8')
);

// ---- Configurable thresholds ----
const MIN_LINKS_PER_SEO_PAGE = 1; // Phase 3.3
const ALLOWED_PREFIXES = ['/articles', '/service-area', '/guide', '/rewards', '/research', '/images'];

// Service blocks that are "SEO landing pages" (Phase 3.3 scope) vs core services
// SEO landing pages get their links ONLY from inline content. Core service pages
// additionally get links from the auto-rendered RelatedServices component.
const SEO_LANDING_FILES = [
  'competitive/', // all files under competitive/
  'local-seo.ts',
  'gsc-landing-pages.ts',
  'micro-problems.ts',
];

function normalizePath(p) {
  if (!p) return '';
  let cleaned = p.trim();
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    try {
      cleaned = new URL(cleaned).pathname;
    } catch (e) {
      return '';
    }
  }
  cleaned = cleaned.split('#')[0].split('?')[0];
  if (cleaned.endsWith('.html')) cleaned = cleaned.slice(0, -5);
  if (!cleaned.startsWith('/')) cleaned = '/' + cleaned;
  if (cleaned.length > 1 && cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
  return cleaned;
}

// ---- 1. Collect all known routes from siteStructure.json + built dist ----
const knownRoutes = new Set();
const knownIds = new Set();
function register(item) {
  if (!item || typeof item !== 'object') return;
  if (item.id) knownIds.add(item.id);
  if (item.url) knownRoutes.add(normalizePath(item.url));
  if (Array.isArray(item.children)) item.children.forEach(register);
}
if (SITE_STRUCTURE.homepage) register(SITE_STRUCTURE.homepage);
['pillars', 'subSupporting', 'seo-landing'].forEach((key) => {
  (SITE_STRUCTURE[key] || []).forEach(register);
});

// Built routes from dist/ (ground truth for link target validity)
const builtRoutes = new Set();
function walkHtml(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walkHtml(full, list);
    else if (entry.endsWith('.html')) list.push(full);
  }
  return list;
}
for (const f of walkHtml(DIST_DIR)) {
  const rel = path.relative(DIST_DIR, f).replace(/\\/g, '/');
  let urlPath = rel === 'index.html' ? '/' : '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  builtRoutes.add(normalizePath(urlPath));
}

// ---- 2. Collect service config pages and their inline content links ----
function walk(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full, fileList);
    else if (entry.endsWith('.ts')) fileList.push(full);
  }
  return fileList;
}

const configFiles = walk(CONFIG_DIR).concat(walk(MICRO_PROBLEMS_DIR));
const pages = []; // { id, slug, file, links, isSeoLanding }
const pagesById = new Map();
const linkSinks = new Map(); // target -> inbound count from inline content links

function isSeoLandingFile(file) {
  const rel = path.relative(CONFIG_DIR, file).replace(/\\/g, '/');
  return SEO_LANDING_FILES.some((p) => p.endsWith('/') ? rel.startsWith(p) : rel.includes(p));
}

function addPage(id, slug, file, block) {
  const hrefs = [...block.matchAll(/href="(\/[^"#?]*)/g)].map((m) => normalizePath(m[1]));
  const internal = hrefs.filter((h) => h && !h.startsWith('//') && !h.startsWith('/images'));
  const page = { id, slug: normalizePath(slug), file, links: [...new Set(internal)], isSeoLanding: isSeoLandingFile(file) };
  pages.push(page);
  pagesById.set(id, page);
  for (const target of new Set(internal)) {
    linkSinks.set(target, (linkSinks.get(target) || 0) + 1);
  }
}

for (const file of configFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const blocks = content.split(/\n\s*id:\s*'/);
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const id = block.slice(0, block.indexOf("'"));
    if (!id) continue;
    const slugMatch = block.match(/slug:\s*'([^']+)'/);
    const slug = slugMatch ? slugMatch[1] : null;
    addPage(id, slug || `/${id}`, file, block);
  }
}

// ---- 3. Inbound edges from internalLinks.json "related" arrays ----
// Each entry: key page has related: [ids...] -> those edges render as links
// from the key page to each related page (RelatedServices component).
// Map related IDs to their URL routes before counting inbound.
const idToRoute = new Map();
for (const p of pages) if (p.slug) idToRoute.set(p.id, p.slug);
for (const item of [SITE_STRUCTURE.homepage, ...(SITE_STRUCTURE.pillars || []), ...(SITE_STRUCTURE.subSupporting || []), ...(SITE_STRUCTURE['seo-landing'] || [])]) {
  if (item && item.id && item.url) idToRoute.set(item.id, normalizePath(item.url));
}

const relatedEdges = new Map(); // targetRoute -> count
for (const [srcId, entry] of Object.entries(INTERNAL_LINKS)) {
  if (entry && Array.isArray(entry.related)) {
    for (const relId of entry.related) {
      const route = idToRoute.get(relId) || normalizePath(String(relId));
      relatedEdges.set(route, (relatedEdges.get(route) || 0) + 1);
    }
  }
  // parent relationship itself is an inbound edge from parent
  if (entry && entry.parent) {
    const parentRoute = idToRoute.get(entry.parent) || normalizePath(String(entry.parent));
    relatedEdges.set(parentRoute, (relatedEdges.get(parentRoute) || 0) + 1);
  }
}

// ---- 4. Inbound links from articles ----
const articleSinks = new Map();
function walkMd(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walkMd(full, list);
    else if (entry.endsWith('.md')) list.push(full);
  }
  return list;
}
for (const f of walkMd(ARTICLES_DIR)) {
  const content = fs.readFileSync(f, 'utf-8');
  const hrefs = [...content.matchAll(/\]\((\/[^)#?\s]+)/g)].map((m) => normalizePath(m[1]));
  for (const h of hrefs) {
    if (h && !h.startsWith('//')) articleSinks.set(h, (articleSinks.get(h) || 0) + 1);
  }
}

// ---- Checks ----

// Check 1: Content links on SEO landing pages (Phase 3.3)
const seoPages = pages.filter((p) => p.isSeoLanding);
const seoMissing = seoPages.filter((p) => p.links.length < MIN_LINKS_PER_SEO_PAGE);

// Check 2: Link target validity (against siteStructure OR built routes)
const brokenTargets = new Map();
for (const page of pages) {
  for (const target of page.links) {
    if (knownRoutes.has(target) || builtRoutes.has(target)) continue;
    if (ALLOWED_PREFIXES.some((p) => target.startsWith(p))) continue;
    if (!brokenTargets.has(target)) brokenTargets.set(target, []);
    brokenTargets.get(target).push(page.id);
  }
}

// Check 3: Registry coverage
const internalLinkKeys = new Set(Object.keys(INTERNAL_LINKS));
const registryMissingLinks = [...knownIds].filter((id) => !internalLinkKeys.has(id));

// Check 4: Inbound coverage (inline + related edges + articles)
const inboundTotal = new Map();
for (const [t, c] of linkSinks) inboundTotal.set(t, (inboundTotal.get(t) || 0) + c);
for (const [t, c] of relatedEdges) inboundTotal.set(t, (inboundTotal.get(t) || 0) + c);
for (const [t, c] of articleSinks) inboundTotal.set(t, (inboundTotal.get(t) || 0) + c);

// Legacy alias / phantom routes that are intentionally not built as standalone
// pages (handled under /pack-ship/ or allowed-missing in the route registry).
const ALLOWED_LEGACY_ALIASES = new Set([
  '/drop-off-locations', // geo dropoff landing; nested elsewhere
  '/package-drop-offs', // built under /pack-ship/package-drop-offs
  '/package-receiving', // built under /pack-ship/package-receiving
]);

const orphanRoutes = [];
for (const route of knownRoutes) {
  if (route === '/') continue;
  if (ALLOWED_LEGACY_ALIASES.has(route)) continue;
  const hasInbound = (inboundTotal.get(route) || 0) > 0;
  if (!hasInbound) orphanRoutes.push(route);
}

// ---- Reporting ----
let failed = false;
console.log('==================================================');
console.log('  SEO INTERNAL LINK STRATEGY AUDIT');
console.log('==================================================\n');

console.log(`ℹ️ Routes in siteStructure.json: ${knownRoutes.size}`);
console.log(`ℹ️ Routes built in dist/: ${builtRoutes.size}`);
console.log(`ℹ️ Service config pages audited: ${pages.length} (${seoPages.length} SEO landing pages)`);
console.log(`ℹ️ internalLinks.json entries: ${internalLinkKeys.size}`);
console.log(`ℹ️ Articles scanned for links: ${walkMd(ARTICLES_DIR).length}\n`);

// 1. Content links
console.log('--- 1. Content Links on SEO Landing Pages (Phase 3.3) ---');
if (seoMissing.length === 0) {
  console.log(`✅ OK: All ${seoPages.length} SEO landing pages have >= ${MIN_LINKS_PER_SEO_PAGE} contextual link(s).`);
} else {
  failed = true;
  console.error(`❌ FAIL: ${seoMissing.length}/${seoPages.length} SEO landing page(s) have NO contextual links:`);
  for (const p of seoMissing) {
    console.error(`   - ${p.id} (${p.slug}) [${path.relative(ROOT, p.file)}]`);
  }
}
const seoWithLinks = seoPages.length - seoMissing.length;

// 1b. Core pages (informational — they get RelatedServices links automatically)
const coreMissing = pages.filter((p) => !p.isSeoLanding && p.links.length === 0);
console.log(`ℹ️ (Info) Core service pages with NO inline links (still linked via RelatedServices + nav): ${coreMissing.length}`);

// 2. Link targets
console.log('\n--- 2. Link Target Validity ---');
if (brokenTargets.size === 0) {
  console.log('✅ OK: All internal href targets resolve to registered or built routes.');
} else {
  failed = true;
  console.error(`❌ FAIL: ${brokenTargets.size} internal link target(s) do NOT exist in siteStructure.json or dist/:`);
  for (const [t, sources] of [...brokenTargets.entries()].sort()) {
    console.error(`   - ${t}  (linked from: ${sources.join(', ')})`);
  }
}

// 3. Registry coverage
console.log('\n--- 3. Registry Coverage (internalLinks.json) ---');
if (registryMissingLinks.length === 0) {
  console.log('✅ OK: Every registered page ID has an internalLinks.json entry (RelatedServices renders links).');
} else {
  console.warn(`⚠️ WARNING: ${registryMissingLinks.length} registered ID(s) missing from internalLinks.json:`);
  for (const id of registryMissingLinks.slice(0, 20)) console.warn(`   - ${id}`);
}

// 4. Inbound links
console.log('\n--- 4. Inbound Link Coverage (no dead ends) ---');
if (orphanRoutes.length === 0) {
  console.log('✅ OK: Every registered route receives inbound links.');
} else {
  console.warn(`⚠️ WARNING: ${orphanRoutes.length} registered route(s) have no detected inbound links:`);
  for (const r of orphanRoutes.slice(0, 25)) console.warn(`   - ${r}`);
}

// Link distribution summary
console.log('\n--- Link Distribution ---');
const seoLinks = seoPages.map((p) => p.links.length);
const seoAvg = seoLinks.length ? (seoLinks.reduce((a, b) => a + b, 0) / seoLinks.length).toFixed(1) : '0';
console.log(`SEO landing pages with >=1 inline link: ${seoWithLinks}/${seoPages.length} (${Math.round((seoWithLinks / seoPages.length) * 100)}%)`);
console.log(`Average inline links per SEO page: ${seoAvg}`);
console.log(`Total unique inline link targets: ${linkSinks.size}`);
const topTargets = [...linkSinks.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log('Top inline link targets:');
for (const [t, c] of topTargets) console.log(`   ${c}x  ${t}`);

console.log('\n==================================================');
if (failed) {
  console.error('❌ INTERNAL LINK STRATEGY AUDIT FAILED.');
  console.log('==================================================\n');
  process.exit(1);
} else {
  console.log('🎉 INTERNAL LINK STRATEGY AUDIT PASSED.');
  console.log('==================================================\n');
  process.exit(0);
}
