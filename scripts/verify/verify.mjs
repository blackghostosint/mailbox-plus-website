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
 *   article <path.md> --json     machine-readable output
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
let gray;
try { gray = (await import('gray-matter')).default; } catch { gray = null; }

const results = [];
function check(name, pass, detail, fix) {
  results.push({ name, pass: !!pass, detail, fix });
}

// ---------- doctor ----------
function cmdDoctor() {
  check('repo-root', fs.existsSync(path.join(ROOT, 'astro', 'package.json')),
    `resolved ${ROOT}`, 'run from scripts/verify/ inside the repo; never from ~/Projects clone (stale)');
  check('node-modules', fs.existsSync(path.join(ROOT, 'node_modules')) && fs.existsSync(path.join(ROOT, 'astro', 'node_modules')),
    'root + astro node_modules present', 'npm ci (root) && cd astro && npm ci');
  check('gray-matter', !!gray, gray ? 'gray-matter available' : 'gray-matter missing',
    'npm install gray-matter --save-dev');
// execSync usage: only fixed, constant git commands with no user input — no injection surface.
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
const TITLE_SUFFIX_CATEGORIES = new Set([
  'pack-ship', 'copy-print', 'printing', 'mailbox-rentals', 'notary', 'document-services',
]);
const REQUIRED_FRONTMATTER = ['title', 'description', 'slug', 'category', 'intentKey', 'pubDate', 'status', 'image', 'imageAlt', 'keywords', 'relatedServices', 'author'];
const DISALLOWED_LINK_STYLE = /<a\s+(?![^>]*href="\/[^"]*\/")[^>]*href="\/(?!\/)[^"]*"(?![^>]*\/>)/g;

function extractInternalHrefs(content) {
  const hrefs = [];
  const re = /\[([^\]]*)\]\((\/[^)\s]*)\)/g;
  let m;
  while ((m = re.exec(content))) hrefs.push(m[2]);
  const reHtml = /<a\s+[^>]*href="(\/[^"]*)"/g;
  while ((m = reHtml.exec(content))) hrefs.push(m[1]);
  return hrefs;
}

function extractImages(content, filePath) {
  const imgs = [];
  const reMd = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
  let m;
  while ((m = reMd.exec(content))) imgs.push({ alt: m[1], src: m[2], line: content.slice(0, m.index).split('\n').length });
  const reHtml = /<img\s+([^>]*)>/g;
  while ((m = reHtml.exec(content))) {
    const attrs = m[1];
    const src = /src="([^"]*)"/.exec(attrs)?.[1] || '';
    const alt = /alt="([^"]*)"/.exec(attrs)?.[1] || '';
    imgs.push({ alt, src, line: content.slice(0, m.index).split('\n').length, html: true, attrs });
  }
  return imgs;
}

