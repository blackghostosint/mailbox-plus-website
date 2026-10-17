import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import {
  extractTableBlocks,
  isSeparatorRow,
  splitCells,
  validateVerdictMarker,
  verifyVerdictsContent,
  verifyVerdictsFile,
} from '../preflight-verify-verdicts.mjs';

describe('preflight-verify-verdicts', () => {
  describe('helper functions', () => {
    it('extractTableBlocks groups contiguous markdown table lines into blocks', () => {
      const markdown = `
# Fact Check Receipt

| Column A | Column B |
| --- | --- |
| Val A | Val B |

Some prose paragraph here.

| Header 1 | Verdict |
| --- | --- |
| Claim 1 | ✅ |
`;
      const blocks = extractTableBlocks(markdown);
      expect(blocks.length).toBe(2);
      expect(blocks[0].length).toBe(3);
      expect(blocks[1].length).toBe(3);
    });

    it('extractTableBlocks handles non-string or empty input safely', () => {
      expect(extractTableBlocks('')).toEqual([]);
      expect(extractTableBlocks(null as unknown as string)).toEqual([]);
    });

    it('isSeparatorRow correctly identifies table delimiter rows', () => {
      expect(isSeparatorRow('| --- | :---: | ---: |')).toBe(true);
      expect(isSeparatorRow('  |---|---|  ')).toBe(true);
      expect(isSeparatorRow('| Row content | Verdict |')).toBe(false);
      expect(isSeparatorRow(null as unknown as string)).toBe(false);
    });

    it('splitCells parses table row into trimmed cell strings', () => {
      expect(splitCells('| Cell 1 | Cell 2  |  Cell 3 |')).toEqual(['Cell 1', 'Cell 2', 'Cell 3']);
      expect(splitCells('|   |   |')).toEqual(['', '']);
      expect(splitCells(123 as unknown as string)).toEqual([]);
    });

    it('validateVerdictMarker accepts valid markers case-insensitively', () => {
      expect(validateVerdictMarker('✅')).toBe(true);
      expect(validateVerdictMarker('⚠️')).toBe(true);
      expect(validateVerdictMarker('owner-verified')).toBe(true);
      expect(validateVerdictMarker('OWNER-VERIFIED')).toBe(true);
      expect(validateVerdictMarker('Owner-Verified')).toBe(true);
      expect(validateVerdictMarker('✅ Softened')).toBe(true);

      expect(validateVerdictMarker('❌')).toBe(false);
      expect(validateVerdictMarker('pending')).toBe(false);
      expect(validateVerdictMarker('')).toBe(false);
      expect(validateVerdictMarker('unverified')).toBe(false);
      expect(validateVerdictMarker(undefined as unknown as string)).toBe(false);
    });
  });

  describe('verifyVerdictsContent', () => {
    it('passes for valid claim tables with ✅, ⚠️, and owner-verified markers', () => {
      const markdown = `
| Claim | Source | Verdict |
| --- | --- | --- |
| Claim 1 | Source A | ✅ |
| Claim 2 | Source B | ⚠️ |
| Claim 3 | Source C | owner-verified |
| Claim 4 | Source D | OWNER-VERIFIED |
`;
      const result = verifyVerdictsContent(markdown);
      expect(result.total).toBe(4);
      expect(result.bad.length).toBe(0);
      expect(result.valid).toBe(true);
    });

    it('flags invalid verdict markers in claim tables', () => {
      const markdown = `
| # | Claim | Verdict |
| --- | --- | --- |
| 1 | Valid claim | ✅ |
| 2 | Invalid claim | ❌ |
| 3 | Missing verdict | |
| 4 | Pending claim | pending |
`;
      const result = verifyVerdictsContent(markdown);
      expect(result.total).toBe(4);
      expect(result.bad.length).toBe(3);
      expect(result.valid).toBe(false);
      expect(result.bad[0]).toContain('Invalid claim');
      expect(result.bad[0]).toContain('❌');
      expect(result.bad[1]).toContain('Missing verdict');
      expect(result.bad[1]).toContain('(empty)');
      expect(result.bad[2]).toContain('Pending claim');
      expect(result.bad[2]).toContain('pending');
    });

    it('skips non-claim tables without a verdict header column', () => {
      const markdown = `
| Store ID | Location | Hours |
| --- | --- | --- |
| Store 101 | Main St | 9-5 |
| Store 102 | Oak Ave | 10-6 |
`;
      const result = verifyVerdictsContent(markdown);
      expect(result.total).toBe(0);
      expect(result.bad.length).toBe(0);
      expect(result.valid).toBe(false);
    });

    it('handles mixed case header titles containing "verdict"', () => {
      const markdown = `
| ID | Claim Text | VERDICT |
| --- | --- | --- |
| 1 | Claim A | ✅ |
| 2 | Claim B | ⚠️ |
`;
      const result = verifyVerdictsContent(markdown);
      expect(result.total).toBe(2);
      expect(result.bad.length).toBe(0);
      expect(result.valid).toBe(true);
    });

    it('handles malformed tables, trailing spaces, and empty row cells without throwing', () => {
      const markdown = `
| # | Claim | Verdict | Extra |
| --- | --- | --- |
| 1 | Malformed row without enough cells |
| 2 | |
| 3 | Claim with trailing spaces   | ✅    |
`;
      const result = verifyVerdictsContent(markdown);
      expect(result.total).toBe(3);
      expect(result.bad.length).toBe(2);
      expect(result.bad[0]).toContain('Malformed row without enough cells');
      expect(result.bad[1]).toContain('(empty)');
    });
  });

  describe('verifyVerdictsFile', () => {
    const tmpDir = path.resolve(process.cwd(), '../scripts/__test_verdicts_tmp__');

    it('verifies existing receipt files on disk', () => {
      fs.mkdirSync(tmpDir, { recursive: true });
      const testFile = path.join(tmpDir, 'sample.factcheck.md');
      const content = `
| ID | Claim | Verdict |
| --- | --- | --- |
| 1 | Test claim | ✅ |
`;
      fs.writeFileSync(testFile, content, 'utf8');

      try {
        const result = verifyVerdictsFile(testFile);
        expect(result.skipped).toBe(false);
        expect(result.total).toBe(1);
        expect(result.bad.length).toBe(0);
        expect(result.valid).toBe(true);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('handles missing files gracefully without throwing unhandled errors', () => {
      const missingPath = path.join(tmpDir, 'does-not-exist.factcheck.md');
      const result = verifyVerdictsFile(missingPath);
      expect(result.skipped).toBe(true);
      expect(result.reason).toBe('file_not_found');
      expect(result.total).toBe(0);
      expect(result.bad.length).toBe(0);
      expect(result.valid).toBe(false);
    });
  });
});
