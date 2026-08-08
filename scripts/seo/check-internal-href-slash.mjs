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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DIST_DIR = path.join(ROOT, 'dist');

const HREF_RE = /href="(\/(?:[a-z0-9][a-z0-9\-/]*?))"/gi;

function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getHtmlFiles(full, fileList);
    } else if (entry.name.endsWith('.html')) {
      fileList.push(full);
    }
  }
  return fileList;
}

function isBadInternal(u) {
  if (!u.startsWith('/') || u.startsWith('//') || u === '/') return false;
  if (u.endsWith('/')) return false;
  // Exempt files, query strings, hashes, and protocol-ish strings.
  if (u.includes('.') || u.includes('?') || u.includes('#') || u.includes(':')) return false;
  return true;
}

function main() {
  console.log('==================================================');
  console.log('  INTERNAL HREF TRAILING-SLASH INTEGRITY CHECK   ');
  console.log('==================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Error: Build output directory "${DIST_DIR}" does not exist.`);
    console.error('Please run "npm run build" before running this check.\n');
    process.exit(1);
  }

  const htmlFiles = getHtmlFiles(DIST_DIR);
  console.log(`ℹ️ Scanned ${htmlFiles.length} HTML files from dist/`);

  const offenders = new Map(); // url -> Set(file paths)

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

  if (offenders.size === 0) {
    console.log('🎉 All internal hrefs use the trailing-slash canonical form.');
    console.log('==================================================\n');
    process.exit(0);
  }

  console.error(`❌ FAIL: ${offenders.size} distinct internal href(s) missing trailing slash:`);
  for (const [url, files] of [...offenders.entries()].sort()) {
    console.error(`   - "${url}" in ${files.size} file(s)`);
    for (const f of [...files].sort().slice(0, 3)) {
      console.error(`       ${f}`);
    }
    if (files.size > 3) console.error(`       ... and ${files.size - 3} more`);
  }
  console.error('\nFix: add the trailing slash (e.g. href="/contact-us/" ).');
  console.error('Internal links must match the canonical form Google chose.\n');
  console.error('==================================================\n');
  process.exit(1);
}

main();
