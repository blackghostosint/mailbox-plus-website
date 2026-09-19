import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveDistDir } from '../lib/dist-path.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const ROOT_DIR = path.resolve(__dirname, '../..');
const DIST_DIR = resolveDistDir();
const SITE_STRUCTURE_PATH = path.join(ROOT_DIR, 'astro/src/data/siteStructure.json');
const INTERNAL_LINKS_PATH = path.join(ROOT_DIR, 'astro/src/data/internalLinks.json');
const ALLOWLIST_PATH = path.join(ROOT_DIR, 'scripts/seo/route-registry-allowlist.json');

// Normalizes path for comparing consistently:
// Strips host/protocol, strips '.html', ensures leading slash, strips trailing slashes (except '/')
export function normalizePath(p) {
  if (!p) return '';
  let cleaned = p.trim();
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    try {
      cleaned = new URL(cleaned).pathname;
    } catch (e) {
      // ignore
    }
  }
  if (cleaned.endsWith('.html')) {
    cleaned = cleaned.slice(0, -5);
  }
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

// Recursively walks directory to find all .html files
export function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Default static allowlist of utility/section pages
export const DEFAULT_ALLOWED_PREFIXES = ['/articles', '/service-area', '/guide'];

export const DEFAULT_ALLOWED_EXACT = [
  '/404',
  '/privacy',
  '/terms',
  '/accessibility',
  '/sms-consent',
  '/rental-agreement',
  '/contact-us',
  '/about-us',
  '/services',
  '/tracking',
  '/accept-invite',
  '/after-signup',
  '/pickup-hours',
  '/shipping-partners',
];

// List of registry URLs that are expected to be missing from the build (e.g. redirected or aliases)
export const ALLOW_MISSING_REGISTRY_PATHS = new Set(
  [
    '/drop-off-locations', // Main geo dropoff landing page; handled or nested elsewhere
    '/package-drop-offs', // Built under /pack-ship/package-drop-offs
    '/package-receiving', // Built under /pack-ship/package-receiving
  ].map(normalizePath)
);

export function isPathAllowedOrphan(p, localAllowlist = []) {
  const norm = normalizePath(p);
  if (DEFAULT_ALLOWED_EXACT.map(normalizePath).includes(norm)) return true;
  if (localAllowlist.map(normalizePath).includes(norm)) return true;
  for (const prefix of DEFAULT_ALLOWED_PREFIXES) {
    if (norm === prefix || norm.startsWith(prefix + '/')) {
      return true;
    }
  }
  return false;
}

