#!/usr/bin/env node
/**
 * check-source-of-truth — mechanical preflight lint against docs/SOURCE_OF_TRUTH.md
 * and content/facts.json.
 *
 * Catches recurring store-fact, location, pricing, and wording errors locally in <2s
 * before they burn CI minutes or L3 review rounds.
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
  return NEGATION_PREFIX.test(before);
}

const KIRTLAND_CONTEXT =
  /\b(?:kirtland|kirtland hills|chillicothe|baldwin\s+rd|holden\s+arboretum)\b/i;
const BUSINESS_CONTEXT = /\b(?:business|llc|dba|commercial|company)\b/i;

/**
 * Deterministic Source of Truth rules.
 * Each rule has:
 * - id: stable rule identifier
 * - re: regex to test against each line
 * - message: actionable fix pointing to docs/SOURCE_OF_TRUTH.md
 * - allowLine?: (line, ctx) => boolean — explicit context exemption to avoid false positives
 */
export const SOT_RULES = [
  {
    id: 'banned-no-annual-contract',
    re: /\bno\s+annual\s+contract\b/i,
    message:
      'Use "no term commitment" instead of "no annual contract" (docs/SOURCE_OF_TRUTH.md §4).',
  },
  {
    id: 'banned-30-day-risk-free',
    re: /\b30[- ]day\s+risk[- ]free\b/i,
    message: 'Remove unapproved "30-day risk-free" offer language (docs/SOURCE_OF_TRUTH.md §4).',
  },
  {
    id: 'banned-24-7-access',
    re: /\b(?:24\/7|24-7|24[- ]hour)\s+(?:access|mailbox|service|fax|drop[- ]?off|pickup)\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message:
      'Mailbox Plus does NOT offer 24/7 or 24-hour access/service — use store hours (docs/SOURCE_OF_TRUTH.md §1, §4).',
  },
  {
    id: 'banned-route-306',
    re: /\b(?:route|rt\.?|sr|oh)[- ]?306\b/i,
    allowLine: (line, ctx) =>
      KIRTLAND_CONTEXT.test(line) || isNegatedBeforeMatch(line, ctx.matchIndex),
    message:
      'Store is NOT on Route 306 — use "just off Crile Road, minutes from SR-44 and I-90" (docs/SOURCE_OF_TRUTH.md §1).',
  },
  {
    id: 'banned-capital-plaza',
    re: /\bcapital\s+plaza\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message:
      'Wrong plaza name ("Capital Plaza") — store is in Gristmill Village (docs/SOURCE_OF_TRUTH.md §1).',
  },
  {
    id: 'banned-pet-supplies-plus',
    re: /\bpet\s+supplies\s+plus\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message:
      'Wrong neighbor ("Pet Supplies Plus") — store is next to Pub Frato (docs/SOURCE_OF_TRUTH.md §1).',
  },
  {
    id: 'banned-everything-prints-here',
    re: /\beverything\s+prints\s+here\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message:
      'False claim: B&W/color copies & document printing are in-house; business cards/posters/banners are outsourced (docs/SOURCE_OF_TRUTH.md §5).',
  },
  {
    id: 'banned-mail-experts',
    re: /\bwe\s+are\s+mail\s+experts\b/i,
    message:
      'Use "we are package experts, not your attorneys… we cannot give legal advice" (docs/SOURCE_OF_TRUTH.md §2).',
  },
  {
    id: 'banned-fill-forms-for-you',
    re: /\b(?:keep\s+the\s+forms\s+in\s+stock\s+and\s+(?:we\s+)?fill\s+them\s+out\s+for\s+you|fill\s+out\s+(?:usps|certified\s+mail|coa|forwarding)\s+forms?\s+for\s+you)\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message:
      'Do not claim staff fills out USPS/Certified Mail/COA forms for customers (docs/SOURCE_OF_TRUTH.md §2).',
  },
  {
    id: 'banned-no-door-tag-ever',
    re: /\bno\s+door\s+tag\s+will\s+ever\b|\bnever\s+get\s+a\s+door\s+tag\b/i,
    message: 'Do not make absolute door-tag guarantees (docs/SOURCE_OF_TRUTH.md §2).',
  },
  {
    id: 'banned-vinted-go',
    re: /\bvinted\s+go\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message:
      'Use "Vinted (via SpeedX, FedEx, or USPS)" — never "Vinted Go" (docs/SOURCE_OF_TRUTH.md §3).',
  },
  {
    id: 'banned-passport-photos',
    re: /\bpassport\s+photos?\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message: 'Passport photos are NOT offered in store (docs/SOURCE_OF_TRUTH.md §5).',
  },
  {
    id: 'banned-plus-points',
    re: /\bplus\s+points\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message: 'Rewards / Plus Points are NOT live yet (docs/SOURCE_OF_TRUTH.md §5).',
  },
  {
    id: 'banned-stale-shredding-price',
    re: /\$1\.25\s*(?:\/|\s*per\s*)(?:lb|pound)\b/i,
    message:
      'Stale shredding price ($1.25/lb) — canonical price is $1.00/lb, no minimum (docs/SOURCE_OF_TRUTH.md §5).',
  },
  {
    id: 'banned-invented-unlimited-receiving',
    re: /\$30\s*(?:\/|\s*per\s*)month\s+unlimited\b|\$30\/mo\s+unlimited\b/i,
    message:
      'Invented receiving fee ("$30/month unlimited") — non-holder walk-in is $10/pkg; PMB overage is $5/pkg (docs/SOURCE_OF_TRUTH.md §4).',
  },
  {
    id: 'banned-physical-fax',
    re: /\b(?:physical\s+fax\s+machine|printed\s+confirmation\s+slip)\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message:
      'Fax is digital send/receive only — no customer-operated physical fax machine or printed confirmation slip (docs/SOURCE_OF_TRUTH.md §5).',
  },
  {
    id: 'banned-pmb-suite-format',
    re: /7554\s+fredle\s+(?:dr\.?|drive)\s*,?\s*suite\b/i,
    allowLine: (line, ctx) => isNegatedBeforeMatch(line, ctx.matchIndex),
    message:
      'Never format Mailbox Plus PMB addresses with "Suite" — use "#" or "PMB" (docs/SOURCE_OF_TRUTH.md §4).',
  },
  {
    id: 'banned-personal-35-anchor',
    re: /\b(?:from|starting\s+at)\s+\$35\s*(?:\/|\s*per\s*)mo(?:nth)?\b/i,
    allowLine: (line, ctx) =>
      BUSINESS_CONTEXT.test(line) || BUSINESS_CONTEXT.test(ctx.heading || ''),
    message:
      'Personal PMBs start at $15/mo (Mail Only) or $25/mo (+10 Packages); $35/mo is Business Small only (docs/SOURCE_OF_TRUTH.md §4).',
  },
];

function stripFrontmatter(text) {
  if (!text.startsWith('---')) return { body: text, startLine: 1 };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { body: text, startLine: 1 };
  const prefix = text.slice(0, end + 4);
  const startLine = prefix.split('\n').length;
  return { body: text.slice(end + 4), startLine };
}

/**
 * Scan a single file's text against SOT_RULES.
 * @param {string} filePath
 * @param {string} content
 * @returns {Array<{file: string, line: number, ruleId: string, match: string, message: string}>}
 */
export function scanTextForSotViolations(filePath, content) {
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
    for (const rule of SOT_RULES) {
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
    allViolations.push(...scanTextForSotViolations(rel, text));
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
