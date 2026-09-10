#!/usr/bin/env node
/**
 * mailboxplus-verify — deterministic pre-flight verification CLI for
 * mailboxplusohio.com content (articles + service pages).
 *
 * Design (lauren/pstack pattern): one agent-friendly entry point, JSON output,
 * exit 0/1, rules compiled in — the agent runs one command instead of
 * improvising the checklist skill step-by-step.
 *
 * Commands:
 *   doctor                       environment sanity (repo root, deps, main branch hygiene)
 *   article <path.md>            full article pre-flight (frontmatter, links, images, gates)
 *   article <path.md> --strict   gates hard on all standard rules
 *   articles [--strict]          run verification across all articles in content/articles/
 *   build                        runs npm run build, reports page-count delta
 *   sitemap <path-or-slug>       confirms URL is in dist/sitemap-0.xml
 *   seo-gates                    runs all CI SEO gate scripts
 *   help                         this text
 *
 * Exit codes: 0 = all checks passed, 1 = one or more failures, 2 = usage error.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const PAGES_DIR = path.resolve(ROOT, 'astro', 'src', 'pages');
const CONTENT_DIR = path.resolve(ROOT, 'content', 'articles');

let gray;
try { gray = (await import('gray-matter')).default; } catch { gray = null; }

const results = [];
function check(name, pass, detail, fix) {
  results.push({ name, pass: !!pass, detail, fix });
}

// ---------- Route Registry & Cache ----------
let registryInitialized = false;
const validRoutes = new Set();
const dynamicPrefixes = [];
const intentKeyMap = new Map(); // intentKey -> Array<relPath>

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    fs.statSync(dirPath).isDirectory() ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function initRouteRegistry() {
  if (registryInitialized) return;
  registryInitialized = true;

  // 1) Pages under astro/src/pages
  walkDir(PAGES_DIR, (filePath) => {
    if (path.extname(filePath) !== '.astro') return;
    const rel = path
      .relative(PAGES_DIR, filePath)
      .replace(/\\/g, '/')
      .replace(/\.astro$/, '');
    const segments = rel.split('/');
    const dynamicIdx = segments.findIndex((s) => s.startsWith('[') && s.endsWith(']'));
    if (dynamicIdx !== -1) {
      const prefix = '/' + segments.slice(0, dynamicIdx).join('/').replace(/\/$/, '');
      dynamicPrefixes.push({
        prefix: prefix === '' ? '/' : prefix,
        catchAll: segments[dynamicIdx].startsWith('[...'),
      });
      return;
    }
    let route = rel.replace(/\.astro$/, '');
    if (route.endsWith('/index')) route = route.slice(0, -6);
    validRoutes.add('/' + route);
  });

  // 2) Article routes & intentKeys from content/articles
  if (gray && fs.existsSync(CONTENT_DIR)) {
    walkDir(CONTENT_DIR, (filePath) => {
      if (path.extname(filePath) !== '.md') return;
      if (path.basename(filePath).toLowerCase() === 'readme.md') return;
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const { data } = gray(raw);
        if (data.slug) validRoutes.add('/articles/' + data.slug);
        if (data.intentKey) {
          const ik = String(data.intentKey);
          const rel = path.relative(ROOT, filePath);
          if (!intentKeyMap.has(ik)) intentKeyMap.set(ik, []);
          intentKeyMap.get(ik).push(rel);
        }
      } catch (e) {}
    });
  }
}

function normalizeRoute(p) {
  if (!p) return p;
  const clean = p.split('?')[0].split('#')[0];
  return clean.length > 1 ? clean.replace(/\/+$/, '') : clean;
}

function isKnownRoute(target) {
  initRouteRegistry();
  const norm = normalizeRoute(target);
  if (validRoutes.has(norm)) return true;
  for (const { prefix, catchAll } of dynamicPrefixes) {
    if (norm === prefix) return true;
    if (prefix === '/' || !norm.startsWith(prefix + '/')) continue;
    const rest = norm.slice(prefix.length + 1);
    if (catchAll || !rest.includes('/')) return true;
  }
  return false;
}

// ---------- doctor ----------
function cmdDoctor() {
  check('repo-root', fs.existsSync(path.join(ROOT, 'astro', 'package.json')),
    `resolved ${ROOT}`, 'run from scripts/verify/ inside the repo; never from ~/Projects clone (stale)');
  check('node-modules', fs.existsSync(path.join(ROOT, 'node_modules')) && fs.existsSync(path.join(ROOT, 'astro', 'node_modules')),
    'root + astro node_modules present', 'npm ci (root) && cd astro && npm ci');
  check('gray-matter', !!gray, gray ? 'gray-matter available' : 'gray-matter missing',
    'npm install gray-matter --save-dev');

  let branch = '', ahead = 0;
  try {
    branch = execSync('git branch --show-current', { cwd: ROOT }).toString().trim();
    ahead = parseInt(execSync('git rev-list --count origin/main..HEAD', { cwd: ROOT }).toString().trim() || '0', 10);
    check('branch-hygiene', branch !== 'main' || ahead === 0, `branch=${branch} ahead=${ahead}`,
      'work on a feature branch; never commit directly to main');
  } catch (e) {
    check('branch-hygiene', false, 'git check failed: ' + e.message.slice(0, 80), 'run inside the repo clone');
  }
  check('scripts-present', ['validate-articles.cjs', 'seo'].every((p) => fs.existsSync(path.join(ROOT, 'scripts', p))),
    'scripts/seo + validate-articles.cjs present', 'git checkout main && git pull');
}

// ---------- article ----------
const REQUIRED_FRONTMATTER = ['title', 'description', 'slug', 'category', 'intentKey', 'pubDate', 'status', 'image', 'imageAlt', 'keywords', 'relatedServices', 'author'];
const BANNED_TERMS_RE = /\b(PostalMate|Stamps\.com|Endicia)\b/i;

function extractInternalHrefs(content) {
  const hrefs = [];
  const re = /\[([^\]]*)\]\((\/[^)\s]*)\)/g;
  let m;
  while ((m = re.exec(content))) hrefs.push(m[2]);
  const reHtml = /<a\s+[^>]*href="(\/[^"]*)"/g;
  while ((m = reHtml.exec(content))) hrefs.push(m[1]);
  return hrefs;
}

function cmdArticle(arg, isStrict = false) {
  const abs = path.isAbsolute(arg) ? arg : path.join(ROOT, arg);
  const relPath = path.relative(ROOT, abs);
  if (!fs.existsSync(abs)) {
    check('file-exists', false, `${arg} not found`, 'pass a path relative to repo root, e.g. content/articles/pack-ship/foo.md');
    return;
  }
  const raw = fs.readFileSync(abs, 'utf8');
  if (!gray) { check('parse', false, 'gray-matter unavailable', 'npm install gray-matter --save-dev'); return; }
  const { data, content } = gray(raw);

  initRouteRegistry();

  // 1) Required frontmatter
  for (const f of REQUIRED_FRONTMATTER) {
    if (data[f] === undefined || data[f] === null || data[f] === '') {
      if (f === 'status') {
        check('frontmatter:status', true, 'absent (advisory — defaults to published)');
      } else {
        check(`frontmatter:${f}`, false, 'missing or empty', `add '${f}' to frontmatter`);
      }
    } else {
      check(`frontmatter:${f}`, true, 'present');
    }
  }

  // 2) Description length (150-160 target, hard fail outside 100-280)
  const desc = String(data.description || '');
  const dlen = desc.length;
  if (dlen < 100 || dlen > 280) {
    check('meta:description-length', false, `${dlen} chars (target 150-160)`, 'rewrite description');
  } else {
    check('meta:description-length', true, `${dlen} chars`);
  }

  // 3) Title rules: No pipes (|), no brand suffixes (" | Mailbox Plus", " - Mailbox Plus")
  const title = String(data.title || '');
  const hasPipe = /\|/.test(title);
  const hasBrandSuffix = /\s*[|—-]\s*Mailbox Plus\s*$/i.test(title);
  if (hasPipe || hasBrandSuffix) {
    if (isStrict) {
      check('meta:title-rule', false, `title contains pipe or brand suffix: "${title}"`,
        "remove pipes ('|') and brand suffixes; titles must read naturally without 'Mailbox Plus'");
    } else {
      check('meta:title-rule', true, `title has suffix/pipe (advisory in non-strict): "${title}"`);
    }
  } else {
    check('meta:title-rule', true, 'clean (no pipes or brand suffixes)');
  }

  // 4) Slug hygiene
  const slug = String(data.slug || '');
  check('meta:slug-format', /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug), slug, 'slug must be lowercase kebab-case');

  // 5) IntentKey uniqueness across corpus
  const ik = String(data.intentKey || '');
  if (ik) {
    const matchingFiles = (intentKeyMap.get(ik) || []).filter((p) => p !== relPath);
    if (matchingFiles.length > 0) {
      check('meta:intentKey-unique', false, `duplicate intentKey '${ik}' (also in ${matchingFiles.join(', ')})`,
        'intentKey must be unique across all articles to prevent cannibalization');
    } else {
      check('meta:intentKey-unique', true, `'${ik}' is unique`);
    }
  }

  // 6) pubDate parses + is not in the future
  const pd = new Date(String(data.pubDate || ''));
  if (isNaN(pd.getTime())) {
    check('meta:pubDate', false, String(data.pubDate), 'ISO 8601 with offset, e.g. 2026-09-08T17:30:00-04:00');
  } else {
    check('meta:pubDate', pd.getTime() <= Date.now() + 86400000, pd.toISOString(), 'pubDate more than 1 day in the future');
  }

  // 7) Internal links: count, trailing slashes, and route existence
  const hrefs = extractInternalHrefs(content);
  const noSlash = hrefs.filter((h) => h.length > 1 && !h.endsWith('/'));
  const unknownHrefs = hrefs.filter((h) => !isKnownRoute(h));

  if (hrefs.length >= 2) {
    check('links:minimum', true, `${hrefs.length} internal links`);
  } else if (isStrict) {
    check('links:minimum', false, `${hrefs.length} internal links (min 2)`, 'add at least 2 contextual links to related Mailbox Plus pages');
  } else {
    check('links:minimum', true, `${hrefs.length} internal links (advisory — min 2 for new articles)`);
  }
  check('links:trailing-slash', noSlash.length === 0,
    noSlash.length ? `missing trailing slash: ${noSlash.join(', ')}` : 'all internal links end with /',
    'CI seo:check-href-slash will fail — add trailing slashes');
  check('links:valid-targets', unknownHrefs.length === 0,
    unknownHrefs.length ? `unknown route targets: ${unknownHrefs.join(', ')}` : `all ${hrefs.length} targets exist`,
    'link points to non-existent route — verify path matches a published page or article');

  // 8) relatedServices canonical form + route existence
  const rel = data.relatedServices || [];
  if (Array.isArray(rel)) {
    const badSlash = rel.filter((r) => typeof r === 'string' && r.length > 1 && !r.endsWith('/'));
    const unknownServices = rel.filter((r) => typeof r === 'string' && !isKnownRoute(r));

    if (badSlash.length === 0) {
      check('frontmatter:relatedServices-slash', true, 'all canonical');
    } else if (isStrict) {
      check('frontmatter:relatedServices-slash', false, `non-canonical: ${badSlash.join(', ')}`, 'add trailing slashes — canonical form required');
    } else {
      check('frontmatter:relatedServices-slash', true, `non-canonical (advisory in non-strict): ${badSlash.join(', ')}`);
    }

    check('frontmatter:relatedServices-targets', unknownServices.length === 0,
      unknownServices.length ? `unknown route targets: ${unknownServices.join(', ')}` : `all ${rel.length} services exist`,
      'relatedServices entry does not match any known route');
  }

  // 9) Featured image: frontmatter.image + imageAlt
  const img = String(data.image || '');
  const imgAlt = String(data.imageAlt || '');
  if (!img) {
    check('image:featured', false, 'missing frontmatter image', "add image: 'articles/<category>/<slug>-featured.webp'");
  } else if (!/^articles\/[a-z-]+\/[a-z0-9-]+\.(webp|jpg|png)$/.test(img)) {
    check('image:featured', false, img, "expected R2 path shape: articles/<category>/<slug>-featured.webp");
  } else {
    check('image:featured', true, img);
  }
  if (!imgAlt || imgAlt.length < 15) {
    check('image:alt', false, imgAlt || '(empty)', 'imageAlt must be descriptive (15+ chars)');
  } else {
    check('image:alt', true, `${imgAlt.length} chars`);
  }

  // 10) Astro layout hygiene: No H1 in body & no duplicate featured image
  const bodyH1Match = content.match(/^#\s+([^\n]+)/m);
  if (bodyH1Match) {
    if (isStrict) {
      check('layout:no-body-h1', false, `H1 in markdown body: "${bodyH1Match[1]}"`,
        'remove "# Title" from markdown body; Astro layout renders H1 automatically from frontmatter');
    } else {
      check('layout:no-body-h1', true, `H1 in body (advisory in non-strict): "${bodyH1Match[1]}"`);
    }
  } else {
    check('layout:no-body-h1', true, 'no H1 in body (Astro layout safe)');
  }

  const embedsFeatured = img && content.includes(img);
  if (embedsFeatured) {
    if (isStrict) {
      check('layout:no-featured-in-body', false, 'featured image embedded in body',
        'remove featured image markdown from body; Astro layout floats it automatically from frontmatter');
    } else {
      check('layout:no-featured-in-body', true, 'featured image in body (advisory in non-strict)');
    }
  } else {
    check('layout:no-featured-in-body', true, 'featured image not duplicated in body');
  }

  // 11) Banned vendor / software terms
  const bannedMatch = content.match(BANNED_TERMS_RE);
  if (bannedMatch) {
    check('content:no-banned-terms', false, `found banned software term: "${bannedMatch[0]}"`,
      "refer to software generically (e.g. 'point-of-sale software', 'computers behind counter')");
  } else {
    check('content:no-banned-terms', true, 'clean (no banned vendor terms)');
  }

  // 12) Word count guardrails
  const words = content.split(/\s+/).filter(Boolean).length;
  check('content:word-count', words >= 400 && words <= 5300, `${words} words (workflow target 1200-4000)`, 'article body out of publishable range');

  // 13) Robots status
  const status = String(data.status || 'published').toLowerCase();
  check('meta:robots', status !== 'draft-noindex', `status='${status}' → index,follow (BaseLayout default)`,
    'set status: published unless intentionally excluding from search');
}

function cmdArticles(isStrict = false) {
  initRouteRegistry();
  const files = [];
  walkDir(CONTENT_DIR, (f) => {
    if (f.endsWith('.md') && path.basename(f).toLowerCase() !== 'readme.md') {
      files.push(f);
    }
  });

  console.log(`🔍 Verifying ${files.length} articles (${isStrict ? 'STRICT' : 'STANDARD'} mode)...\n`);
  let totalPass = 0;
  let totalFail = 0;
  const failedArticles = [];

  for (const f of files) {
    const rel = path.relative(ROOT, f);
    const startIdx = results.length;
    cmdArticle(f, isStrict);
    const fileChecks = results.slice(startIdx);
    const fileFailed = fileChecks.filter((c) => !c.pass);
    if (fileFailed.length === 0) {
      totalPass++;
    } else {
      totalFail++;
      failedArticles.push({ file: rel, failures: fileFailed });
    }
  }

  for (const { file, failures } of failedArticles) {
    console.log(`❌ ${file}:`);
    for (const f of failures) {
      console.log(`   - ${f.name}: ${f.detail}`);
      if (f.fix) console.log(`     fix: ${f.fix}`);
    }
  }

  console.log(`\nSummary: ${totalPass} passed, ${totalFail} failed out of ${files.length} articles.`);
  process.exit(totalFail === 0 ? 0 : 1);
}

// ---------- build, sitemap, seo-gates ----------
function cmdBuild() {
  let before;
  try { before = execSync('find dist -name "*.html" | wc -l', { cwd: ROOT }).toString().trim(); } catch { before = '0'; }
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'inherit', timeout: 600000 });
  } catch (e) {
    check('build', false, 'npm run build failed', 'fix build errors first');
    return;
  }
  const after = execSync('find dist -name "*.html" | wc -l', { cwd: ROOT }).toString().trim();
  check('build', true, `page count: ${before} → ${after}`);
}

function cmdSitemap(expectPath) {
  const sm = path.join(ROOT, 'dist', 'sitemap-0.xml');
  if (!fs.existsSync(sm)) {
    check('sitemap', false, 'dist/sitemap-0.xml missing — run build first', 'npm run build');
    return;
  }
  const xml = fs.readFileSync(sm, 'utf8');
  if (expectPath) {
    const url = `https://mailboxplusohio.com/${expectPath.replace(/^\/+/, '')}`;
    const found = xml.includes(url);
    if (found) {
      check('sitemap:contains', true, url);
    } else {
      const slug = path.basename(expectPath.replace(/\/+$/, ''));
      const alt = `https://mailboxplusohio.com/articles/${slug}/`;
      if (xml.includes(alt)) {
        check('sitemap:contains', true, `${alt} (article route)`);
      } else {
        check('sitemap:contains', false, `${url} NOT in sitemap (also tried ${alt})`, 'route not generated — check slug/filename');
      }
    }
  } else {
    const n = (xml.match(/<loc>/g) || []).length;
    check('sitemap', true, `${n} URLs in sitemap`);
  }
}

function cmdSeoGates() {
  for (const script of ['seo:check-href-slash', 'seo:check-canonical', 'seo:check-jsonld', 'seo:check-routes']) {
    try {
      execSync(`npm run ${script}`, { cwd: ROOT, stdio: 'pipe', timeout: 300000 });
      check(script, true, 'pass');
    } catch (e) {
      const out = (e.stdout || e.stderr || '').toString();
      const firstFail = out.split('\n').find((l) => l.includes('FAIL')) || `${script} failed`;
      check(script, false, firstFail.trim().slice(0, 160), 'run npm run ' + script + ' for full output');
    }
  }
}

// ---------- CLI dispatch ----------
const [cmd, ...rest] = process.argv.slice(2);
const asJson = rest.includes('--json');
const isStrict = rest.includes('--strict');
const arg = rest.find((r) => !r.startsWith('--'));

if (cmd === 'doctor') {
  cmdDoctor();
} else if (cmd === 'article' && arg) {
  cmdArticle(arg, isStrict);
} else if (cmd === 'articles') {
  cmdArticles(isStrict);
} else if (cmd === 'build') {
  cmdBuild();
} else if (cmd === 'sitemap') {
  cmdSitemap(arg);
} else if (cmd === 'seo-gates') {
  cmdSeoGates();
} else {
  console.log('usage: node scripts/verify/verify.mjs <doctor|article <path> [--strict]|articles [--strict]|build|sitemap [path]|seo-gates> [--json]');
  process.exit(2);
}

if (cmd !== 'articles') {
  const failed = results.filter((r) => !r.pass);
  if (asJson) {
    console.log(JSON.stringify({ ok: failed.length === 0, passed: results.length - failed.length, failed: failed.length, results }, null, 2));
  } else {
    for (const r of results) {
      const icon = r.pass ? '✅' : '❌';
      console.log(`${icon} ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
      if (!r.pass && r.fix) console.log(`   fix: ${r.fix}`);
    }
    console.log(`\n${failed.length === 0 ? 'ALL CHECKS PASSED' : `${failed.length} FAILURE(S)`} (${results.length} checks)`);
  }
  process.exit(failed.length === 0 ? 0 : 1);
}
