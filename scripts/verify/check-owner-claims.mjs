#!/usr/bin/env node
/**
 * check-owner-claims — AGENTS.md rule 3 enforcement (owner sign-off on business claims).
 *
 * Scans changed article files for Rule-3 claim classes — superlatives, experience
 * figures, categorical claims about third parties, and packing guidance — whose truth
 * lives with the owner, not with any public source the machine gates can check. If any
 * match, the PR body MUST carry a "Business Claims" section with a real per-claim
 * status ledger (⏳ awaiting / ✅ approved / ⚠️ softened-cut). Hard fail otherwise,
 * consistent with check-auth-model (rule 7).
 *
 * Honest scope note: this gate mechanically enforces SECTION PRESENCE + non-hollow
 * content + status markers. One-entry-per-detected-claim coverage is asserted by the
 * marker count (section must carry at least as many status markers as detected
 * claims) and reviewed by Runa/owner; regex-to-claim-text matching is deliberately
 * NOT attempted because it is fragile against paraphrase.
 *
 * Modes:
 *   CI:     PR context files (PR_BODY_FILE / PR_FILES_FILE); articles read from the
 *           checkout on disk.
 *   Manual: node scripts/verify/check-owner-claims.mjs <body-file> <changed-files.txt>
 *
 * Exit 0 = compliant / not applicable. Exit 1 = missing, hollow, or under-marked section.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { getPRContext } from './pr-utils.mjs';

const HEADING = /#{2,4}\s*business\s+claims/i;
const MIN_SECTION_CHARS = 120; // heading + real ledger content, not a bare word
// Status markers that prove the section is a live ledger, not filler prose.
const STATUS_MARKERS = /[⏳✅⚠️]/g;

// Rule-3 claim classes (truth lives with the owner — no public source can verify these).
// Conservative on purpose: false negatives are caught by Runa/the owner review; false
// positives cost only a PR-body section. Each entry: category + matcher.
const CLAIM_PATTERNS = [
  {
    category: 'superlative',
    re: /\b(?:the\s+)?(?:best|cheapest|lowest[- ]priced|most affordable|top[- ]rated|#1|number[- ]one)\b/gi,
  },
  {
    category: 'experience-figure',
    re: /\b(?:thousands|hundreds)(?:\s+of)?\b|\b\d+\+?\s+years\b/gi,
  },
  {
    category: 'third-party-categorical',
    re: /\b(?:better than|unlike|compared to|vs\.?)\s+(?:the\s+)?(?:ups|fedex|usps|post office|postal)\b|\b(?:the\s+)?(?:post office|ups|fedex|usps)\s+(?:does not|doesn't|won't|will not|never|can't|cannot)\b/gi,
  },
  {
    category: 'packing-guidance',
    re: /\b(?:we|our (?:team|staff|clerk|experts?))\s+(?:pack|wrap|crate|box|cushion)\w*\b|\bprofessional(?:ly)?\s+pack\w*\b/gi,
  },
];

const ARTICLE_PATH = /^content\/articles\/.*\.md$/;

function stripFrontmatter(text) {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  return end === -1 ? text : text.slice(end + 4);
}

/**
 * Scans changed article files for Rule-3 claim classes and validates the PR body
 * carries a substantive Business Claims ledger when any are found.
 *
 * @param {Object} params
 * @param {string} [params.body] PR body text.
 * @param {string[]} [params.changedFiles] repo-relative changed file paths.
 * @param {(relPath: string) => string|null} [params.readFile] article content reader
 *        (injectable for tests). Defaults to reading from disk relative to params.root.
 * @param {string} [params.root] repo root for the default reader.
 */
