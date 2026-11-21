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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(__dirname, '..', '..');

const NEGATION_PREFIX =
  /\b(?:no|not|never|don't|do not|cannot|can't|won't|will not|doesn't|does not|without|aren't|are not|isn't|is not|exclude[sd]?|unlike|instead of|stop saying)\b/i;

function isNegatedBeforeMatch(line, matchIndex) {
  const windowStart = Math.max(0, matchIndex - 50);
  const before = line.slice(windowStart, matchIndex);
  // Stop at clause boundaries so an unrelated earlier negation (e.g. "no annual contract and 24/7 access")
  // cannot mask a violation in the next clause.
  const clauseParts = before.split(/[.,;—]|\s--\s|\b(?:and|but|or)\b/i);
  const currentClause = clauseParts[clauseParts.length - 1] || '';
  return NEGATION_PREFIX.test(currentClause);
}

const KIRTLAND_CONTEXT =
  /\b(?:kirtland|kirtland hills|chillicothe|baldwin\s+rd|holden\s+arboretum)\b/i;
const BUSINESS_CONTEXT = /\b(?:business|llc|dba|commercial|company)\b/i;

const CONTEXT_GUARDS = {
  none: null,
  negation: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
  kirtland_or_negation: (line, ctx) =>
    KIRTLAND_CONTEXT.test(line) || isNegatedBeforeMatch(line, ctx.matchIndex),
  business_context: (line, ctx) =>
    BUSINESS_CONTEXT.test(line) || BUSINESS_CONTEXT.test(ctx.heading || ''),
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Load and compile Source of Truth lint rules dynamically from `content/facts.json`.
 * @param {string} [root]
 */
export function loadSotRules(root = DEFAULT_ROOT) {
  const factsPath = path.join(root, 'content', 'facts.json');
  if (!existsSync(factsPath)) {
    throw new Error(`Missing canonical facts file: ${factsPath}`);
  }
  const parsed = JSON.parse(readFileSync(factsPath, 'utf8'));
  const entries = Array.isArray(parsed.forbidden) ? parsed.forbidden : [];
  return entries.map((entry, idx) => {
    const id = entry.id || `forbidden-${idx}`;
    const source = entry.regex || escapeRegExp(String(entry.pattern || ''));
    const re = new RegExp(source, 'i');
    const guardKey = entry.context || 'negation';
    const allowLine = Object.prototype.hasOwnProperty.call(CONTEXT_GUARDS, guardKey)
      ? CONTEXT_GUARDS[guardKey]
      : CONTEXT_GUARDS.negation;
    return {
      id,
      re,
      allowLine,
      message: String(entry.reason || `Forbidden pattern "${entry.pattern}"`),
    };
  });
}

export const SOT_RULES = loadSotRules(DEFAULT_ROOT);

function stripFrontmatter(text) {
  if (!text.startsWith('---')) return { body: text, startLine: 1 };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { body: text, startLine: 1 };
  const prefix = text.slice(0, end + 4);
  const startLine = prefix.split('\n').length;
  return { body: text.slice(end + 4), startLine };
}

/**
 * Scan a single file's text against rules loaded from `content/facts.json`.
 * @param {string} filePath
 * @param {string} content
 * @param {Array} [rules]
 * @returns {Array<{file: string, line: number, ruleId: string, match: string, message: string}>}
 */
export function scanTextForSotViolations(filePath, content, rules = SOT_RULES) {
  const isMarkdown = filePath.endsWith('.md') || filePath.endsWith('.mdx');
  const { body, startLine } = isMarkdown
    ? stripFrontmatter(content)
    : { body: content, startLine: 1 };
  const lines = body.split('\n');
  const violations = [];
  let currentHeading = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isMarkdown && /^#{1,6}\s+/.test(line)) {
      currentHeading = line;
    }
    const lineNum = startLine + i;
    for (const rule of rules) {
      rule.re.lastIndex = 0;
      const m = rule.re.exec(line);
      if (!m) continue;
      if (
        rule.allowLine &&
        rule.allowLine(line, { heading: currentHeading, filePath, matchIndex: m.index })
      ) {
        continue;
      }
      violations.push({
        file: filePath,
        line: lineNum,
        ruleId: rule.id,
        match: m[0],
        message: rule.message,
      });
    }
  }
  return violations;
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
    const rel = path.relative(root, abs);
    const text = readFileSync(abs, 'utf8');
    allViolations.push(...scanTextForSotViolations(rel, text, rules));
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
