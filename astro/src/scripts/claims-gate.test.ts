import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeClaimsGate } from '../../../scripts/verify/claims-gate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');

describe('claims-gate', () => {
  const headStatus = () => '200';
  const SKIP_NETWORK = true;
  const DRAFTS_DIR = path.join(REPO_ROOT, 'content/articles');

  it('exports makeClaimsGate and creates gate runner', () => {
    const gate = makeClaimsGate(fs, path);
    expect(gate).toHaveProperty('runClaimsGate');
    expect(typeof gate.runClaimsGate).toBe('function');
  });

  describe('forbidden phrases rules', () => {
    it('detects forbidden phrases in article content', () => {
      const { runClaimsGate } = makeClaimsGate(fs, path);
      const results: Record<string, { pass: boolean; detail?: string }> = {};
      const check = (name: string, pass: boolean, detail?: string) => {
        results[name] = { pass, detail };
      };

      const content = 'Located at Capital Plaza near Pet Supplies Plus.';
      const fcText = '| 1 | Plaza location | ✅ | http://example.com |\n';

      runClaimsGate(
        'test-slug',
        content,
        fcText,
        check,
        headStatus,
        SKIP_NETWORK,
        REPO_ROOT,
        DRAFTS_DIR
      );

      expect(results['claims:forbidden-phrases'].pass).toBe(false);
      expect(results['claims:forbidden-phrases'].detail).toContain('Capital Plaza');
    });

    it('allows Route 306 when Kirtland area is mentioned in context', () => {
      const { runClaimsGate } = makeClaimsGate(fs, path);
      const results: Record<string, { pass: boolean; detail?: string }> = {};
      const check = (name: string, pass: boolean, detail?: string) => {
        results[name] = { pass, detail };
      };

      const content = 'If you are driving along Route 306 in Kirtland, turn onto Fredle Drive.';
      const fcText = '| 1 | Route 306 | ✅ | http://example.com |\n';

      runClaimsGate(
        'test-slug',
        content,
        fcText,
        check,
        headStatus,
        SKIP_NETWORK,
        REPO_ROOT,
        DRAFTS_DIR
      );

      expect(results['claims:forbidden-phrases'].pass).toBe(true);
    });
  });

  describe('notary fee rules', () => {
    it('passes when notary fee is $5', () => {
      const { runClaimsGate } = makeClaimsGate(fs, path);
      const results: Record<string, { pass: boolean; detail?: string }> = {};
      const check = (name: string, pass: boolean, detail?: string) => {
        results[name] = { pass, detail };
      };

      const content = 'In-person notarization fee is $5 per stamp.';
      const fcText = '| 1 | Notary fee $5 | ✅ | http://example.com |\n';

      runClaimsGate(
        'test-slug',
        content,
        fcText,
        check,
        headStatus,
        SKIP_NETWORK,
        REPO_ROOT,
        DRAFTS_DIR
      );

      expect(results['claims:notary-fee'].pass).toBe(true);
    });

    it('fails when notary fee is not $5', () => {
      const { runClaimsGate } = makeClaimsGate(fs, path);
      const results: Record<string, { pass: boolean; detail?: string }> = {};
      const check = (name: string, pass: boolean, detail?: string) => {
        results[name] = { pass, detail };
      };

      const content = 'In-person notarization fee is $15 per stamp.';
      const fcText = '| 1 | Notary fee $15 | ✅ | http://example.com |\n';

      runClaimsGate(
        'test-slug',
        content,
        fcText,
        check,
        headStatus,
        SKIP_NETWORK,
        REPO_ROOT,
        DRAFTS_DIR
      );

      expect(results['claims:notary-fee'].pass).toBe(false);
      expect(results['claims:notary-fee'].detail).toContain('non-canonical notary fee');
    });
  });

  describe('numeric claim receipt matching', () => {
    it('fails when no factcheck receipt is provided', () => {
      const { runClaimsGate } = makeClaimsGate(fs, path);
      const results: Record<string, { pass: boolean; detail?: string }> = {};
      const check = (name: string, pass: boolean, detail?: string) => {
        results[name] = { pass, detail };
      };

      const content = 'We process packages in 90 seconds.';

      runClaimsGate(
        'test-slug',
        content,
        null,
        check,
        headStatus,
        SKIP_NETWORK,
        REPO_ROOT,
        DRAFTS_DIR
      );

      expect(results['claims:receipt-coverage'].pass).toBe(false);
      expect(results['claims:receipt-coverage'].detail).toContain('no fact-check receipt found');
    });

    it('passes when numeric claims match receipt rows or whitelist', () => {
      const { runClaimsGate } = makeClaimsGate(fs, path);
      const results: Record<string, { pass: boolean; detail?: string }> = {};
      const check = (name: string, pass: boolean, detail?: string) => {
        results[name] = { pass, detail };
      };

      const content = 'Address is 7554 Fredle Drive. Shipping costs $25 for freight.';
      const fcText = '| 1 | Shipping costs $25 for heavy freight | ✅ | http://example.com |\n';

      runClaimsGate(
        'test-slug',
        content,
        fcText,
        check,
        headStatus,
        SKIP_NETWORK,
        REPO_ROOT,
        DRAFTS_DIR
      );

      expect(results['claims:receipt-coverage'].pass).toBe(true);
    });

    it('fails when numeric claims do not match receipt rows', () => {
      const { runClaimsGate } = makeClaimsGate(fs, path);
      const results: Record<string, { pass: boolean; detail?: string }> = {};
      const check = (name: string, pass: boolean, detail?: string) => {
        results[name] = { pass, detail };
      };

      const content = 'Special rate is $999 for overnight delivery.';
      const fcText = '| 1 | Standard shipping $20 | ✅ | http://example.com |\n';

      runClaimsGate(
        'test-slug',
        content,
        fcText,
        check,
        headStatus,
        SKIP_NETWORK,
        REPO_ROOT,
        DRAFTS_DIR
      );

      expect(results['claims:receipt-coverage'].pass).toBe(false);
      expect(results['claims:receipt-coverage'].detail).toContain('uncovered claims');
    });
  });

  describe('verdict checking', () => {
    it('passes with valid verdicts', () => {
      const { runClaimsGate } = makeClaimsGate(fs, path);
      const results: Record<string, { pass: boolean; detail?: string }> = {};
      const check = (name: string, pass: boolean, detail?: string) => {
        results[name] = { pass, detail };
      };

      const content = 'Store is open 9:00 AM.';
      const fcText =
        '| 1 | Open hours | ✅ | http://example.com |\n| 2 | Notary fee | owner-verified | http://example.com |\n';

      runClaimsGate(
        'test-slug',
        content,
        fcText,
        check,
        headStatus,
        SKIP_NETWORK,
        REPO_ROOT,
        DRAFTS_DIR
      );

      expect(results['claims:verdicts'].pass).toBe(true);
    });

    it('fails when receipt row has invalid verdict', () => {
      const { runClaimsGate } = makeClaimsGate(fs, path);
      const results: Record<string, { pass: boolean; detail?: string }> = {};
      const check = (name: string, pass: boolean, detail?: string) => {
        results[name] = { pass, detail };
      };

      const content = 'Store open hours.';
      const fcText = '| 1 | Open hours | UNVERIFIED | http://example.com |\n';

      runClaimsGate(
        'test-slug',
        content,
        fcText,
        check,
        headStatus,
        SKIP_NETWORK,
        REPO_ROOT,
        DRAFTS_DIR
      );

      expect(results['claims:verdicts'].pass).toBe(false);
      expect(results['claims:verdicts'].detail).toContain('rows without valid verdict');
    });
  });
});