export function checkOwnerClaims({ body = '', changedFiles = [], readFile, root = process.cwd() } = {}) {
  const reader =
    readFile ||
    ((rel) => {
      const abs = path.join(root, rel);
      try {
        return existsSync(abs) ? readFileSync(abs, 'utf8') : null;
      } catch {
        return null;
      }
    });

  const articleFiles = changedFiles.filter((f) => ARTICLE_PATH.test(f));
  if (articleFiles.length === 0) {
    return {
      success: true,
      applicable: false,
      message: `check-owner-claims: no content/articles/ changes (${changedFiles.length} files) — OK`,
    };
  }

  // Collect detected Rule-3 claims (deduped per file+category+match text).
  const detected = [];
  for (const rel of articleFiles) {
    const raw = reader(rel);
    if (raw == null) {
      // Changed article not readable (deleted or outside checkout) — nothing to scan.
      continue;
    }
    const content = stripFrontmatter(raw);
    for (const { category, re } of CLAIM_PATTERNS) {
      re.lastIndex = 0;
      const seen = new Set();
      for (const m of content.matchAll(re)) {
        const key = `${category}:${m[0].toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        detected.push({ file: rel, category, match: m[0].replace(/[<>]/g, '') });
      }
    }
  }

  if (detected.length === 0) {
    return {
      success: true,
      applicable: true,
      detectedCount: 0,
      message: `check-owner-claims: ${articleFiles.length} article file(s), no Rule-3 claim patterns detected — OK`,
    };
  }

  const m = body.match(HEADING);
  if (!m) {
    return {
      success: false,
      applicable: true,
      reason: 'missing_section',
      detected,
      message: `PR touches article copy containing ${detected.length} Rule-3 business claim(s) but the body has no "Business Claims" section.`,
    };
  }

  const section = body.slice(m.index + m[0].length);
  const next = section.match(/\n#{1,3}\s/);
  const rawContent = next ? section.slice(0, next.index) : section;
  // COMPLETE sanitization: strip every angle bracket in one pass so no HTML fragment
  // of body-derived text can survive into echoed output (CodeQL incomplete-sanitization).
  const content = rawContent.replace(/[<>]/g, '').trim();

  if (content.length < MIN_SECTION_CHARS) {
    return {
      success: false,
      applicable: true,
      reason: 'hollow_section',
      contentLength: content.length,
      detected,
      message: `"Business Claims" section exists but is hollow (${content.length} chars, need ${MIN_SECTION_CHARS}). List every detected claim with its status.`,
    };
  }

  const markerCount = (content.match(STATUS_MARKERS) || []).length;
  if (markerCount < detected.length) {
    return {
      success: false,
      applicable: true,
      reason: 'under_marked',
      markerCount,
      detectedCount: detected.length,
      detected,
      message: `"Business Claims" section carries ${markerCount} status marker(s) for ${detected.length} detected claim(s). Every claim needs its own ⏳/✅/⚠️ line.`,
    };
  }

  return {
    success: true,
    applicable: true,
    detectedCount: detected.length,
    markerCount,
    detected,
    message: `check-owner-claims: ${detected.length} Rule-3 claim(s) detected, ledger present with ${markerCount} status marker(s) — OK`,
  };
}

function fail(result) {
  // Echo only gate-authored text; PR-derived strings arrive pre-sanitized (angle
  // brackets stripped) and are listed as category+match pairs, never raw body text.
  console.error(`❌ ${result.message}`);
  for (const d of result.detected || []) {
    console.error(`   - [${d.category}] "${d.match}" in ${d.file}`);
  }
  console.error(`   Add a "Business Claims — Rule 3 (owner sign-off required)" section to the PR body:`);
  console.error(`   one line per claim — quote, class, and status ⏳ awaiting Frank / ✅ approved <date> / ⚠️ softened-cut.`);
  console.error(`   See .github/pull_request_template.md and AGENTS.md rule 3.`);
  process.exit(1);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const ctx = getPRContext();
  const result = checkOwnerClaims({ body: ctx.body, changedFiles: ctx.changedFiles });

  if (!result.success) {
    fail(result);
  } else {
    console.log(result.message);
    process.exit(0);
  }
}
