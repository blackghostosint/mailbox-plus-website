import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const ROOT_DIR = path.resolve(__dirname, '../..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SITE_STRUCTURE_PATH = path.join(ROOT_DIR, 'astro/src/data/siteStructure.json');
const INTERNAL_LINKS_PATH = path.join(ROOT_DIR, 'astro/src/data/internalLinks.json');
const ALLOWLIST_PATH = path.join(ROOT_DIR, 'scripts/seo/route-registry-allowlist.json');

// Normalizes path for comparing consistently:
// Strips host/protocol, strips '.html', ensures leading slash, strips trailing slashes (except '/')
function normalizePath(p) {
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
function getHtmlFiles(dir, fileList = []) {
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
const DEFAULT_ALLOWED_PREFIXES = ['/articles', '/service-area', '/guide', '/rewards'];

const DEFAULT_ALLOWED_EXACT = [
  '/404',
  '/privacy',
  '/terms',
  '/sms-consent',
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
const ALLOW_MISSING_REGISTRY_PATHS = new Set(
  [
    '/drop-off-locations', // Main geo dropoff landing page; handled or nested elsewhere
    '/package-drop-offs', // Built under /pack-ship/package-drop-offs
    '/package-receiving', // Built under /pack-ship/package-receiving
  ].map(normalizePath)
);

function main() {
  console.log('==================================================');
  console.log('     SEO ROUTE REGISTRY & INTEGRITY CHECKER       ');
  console.log('==================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Error: Build output directory "${DIST_DIR}" does not exist.`);
    console.error('Please run "npm run build" before running the SEO route check.\n');
    process.exit(1);
  }

  if (!fs.existsSync(SITE_STRUCTURE_PATH)) {
    console.error(`❌ Error: Site structure registry not found at "${SITE_STRUCTURE_PATH}".\n`);
    process.exit(1);
  }

  // 1. Load siteStructure.json
  const siteStructure = JSON.parse(fs.readFileSync(SITE_STRUCTURE_PATH, 'utf-8'));

  // Collect all expected paths & IDs from the registry
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

  console.log(`ℹ️ Found ${expectedPaths.size} registered routes in siteStructure.json`);

  // 2. Load dynamic allowlist from route-registry-allowlist.json if present
  let localAllowlist = [];
  if (fs.existsSync(ALLOWLIST_PATH)) {
    try {
      const content = JSON.parse(fs.readFileSync(ALLOWLIST_PATH, 'utf-8'));
      if (Array.isArray(content.allowed_exact)) {
        localAllowlist = content.allowed_exact.map(normalizePath);
        console.log(
          `ℹ️ Loaded ${localAllowlist.length} extra exact routes from route-registry-allowlist.json`
        );
      }
    } catch (e) {
      console.warn(`⚠️ Warning: Failed to parse allowlist file: ${e.message}`);
    }
  }

  // 3. Scan dist/ for actual built paths
  const htmlFiles = getHtmlFiles(DIST_DIR);
  const builtPaths = new Set();

  for (const file of htmlFiles) {
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
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

  console.log(`ℹ️ Scanned ${builtPaths.size} actual HTML routes from dist/`);

  // Helper check if a path is allowed/exempted from being an orphan
  function isPathAllowedOrphan(p) {
    const norm = normalizePath(p);
    if (DEFAULT_ALLOWED_EXACT.map(normalizePath).includes(norm)) return true;
    if (localAllowlist.includes(norm)) return true;
    for (const prefix of DEFAULT_ALLOWED_PREFIXES) {
      if (norm === prefix || norm.startsWith(prefix + '/')) {
        return true;
      }
    }
    return false;
  }

  let failed = false;

  // 4. STRICT CHECK: Registry -> Built
  // Every expected path in siteStructure.json must exist in dist/ (unless explicitly allowed missing)
  console.log('\n--- Checking: Registry Paths Exist in Build (Strict) ---');
  const missingFromBuild = [];
  for (const expected of expectedPaths) {
    if (!builtPaths.has(expected)) {
      if (ALLOW_MISSING_REGISTRY_PATHS.has(expected)) {
        continue; // Permitted missing with comments
      }
      missingFromBuild.push(expected);
    }
  }

  if (missingFromBuild.length > 0) {
    console.error(
      '❌ FAIL: The following registered paths from siteStructure.json were NOT found in the build folder:'
    );
    for (const missing of missingFromBuild) {
      console.error(`   - ${missing}`);
    }
    failed = true;
  } else {
    console.log('✅ OK: All registry paths successfully exist in the built site.');
  }

  // 5. ORPHANS CHECK: Built -> Registry
  // Every built HTML page must either be registered in siteStructure.json or be allowlisted
  console.log('\n--- Checking: Built Pages are Registered or Allowlisted ---');
  const orphans = [];
  for (const built of builtPaths) {
    if (!expectedPaths.has(built) && !isPathAllowedOrphan(built)) {
      orphans.push(built);
    }
  }

  if (orphans.length > 0) {
    console.error(
      '❌ FAIL: Found built HTML pages that are NOT registered in siteStructure.json and are NOT allowlisted (Orphans):'
    );
    for (const orphan of orphans) {
      console.error(`   - ${orphan}`);
    }
    console.error(`\n💡 To resolve orphans, either:`);
    console.error(`   1. Add them to siteStructure.json under seo-landing or appropriate pillar`);
    console.error(
      `   2. If they are temporary/legitimate city landing pages, add them to scripts/seo/route-registry-allowlist.json`
    );
    failed = true;
  } else {
    console.log('✅ OK: No orphan pages detected.');
  }

  // 6. WARNINGS (Non-blocking): internalLinks.json vs siteStructure.json
  console.log('\n--- Cross-Checking internalLinks.json Keys (Non-blocking Warnings) ---');
  if (fs.existsSync(INTERNAL_LINKS_PATH)) {
    try {
      const internalLinks = JSON.parse(fs.readFileSync(INTERNAL_LINKS_PATH, 'utf-8'));
      const internalLinkKeys = Object.keys(internalLinks);

      const keysMissingFromRegistry = [];
      for (const key of internalLinkKeys) {
        if (!registeredIds.has(key)) {
          keysMissingFromRegistry.push(key);
        }
      }

      const registryIdsMissingFromLinks = [];
      for (const id of registeredIds) {
        if (!internalLinkKeys.includes(id)) {
          registryIdsMissingFromLinks.push(id);
        }
      }

      if (keysMissingFromRegistry.length > 0) {
        console.warn(
          '⚠️ Warning: The following keys exist in internalLinks.json but are missing from siteStructure.json:'
        );
        for (const k of keysMissingFromRegistry) {
          console.warn(`   - ${k}`);
        }
      }

      if (registryIdsMissingFromLinks.length > 0) {
        console.warn(
          '⚠️ Warning: The following IDs exist in siteStructure.json but are missing from internalLinks.json:'
        );
        for (const id of registryIdsMissingFromLinks) {
          console.warn(`   - ${id}`);
        }
      }

      if (keysMissingFromRegistry.length === 0 && registryIdsMissingFromLinks.length === 0) {
        console.log('✅ OK: Parity match between internalLinks.json and siteStructure.json IDs.');
      }
    } catch (e) {
      console.warn(`⚠️ Warning: Failed to parse internalLinks.json for cross-check: ${e.message}`);
    }
  } else {
    console.warn(
      `⚠️ Warning: internalLinks.json not found at "${INTERNAL_LINKS_PATH}". Skipping ID check.`
    );
  }

  console.log('\n==================================================');
  if (failed) {
    console.error('❌ SEO route registry check FAILED.');
    console.log('==================================================\n');
    process.exit(1);
  } else {
    console.log('🎉 SEO route registry check PASSED successfully!');
    console.log('==================================================\n');
    process.exit(0);
  }
}

main();
