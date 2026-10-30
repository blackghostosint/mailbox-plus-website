import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import { makeSourceConstraintGate } from '../source-constraint-gate.mjs';

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
  const byName = (name: string) => results.filter((r) => r.name === name);
  const must = (name: string) => {
    const rows = byName(name);
    expect(rows.length, `expected check ${name} to run`).toBeGreaterThan(0);
    return rows;
  };
  return { results, check, byName, must };
}

// mockFs keyed by exact path — the gate asks for one sources.json path.
function createMockFs(files: Record<string, object | string>) {
  return {
    readFileSync: vi.fn().mockImplementation((p: string) => {
      const key = Object.keys(files).find((k) => String(p).endsWith(k));
      if (!key) throw new Error(`ENOENT: ${p}`);
      const v = files[key];
      return typeof v === 'string' ? v : JSON.stringify(v);
    }),
    existsSync: vi
      .fn()
      .mockImplementation((p: string) => Object.keys(files).some((k) => String(p).endsWith(k))),
  };
}

const slug = 'cheapest-mailbox-rental-options-compared';

// Sources mirror the live pricing page (private-mailbox-rental.astro):
// $15/$30 Mail Only, $25/$40 +10 Packages, ~10 minutes setup.
const goodSources = {
  source_extracts: [
    {
      label: 'pricing page',
      url: 'https://mailboxplusohio.com/private-mailbox-rental/',
      quote: 'Setup takes about 10 minutes. We handle the paperwork.',
    },
  ],
  numeric_claims: [
    { value: '$15', scope: 'Small Mail Only tier' },
    { value: '$25', scope: 'Small +10 Packages' },
    { value: '$30', scope: 'Large Mail Only tier' },
    { value: '$40', scope: 'Large +10 Packages' },
    { value: '$5', scope: 'key deposit / oversized flat fee' },
    { value: '10 packages', scope: 'monthly package allowance on +10 plans' },
    { value: '10 minutes', scope: 'setup time per pricing page' },
    { value: '5 days', scope: 'storage before $/day fee' },
    { value: '$1', scope: 'per-day storage fee' },
    { value: '20 pounds', scope: 'oversized threshold' },
    { value: '18 inches', scope: 'oversized threshold' },
  ],
  scope_rules: [
    {
      forbid: 'all four carriers[,.]?( every| all) plans?',
      reason: 'Mail Only tiers ($15/$30) do not take carrier packages — package plans only',
    },
  ],
  required_when: [
    {
      trigger: 'sign for (your |the )?deliveries',
      must_include: 'when a carrier requires',
    },
  ],
};

