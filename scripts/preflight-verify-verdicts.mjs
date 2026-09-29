#!/usr/bin/env node
/**
 * preflight-verify-verdicts — validates claim tables in a fact-check receipt:
 * every row in a table whose header includes a "verdict" column must carry a
 * valid marker (✅ / ⚠️ / owner-verified) in that column. Mirrors claims-gate.js
 * rule A5 so the error surfaces at preflight, not in CI.
 * Usage: node preflight-verify-verdicts.mjs <receipt.md>
 */
import { readFileSync } from 'fs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node preflight-verify-verdicts.mjs <receipt.md>');
  process.exit(2);
}
let text = '';
try {
  text = readFileSync(file, 'utf8');
} catch {
  console.log(`⚠️  verdicts: receipt ${file} not found on disk (skipped)`);
  process.exit(0);
}

// group contiguous table lines into blocks
const lines = text.split('\n');
const blocks = [];
let cur = [];
for (const l of lines) {
  if (/^\s*\|/.test(l)) cur.push(l);
  else if (cur.length) {
    blocks.push(cur);
    cur = [];
  }
}
if (cur.length) blocks.push(cur);

const isSep = (l) => /^\s*\|[\s:|-]+\|\s*$/.test(l);
const cells = (l) =>
  l
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim());

let total = 0;
const bad = [];
for (const block of blocks) {
  const header = cells(block[0]).map((c) => c.toLowerCase());
  const vIdx = header.findIndex((c) => c.includes('verdict'));
  if (vIdx === -1) continue; // store-info or other non-claims table — skip
  for (const row of block.slice(1)) {
    if (isSep(row)) continue;
    const cs = cells(row);
    total++;
    const verdict = cs[vIdx] || '';
    if (!/✅|⚠️|owner-verified/i.test(verdict)) {
      bad.push(
        `"${(cs[1] || cs[0]).slice(0, 50)}" → verdict cell: "${verdict.slice(0, 40) || '(empty)'}"`
      );
    }
  }
}

if (total === 0) {
  console.log(`⚠️  verdicts: no claim table with a verdict column found in ${file}`);
  process.exit(0);
}
if (bad.length === 0) {
  console.log(`✅ verdicts: ${total} receipt rows carry valid verdicts (${file})`);
} else {
  console.log(`❌ verdicts: ${bad.length}/${total} row(s) without valid verdict in ${file}`);
  for (const b of bad.slice(0, 5)) console.log(`   ${b}`);
  console.log(
    '   fix: mark each row ✅ (verified), ⚠️ (softened), or owner-verified in the VERDICT column'
  );
  process.exit(1);
}
