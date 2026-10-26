#!/usr/bin/env node
/**
 * preflight-verify-verdicts — validates claim tables in a fact-check receipt:
 * every row in a table whose header includes a "verdict" column must carry a
 * valid marker (✅ / ⚠️ / owner-verified) in that column. Mirrors claims-gate.js
 * rule A5 so the error surfaces at preflight, not in CI.
 * Usage: node preflight-verify-verdicts.mjs <receipt.md>
 */
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function extractTableBlocks(text) {
  if (typeof text !== 'string') return [];
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
  return blocks;
}

export function isSeparatorRow(line) {
  if (typeof line !== 'string') return false;
  return /^\s*\|[\s:|-]+\|\s*$/.test(line);
}

export function splitCells(line) {
  if (typeof line !== 'string') return [];
  return line
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim());
}

export function validateVerdictMarker(verdict) {
  if (typeof verdict !== 'string') return false;
  return /✅|⚠️|owner-verified/i.test(verdict);
}

export function verifyVerdictsContent(text) {
  const blocks = extractTableBlocks(text);
  let total = 0;
  const bad = [];

  for (const block of blocks) {
    if (!block.length) continue;
    const header = splitCells(block[0]).map((c) => c.toLowerCase());
    const vIdx = header.findIndex((c) => c.includes('verdict'));
    if (vIdx === -1) continue; // store-info or other non-claims table — skip

    for (const row of block.slice(1)) {
      if (isSeparatorRow(row)) continue;
      const cs = splitCells(row);
      total++;
      const verdict = cs[vIdx] || '';
      if (!validateVerdictMarker(verdict)) {
        const claimLabel = cs[1] || cs[0] || '';
        bad.push(
          `"${claimLabel.slice(0, 50)}" → verdict cell: "${verdict.slice(0, 40) || '(empty)'}"`
        );
      }
    }
  }

  return { total, bad, valid: bad.length === 0 && total > 0 };
}

export function verifyVerdictsFile(filePath) {
  let text = '';
  try {
    text = readFileSync(filePath, 'utf8');
  } catch (err) {
    return {
      total: 0,
      bad: [],
      valid: false,
      skipped: true,
      reason: 'file_not_found',
      filePath,
      error: err.message,
    };
  }

  const result = verifyVerdictsContent(text);
  return {
    ...result,
    skipped: false,
    filePath,
  };
}

export function runCli(filePath) {
  const res = verifyVerdictsFile(filePath);

  if (res.skipped) {
    console.log(`⚠️  verdicts: receipt ${filePath} not found on disk (skipped)`);
    process.exit(0);
  }
  if (res.total === 0) {
    console.log(`⚠️  verdicts: no claim table with a verdict column found in ${filePath}`);
    process.exit(0);
  }
  if (res.bad.length === 0) {
    console.log(`✅ verdicts: ${res.total} receipt rows carry valid verdicts (${filePath})`);
    process.exit(0);
  } else {
    console.log(
      `❌ verdicts: ${res.bad.length}/${res.total} row(s) without valid verdict in ${filePath}`
    );
    for (const b of res.bad.slice(0, 5)) console.log(`   ${b}`);
    console.log(
      '   fix: mark each row ✅ (verified), ⚠️ (softened), or owner-verified in the VERDICT column'
    );
    process.exit(1);
  }
}

const currentFilePath = fileURLToPath(import.meta.url);
if (
  process.argv[1] &&
  (path.resolve(process.argv[1]) === currentFilePath ||
    import.meta.url === `file://${process.argv[1]}`)
) {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node preflight-verify-verdicts.mjs <receipt.md>');
    process.exit(2);
  }
  runCli(file);
}
