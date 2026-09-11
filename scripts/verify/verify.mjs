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
 *   article <path.md> --strict   gates hard on all standard rules (incl. image:exists, gates:factcheck)
 *   --offline                    skip network checks (image:exists)
 *   articles [--strict]          run verification across all articles in content/articles/
 *   build                        runs npm run build, reports page-count delta
 *   sitemap <path-or-slug>       confirms URL is in dist/sitemap-0.xml
 *   review <path.md>             grades draft against 5-point DR adversarial rubric (min 80/100)
 *   headings [--json]            heading-variation report across the whole corpus
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
const R2_PUBLIC_BASE = process.env.R2_PUBLIC_BASE || 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev';
const DRAFTS_DIR = process.env.ARTICLE_DRAFTS_DIR || '/home/blackghost/work/batch_articles/drafts';
const SKIP_NETWORK = process.argv.includes('--offline');

// HEAD a URL with curl (no fetch dependency, hard timeout). Returns status code string or 'ERR'.
function headStatus(url) {
  try {
    return execSync(`curl -sI -o /dev/null -w "%{http_code}" --max-time 10 "${url}"`, { cwd: ROOT }).toString().trim();
  } catch { return 'ERR'; }
}

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

// ---------- heading diversity ----------
// Legacy articles shared the same 8 literal H2 strings (58% of all H2s across 179 files),
// which reads as machine output and wastes topical-relevance surface area. Structure is
// frozen; surface text must vary. This gate measures heading-set overlap between articles.
const HEADING_OVERLAP_MAX = Number(process.env.HEADING_OVERLAP_MAX || 0.6);

// Retired fixed headings from the legacy template. Used only to classify the legacy cohort.
const RETIRED_TEMPLATE = [
  'bring it in', 'what it actually feels like', 'why it should not be this way',
  'what we see every day', 'how it works', 'what you lose by not acting',
  'your afternoon after the change', 'the scene that starts everything',
  'the direct opening that names the problem',
];

const normHeading = (h) => h.toLowerCase().replace(/[^a-z ]/g, '').trim();

function extractH2s(content) {
  const out = [];
  const re = /^##\s+(.+)$/gm;
  let m;
  while ((m = re.exec(content))) out.push(m[1].trim());
  return out;
}

let headingCorpus = null;   // [{ rel, set:Set<string>, legacy:boolean }]
let newArticleCache = null; // Set<relPath> of articles added/changed vs origin/main

function initHeadingCorpus() {
  if (headingCorpus) return headingCorpus;
  headingCorpus = [];
  if (!gray || !fs.existsSync(CONTENT_DIR)) return headingCorpus;
  walkDir(CONTENT_DIR, (filePath) => {
    if (path.extname(filePath) !== '.md') return;
    if (path.basename(filePath).toLowerCase() === 'readme.md') return;
    try {
      const { content } = gray(fs.readFileSync(filePath, 'utf8'));
      const hs = extractH2s(content).map(normHeading);
      if (!hs.length) return;
      const set = new Set(hs);
      const retired = hs.filter((h) => RETIRED_TEMPLATE.includes(h)).length;
      headingCorpus.push({
        rel: path.relative(ROOT, filePath),
        set,
        // Legacy cohort = boilerplate articles. Excluded from the gate so the backlog
        // doesn't drown real signal; the gate self-tightens as varied articles accumulate.
        legacy: retired / hs.length >= 0.6,
      });
    } catch (e) {}
  });
  return headingCorpus;
}

// "New" = added or modified relative to origin/main (working tree, index, or commits).
// The gate only hard-fails on new articles, so running `articles --strict` over the
// existing corpus stays green while every new PR is held to the standard.
function initNewArticles() {
  if (newArticleCache) return newArticleCache;
  newArticleCache = new Set();
  try {
    const base = execSync('git merge-base HEAD origin/main', { cwd: ROOT, stdio: 'pipe' }).toString().trim();
    // base is a git SHA from our own repo; still validate the shape before interpolating.
    if (!/^[0-9a-f]{7,40}$/.test(base)) return newArticleCache;
    const committed = execSync(`git diff --name-only ${base} HEAD`, { cwd: ROOT, stdio: 'pipe' }).toString();
    const status = execSync('git status --porcelain', { cwd: ROOT, stdio: 'pipe' }).toString();
    for (const line of (committed + '\n' + status).split('\n')) {
      const rel = line.slice(3).trim().replace(/^.*-> /, '');
      if (rel) newArticleCache.add(rel);
    }
  } catch (e) {}
  return newArticleCache;
}

