import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  compileFactsRules,
  escapeRegExp,
  loadFactsJson,
  scanTextForFactsViolations,
  stripFrontmatter,
} from '../lib/facts-rules.mjs';
import { loadSotRules, scanTextForSotViolations } from '../check-source-of-truth.mjs';
import { makeClaimsGate } from '../claims-gate.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..');

const VALID_RECEIPT = [
  '| # | Claim | Verdict | Source |',
  '| --- | --- | --- | --- |',
  '| 1 | Placeholder verified claim $15 $25 $30 $35 $50 $1.25 30 24 | ✅ | https://example.com/source |',
].join('\n');

function runBothEvaluators(markdownContent: string) {
  const sotViolations = scanTextForSotViolations('content/articles/parity.md', markdownContent);

  const { runClaimsGate } = makeClaimsGate(fs, path);
  const results: Array<{ name: string; pass: boolean; detail: string; fix?: string }> = [];
  runClaimsGate(
    'parity',
    markdownContent,
    VALID_RECEIPT,
    (name: string, pass: boolean, detail: string, fix?: string) => {
      results.push({ name, pass: Boolean(pass), detail, fix });
    },
    () => '200',
    true,
    ROOT,
    path.join(ROOT, '.factchecks')
  );
  const claimsForbidden = results.find((r) => r.name === 'claims:forbidden-phrases');
  if (!claimsForbidden) {
    throw new Error('Expected claims:forbidden-phrases check to run');
  }

  return {
    sotPass: sotViolations.length === 0,
    sotViolations,
    claimsPass: claimsForbidden.pass,
    claimsForbidden,
  };
}

