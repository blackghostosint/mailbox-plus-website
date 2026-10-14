#!/usr/bin/env node
// loop-ledger.mjs — machine-written row per PR: pushes, review rounds, failure classes.
//
// Purpose (docs/ARTICLE-ERROR-LOG.md rule 2): make "are we running in circles?"
// a number you can read instead of a memory of a bad week.
//
// For each PR (newest first) writes one CSV row:
//   pr, title, is_article, pushes, review_rounds, failed_ci_runs, failure_classes, merged_at, created_at, url
//
//   pushes         = commits on the PR (surrogate for push/fix round-trips)
//   review_rounds  = review submissions received (each rewrite costs one)
//   failure_classes= distinct names of FAILED check runs on the head SHA
//
// Usage:
//   node scripts/loop-ledger.mjs [--limit 60] [--out docs/loop-ledger.csv]
//
// Thresholds worth alerting on (loop signatures from the error log):
//   pushes >= 4 | review_rounds >= 3 | failed_ci_runs >= 3  → investigate.

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const LIMIT = parseInt(arg('--limit', '0'), 10) || Infinity; // 0/absent = all
const OUT = arg('--out', 'docs/loop-ledger.csv');

function gh(path, jq) {
  const cmdArgs = ['api', path];
  if (jq) cmdArgs.push('--jq', jq);
  const out = execFileSync('gh', cmdArgs, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const text = out.trim();
  if (!text) return [];
  try {
    return JSON.parse(text);
  } catch {
    // gh --jq emits one JSON object per line across pages (NDJSON).
    return text
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));
  }
}

const repo = (() => {
  const url = execFileSync('git', ['remote', 'get-url', 'origin'], {
    encoding: 'utf8',
  }).trim();
  const m = url.match(/github\.com[:/](.+?\/.+?)(?:\.git)?$/);
  if (!m) throw new Error(`cannot parse origin remote: ${url}`);
  return m[1];
})();

console.log(`loop-ledger: ${repo}`);

// 1. All PRs, newest first.
let prs = gh(
  `repos/${repo}/pulls?state=all&per_page=100&sort=created&direction=desc`,
  `.[] | {number, title, created_at, merged_at, head_sha: .head.sha, url: .html_url}`
);
if (prs.length > LIMIT) prs = prs.slice(0, LIMIT);
console.log(`PRs to process: ${prs.length}`);

const ARTICLE_RE = /\b(article|content)\b/i;

const rows = [];
for (const [i, pr] of prs.entries()) {
  // 2. Pushes: commits on the PR.
  const commits = gh(`repos/${repo}/pulls/${pr.number}/commits?per_page=100`, 'length');

  // 3. Review rounds: review submissions on the PR.
  const reviews = gh(`repos/${repo}/pulls/${pr.number}/reviews?per_page=100`, 'length');

  // 4. Failure classes: failed check runs on the PR head SHA.
  let failed = [];
  try {
    failed = gh(
      `repos/${repo}/commits/${pr.head_sha}/check-runs?per_page=100`,
      `.check_runs[] | select(.conclusion == "failure" or .conclusion == "timed_out") | .name`
    );
  } catch {
    // head SHA may be pruned; leave failures empty rather than crash the ledger.
  }
  const failureClasses = [...new Set(failed)].sort().join('; ');

  rows.push({
    pr: pr.number,
    title: pr.title.replace(/"/g, '""'),
    is_article: ARTICLE_RE.test(pr.title) ? 'yes' : 'no',
    pushes: commits,
    review_rounds: reviews,
    failed_ci_runs: failed.length,
    failure_classes: failureClasses.replace(/"/g, '""'),
    merged_at: pr.merged_at ?? '',
    created_at: pr.created_at,
    url: pr.url,
  });
  if ((i + 1) % 10 === 0) console.log(`  processed ${i + 1}/${prs.length}`);
}

// 5. Write CSV.
const header =
  'pr,title,is_article,pushes,review_rounds,failed_ci_runs,failure_classes,merged_at,created_at,url';
const csv = [
  header,
  ...rows.map((r) =>
    [
      r.pr,
      `"${r.title}"`,
      r.is_article,
      r.pushes,
      r.review_rounds,
      r.failed_ci_runs,
      `"${r.failure_classes}"`,
      r.merged_at,
      r.created_at,
      r.url,
    ].join(',')
  ),
].join('\n');
writeFileSync(OUT, csv + '\n');

// 6. Loop summary — same evidence shape as the error log, but numeric.
const articleRows = rows.filter((r) => r.is_article === 'yes');
const avg = (xs) => (xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : '0');
const over = (pred) => rows.filter(pred).length;

console.log(`\nWrote ${rows.length} rows → ${OUT}`);
console.log(`\nLoop summary:`);
console.log(
  `  article PRs: ${articleRows.length}/${rows.length} | avg pushes ${avg(
    articleRows.map((r) => r.pushes)
  )} | avg review rounds ${avg(articleRows.map((r) => r.review_rounds))}`
);
console.log(
  `  loop signatures: ${over((r) => r.pushes >= 4)} PRs ≥4 pushes | ${over(
    (r) => r.review_rounds >= 3
  )} PRs ≥3 review rounds | ${over((r) => r.failed_ci_runs >= 3)} PRs ≥3 failed CI runs`
);
const worst = [...rows]
  .sort((a, b) => b.pushes + 2 * b.review_rounds - (a.pushes + 2 * a.review_rounds))
  .slice(0, 5);
console.log(`  top circles:`);
for (const r of worst)
  console.log(
    `    #${r.pr} pushes=${r.pushes} reviews=${r.review_rounds} ci_fails=${r.failed_ci_runs} — ${r.title.slice(0, 60)}`
  );
