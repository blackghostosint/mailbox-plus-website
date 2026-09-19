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
import { resolveDistDir } from '../lib/dist-path.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DATA_DIR = path.join(ROOT, 'astro/src/data');
const CONFIG_DIR = path.join(ROOT, 'astro/src/config/services');
const MICRO_PROBLEMS_DIR = path.join(ROOT, 'astro/src/config/micro-problems');
const ARTICLES_DIR = path.join(ROOT, 'content/articles');
const DIST_DIR = resolveDistDir();

export const MIN_LINKS_PER_SEO_PAGE = 1;
export const ALLOWED_PREFIXES = [
  '/articles',
  '/service-area',
  '/guide',
  '/research',
  '/images',
  '/contact-us',
];

export const SEO_LANDING_FILES = [
  'competitive/',
  'local-seo.ts',
  'gsc-landing-pages.ts',
  'micro-problems.ts',
];

export const ALLOWED_LEGACY_ALIASES = new Set([
  '/drop-off-locations',
  '/package-drop-offs',
  '/package-receiving',
]);

export function normalizePath(p) {
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

export function isSeoLandingFile(file, baseConfigDir = CONFIG_DIR) {
  const rel = path.relative(baseConfigDir, file).replace(/\\/g, '/');
  return SEO_LANDING_FILES.some((p) => (p.endsWith('/') ? rel.startsWith(p) : rel.includes(p)));
}

export function auditInternalLinkStrategy(options = {}) {
  const dataDir = options.dataDir || DATA_DIR;
  const configDir = options.configDir || CONFIG_DIR;
  const microProblemsDir = options.microProblemsDir || MICRO_PROBLEMS_DIR;
  const articlesDir = options.articlesDir || ARTICLES_DIR;
  const distDir = options.distDir || DIST_DIR;

  const siteStructurePath = path.join(dataDir, 'siteStructure.json');
  const internalLinksPath = path.join(dataDir, 'internalLinks.json');

  const siteStructure =
    options.siteStructure ||
    (fs.existsSync(siteStructurePath)
      ? JSON.parse(fs.readFileSync(siteStructurePath, 'utf-8'))
      : {});
  const internalLinks =
    options.internalLinks ||
    (fs.existsSync(internalLinksPath)
      ? JSON.parse(fs.readFileSync(internalLinksPath, 'utf-8'))
      : {});

  // 1. Collect all known routes
  const knownRoutes = new Set();
  const knownIds = new Set();
  function register(item) {
    if (!item || typeof item !== 'object') return;
    if (item.id) knownIds.add(item.id);
    if (item.url) knownRoutes.add(normalizePath(item.url));
    if (Array.isArray(item.children)) item.children.forEach(register);
  }
  if (siteStructure.homepage) register(siteStructure.homepage);
  ['pillars', 'subSupporting', 'seo-landing'].forEach((key) => {
    (siteStructure[key] || []).forEach(register);
  });

  // Built routes from dist/
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
  for (const f of walkHtml(distDir)) {
    const rel = path.relative(distDir, f).replace(/\\/g, '/');
    let urlPath =
      rel === 'index.html' ? '/' : '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    builtRoutes.add(normalizePath(urlPath));
  }

  // 2. Collect service config pages
  function walkTsFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) walkTsFiles(full, fileList);
      else if (entry.endsWith('.ts')) fileList.push(full);
    }
    return fileList;
  }

  const configFiles = walkTsFiles(configDir).concat(walkTsFiles(microProblemsDir));
  const pages = [];
  const linkSinks = new Map();

  function addPage(id, slug, file, block) {
    const hrefs = [...block.matchAll(/href="(\/[^"#?]*)/g)].map((m) => normalizePath(m[1]));
    const internal = hrefs.filter((h) => h && !h.startsWith('//') && !h.startsWith('/images'));
    const page = {
      id,
      slug: normalizePath(slug),
      file,
      links: [...new Set(internal)],
      isSeoLanding: isSeoLandingFile(file, configDir),
    };
    pages.push(page);
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

  // 3. Inbound edges from internalLinks.json
  const idToRoute = new Map();
  for (const p of pages) if (p.slug) idToRoute.set(p.id, p.slug);
  for (const item of [
    siteStructure.homepage,
    ...(siteStructure.pillars || []),
    ...(siteStructure.subSupporting || []),
    ...(siteStructure['seo-landing'] || []),
  ]) {
    if (item && item.id && item.url) idToRoute.set(item.id, normalizePath(item.url));
  }

  const relatedEdges = new Map();
  for (const [srcId, entry] of Object.entries(internalLinks)) {
    if (entry && Array.isArray(entry.related)) {
      for (const relId of entry.related) {
        const route = idToRoute.get(relId) || normalizePath(String(relId));
        relatedEdges.set(route, (relatedEdges.get(route) || 0) + 1);
      }
    }
    if (entry && entry.parent) {
      const parentRoute = idToRoute.get(entry.parent) || normalizePath(String(entry.parent));
      relatedEdges.set(parentRoute, (relatedEdges.get(parentRoute) || 0) + 1);
    }
  }

  // 4. Inbound links from articles
  const articleSinks = new Map();
  function walkMdFiles(dir, list = []) {
    if (!fs.existsSync(dir)) return list;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) walkMdFiles(full, list);
      else if (entry.endsWith('.md')) list.push(full);
    }
    return list;
  }
  const articleFiles = walkMdFiles(articlesDir);
  for (const f of articleFiles) {
    const content = fs.readFileSync(f, 'utf-8');
    const hrefs = [...content.matchAll(/\]\((\/[^)#?\s]+)/g)].map((m) => normalizePath(m[1]));
    for (const h of hrefs) {
      if (h && !h.startsWith('//')) articleSinks.set(h, (articleSinks.get(h) || 0) + 1);
    }
  }

  // Audits
  const seoPages = pages.filter((p) => p.isSeoLanding);
  const seoMissing = seoPages.filter((p) => p.links.length < MIN_LINKS_PER_SEO_PAGE);

  const brokenTargets = new Map();
  for (const page of pages) {
    for (const target of page.links) {
      if (knownRoutes.has(target) || builtRoutes.has(target)) continue;
      if (ALLOWED_PREFIXES.some((p) => target.startsWith(p))) continue;
      if (!brokenTargets.has(target)) brokenTargets.set(target, []);
      brokenTargets.get(target).push(page.id);
    }
  }

  const internalLinkKeys = new Set(Object.keys(internalLinks));
  const registryMissingLinks = [...knownIds].filter((id) => !internalLinkKeys.has(id));

  const inboundTotal = new Map();
  for (const [t, c] of linkSinks) inboundTotal.set(t, (inboundTotal.get(t) || 0) + c);
  for (const [t, c] of relatedEdges) inboundTotal.set(t, (inboundTotal.get(t) || 0) + c);
  for (const [t, c] of articleSinks) inboundTotal.set(t, (inboundTotal.get(t) || 0) + c);

  const orphanRoutes = [];
  for (const route of knownRoutes) {
    if (route === '/') continue;
    if (ALLOWED_LEGACY_ALIASES.has(route)) continue;
    const hasInbound = (inboundTotal.get(route) || 0) > 0;
    if (!hasInbound) orphanRoutes.push(route);
  }

  const success = seoMissing.length === 0 && brokenTargets.size === 0;

  return {
    success,
    knownRoutesCount: knownRoutes.size,
    builtRoutesCount: builtRoutes.size,
    pagesCount: pages.length,
    seoPagesCount: seoPages.length,
    seoMissing,
    brokenTargets,
    registryMissingLinks,
    orphanRoutes,
    internalLinkKeysCount: internalLinkKeys.size,
    articleCount: articleFiles.length,
    linkSinks,
  };
}

export function main() {
  console.log('==================================================');
  console.log('  SEO INTERNAL LINK STRATEGY AUDIT');
  console.log('==================================================\n');

  const res = auditInternalLinkStrategy();

  console.log(`ℹ️ Routes in siteStructure.json: ${res.knownRoutesCount}`);
  console.log(`ℹ️ Routes built in dist/: ${res.builtRoutesCount}`);
  console.log(
    `ℹ️ Service config pages audited: ${res.pagesCount} (${res.seoPagesCount} SEO landing pages)`
  );
  console.log(`ℹ️ internalLinks.json entries: ${res.internalLinkKeysCount}`);
  console.log(`ℹ️ Articles scanned for links: ${res.articleCount}\n`);

  // 1. Content links
  console.log('--- 1. Content Links on SEO Landing Pages (Phase 3.3) ---');
  if (res.seoMissing.length === 0) {
    console.log(
      `✅ OK: All ${res.seoPagesCount} SEO landing pages have >= ${MIN_LINKS_PER_SEO_PAGE} contextual link(s).`
    );
  } else {
    console.error(
      `❌ FAIL: ${res.seoMissing.length}/${res.seoPagesCount} SEO landing page(s) have NO contextual links:`
    );
    for (const p of res.seoMissing) {
      console.error(`   - ${p.id} (${p.slug}) [${path.relative(ROOT, p.file)}]`);
    }
  }

  // 2. Link targets
  console.log('\n--- 2. Link Target Validity ---');
  if (res.brokenTargets.size === 0) {
    console.log('✅ OK: All internal href targets resolve to registered or built routes.');
  } else {
    console.error(
      `❌ FAIL: ${res.brokenTargets.size} internal link target(s) do NOT exist in siteStructure.json or dist/:`
    );
    for (const [t, sources] of [...res.brokenTargets.entries()].sort()) {
      console.error(`   - ${t}  (linked from: ${sources.join(', ')})`);
    }
  }

  // 3. Registry coverage
  console.log('\n--- 3. Registry Coverage (internalLinks.json) ---');
  if (res.registryMissingLinks.length === 0) {
    console.log(
      '✅ OK: Every registered page ID has an internalLinks.json entry (RelatedServices renders links).'
    );
  } else {
    console.warn(
      `⚠️ WARNING: ${res.registryMissingLinks.length} registered ID(s) missing from internalLinks.json:`
    );
    for (const id of res.registryMissingLinks.slice(0, 20)) console.warn(`   - ${id}`);
  }

  // 4. Inbound links
  console.log('\n--- 4. Inbound Link Coverage (no dead ends) ---');
  if (res.orphanRoutes.length === 0) {
    console.log('✅ OK: Every registered route receives inbound links.');
  } else {
    console.warn(
      `⚠️ WARNING: ${res.orphanRoutes.length} registered route(s) have no detected inbound links:`
    );
    for (const r of res.orphanRoutes.slice(0, 25)) console.warn(`   - ${r}`);
  }

  console.log('\n==================================================');
  if (!res.success) {
    console.error('❌ INTERNAL LINK STRATEGY AUDIT FAILED.');
    console.log('==================================================\n');
    process.exit(1);
  } else {
    console.log('🎉 INTERNAL LINK STRATEGY AUDIT PASSED.');
    console.log('==================================================\n');
    process.exit(0);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