describe('source-constraint-gate', () => {
  describe('source:constraints — file presence', () => {
    it('fails closed when sources.json is missing', () => {
      const mockFs = createMockFs({});
      const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
      const { results, check } = createCheckCollector();
      runSourceConstraintGate(slug, 'Body.', check, '/root', '/drafts');
      const rows = results.filter((r) => r.name === 'source:constraints');
      expect(rows.length).toBe(1);
      expect(rows[0].pass).toBe(false);
      expect(rows[0].fix).toMatch(/sources\.json/);
    });

    it('fails on unparseable JSON', () => {
      const mockFs = createMockFs({ [`${slug}.sources.json`]: '{not json' });
      const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
      const { results, check } = createCheckCollector();
      runSourceConstraintGate(slug, 'Body.', check, '/root', '/drafts');
      const rows = results.filter((r) => r.name === 'source:constraints');
      expect(rows[0].pass).toBe(false);
    });
  });

  describe('source:number-coverage — the PR 898 failure class', () => {
    it('FAILS the pre-fix 898 copy: word-number "five minutes" is unregistered', () => {
      const mockFs = createMockFs({ [`${slug}.sources.json`]: goodSources });
      const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
      const { check, must } = createCheckCollector();
      // "five minutes" was the invented setup timing; source says about 10 minutes
      const preFix = "It's five minutes at our counter and you're done.";
      runSourceConstraintGate(slug, preFix, check, '/root', '/drafts');
      const rows = must('source:number-coverage');
      expect(rows[0].pass).toBe(false);
      expect(rows[0].detail).toMatch(/five/i);
    });

    it('FAILS when a digit number is missing from numeric_claims', () => {
      const mockFs = createMockFs({ [`${slug}.sources.json`]: goodSources });
      const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
      const { check, must } = createCheckCollector();
      const bad = 'Setup takes 45 minutes at the counter.';
      runSourceConstraintGate(slug, bad, check, '/root', '/drafts');
      const rows = must('source:number-coverage');
      expect(rows[0].pass).toBe(false);
      expect(rows[0].detail).toContain('45');
    });

    it('PASSES when every number (digit and word form) is registered', () => {
      const mockFs = createMockFs({ [`${slug}.sources.json`]: goodSources });
      const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
      const { check, must } = createCheckCollector();
      const good =
        'Tiers are $15, $25, $30, and $40. Setup takes about 10 minutes. Oversized starts at 18 inches or 20 pounds. Storage past 5 days costs $1 a day.';
      runSourceConstraintGate(slug, good, check, '/root', '/drafts');
      expect(must('source:number-coverage')[0].pass).toBe(true);
    });
  });

  describe('source:scope-rule — tier overreach (the PR 898 pricing contradiction)', () => {
    it('FAILS "all four carriers, every plan"', () => {
      const mockFs = createMockFs({ [`${slug}.sources.json`]: goodSources });
      const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
      const { check, must } = createCheckCollector();
      const bad = 'Carriers that can reach you: All four carriers, every plan.';
      runSourceConstraintGate(slug, bad, check, '/root', '/drafts');
      const rows = must('source:scope-rule');
      const failing = rows.filter((r) => !r.pass);
      expect(failing.length).toBeGreaterThan(0);
      expect(failing[0].detail).toMatch(/Mail Only tiers/);
    });

    it('PASSES tier-scoped phrasing', () => {
      const mockFs = createMockFs({ [`${slug}.sources.json`]: goodSources });
      const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
      const { check, must } = createCheckCollector();
      const good = 'All four carriers on package plans; Mail Only tiers receive USPS.';
      runSourceConstraintGate(slug, good, check, '/root', '/drafts');
      expect(must('source:scope-rule').every((r) => r.pass)).toBe(true);
    });
  });

  describe('source:required-qualifier — the signing-claim rule', () => {
    it('FAILS unqualified signing claim', () => {
      const mockFs = createMockFs({ [`${slug}.sources.json`]: goodSources });
      const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
      const { check, must } = createCheckCollector();
      const bad = 'We sign for your deliveries, so you never miss a drop.';
      runSourceConstraintGate(slug, bad, check, '/root', '/drafts');
      const rows = must('source:required-qualifier').filter((r) => !r.pass);
      expect(rows.length).toBeGreaterThan(0);
    });

    it('PASSES when the qualifier is present', () => {
      const mockFs = createMockFs({ [`${slug}.sources.json`]: goodSources });
      const { runSourceConstraintGate } = makeSourceConstraintGate(mockFs, path);
      const { check, must } = createCheckCollector();
      const good = 'We sign for your deliveries when a carrier requires it.';
      runSourceConstraintGate(slug, good, check, '/root', '/drafts');
      const failing = must('source:required-qualifier').filter((r) => !r.pass);
      expect(failing.length).toBe(0);
    });
  });

  describe('parseValueToken normalization', () => {
    it('normalizes currency, word numbers, and units', () => {
      const mockFs = createMockFs({});
      const { parseValueToken } = makeSourceConstraintGate(mockFs, path);
      expect(parseValueToken('$15')).toBe('$15');
      expect(parseValueToken('five')).toBe('5');
      expect(parseValueToken('10 minutes')).toBe('10 minutes');
      expect(parseValueToken('5%')).toBe('5%');
      expect(parseValueToken('tuesday')).toBeNull();
    });
  });
});