export function checkRouteRegistry(options = {}) {
  const distDir = options.distDir || DIST_DIR;
  const siteStructurePath = options.siteStructurePath || SITE_STRUCTURE_PATH;
  const allowlistPath = options.allowlistPath || ALLOWLIST_PATH;
  const internalLinksPath = options.internalLinksPath || INTERNAL_LINKS_PATH;

  if (!fs.existsSync(distDir)) {
    return {
      success: false,
      error: `Build output directory "${distDir}" does not exist.`,
    };
  }

  if (!fs.existsSync(siteStructurePath)) {
    return {
      success: false,
      error: `Site structure registry not found at "${siteStructurePath}".`,
    };
  }

  // 1. Load siteStructure.json
  const siteStructure = JSON.parse(fs.readFileSync(siteStructurePath, 'utf-8'));

  const expectedPaths = new Set();
  const registeredIds = new Set();

  function register(id, url) {
    if (id) registeredIds.add(id);
    if (url) {
      expectedPaths.add(normalizePath(url));
    }
  }

  if (siteStructure.homepage) {
    register('homepage', siteStructure.homepage.url);
  }

  if (Array.isArray(siteStructure.pillars)) {
    for (const pillar of siteStructure.pillars) {
      register(pillar.id, pillar.url);
      if (Array.isArray(pillar.children)) {
        for (const child of pillar.children) {
          register(child.id, child.url);
        }
      }
    }
  }

  if (Array.isArray(siteStructure.subSupporting)) {
    for (const sub of siteStructure.subSupporting) {
      register(sub.id, sub.url);
    }
  }

  if (Array.isArray(siteStructure['seo-landing'])) {
    for (const landing of siteStructure['seo-landing']) {
      register(landing.id, landing.url);
    }
  }

  // 2. Load dynamic allowlist
  let localAllowlist = [];
  if (fs.existsSync(allowlistPath)) {
    try {
      const content = JSON.parse(fs.readFileSync(allowlistPath, 'utf-8'));
      if (Array.isArray(content.allowed_exact)) {
        localAllowlist = content.allowed_exact.map(normalizePath);
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Scan dist/ for actual built paths
  const htmlFiles = getHtmlFiles(distDir);
  const builtPaths = new Set();

  for (const file of htmlFiles) {
    const rel = path.relative(distDir, file).replace(/\\/g, '/');
    let urlPath = '';
    if (rel === 'index.html') {
      urlPath = '/';
    } else if (rel.endsWith('/index.html')) {
      urlPath = '/' + rel.slice(0, -11);
    } else if (rel.endsWith('.html')) {
      urlPath = '/' + rel.slice(0, -5);
    } else {
      urlPath = '/' + rel;
    }
    builtPaths.add(normalizePath(urlPath));
  }

  // 4. Strict Check: Registry -> Built
  const missingFromBuild = [];
  for (const expected of expectedPaths) {
    if (!builtPaths.has(expected)) {
      if (ALLOW_MISSING_REGISTRY_PATHS.has(expected)) {
        continue;
      }
      missingFromBuild.push(expected);
    }
  }

  // 5. Orphans Check: Built -> Registry
  const orphans = [];
  for (const built of builtPaths) {
    if (!expectedPaths.has(built) && !isPathAllowedOrphan(built, localAllowlist)) {
      orphans.push(built);
    }
  }

  // 6. Warnings: internalLinks vs siteStructure
  const keysMissingFromRegistry = [];
  const registryIdsMissingFromLinks = [];

  if (fs.existsSync(internalLinksPath)) {
    try {
      const internalLinks = JSON.parse(fs.readFileSync(internalLinksPath, 'utf-8'));
      const internalLinkKeys = Object.keys(internalLinks);

      for (const key of internalLinkKeys) {
        if (!registeredIds.has(key)) {
          keysMissingFromRegistry.push(key);
        }
      }

      for (const id of registeredIds) {
        if (!internalLinkKeys.includes(id)) {
          registryIdsMissingFromLinks.push(id);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  const success = missingFromBuild.length === 0 && orphans.length === 0;

  return {
    success,
    expectedPaths,
    builtPaths,
    missingFromBuild,
    orphans,
    keysMissingFromRegistry,
    registryIdsMissingFromLinks,
    localAllowlist,
  };
}

export function main() {
  console.log('==================================================');
  console.log('     SEO ROUTE REGISTRY & INTEGRITY CHECKER       ');
  console.log('==================================================\n');

  const res = checkRouteRegistry();

  if (!res.success && res.error) {
    console.error(`❌ Error: ${res.error}`);
    process.exit(1);
  }

  console.log(`ℹ️ Found ${res.expectedPaths?.size || 0} registered routes in siteStructure.json`);
  if (res.localAllowlist?.length) {
    console.log(
      `ℹ️ Loaded ${res.localAllowlist.length} extra exact routes from route-registry-allowlist.json`
    );
  }
  console.log(`ℹ️ Scanned ${res.builtPaths?.size || 0} actual HTML routes from dist/`);

  console.log('\n--- Checking: Registry Paths Exist in Build (Strict) ---');
  if (res.missingFromBuild.length > 0) {
    console.error(
      '❌ FAIL: The following registered paths from siteStructure.json were NOT found in the build folder:'
    );
    for (const missing of res.missingFromBuild) {
      console.error(`   - ${missing}`);
    }
  } else {
    console.log('✅ OK: All registry paths successfully exist in the built site.');
  }

  console.log('\n--- Checking: Built Pages are Registered or Allowlisted ---');
  if (res.orphans.length > 0) {
    console.error(
      '❌ FAIL: Found built HTML pages that are NOT registered in siteStructure.json and are NOT allowlisted (Orphans):'
    );
    for (const orphan of res.orphans) {
      console.error(`   - ${orphan}`);
    }
  } else {
    console.log('✅ OK: No orphan pages detected.');
  }

  console.log('\n--- Cross-Checking internalLinks.json Keys (Non-blocking Warnings) ---');
  if (res.keysMissingFromRegistry.length > 0) {
    console.warn(
      '⚠️ Warning: The following keys exist in internalLinks.json but are missing from siteStructure.json:'
    );
    for (const k of res.keysMissingFromRegistry) {
      console.warn(`   - ${k}`);
    }
  }
  if (res.registryIdsMissingFromLinks.length > 0) {
    console.warn(
      '⚠️ Warning: The following IDs exist in siteStructure.json but are missing from internalLinks.json:'
    );
    for (const id of res.registryIdsMissingFromLinks) {
      console.warn(`   - ${id}`);
    }
  }
  if (res.keysMissingFromRegistry.length === 0 && res.registryIdsMissingFromLinks.length === 0) {
    console.log('✅ OK: Parity match between internalLinks.json and siteStructure.json IDs.');
  }

  console.log('\n==================================================');
  if (!res.success) {
    console.error('❌ SEO route registry check FAILED.');
    console.log('==================================================\n');
    process.exit(1);
  } else {
    console.log('🎉 SEO route registry check PASSED successfully!');
    console.log('==================================================\n');
    process.exit(0);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
