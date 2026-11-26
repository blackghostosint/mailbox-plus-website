/**
 * Shared Markdown fact-check receipt parser and verdict validator.
 *
 * Used by both local preflight (`scripts/preflight-verify-verdicts.mjs`) and
 * CI article verification (`scripts/verify/claims-gate.js`) so unnumbered,
 * column-reordered, split-table, missing-pipe, and multi-table receipts
 * produce identical row counts and verdicts everywhere.
 */

/**
 * Returns true when `line` is a Markdown table delimiter row (e.g. `| --- | :---: |`).
 * @param {string} line
 */
export function isSeparatorRow(line) {
  if (typeof line !== 'string') return false;
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return false;
  return /^\|[\s:|-]+\|?$/.test(trimmed) && /-/.test(trimmed);
}

/**
 * Splits a Markdown table row into trimmed cell strings.
 * Handles optional missing trailing pipe without dropping the final cell, and
 * preserves escaped pipes (`\|`) inside cell text.
 * @param {string} line
 * @returns {string[]}
 */
export function splitCells(line) {
  if (typeof line !== 'string') return [];
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return [];
  const inner =
    trimmed.endsWith('|') && !trimmed.endsWith('\\|') ? trimmed.slice(1, -1) : trimmed.slice(1);
  return inner.split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, '|').trim());
}

/**
 * Groups Markdown table lines into table blocks while ignoring blank lines inside
 * split tables (when the next non-blank line is a pipe row not followed by a
 * table separator row).
 * @param {string} text
 * @returns {string[][]}
 */
export function extractTableBlocks(text) {
  if (typeof text !== 'string' || !text) return [];
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let cur = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*\|/.test(line)) {
      cur.push(line);
      continue;
    }

    if (cur.length > 0 && line.trim() === '') {
      // Peek ahead past contiguous blank lines to detect split tables vs separate tables
      let nextIdx = i + 1;
      while (nextIdx < lines.length && lines[nextIdx].trim() === '') {
        nextIdx++;
      }
      if (nextIdx < lines.length && /^\s*\|/.test(lines[nextIdx])) {
        // Check if lines[nextIdx] is the header of a brand-new table (followed by a separator row)
        let afterNext = nextIdx + 1;
        while (afterNext < lines.length && lines[afterNext].trim() === '') {
          afterNext++;
        }
        const startsNewTable = afterNext < lines.length && isSeparatorRow(lines[afterNext]);
        if (!startsNewTable) {
          i = nextIdx - 1;
          continue;
        }
      }
    }

    if (cur.length > 0) {
      blocks.push(cur);
      cur = [];
    }
  }

  if (cur.length > 0) blocks.push(cur);
  return blocks;
}

/**
 * Validates whether a verdict cell contains an approved verdict marker.
 * @param {string} verdict
 */
export function validateVerdictMarker(verdict) {
  if (typeof verdict !== 'string') return false;
  return /✅|⚠️|owner-verified/i.test(verdict);
}

function extractFirstUrl(sourceCell) {
  if (typeof sourceCell !== 'string') return '';
  const urlMatch = sourceCell.match(/https?:\/\/[^\s|)]+/);
  return urlMatch ? urlMatch[0] : sourceCell;
}

function isHeaderlessLegacyBlock(block) {
  if (!Array.isArray(block) || block.length === 0) return false;
  if (block.some(isSeparatorRow)) return false;
  const firstHeaderLower = splitCells(block[0]).map((c) => c.toLowerCase());
  if (firstHeaderLower.some((c) => c.includes('verdict') || c.includes('claim'))) {
    return false;
  }
  return block.every((row) => /^\s*\|\s*\d+\s*\|/.test(row) && splitCells(row).length >= 3);
}

/**
 * Parses all claim/verdict tables in a Markdown receipt.
 * Indexes `claim`, `verdict`, and `source` (or `evidence`) columns by header name,
 * skips non-verdict tables, and computes verdict validity across all claim rows.
 *
 * @param {string} text
 */
export function parseReceiptContent(text) {
  const blocks = extractTableBlocks(text);
  const rows = [];
  const bad = [];
  let hasVerdictTable = false;

  for (const block of blocks) {
    if (!block.length) continue;

    let cIdx = -1;
    let vIdx = -1;
    let sIdx = -1;
    let dataRows = [];

    if (isHeaderlessLegacyBlock(block)) {
      hasVerdictTable = true;
      cIdx = 1;
      vIdx = 2;
      sIdx = 3;
      dataRows = block;
    } else {
      const header = splitCells(block[0]).map((c) => c.toLowerCase());
      vIdx = header.findIndex((c) => c.includes('verdict'));
      if (vIdx === -1) continue; // Non-verdict table (e.g. store info / metadata) — skip
      hasVerdictTable = true;
      cIdx = header.findIndex((c) => c.includes('claim'));
      sIdx = header.findIndex((c) => c.includes('source') || c.includes('evidence'));
      dataRows = block.slice(1);
    }

    for (const row of dataRows) {
      if (isSeparatorRow(row)) continue;
      const cs = splitCells(row);
      const claim =
        cIdx !== -1 && cs[cIdx] !== undefined && cs[cIdx] !== '' ? cs[cIdx] : cs[1] || cs[0] || '';
      const verdict = cs[vIdx] ?? '';
      const rawSource = sIdx !== -1 ? (cs[sIdx] ?? '') : '';
      const source = extractFirstUrl(rawSource);
      const validVerdict = validateVerdictMarker(verdict);

      if (!validVerdict) {
        bad.push(`"${claim.slice(0, 50)}" → verdict cell: "${verdict.slice(0, 40) || '(empty)'}"`);
      }

      rows.push({
        claim,
        verdict,
        rawSource,
        source,
        validVerdict,
      });
    }
  }

  const total = rows.length;
  return {
    rows,
    total,
    bad,
    hasVerdictTable,
    valid: bad.length === 0 && total > 0,
  };
}

/**
 * Convenience helper returning `{ claim, verdict, source, rawSource, validVerdict }[]`.
 * @param {string} text
 */
export function parseReceiptRows(text) {
  return parseReceiptContent(text).rows;
}

/**
 * Verifies verdicts across all claim tables in `text`.
 * @param {string} text
 */
export function verifyVerdictsContent(text) {
  const { total, bad, valid } = parseReceiptContent(text);
  return { total, bad, valid };
}