function headingOverlap(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const h of a) if (b.has(h)) inter++;
  return inter / Math.min(a.size, b.size);
}

function cmdHeadings() {
  const corpus = initHeadingCorpus();
  if (!corpus.length) {
    check('headings:corpus', false, 'no articles found', 'run from the repo root');
    return;
  }
  const counter = new Map();
  for (const { set } of corpus) for (const h of set) counter.set(h, (counter.get(h) || 0) + 1);

  const totalH2 = [...counter.values()].reduce((a, b) => a + b, 0);
  const retiredHits = RETIRED_TEMPLATE.reduce((a, h) => a + (counter.get(h) || 0), 0);
  const legacyCount = corpus.filter((c) => c.legacy).length;

  check('headings:corpus', true,
    `${corpus.length} articles, ${totalH2} H2s; ${retiredHits} (${Math.round((retiredHits / totalH2) * 100)}%) still on a retired template string`);
  check('headings:legacy-cohort', true, `${legacyCount}/${corpus.length} articles are ≥60% boilerplate headings (backlog)`);

  const top = [...counter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  console.log('Most-reused H2s:');
  for (const [h, c] of top) console.log(`  ${String(c).padStart(4)}  ${h}`);
}


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

  // 9b) Featured image must actually exist on the CDN — path shape alone shipped a 404 hero (painesville-notary, 9/9/26).
  if (img && /^articles\//.test(img)) {
    if (SKIP_NETWORK) {
      check('image:exists', true, 'skipped (--offline)');
    } else {
      const url = `${R2_PUBLIC_BASE}/${img}`;
      const code = headStatus(url);
      if (code === '200') {
        check('image:exists', true, `HTTP 200 ${url}`);
      } else if (isStrict) {
        check('image:exists', false, `HTTP ${code} ${url}`, 'generate + upload the featured image (rclone copyto → mailboxplus-r2:mailbox-plus-images/<image>) before PR');
      } else {
        check('image:exists', true, `HTTP ${code} (advisory in non-strict) ${url}`);
      }
    }
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

  // 12b) Fact-check receipt — the gate that would have caught the $3-vs-$5 notary fee error. Strict-only, new articles.
  const fcCandidates = [
    path.join(DRAFTS_DIR, `${slug}.factcheck.md`),
    path.join(DRAFTS_DIR, `${slug}.factcheck`),
    path.join(path.dirname(abs), `${slug}.factcheck.md`),
  ];
  const fcFound = fcCandidates.find((f) => fs.existsSync(f));
  if (fcFound) {
    const fcSize = fs.statSync(fcFound).size;
    check('gates:factcheck', fcSize > 200, `${path.relative(ROOT, fcFound)} (${fcSize} bytes)`, 'fact-check file exists but is nearly empty — fill the claim table');
  } else if (isStrict) {
    check('gates:factcheck', false, `no ${slug}.factcheck.md in ${DRAFTS_DIR}`, 'run the Fact-Check Gate and write the claim/verdict/source table before PR');
  } else {
    check('gates:factcheck', true, 'no receipt (advisory in non-strict)');
  }

  // 13) Robots status
  const status = String(data.status || 'published').toLowerCase();
  check('meta:robots', status !== 'draft-noindex', `status='${status}' → index,follow (BaseLayout default)`,
    'set status: published unless intentionally excluding from search');

  // 14) Heading variation — the structural skeleton is frozen, the surface text is not.
  //     Retired headings are the legacy boilerplate strings; reusing them is a regression.
  const h2set = new Set(extractH2s(content).map(normHeading));
  if (h2set.size >= 4) {
    const isNew = initNewArticles().has(relPath);
    const retiredHits = [...h2set].filter((h) => RETIRED_TEMPLATE.includes(h)).length;
    const retiredRatio = retiredHits / h2set.size;

    if (retiredHits >= 3) {
      if (isStrict && isNew) {
        check('content:no-retired-headings', false,
          `${retiredHits} retired template headings (${Math.round(retiredRatio * 100)}% of H2s)`,
          'assign headings from content/heading_banks.json via scripts/assign_headings.py — do not hand-write the old template');
      } else {
        check('content:no-retired-headings', true,
          `${retiredHits} retired headings${isNew ? '' : ' (advisory — existing article)'}`);
      }
    } else {
      check('content:no-retired-headings', true, `${retiredHits} retired headings`);
    }

    // Legacy subjects are skipped so the existing backlog doesn't drown out new signal.
    // Everything else is compared against the full corpus, so copying the old template still fails.
    if (retiredRatio < 0.6) {
      let worst = 0;
      let worstRel = null;
      for (const entry of initHeadingCorpus()) {
        if (entry.rel === relPath) continue;
        const o = headingOverlap(h2set, entry.set);
        if (o > worst) { worst = o; worstRel = entry.rel; }
        if (!worstRel) worstRel = entry.rel;
      }
      const pct = Math.round(worst * 100);
      const detail = worstRel
        ? `max ${pct}% overlap with ${worstRel} (limit ${Math.round(HEADING_OVERLAP_MAX * 100)}%)`
        : 'no other articles in baseline';
      if (isStrict && isNew && worst > HEADING_OVERLAP_MAX) {
        check('content:heading-diversity', false, detail,
          'vary the H2 wording: python3 scripts/assign_headings.py --slug <slug> --villain "<villain>" --json');
      } else {
        check('content:heading-diversity', true, detail);
      }
    } else {
      check('content:heading-diversity', true, 'legacy boilerplate article — baseline excluded (backlog)');
    }
  }
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


function cmdReview(targetPath) {
  const abs = path.isAbsolute(targetPath) ? targetPath : path.join(ROOT, targetPath);
  if (!fs.existsSync(abs)) {
    check('review:file-exists', false, `${targetPath} not found`, 'check file path');
    return;
  }
  const scriptPath = path.join(ROOT, 'scripts', 'review-article-copy.py');
  if (!fs.existsSync(scriptPath)) {
    check('review:script-exists', false, 'scripts/review-article-copy.py not found', 'script missing');
    return;
  }

  const providerIdx = rest.indexOf('--provider');
  const provider = providerIdx !== -1 ? rest[providerIdx + 1] : 'nous';
  const modelIdx = rest.indexOf('--model');
  const model = modelIdx !== -1 ? rest[modelIdx + 1] : 'tencent/hy3';
  const minScoreIdx = rest.indexOf('--min-score');
  const minScore = minScoreIdx !== -1 ? rest[minScoreIdx + 1] : '80';

  console.log(`🤖 Running 5-point Direct Response Review Rubric on ${path.basename(abs)} (provider=${provider}, model=${model}, min=${minScore})...\n`);
  try {
    const jsonFlag = asJson ? ' --json' : '';
    execSync(`python3 "${scriptPath}" "${abs}" --provider "${provider}" --model "${model}" --min-score "${minScore}"${jsonFlag}`, {
      stdio: 'inherit',
      cwd: ROOT,
    });
    check('review:rubric-score', true, 'passed review matrix (score >= 80)');
  } catch (e) {
    check('review:rubric-score', false, 'failed review matrix (score < 80 or error)', 'review feedback above and revise draft');
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
} else if (cmd === 'review' && arg) {
  cmdReview(arg);
} else if (cmd === 'headings') {
  cmdHeadings();
} else if (cmd === 'seo-gates') {
  cmdSeoGates();
} else {
  console.log('usage: node scripts/verify/verify.mjs <doctor|article <path> [--strict]|articles [--strict]|review <path>|headings|build|sitemap [path]|seo-gates> [--json] [--offline]');
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
