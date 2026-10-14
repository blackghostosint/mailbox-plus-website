#!/usr/bin/env node
// loop-gate.mjs — fail-closed loop detector for pre-push.
//
// Blocks a push when the current branch's PR shows a loop signature
// (docs/ARTICLE-ERROR-LOG.md + docs/loop-ledger.csv):
//   - this would be push #4 or later on the PR
//   - or the PR has 3+ review rounds (rewrite seesaw)
//
// CI failures deliberately do NOT block: a fix push is how CI gets green.
// Owner escape hatch (conscious override, logged by the caller):
//   LOOP_LEDGER_ALLOW="<reason>" git push ...
//
// Usage (from .husky/pre-push): node scripts/loop-gate.mjs [branch]
// Exits 0 when no PR exists for the branch (pre-PR pushes unaffected).

import { execFileSync } from 'node:child_process';

const PUSH_THRESHOLD = 3; // block when PR already has >= 3 pushes (next is #4)
const REVIEW_THRESHOLD = 3;

const branch =
  process.argv[2] || execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim();
if (!branch || branch === 'main') process.exit(0);

function ghJson(args) {
  try {
    const out = execFileSync('gh', args, { encoding: 'utf8' });
    return out.trim() ? JSON.parse(out) : null;
  } catch {
    return null; // no PR, gh not authed, network hiccup — fail OPEN here;
    // the loop gate must never block work on infrastructure failure.
  }
}

const pr = ghJson([
  'pr',
  'view',
  branch,
  '--json',
  'number,url,commits,reviews',
  '--jq',
  '{number, url, pushes: (.commits | length), reviews: (.reviews | length)}',
]);
if (!pr) process.exit(0);

const reasons = [];
if (pr.pushes >= PUSH_THRESHOLD) {
  reasons.push(`push #${pr.pushes + 1} on PR #${pr.number} (threshold: push #4 blocks)`);
}
if (pr.reviews >= REVIEW_THRESHOLD) {
  reasons.push(`${pr.reviews} review rounds on PR #${pr.number} (rewrite-seesaw signature)`);
}
if (reasons.length === 0) process.exit(0);

const allow = process.env.LOOP_LEDGER_ALLOW;
if (allow && allow.trim()) {
  console.log(`loop-gate: OVERRIDE (${allow.trim()}) — allowing push despite loop signature.`);
  process.exit(0);
}

console.error(`
pre-push BLOCKED by loop-gate — loop signature detected:
  ${reasons.map((r) => '- ' + r).join('\n  ')}

This PR is running in circles (see docs/loop-ledger.csv for history).
Do NOT push a rewrite #${pr.pushes + 1}. Instead:
  1. Stop and escalate to the owner with the failure classes hit so far.
  2. Change the INPUT (brief, model, threshold), not the retry count.
  3. If the owner approves this push consciously:
       LOOP_LEDGER_ALLOW="<reason>" git push ...
`);
process.exit(1);
