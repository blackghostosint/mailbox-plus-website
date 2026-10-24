#!/usr/bin/env node
/**
 * SEO INTERNAL HREF TRAILING-SLASH CHECK
 * ======================================
 * Scans every built HTML file in dist/ for internal links that omit the
 * trailing slash (e.g. href="/contact-us" instead of href="/contact-us/").
 *
 * WHY: Google treats /page and /page/ as different URLs. The site's canonical
 * URLs, sitemap, and redirects all use the trailing-slash form; internal links
 * MUST agree with it. A no-slash internal link makes Google crawl the
 * redirecting form and log it under "Page with redirect" in the Page indexing
 * report (and, without a redirect, under "Duplicate without user-selected
 * canonical").
 *
 * RULE: every internal href must use the trailing-slash canonical form.
 * Exemptions (left untouched): root "/", anchors "#...", query "?...",
 * hash "...#...", files "file.ext", external "http(s)://...", and
 * protocol-relative "//...".
 *
 * Usage: node scripts/seo/check-internal-href-slash.mjs
 * Exit code 0 = pass, 1 = fail. Runs AFTER `npm run build` in CI.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveDistDir, getHtmlFiles } from '../lib/dist-path.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DIST_DIR = resolveDistDir();

const HREF_RE = /href="(\/(?:[a-z0-9][a-z0-9\-/]*?))"/gi;

function isBadInternal(u) {
  if (!u.startsWith('/') || u.startsWith('//') || u === '/') return false;
  if (u.endsWith('/')) return false;
  // Exempt files, query strings, hashes, and protocol-ish strings.
  if (u.includes('.') || u.includes('?') || u.includes('#') || u.includes(':')) return false;
  return true;
}

export function checkInternalHrefSlash(distDir = DIST_DIR) {
  if (!fs.existsSync(distDir)) {
    return {
      ok: false,
      error: `Build output directory "${distDir}" does not exist.`,
      offenders: new Map(),
      htmlFilesCount: 0,
    };
  }

  const htmlFiles = getHtmlFiles(distDir);
  const offenders = new Map();

  for (const file of htmlFiles) {
    const relPath = path.relative(ROOT, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(HREF_RE)) {
      const url = match[1];
      if (isBadInternal(url)) {
        if (!offenders.has(url)) offenders.set(url, new Set());
        offenders.get(url).add(relPath);
      }
    }
  }

  return { ok: offenders.size === 0, offenders, htmlFilesCount: htmlFiles.length };
}

export function main() {
  console.log('==================================================');
  console.log('  INTERNAL HREF TRAILING-SLASH INTEGRITY CHECK   ');
  console.log('==================================================\n');

  const res = checkInternalHrefSlash();
  if (!res.ok) {
    if (res.error) {
      console.error(`❌ Error: ${res.error}`);
    } else {
      console.error(
        `❌ FAIL: ${res.offenders.size} distinct internal href(s) missing trailing slash`
      );
    }
    process.exit(1);
  } else {
    console.log(`ℹ️ Scanned ${res.htmlFilesCount} HTML files from dist/`);
    console.log('🎉 All internal hrefs use the trailing-slash canonical form.');
    process.exit(0);
  }
}

export { isBadInternal };

const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main();
}
