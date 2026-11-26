#!/usr/bin/env node
/**
 * check-source-of-truth — data-driven mechanical preflight lint.
 *
 * Loads all forbidden store-fact rules dynamically from `content/facts.json`
 * (`forbidden[]`), keeping zero business facts hardcoded in script code.
 *
 * Usage:
 *   node scripts/verify/check-source-of-truth.mjs --files <file1> [file2...]
 *   node scripts/verify/check-source-of-truth.mjs --all
 *
 * Exit 0 = clean. Exit 1 = one or more Source of Truth violations found.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFactsRules, scanTextForFactsViolations } from './lib/facts-rules.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(__dirname, '..', '..');

/**
 * Exact pre-existing `file#ruleId` pairs on legacy articles authored before strict
 * Source-of-Truth / receipt gates landed. Deferred ONLY during corpus-wide `--all` scans;
 * `--files <path>` (preflight) and `claims-gate.js` enforce zero exemptions if any of
 * these files are touched in a PR.
 */
export const LEGACY_ARTICLE_BACKLOG = new Set([
  'content/articles/mailbox-rentals/24-7-mail-access.md#banned-24-7-access',
  'content/articles/mailbox-rentals/concord-township-business-real-street-address.md#banned-pmb-suite-format',
  'content/articles/mailbox-rentals/concord-township-mover-mailbox.md#banned-24-7-access',
  'content/articles/mailbox-rentals/eastlake-online-seller-mailbox.md#banned-route-306',
  'content/articles/mailbox-rentals/fincen-bank-address-requirements-commercial-suite.md#banned-route-306',
  'content/articles/mailbox-rentals/kirtland-hills-small-business-mailbox.md#banned-pmb-suite-format',
  'content/articles/mailbox-rentals/registered-agent-vs-mailbox-address-llc.md#banned-pmb-suite-format',
  'content/articles/mailbox-rentals/why-po-boxes-get-rejected-street-address.md#banned-pmb-suite-format',
  'content/articles/pack-ship/pack-ship-kirtland.md#banned-route-306',
  'content/articles/pack-ship/vinted-go-drop-off-concord-township.md#banned-vinted-go',
]);

/**
 * Load and compile Source of Truth lint rules dynamically from `content/facts.json`.
 * @param {string} [root]
 */
export function loadSotRules(root = DEFAULT_ROOT) {
  return loadFactsRules(root);
}

export const SOT_RULES = loadSotRules(DEFAULT_ROOT);

/**
 * Scan a single file's text against rules loaded from `content/facts.json`.
 * @param {string} filePath
 * @param {string} content
 * @param {Array} [rules]
 * @returns {Array<{file: string, line: number, ruleId: string, pattern: string, match: string, message: string}>}
 */
export function scanTextForSotViolations(filePath, content, rules = SOT_RULES) {
  return scanTextForFactsViolations(filePath, content, rules);
}

function collectFilesRecursive(dir, exts, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === '__tests__' || entry === 'node_modules') continue;
      collectFilesRecursive(full, exts, out);
    } else if (exts.some((ext) => entry.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

export function runSotCheck({ root = DEFAULT_ROOT, files = [], all = false } = {}) {
  const rulesRoot = existsSync(path.join(root, 'content', 'facts.json')) ? root : DEFAULT_ROOT;
  const rules = loadSotRules(rulesRoot);
  const targets = [];
  if (all) {
    targets.push(...collectFilesRecursive(path.join(root, 'content', 'articles'), ['.md', '.mdx']));
    targets.push(
      ...collectFilesRecursive(path.join(root, 'astro', 'src', 'config'), ['.ts', '.js'])
    );
    const kbPath = path.join(root, 'knowledge', 'kb.entries.json');
    if (existsSync(kbPath)) targets.push(kbPath);
  } else {
    for (const f of files) {
      const abs = path.isAbsolute(f) ? f : path.resolve(root, f);
      if (existsSync(abs)) targets.push(abs);
    }
  }

  const allViolations = [];
  for (const abs of targets) {
    const rel = path.relative(root, abs).replace(/\\/g, '/');
    const text = readFileSync(abs, 'utf8');
    const fileViolations = scanTextForSotViolations(rel, text, rules);
    for (const v of fileViolations) {
      if (all && LEGACY_ARTICLE_BACKLOG.has(`${rel}#${v.ruleId}`)) {
        continue;
      }
      allViolations.push(v);
    }
  }
  return {
    scannedCount: targets.length,
    violations: allViolations,
    success: allViolations.length === 0,
  };
}

function main() {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const filesIdx = args.indexOf('--files');
  const files = filesIdx !== -1 ? args.slice(filesIdx + 1).filter((a) => !a.startsWith('--')) : [];

  if (!all && files.length === 0) {
    console.error(
      'Usage: node scripts/verify/check-source-of-truth.mjs (--all | --files <file...>)'
    );
    process.exit(2);
  }

  const res = runSotCheck({ root: all ? DEFAULT_ROOT : process.cwd(), files, all });
  if (res.success) {
    console.log(`✅ source-of-truth: ${res.scannedCount} file(s) clean`);
    process.exit(0);
  }

  console.error(
    `❌ source-of-truth: ${res.violations.length} violation(s) across ${res.scannedCount} file(s):`
  );
  for (const v of res.violations) {
    console.error(`  - ${v.file}:${v.line} [${v.ruleId}] matched "${v.match}" — ${v.message}`);
  }
  process.exit(1);
}

const isDirect =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isDirect) {
  main();
}
