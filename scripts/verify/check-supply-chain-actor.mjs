#!/usr/bin/env node
// Policy gate: protected supply-chain files may only be modified by the repo owner.
// Background (2026-10-05, PR #720): an external agent pinned `braces` to a
// typosquat fork (`@xiaoxige1/braces`) and removed the audit allowlist — CI was
// green but the "fix" was a renamed vulnerable package. This guard rejects any
// PR that touches protected files unless the PR author is the repo owner.
//
// Usage: node scripts/verify/check-supply-chain-actor.mjs <pr_files_file> <pr_author>
// Protected: .github/workflows/*, package.json + package-lock.json (root + astro/),
// scripts/verify/audit-*.
import { readFileSync } from 'node:fs';

const OWNER = process.env.REPO_OWNER || 'blackghostosint';

const PROTECTED = [
  /^\.github\/workflows\//,
  /^(astro\/)?package\.json$/,
  /^(astro\/)?package-lock\.json$/,
  /^scripts\/verify\/audit-/,
];

function fail(msg) {
  console.error('❌ ' + msg);
  process.exit(1);
}

const [filesFile, authorArg] = process.argv.slice(2);
if (!filesFile || !authorArg)
  fail('usage: check-supply-chain-actor.mjs <pr_files_file> <pr_author>');

const files = readFileSync(filesFile, 'utf8').trim().split('\n').filter(Boolean);
const touched = files.filter((f) => PROTECTED.some((rx) => rx.test(f)));

if (!touched.length) {
  console.log('✅ no protected supply-chain files touched');
  process.exit(0);
}

if (authorArg === OWNER) {
  console.log(`✅ protected files touched by repo owner (${authorArg}): ${touched.join(', ')}`);
  process.exit(0);
}

fail(
  `PR by "${authorArg}" touches protected supply-chain files: ${touched.join(', ')}. ` +
    'Dependency overrides and CI workflow changes require a PR from the repo owner. ' +
    'Owner reviews and applies dependency changes in-house (see PR #720 incident).'
);