describe('facts-rules shared evaluator & parity across check-source-of-truth and claims-gate', () => {
  it('loads all 18 canonical forbidden rules from content/facts.json', () => {
    const facts = loadFactsJson(ROOT);
    const rules = loadSotRules(ROOT);
    expect(Array.isArray(facts.forbidden)).toBe(true);
    expect(facts.forbidden.length).toBe(18);
    expect(rules.length).toBe(18);
  });

  it('escapes literal RegExp characters such as $ when entry.regex is absent', () => {
    expect(escapeRegExp('$1.25/lb')).toBe('\\$1\\.25/lb');
    const rules = compileFactsRules([
      {
        id: 'literal-dollar-fallback',
        pattern: '$1.25/lb',
        context: 'none',
        reason: 'Stale per-pound price',
      },
      {
        id: 'literal-unlimited-fallback',
        pattern: '$30 per month unlimited',
        context: 'none',
        reason: 'Invented unlimited tier',
      },
      {
        id: 'literal-35-fallback',
        pattern: 'from $35/month',
        context: 'business_context',
        reason: 'Personal $35 anchor',
      },
    ]);

    const hits = scanTextForFactsViolations(
      'article.md',
      'Shredding is $1.25/lb, plans include $30 per month unlimited, and personal mailboxes start from $35/month.',
      rules
    );
    expect(hits.map((h) => h.ruleId)).toEqual([
      'literal-dollar-fallback',
      'literal-unlimited-fallback',
      'literal-35-fallback',
    ]);
  });

  it('returns identical failing verdicts across every single one of the 18 rules in content/facts.json', () => {
    const ruleSamples: Array<{ id: string; text: string }> = [
      { id: 'banned-route-306', text: 'Visit our Concord store right off Route 306 today.' },
      { id: 'banned-capital-plaza', text: 'Find us inside Capital Plaza in Concord Township.' },
      { id: 'banned-pet-supplies-plus', text: 'Park right next to Pet Supplies Plus.' },
      { id: 'banned-no-annual-contract', text: 'Rent a mailbox with no annual contract required.' },
      { id: 'banned-30-day-risk-free', text: 'Try it with our 30-day risk-free trial.' },
      { id: 'banned-24-7-access', text: 'Customers get 24/7 access to the mailbox lobby.' },
      {
        id: 'banned-personal-35-anchor',
        text: 'Personal mailbox plans are available from $35/month at the counter.',
      },
      {
        id: 'banned-pmb-suite-format',
        text: 'Format your mail as 7554 Fredle Drive, Suite 104.',
      },
      {
        id: 'banned-invented-unlimited-receiving',
        text: 'Upgrade to $30 per month unlimited package receiving.',
      },
      { id: 'banned-passport-photos', text: 'Walk in for passport photos before your trip.' },
      { id: 'banned-stale-shredding-price', text: 'Drop-off shredding is $1.25/lb.' },
      { id: 'banned-vinted-go', text: 'Bring your Vinted Go parcel to our counter.' },
      { id: 'banned-plus-points', text: 'Earn Plus Points every time you ship.' },
      { id: 'banned-everything-prints-here', text: 'Everything prints here in our back room.' },
      { id: 'banned-mail-experts', text: 'We are mail experts who handle every carrier.' },
      {
        id: 'banned-fill-forms-for-you',
        text: 'We keep the forms in stock and fill them out for you.',
      },
      {
        id: 'banned-physical-fax',
        text: 'Send pages on our physical fax machine with a printed confirmation slip.',
      },
      { id: 'banned-no-door-tag-ever', text: 'With our desk, no door tag will ever be involved.' },
    ];

    const facts = loadFactsJson(ROOT);
    expect(new Set(ruleSamples.map((s) => s.id))).toEqual(
      new Set(facts.forbidden.map((f: { id: string }) => f.id))
    );

    for (const sample of ruleSamples) {
      const md = `---\ntitle: Sample\n---\n\n${sample.text}\n`;
      const res = runBothEvaluators(md);
      expect(res.sotPass, `Expected SoT fail for ${sample.id}`).toBe(false);
      expect(res.claimsPass, `Expected claims-gate fail for ${sample.id}`).toBe(false);
      expect(res.sotViolations.some((v) => v.ruleId === sample.id)).toBe(true);
    }
  });

  it('enforces context guards (none, negation, business_context, kirtland_or_negation incl. Baldwin Rd & Baldwin Road) identically', () => {
    const passingCases = [
      // kirtland_or_negation: both Baldwin Rd and Baldwin Road, Kirtland, Chillicothe, Holden Arboretum, and negation
      'From Kirtland, take Route 306 north to Baldwin Rd and head east.',
      'From Kirtland Hills, take Route 306 past Baldwin Road toward I-90.',
      'Drive north on Chillicothe Road (Route 306) past Holden Arboretum.',
      'Mailbox Plus is not on Route 306; we are off Crile Road.',
      // negation guard
      'We do not offer 24/7 access, we do not offer passport photos, we do not accept Vinted Go, and there is no physical fax machine.',
      // business_context guard (inline and heading)
      'Commercial LLC mailbox rentals start from $35/month.',
      '## Business Mailbox Plans\nPlans start from $35/month with a real street address.',
    ];

    for (const body of passingCases) {
      const md = `---\ntitle: Allowed Context\n---\n\n${body}\n`;
      const res = runBothEvaluators(md);
      expect(res.sotPass, `Expected SoT pass for:\n${body}`).toBe(true);
      expect(res.claimsPass, `Expected claims-gate pass for:\n${body}`).toBe(true);
    }

    // `context: "none"` rules must still fail even when negated
    const nonNegatableCases = [
      'Even if we do not say no annual contract, that phrase is retired.',
      'Never quote $1.25/lb for shredding.',
      'Do not write $30 per month unlimited.',
    ];
    for (const body of nonNegatableCases) {
      const md = `---\ntitle: Non-negatable\n---\n\n${body}\n`;
      const res = runBothEvaluators(md);
      expect(res.sotPass, `Expected SoT fail for:\n${body}`).toBe(false);
      expect(res.claimsPass, `Expected claims-gate fail for:\n${body}`).toBe(false);
    }
  });

  it('strips YAML frontmatter on Markdown files in both check-source-of-truth and claims-gate while preserving body line numbers', () => {
    const cleanBodyWithFrontmatterKeywords = [
      '---',
      'title: Why People Search for 24/7 Access',
      'description: Searching for 24 hour mail service, passport photos, or Route 306 directions?',
      'keywords:',
      '  - 24/7 access',
      '  - passport photo',
      '---',
      '',
      'Mailbox Plus is in Gristmill Village next to Pub Frato, just off Crile Road.',
    ].join('\n');

    const cleanRes = runBothEvaluators(cleanBodyWithFrontmatterKeywords);
    expect(cleanRes.sotPass).toBe(true);
    expect(cleanRes.claimsPass).toBe(true);

    const stripped = stripFrontmatter(
      cleanBodyWithFrontmatterKeywords + '\nBad Capital Plaza line.'
    );
    expect(stripped.startLine).toBe(8);

    const dirtyRes = runBothEvaluators(
      cleanBodyWithFrontmatterKeywords + '\nVisit us in Capital Plaza.'
    );
    expect(dirtyRes.sotPass).toBe(false);
    expect(dirtyRes.claimsPass).toBe(false);
    expect(dirtyRes.sotViolations[0].line).toBe(10);
  });
});
