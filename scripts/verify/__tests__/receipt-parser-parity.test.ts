import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  extractTableBlocks,
  parseReceiptContent,
  splitCells,
  verifyVerdictsContent,
} from '../lib/receipt-parser.mjs';
import { verifyVerdictsFile } from '../../preflight-verify-verdicts.mjs';
import { makeClaimsGate } from '../claims-gate.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..');
const FACTCHECKS_DIR = path.join(ROOT, '.factchecks');

function runClaimsVerdictGate(fcText: string, articleBody = 'Plain prose with no numbers.') {
  const { runClaimsGate } = makeClaimsGate(fs, path);
  const results: Array<{ name: string; pass: boolean; detail: string; fix?: string }> = [];
  runClaimsGate(
    'receipt-parity',
    articleBody,
    fcText,
    (name: string, pass: boolean, detail: string, fix?: string) => {
      results.push({ name, pass: Boolean(pass), detail, fix });
    },
    () => '200',
    true,
    ROOT,
    FACTCHECKS_DIR
  );
  return {
    results,
    verdictsCheck: results.find((r) => r.name === 'claims:verdicts'),
    coverageCheck: results.find((r) => r.name === 'claims:receipt-coverage'),
  };
}

describe('receipt-parser shared parser & parity across claims-gate and preflight-verify-verdicts', () => {
  it('indexes claim, verdict, and source/evidence columns by header name in any order and without row numbers', () => {
    const reorderedReceipt = [
      '| Store Metadata | Value |',
      '| --- | --- |',
      '| Address | 7554 Fredle Drive |',
      '',
      '| Verdict | Evidence URL | Claim Statement |',
      '| --- | --- | --- |',
      '| ✅ | https://usps.com/pobox | PO Box rental runs in 3, 6, or 12 month terms |',
      '| ⚠️ softened | https://example.com/setup | Setup takes 10 minutes at the counter |',
      '| owner-verified | content/facts.json | Non-holder package fee is $10 |',
    ].join('\n');

    const parsed = parseReceiptContent(reorderedReceipt);
    expect(parsed.total).toBe(3);
    expect(parsed.valid).toBe(true);
    expect(parsed.rows.map((r) => r.source)).toEqual([
      'https://usps.com/pobox',
      'https://example.com/setup',
      'content/facts.json',
    ]);

    const preflightRes = verifyVerdictsContent(reorderedReceipt);
    const { verdictsCheck, coverageCheck } = runClaimsVerdictGate(
      reorderedReceipt,
      'Setup takes 10 minutes and non-holder package fee is $10.'
    );
    expect(preflightRes.valid).toBe(true);
    expect(preflightRes.total).toBe(3);
    expect(verdictsCheck?.pass).toBe(true);
    expect(verdictsCheck?.detail).toContain('all 3 receipt rows');
    expect(coverageCheck?.pass).toBe(true);
  });

  it('ignores blank lines inside split tables while keeping distinct multi-table headers separate', () => {
    const splitAndMulti = [
      '| # | Claim | Verdict | Source |',
      '| --- | --- | --- | --- |',
      '| 1 | First claim $15 | ✅ | https://example.com/1 |',
      '',
      '| 2 | Second claim after blank line $25 | ⚠️ | https://example.com/2 |',
      '',
      '| Claim | Verdict | Evidence |',
      '| --- | --- | --- |',
      '| Third claim in second table $40 | owner-verified | https://example.com/3 |',
    ].join('\n');

    const blocks = extractTableBlocks(splitAndMulti);
    expect(blocks.length).toBe(2);

    const parsed = parseReceiptContent(splitAndMulti);
    expect(parsed.total).toBe(3);
    expect(parsed.valid).toBe(true);
  });

  it('handles escaped pipes inside cells and missing trailing pipes', () => {
    const cells = splitCells('| 1 | Plan Small \\| Mail Only | ✅ | https://example.com/plan');
    expect(cells).toEqual(['1', 'Plan Small | Mail Only', '✅', 'https://example.com/plan']);
  });

  it('fails claims:verdicts and preflight-verify-verdicts on zero claim rows or unnumbered malformed rows', () => {
    const zeroRowReceipts = [
      '# Fact-Check Receipt\n\nNo tables in this receipt at all.\n',
      '| Metadata | Notes |\n| --- | --- |\n| Author | Bot |\n',
      '| Claim | Verdict | Source |\n| --- | --- | --- |\n',
    ];

    for (const emptyReceipt of zeroRowReceipts) {
      const preflightRes = verifyVerdictsContent(emptyReceipt);
      const { verdictsCheck } = runClaimsVerdictGate(emptyReceipt);
      expect(preflightRes.total).toBe(0);
      expect(preflightRes.valid).toBe(false);
      expect(verdictsCheck?.pass).toBe(false);
      expect(verdictsCheck?.detail).toContain('no claim rows found');
    }

    const malformedUnnumbered = [
      '| Claim | Verdict | Source |',
      '| --- | --- | --- |',
      '| Valid claim | ✅ | https://example.com |',
      '| Claim missing pipe before source: ⚠️ softened https://example.com |',
      '| Claim with empty verdict | | https://example.com |',
    ].join('\n');

    const preflightMalformed = verifyVerdictsContent(malformedUnnumbered);
    const { verdictsCheck: claimsMalformed } = runClaimsVerdictGate(malformedUnnumbered);
    expect(preflightMalformed.total).toBe(3);
    expect(preflightMalformed.bad.length).toBe(2);
    expect(preflightMalformed.valid).toBe(false);
    expect(claimsMalformed?.pass).toBe(false);
  });

  it('agrees on row counts and verdicts across all .factchecks/*.factcheck.md files in the repository', () => {
    const files = fs
      .readdirSync(FACTCHECKS_DIR)
      .filter((f) => f.endsWith('.factcheck.md'))
      .sort();
    expect(files.length).toBeGreaterThanOrEqual(100);

    const byName = new Map<
      string,
      { total: number; valid: boolean; claimsPass: boolean; blocks: number }
    >();

    for (const file of files) {
      const fullPath = path.join(FACTCHECKS_DIR, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const preflightRes = verifyVerdictsFile(fullPath);
      const parsed = parseReceiptContent(raw);
      const { verdictsCheck } = runClaimsVerdictGate(raw);

      expect(preflightRes.total, `${file}: expected >0 rows`).toBeGreaterThan(0);
      expect(parsed.total, `${file}: row count parity`).toBe(preflightRes.total);
      expect(verdictsCheck?.pass, `${file}: verdict pass/fail parity`).toBe(preflightRes.valid);

      byName.set(file, {
        total: preflightRes.total,
        valid: preflightRes.valid,
        claimsPass: Boolean(verdictsCheck?.pass),
        blocks: extractTableBlocks(raw).length,
      });
    }

    // Verify normalized receipts from task requirement 12
    expect(byName.get('can-you-drop-off-ups-at-fedex-or-post-office.factcheck.md')).toMatchObject({
      total: 13,
      valid: true,
      claimsPass: true,
      blocks: 1,
    });
    expect(byName.get('notarize-car-title-ohio.factcheck.md')).toMatchObject({
      total: 13,
      valid: true,
      claimsPass: true,
      blocks: 1,
    });
    expect(byName.get('pmb-vs-po-box-comparison.factcheck.md')).toMatchObject({
      total: 13,
      valid: true,
      claimsPass: true,
      blocks: 1,
    });
    expect(byName.get('what-is-a-private-mailbox-pmb.factcheck.md')).toMatchObject({
      total: 18,
      valid: true,
      claimsPass: true,
      blocks: 1,
    });

    // Verify Rule-3 held receipts remain untouched with ❌ verdicts failing both gates
    expect(byName.get('pack-ship-painesville-city.factcheck.md')).toMatchObject({
      total: 9,
      valid: false,
      claimsPass: false,
    });
    expect(
      byName.get('ship-fragile-items-safely-artwork-electronics-glass.factcheck.md')
    ).toMatchObject({
      total: 8,
      valid: false,
      claimsPass: false,
    });
  });
});
