import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import { makeClaimsGate } from '../claims-gate.js';

type CheckResult = {
  name: string;
  pass: boolean;
  detail: string;
  fix?: string;
};

function createCheckCollector() {
  const results: CheckResult[] = [];
  const check = (name: string, pass: boolean | number, detail: string, fix?: string) => {
    results.push({ name, pass: !!pass, detail, fix });
  };
  return { results, check };
}

function createMockFs(factsData: object | string | null) {
  return {
    readFileSync: vi.fn().mockImplementation((_p: string, _encoding?: string) => {
      if (factsData === null) {
        throw new Error('ENOENT: no such file or directory');
      }
      if (typeof factsData === 'string') {
        return factsData;
      }
      return JSON.stringify(factsData);
    }),
  };
}

const defaultFacts = {
  forbidden: [
    {
      pattern: 'Route 306',
      reason:
        'OH-306 (Chillicothe Rd) does not touch Fredle Drive. Valid ONLY when describing Kirtland-area streets.',
    },
    {
      pattern: 'Capital Plaza',
      reason: 'Stale/wrong plaza name. Plaza is Gristmill Village.',
    },
    {
      pattern: 'Pet Supplies Plus',
      reason: 'Wrong neighbor. Neighbor is Pub Frato.',
    },
  ],
};

const validReceiptText = `
| Row | Claim | Verdict | Source |
|---|---|---|---|
| 1 | Mailbox rental starts at $25 per month | ✅ | https://example.com/pricing |
| 2 | Store is located 10 miles from downtown | ⚠️ | https://example.com/map |
| 3 | Process takes 15 minutes | owner-verified | https://example.com/process |
| 4 | Save 50% on packing supplies | ✅ | https://example.com/discount |
`.trim();

