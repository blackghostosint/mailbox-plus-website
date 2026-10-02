#!/usr/bin/env node
// Article ownership gate (rule: content/articles is internal-only).
// Fails any PR that touches content/articles/ unless the PR body carries the
// in-house authorship stamp written by the article-writer pipeline.
// Stamp (exact line, machine-parsed): `authorship: article-writer-bot (in-house)`
// Repairs are handled in-session (Hermes/owner) — never reassigned to external agents.
import { readFileSync } from 'node:fs';

const bodyFile = process.argv[2];
const filesFile = process.argv[3];
if (!bodyFile || !filesFile) {
  console.error(
    'usage: node scripts/verify/check-article-ownership.mjs <pr-body-file> <changed-files-file-or-minus>'
  );
  process.exit(2);
}

let body = '';
try {
  body = readFileSync(bodyFile, 'utf8');
} catch {
  body = '';
}

let changed = '';
if (filesFile === '-') {
  changed = readFileSync(0, 'utf8');
} else {
  try {
    changed = readFileSync(filesFile, 'utf8');
  } catch {
    changed = '';
  }
}

const touchesArticles = changed.split('\n').some((f) => f.trim().startsWith('content/articles/'));

if (!touchesArticles) {
  console.log('✅ article-ownership: PR does not touch content/articles/ — not applicable');
  process.exit(0);
}

const stamp = 'authorship: article-writer-bot (in-house)';
if (!body.includes(stamp)) {
  console.error(
    '❌ article-ownership: PR touches content/articles/ but is missing the in-house authorship stamp.\n' +
      '   Articles are produced by the internal article-writer pipeline ONLY.\n' +
      '   The PR body must contain the exact line:\n' +
      '   ' +
      stamp +
      '\n' +
      '   Never reassign article PRs to external agents; repairs are handled in-session by Hermes + owner.'
  );
  process.exit(1);
}
console.log('✅ article-ownership: in-house stamp present');
