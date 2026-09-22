#!/usr/bin/env node
/**
 * check-auth-model — AGENTS.md rule 7 enforcement.
 * Fails if the PR diff touches netlify/functions/ but the PR body lacks an
 * "Endpoint Authentication Models" section with substantive content.
 *
 * Modes:
 *   CI:     GITHUB_EVENT_PATH contains the pull_request payload.
 *   Manual: node scripts/check-auth-model.mjs <body-file> <changed-files.txt>
 *
 * Exit 0 = compliant / not applicable. Exit 1 = missing or hollow section.
 */
import { readFileSync } from 'node:fs';

const HEADING = /#{2,4}\s*endpoint\s+authentication\s+models/i;
const MIN_SECTION_CHARS = 120; // heading + real content, not a bare word

function fail(msg) {
  console.error(`\u274c ${msg}`);
  console.error(`   Add an "Endpoint Authentication Models" section to the PR body.`);
  console.error(`   For each endpoint: who may call it, how identity is proven, rate limit.`);
  console.error(`   See .github/pull_request_template.md and AGENTS.md rule 7.`);
  process.exit(1);
}

function load() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath) {
    const ev = JSON.parse(readFileSync(eventPath, 'utf8'));
    if (!ev.pull_request) {
      console.log('check-auth-model: not a PR event — skipping');
      process.exit(0);
    }
    return {
      body: ev.pull_request.body ?? '',
      changed: ev.pull_request.changed_files, // not in payload; use files via list below
    };
  }
  if (process.argv.length >= 4) {
    const body = readFileSync(process.argv[2], 'utf8');
    return { body };
  }
  console.error('usage: check-auth-model.mjs <body-file> <changed-files.txt>');
  process.exit(2);
}

const { body } = load();
let changed;
const changedSrc = process.argv[3];
if (changedSrc) {
  changed = (changedSrc === '-' ? readFileSync(0, 'utf8') : readFileSync(changedSrc, 'utf8'))
    .split('\n')
    .filter(Boolean);
} else if (process.env.GITHUB_EVENT_PATH) {
  // changed files come from the API in CI; accept via env-provided file list
  changed = (process.env.CHANGED_FILES ?? '').split('\n').filter(Boolean);
} else {
  changed = [];
}

const functionsTouched = changed.some((f) => f.startsWith('netlify/functions/'));
if (!functionsTouched) {
  console.log(`check-auth-model: no netlify/functions/ changes (${changed.length} files) — OK`);
  process.exit(0);
}

const m = body.match(HEADING);
if (!m)
  fail(
    'PR touches netlify/functions/ but the body has no "Endpoint Authentication Models" section.'
  );

const section = body.slice(m.index + m[0].length);
// stop at the next heading of same-or-higher level
const next = section.match(/\n#{1,3}\s/);
const content = (next ? section.slice(0, next.index) : section)
  .replace(/<!--[\s\S]*?-->/g, '')
  .trim();

if (content.length < MIN_SECTION_CHARS) {
  fail(
    `"Endpoint Authentication Models" section exists but is hollow (${content.length} chars, need ${MIN_SECTION_CHARS}).`
  );
}

console.log(`check-auth-model: auth model section present (${content.length} chars) — OK`);