describe('claims-gate', () => {
  describe('claims:facts-json', () => {
    it('fails when content/facts.json is missing', () => {
      const mockFs = createMockFs(null);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      runClaimsGate(
        'slug',
        'Article content',
        validReceiptText,
        check,
        vi.fn(),
        true,
        '/root',
        '/drafts'
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        name: 'claims:facts-json',
        pass: false,
        detail: 'content/facts.json missing or unparseable',
        fix: 'restore content/facts.json (canonical store facts)',
      });
    });

    it('fails when content/facts.json is unparseable JSON', () => {
      const mockFs = createMockFs('invalid json {');
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      runClaimsGate(
        'slug',
        'Article content',
        validReceiptText,
        check,
        vi.fn(),
        true,
        '/root',
        '/drafts'
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        name: 'claims:facts-json',
        pass: false,
        detail: 'content/facts.json missing or unparseable',
        fix: 'restore content/facts.json (canonical store facts)',
      });
    });

    it('passes when content/facts.json is valid', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      runClaimsGate(
        'slug',
        'Article content',
        validReceiptText,
        check,
        vi.fn(),
        true,
        '/root',
        '/drafts'
      );

      const factsCheck = results.find((r) => r.name === 'claims:facts-json');
      expect(factsCheck).toEqual({
        name: 'claims:facts-json',
        pass: true,
        detail: 'content/facts.json loaded',
      });
    });
  });

  describe('claims:forbidden-phrases', () => {
    it('passes when article content contains no forbidden phrases', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const content = 'Located in Concord Township next to Pub Frato in Gristmill Village.';
      runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

      const forbiddenCheck = results.find((r) => r.name === 'claims:forbidden-phrases');
      expect(forbiddenCheck).toEqual({
        name: 'claims:forbidden-phrases',
        pass: true,
        detail: 'no forbidden location/fact phrases',
      });
    });

    it('fails when article content contains forbidden phrases', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const content = 'Our store is located in Capital Plaza near Pet Supplies Plus.';
      runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

      const forbiddenCheck = results.find((r) => r.name === 'claims:forbidden-phrases');
      expect(forbiddenCheck?.pass).toBe(false);
      expect(forbiddenCheck?.detail).toContain('"Capital Plaza": Stale/wrong plaza name');
      expect(forbiddenCheck?.detail).toContain('"Pet Supplies Plus": Wrong neighbor');
      expect(forbiddenCheck?.fix).toBe(
        'replace with approved phrasing (see content/facts.json approved_phrasing)'
      );
    });

    it('exempts Route 306 when the line mentions a Kirtland-area landmark', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);

      const exemptLandmarks = ['Kirtland', 'Chillicothe', 'Baldwin Road', 'Holden Arboretum'];

      for (const landmark of exemptLandmarks) {
        const { results, check } = createCheckCollector();
        const content = `Directions: Take Route 306 heading south towards ${landmark}.`;
        runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

        const forbiddenCheck = results.find((r) => r.name === 'claims:forbidden-phrases');
        expect(forbiddenCheck?.pass).toBe(true);
      }
    });

    it('fails Route 306 pattern when line does not mention a Kirtland-area landmark', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const content = 'Our store is conveniently located right on Route 306 in Concord Township.';
      runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

      const forbiddenCheck = results.find((r) => r.name === 'claims:forbidden-phrases');
      expect(forbiddenCheck?.pass).toBe(false);
      expect(forbiddenCheck?.detail).toContain('"Route 306"');
    });
  });

  describe('claims:notary-fee', () => {
    it('passes when no notary fee is mentioned', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const content = 'We offer notary on duty during all open hours.';
      runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

      const notaryCheck = results.find((r) => r.name === 'claims:notary-fee');
      expect(notaryCheck).toEqual({
        name: 'claims:notary-fee',
        pass: true,
        detail: 'no notary fee mentioned',
      });
    });

    it('passes when notary fee mentions are compliant ($5 or $5.00)', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);

      const compliantContents = [
        'Notary fee is $5 per signature.',
        'Notarization costs $5 per act.',
      ];

      for (const content of compliantContents) {
        const { results, check } = createCheckCollector();
        runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

        const notaryCheck = results.find((r) => r.name === 'claims:notary-fee');
        expect(notaryCheck?.pass).toBe(true);
        expect(notaryCheck?.detail).toContain('notary fee mentions OK');
      }
    });

    it('fails when non-canonical notary fee is mentioned', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const content = 'Our notary fee is $10 per document notarization.';
      runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

      const notaryCheck = results.find((r) => r.name === 'claims:notary-fee');
      expect(notaryCheck?.pass).toBe(false);
      expect(notaryCheck?.detail).toContain('non-canonical notary fee: "notary fee is $10"');
      expect(notaryCheck?.fix).toBe('Ohio caps in-person notarial acts at $5 — fix the amount');
    });
  });

  describe('claims:receipt-coverage', () => {
    it('fails when fact-check receipt is missing (null or empty)', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      runClaimsGate('slug', 'Some article content', null, check, vi.fn(), true, '/root', '/drafts');

      const receiptCheck = results.find((r) => r.name === 'claims:receipt-coverage');
      expect(receiptCheck).toEqual({
        name: 'claims:receipt-coverage',
        pass: false,
        detail: 'no fact-check receipt found',
        fix: 'run the Fact-Check Gate first (gates:factcheck)',
      });
    });

    it('passes when all numeric claims (price, distance, time, percentage) are covered by receipt', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const content =
        'Mailbox rental is $25. Drive 10 miles. Takes 15 minutes. Save 50% on packing.';
      runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

      const receiptCheck = results.find((r) => r.name === 'claims:receipt-coverage');
      expect(receiptCheck?.pass).toBe(true);
      expect(receiptCheck?.detail).toContain('numeric claims all covered by receipt');
    });

    it('ignores whitelisted values such as addresses, zip codes, route numbers, and $5', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const content =
        'Address: 7554 Fredle Dr, Concord 44077. Call 440-709-1946. Hours: 9:00 AM to 6:00 PM. Notary $5. Shredding $1. Live Scan BCI FBI Route 2 I-90.';
      runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

      const receiptCheck = results.find((r) => r.name === 'claims:receipt-coverage');
      expect(receiptCheck?.pass).toBe(true);
    });

    it('fails when there are uncovered numeric claims in the content', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const content = 'We offer specialty box rentals for $99.99.';
      runClaimsGate('slug', content, validReceiptText, check, vi.fn(), true, '/root', '/drafts');

      const receiptCheck = results.find((r) => r.name === 'claims:receipt-coverage');
      expect(receiptCheck?.pass).toBe(false);
      expect(receiptCheck?.detail).toContain('uncovered claims: "$99.99"');
      expect(receiptCheck?.fix).toBe(
        'add each claim to /drafts/slug.factcheck.md with a source URL, or remove the claim'
      );
    });
  });

  describe('claims:sources-resolve', () => {
    it('skips network resolution checks when SKIP_NETWORK is true', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();
      const mockHeadStatus = vi.fn();

      runClaimsGate(
        'slug',
        'Article content',
        validReceiptText,
        check,
        mockHeadStatus,
        true,
        '/root',
        '/drafts'
      );

      expect(mockHeadStatus).not.toHaveBeenCalled();
      const sourcesCheck = results.find((r) => r.name === 'claims:sources-resolve');
      expect(sourcesCheck).toBeUndefined();
    });

    it('passes when all receipt source URLs resolve with valid HTTP status codes', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const mockHeadStatus = vi.fn().mockImplementation((url: string) => {
        if (url.includes('pricing')) return '200';
        if (url.includes('map')) return '301';
        if (url.includes('process')) return '206';
        if (url.includes('discount')) return '403';
        return '200';
      });

      runClaimsGate(
        'slug',
        'Article content',
        validReceiptText,
        check,
        mockHeadStatus,
        false,
        '/root',
        '/drafts'
      );

      const sourcesCheck = results.find((r) => r.name === 'claims:sources-resolve');
      expect(sourcesCheck).toEqual({
        name: 'claims:sources-resolve',
        pass: true,
        detail: '4 source URLs resolve',
      });
      expect(mockHeadStatus).toHaveBeenCalledTimes(4);
    });

    it('fails when any receipt source URL returns an unreachable status code', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const mockHeadStatus = vi.fn().mockImplementation((url: string) => {
        if (url.includes('discount')) return '404';
        return '200';
      });

      runClaimsGate(
        'slug',
        'Article content',
        validReceiptText,
        check,
        mockHeadStatus,
        false,
        '/root',
        '/drafts'
      );

      const sourcesCheck = results.find((r) => r.name === 'claims:sources-resolve');
      expect(sourcesCheck?.pass).toBe(false);
      expect(sourcesCheck?.detail).toContain(
        'unreachable sources: https://example.com/discount → 404'
      );
      expect(sourcesCheck?.fix).toBe('fix or replace dead source URLs in the factcheck receipt');
    });
  });

  describe('claims:verdicts', () => {
    it('passes when all receipt rows carry valid verdicts (✅, ⚠️, owner-verified)', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      runClaimsGate(
        'slug',
        'Article content',
        validReceiptText,
        check,
        vi.fn(),
        true,
        '/root',
        '/drafts'
      );

      const verdictCheck = results.find((r) => r.name === 'claims:verdicts');
      expect(verdictCheck).toEqual({
        name: 'claims:verdicts',
        pass: true,
        detail: 'all 4 receipt rows carry ✅/⚠️/owner-verified verdicts',
      });
    });

    it('fails when receipt rows contain invalid verdict markers', () => {
      const mockFs = createMockFs(defaultFacts);
      const { runClaimsGate } = makeClaimsGate(mockFs, path);
      const { results, check } = createCheckCollector();

      const receiptWithBadVerdict = `
| Row | Claim | Verdict | Source |
|---|---|---|---|
| 1 | Mailbox rental starts at $25 per month | ❌ | https://example.com/pricing |
`.trim();

      runClaimsGate(
        'slug',
        'Article content',
        receiptWithBadVerdict,
        check,
        vi.fn(),
        true,
        '/root',
        '/drafts'
      );

      const verdictCheck = results.find((r) => r.name === 'claims:verdicts');
      expect(verdictCheck?.pass).toBe(false);
      expect(verdictCheck?.detail).toContain(
        'rows without valid verdict: Mailbox rental starts at $25 per month'
      );
      expect(verdictCheck?.fix).toBe(
        'mark each receipt row ✅ (verified), ⚠️ (softened), or owner-verified'
      );
    });
  });
});
