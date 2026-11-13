#!/usr/bin/env node
/**
 * Article workflow paperwork gate (Rule 6).
 *
 * Ensures any PR adding or modifying `content/articles/` carries BOTH:
 *   1. A `.factchecks/` receipt reference (or explicit `fact-check receipt`)
 *   2. A recorded passing copy review score (`Copy review score: NN/100 PASS` or `NN/100`)
 *      meeting or exceeding `minScore` (default 65, aligning with calibrated judge floors).
 *
 * Pure deletion PRs (`fileStatuses` marking all touched articles `'removed'`) are exempt.
 */

import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';
import { getPRContext, parsePRCliArgs } from './pr-utils.mjs';

export const DEFAULT_MIN_SCORE = 65;

/**
 * Strip HTML comments and angle brackets in a single pass (CodeQL-safe).
 * @param {string} raw
 * @returns {string}
 */
function sanitizeBody(raw) {
  return String(raw || '').replace(/<!--[\s\S]*?(?:-->|$)|[<>]/g, '');
}

/**
 * @param {Object} [options]
 * @param {string} [options.body]
 * @param {string[]} [options.changedFiles]
 * @param {Record<string,string> | null} [options.fileStatuses]
 * @param {number} [options.minScore]
 */
export function checkArticlePaperwork({
  body = '',
  changedFiles = [],
  fileStatuses = null,
  minScore = DEFAULT_MIN_SCORE,
} = {}) {
  const touched = changedFiles.filter((f) => f.trim().startsWith('content/articles/'));
  if (touched.length === 0) {
    return {
      success: true,
      reason: 'not_applicable',
      score: null,
      message: 'article-paperwork (Rule 6): PR does not touch content/articles/ — not applicable',
    };
  }

  if (fileStatuses) {
    const nonDeleted = touched.filter((f) => fileStatuses[f.trim()] !== 'removed');
    if (nonDeleted.length === 0) {
      return {
        success: true,
        reason: 'deletions_only',
        score: null,
        message: 'article-paperwork (Rule 6): pure article deletion — paperwork not required',
      };
    }
  }

  const clean = sanitizeBody(body);
  const hasReceipt = /\.factchecks?\/|fact-?check\s+receipt/i.test(clean);
  if (!hasReceipt) {
    return {
      success: false,
      reason: 'missing_receipt',
      score: null,
      message:
        'article-paperwork (Rule 6): PR touches content/articles/ but PR body is missing a `.factchecks/<slug>.factcheck.md` receipt reference.',
    };
  }

  const m1 = clean.match(
    /(?:copy\s*(?:review\s*)?score|review\s+feedback)\s*[:=(]\s*(100|[1-9][0-9])\b/i
  );
  const m2 = clean.match(/\b(100|[1-9][0-9])\s*\/\s*100\b/i);
  const score = m1 ? Number(m1[1]) : m2 ? Number(m2[1]) : null;

  if (score === null || score < minScore) {
    return {
      success: false,
      reason: 'missing_or_low_score',
      score,
      message: `article-paperwork (Rule 6): PR touches content/articles/ but PR body lacks a passing copy review score >= ${minScore} (record literal line: Copy review score: NN/100 PASS).`,
    };
  }

  return {
    success: true,
    reason: 'verified',
    score,
    message: `article-paperwork (Rule 6): verified receipt reference and copy review score (${score}/100)`,
  };
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  const { positional } = parsePRCliArgs(process.argv);
  const ctx = getPRContext(positional, process.env);
  const res = checkArticlePaperwork({
    body: ctx.body,
    changedFiles: ctx.changedFiles,
    fileStatuses: ctx.fileStatuses,
  });
  if (!res.success) {
    console.error(`❌ ${res.message}`);
    process.exit(1);
  }
  console.log(`✅ ${res.message}`);
}