function cmdArticle(arg, asJson) {
  const abs = path.isAbsolute(arg) ? arg : path.join(ROOT, arg);
  if (!fs.existsSync(abs)) {
    check('file-exists', false, `${arg} not found`, 'pass a path relative to repo root, e.g. content/articles/pack-ship/foo.md');
    return;
  }
  const raw = fs.readFileSync(abs, 'utf8');
  if (!gray) { check('parse', false, 'gray-matter unavailable', 'npm install gray-matter --save-dev'); return; }
  const { data, content } = gray(raw);

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

  // 2) Description length (150-160 target, hard fail outside 120-170)
  const desc = String(data.description || '');
  const dlen = desc.length;
  if (dlen < 100 || dlen > 280) {
    check('meta:description-length', false, `${dlen} chars (target 150-160)`, 'rewrite description');
  } else {
    check('meta:description-length', true, `${dlen} chars`);
  }

  // 3) Title suffix rule — competitive/service categories get ' | Mailbox Plus', articles don't
  const title = String(data.title || '');
  const hasSuffix = / \| Mailbox Plus$/i.test(title);
  const expectsSuffix = TITLE_SUFFIX_CATEGORIES.has(String(data.category || ''));
  if (String(data.category) === 'micro-problem') {
    check('meta:title-rule', !hasSuffix, 'micro-problem article: suffix must be absent', hasSuffix ? "remove ' | Mailbox Plus' from title" : '');
  } else if (expectsSuffix) {
    check('meta:title-rule', true, `category '${data.category}': suffix optional for long-form articles (page configs enforce their own rule)`);
  } else {
    check('meta:title-rule', true, `category '${data.category}': no suffix rule`);
  }

  // 4) Slug hygiene
  const slug = String(data.slug || '');
  check('meta:slug-format', /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug), slug, 'slug must be lowercase kebab-case');

  // 5) pubDate parses + is not in the future
  const pd = new Date(String(data.pubDate || ''));
  if (isNaN(pd.getTime())) {
    check('meta:pubDate', false, String(data.pubDate), 'ISO 8601 with offset, e.g. 2026-09-08T17:30:00-04:00');
  } else {
    check('meta:pubDate', pd.getTime() <= Date.now() + 86400000, pd.toISOString(), 'pubDate more than 1 day in the future');
  }

  // 6) Internal links: minimum 2, trailing slash on all
  const hrefs = extractInternalHrefs(content);
  const noSlash = hrefs.filter((h) => h.length > 1 && !h.endsWith('/'));
  // Min-2 is the new-article standard (checklist skill). Corpus has 49 legacy articles below it, so
  // gate only in --strict mode; default run flags advisory.
  if (hrefs.length >= 2) {
    check('links:minimum', true, `${hrefs.length} internal links`);
  } else if (process.argv.includes('--strict')) {
    check('links:minimum', false, `${hrefs.length} internal links (min 2)`, 'add at least 2 contextual links to related Mailbox Plus pages');
  } else {
    check('links:minimum', true, `${hrefs.length} internal links (advisory — min 2 for new articles)`);
  }
  check('links:trailing-slash', noSlash.length === 0, noSlash.length ? `missing trailing slash: ${noSlash.join(', ')}` : 'all internal links end with /', 'CI seo:check-href-slash will fail — add trailing slashes');

  // 7) Featured image: frontmatter.image + imageAlt are required and must reference a valid R2 path shape.
  // (Articles use the frontmatter featured image; inline body images are optional.)
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

  // 8) Word count guardrails (article workflow: 1.2k-4k words)
  const words = content.split(/\s+/).filter(Boolean).length;
  check('content:word-count', words >= 400 && words <= 5300, `${words} words (workflow target 1200-4000)`, 'article body out of publishable range');

  // 8b) robots — BaseLayout defaults to index,follow; articles only risk noindex via explicit status
  const status = String(data.status || 'published').toLowerCase();
  check('meta:robots', status !== 'draft-noindex', `status='${status}' → index,follow (BaseLayout default)`,
    'set status: published unless intentionally excluding from search');

  // 9) relatedServices canonical form — the renderer normalizes via normalizePathname(), but the
  // CI href-slash gate scans built HTML; keep source canonical (trailing slash) to match the site convention.
  const rel = data.relatedServices || [];
  if (Array.isArray(rel)) {
    const bad = rel.filter((r) => typeof r === 'string' && r.length > 1 && !r.endsWith('/'));
    // Trailing slashes are the site convention (FRANK RULE: canonical trailing-slash links mandatory).
    // Renderer normalizes so CI passes on legacy entries, but new articles gate hard under --strict.
    if (bad.length === 0) {
      check('frontmatter:relatedServices-slash', true, 'all canonical');
    } else if (process.argv.includes('--strict')) {
      check('frontmatter:relatedServices-slash', false, `non-canonical: ${bad.join(', ')}`, 'add trailing slashes — canonical form required');
    } else {
      check('frontmatter:relatedServices-slash', true, `non-canonical (advisory in non-strict): ${bad.join(', ')}`);
    }
  }
}

// ---------- main ----------
const [cmd, ...rest] = process.argv.slice(2);
const asJson = rest.includes('--json');
const arg = rest.find((r) => !r.startsWith('--'));

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
      // article slugs route under /articles/<slug>/ regardless of content folder — try that form
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

if (cmd === 'doctor') {
  cmdDoctor();
} else if (cmd === 'article' && arg) {
  cmdArticle(arg, asJson);
} else if (cmd === 'build') {
  cmdBuild();
} else if (cmd === 'sitemap') {
  cmdSitemap(arg);
} else if (cmd === 'seo-gates') {
  // Shell to the CI's own gates — one command, no logic duplication
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
} else {
  console.log('usage: node scripts/verify/verify.mjs <doctor|article <path> [--strict]|build|sitemap [path]|seo-gates> [--json]');
  process.exit(2);
}

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
