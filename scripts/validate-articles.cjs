const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.resolve(ROOT, 'astro/src/pages');
const CONTENT_DIR = path.resolve(ROOT, 'content/articles');

/**
 * Derive valid routes from the filesystem — the same source the Astro build
 * uses — instead of a hand-maintained sitemap-config.json.
 *
 * sitemap-config.json was never read by the build (the sitemap comes from the
 * @astrojs/sitemap plugin) or CI (scripts/seo/check-route-registry.mjs scans
 * dist/ + siteStructure.json). It only went stale — 13 published articles were
 * missing from it — and produced false "missing route" SEO alarms. Deriving
 * routes here means new pages/articles become valid link targets automatically.
 */
const validRoutes = new Set(); // exact routes: '/', '/pack-ship', '/articles/xyz'
const dynamicPrefixes = []; // e.g. { prefix: '/service-area', catchAll: false } from [slug].astro

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    fs.statSync(dirPath).isDirectory() ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

// 1) Page templates under astro/src/pages
walkDir(PAGES_DIR, (filePath) => {
  if (path.extname(filePath) !== '.astro') return;
  const rel = path
    .relative(PAGES_DIR, filePath)
    .replace(/\\/g, '/')
    .replace(/\.astro$/, '');
  const segments = rel.split('/');
  const dynamicIdx = segments.findIndex((s) => s.startsWith('[') && s.endsWith(']'));
  if (dynamicIdx !== -1) {
    // Dynamic template: register the static prefix before the [..] segment.
    // '[slug]' matches exactly one segment; '[...slug]' matches any depth.
    const prefix = '/' + segments.slice(0, dynamicIdx).join('/').replace(/\/$/, '');
    dynamicPrefixes.push({ prefix: prefix === '' ? '/' : prefix, catchAll: segments[dynamicIdx].startsWith('[...') });
    return;
  }
  let route = rel.replace(/\.astro$/, '');
  if (route.endsWith('/index')) route = route.slice(0, -6); // 'pack-ship/index' -> 'pack-ship'
  validRoutes.add('/' + route);
});

// 2) Article routes from content/articles (slug from frontmatter)
walkDir(CONTENT_DIR, (filePath) => {
  if (path.extname(filePath) !== '.md') return;
  if (path.basename(filePath).toLowerCase() === 'readme.md') return;
  try {
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    if (data.slug) validRoutes.add('/articles/' + data.slug);
  } catch (e) {
    // Parsing is flagged in the per-article loop below; nothing to do here.
  }
});

// Normalize a path for route comparison: strip trailing slashes (keep root '/'),
// so links written with the trailing-slash convention (e.g. '/pack-ship/') match
// the no-slash routes derived above (e.g. '/pack-ship').
function normalizeRoute(p) {
  return p && p.length > 1 ? p.replace(/\/+$/, '') : p;
}

function isKnownRoute(target) {
  const norm = normalizeRoute(target);
  if (validRoutes.has(norm)) return true;
  for (const { prefix, catchAll } of dynamicPrefixes) {
    if (norm === prefix) return true;
    if (prefix === '/' || !norm.startsWith(prefix + '/')) continue;
    const rest = norm.slice(prefix.length + 1);
    if (catchAll || !rest.includes('/')) return true; // [slug] = one segment; [...slug] = any depth
  }
  return false;
}

// Simple recursive directory walker
function walkContent(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkContent(dirPath, callback) : callback(dirPath);
  });
}

const errors = [];
const intentKeys = new Map();
let linkCount = 0;
let articleCount = 0;

console.log(`🔍 Scanning articles in ${CONTENT_DIR}...`);
console.log(
  `ℹ️ Valid routes derived from filesystem (${validRoutes.size} exact + ${dynamicPrefixes.length} dynamic prefixes)`
);

if (!fs.existsSync(CONTENT_DIR)) {
  console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
  process.exit(1);
}

walkContent(CONTENT_DIR, (filePath) => {
  if (path.extname(filePath) !== '.md') return;

  // Ignore README files
  if (path.basename(filePath).toLowerCase() === 'readme.md') return;

  articleCount++;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    const requiredFields = [
      'title',
      'description',
      'slug',
      'category',
      'intentKey',
      'pubDate',
      'image',
    ];
    requiredFields.forEach((field) => {
      if (!data[field]) {
        errors.push(`❌ ${path.basename(filePath)}: Missing required field '${field}'`);
      }
    });

    // Check intentKey uniqueness
    if (data.intentKey) {
      if (intentKeys.has(data.intentKey)) {
        errors.push(
          `❌ ${path.basename(filePath)}: Duplicate intentKey '${data.intentKey}' (also in ${intentKeys.get(data.intentKey)})`
        );
      } else {
        intentKeys.set(data.intentKey, path.basename(filePath));
      }
    }

    // Basic content check
    if (!content.trim()) {
      errors.push(`⚠️ ${path.basename(filePath)}: Article content is empty`);
    }

    // Validate relatedServices paths
    if (Array.isArray(data.relatedServices)) {
      data.relatedServices.forEach((servicePath) => {
        linkCount++;
        if (!isKnownRoute(servicePath)) {
          errors.push(
            `❌ ${path.basename(filePath)}: relatedServices path '${servicePath}' does not match any known route`
          );
        }
      });
    }

    // Validate internal markdown links in body
    const linkRegex = /\[([^\]]*)\]\((\/[^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const linkPath = match[2];
      linkCount++;
      if (!isKnownRoute(linkPath)) {
        errors.push(
          `❌ ${path.basename(filePath)}: Markdown link '${linkPath}' does not match any known route`
        );
      }
    }
  } catch (err) {
    errors.push(`❌ ${path.basename(filePath)}: Parsing error - ${err.message}`);
  }
});

if (errors.length > 0) {
  console.error('\nFound validation errors:');
  errors.forEach((e) => console.error(e));
  console.log(`\n🔗 Validated ${linkCount} internal links across ${articleCount} articles.`);
  process.exit(1);
} else {
  console.log('\n✅ All articles validated successfully!');
  console.log(`🔗 Validated ${linkCount} internal links across ${articleCount} articles.`);
}
