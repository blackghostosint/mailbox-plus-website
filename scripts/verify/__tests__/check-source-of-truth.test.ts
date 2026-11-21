import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { scanTextForSotViolations } from '../check-source-of-truth.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..');

describe('check-source-of-truth', () => {
  it('verifies docs/SOURCE_OF_TRUTH.md and content/facts.json exist and stay aligned on key facts', () => {
    const sotPath = path.join(ROOT, 'docs', 'SOURCE_OF_TRUTH.md');
    const factsPath = path.join(ROOT, 'content', 'facts.json');
    expect(existsSync(sotPath)).toBe(true);
    expect(existsSync(factsPath)).toBe(true);

    const sot = readFileSync(sotPath, 'utf8');
    const facts = JSON.parse(readFileSync(factsPath, 'utf8'));
    expect(facts.legal_name).toBe('Mailbox Plus Ohio, LLC');
    expect(sot).toContain('Mailbox Plus Ohio, LLC');
    expect(sot).toContain('Gristmill Village');
    expect(sot).toContain('$10.00/package');
  });

  it('flags banned contract, location, pricing, and capability traps', () => {
    const sample = `---
title: Test Article
---

Our Concord shop is right off Route 306 in Capital Plaza next to Pet Supplies Plus.
Sign up today with no annual contract and a 30-day risk-free guarantee!
Enjoy 24/7 access to your mailbox starting at $35/month.
Mailboxes at 7554 Fredle Drive Suite 100 include $30/mo unlimited receiving.
We also offer passport photos, shredding at $1.25/lb, Vinted Go drop-offs, and Plus Points rewards.
Everything prints here on our own equipment, and we are mail experts who keep the forms in stock and fill them out for you.
Use our physical fax machine for a printed confirmation slip — no door tag will ever be involved.
`;
    const violations = scanTextForSotViolations('content/articles/test.md', sample);
    const ids = new Set(violations.map((v) => v.ruleId));

    expect(ids.has('banned-route-306')).toBe(true);
    expect(ids.has('banned-capital-plaza')).toBe(true);
    expect(ids.has('banned-pet-supplies-plus')).toBe(true);
    expect(ids.has('banned-no-annual-contract')).toBe(true);
    expect(ids.has('banned-30-day-risk-free')).toBe(true);
    expect(ids.has('banned-24-7-access')).toBe(true);
    expect(ids.has('banned-personal-35-anchor')).toBe(true);
    expect(ids.has('banned-pmb-suite-format')).toBe(true);
    expect(ids.has('banned-invented-unlimited-receiving')).toBe(true);
    expect(ids.has('banned-passport-photos')).toBe(true);
    expect(ids.has('banned-stale-shredding-price')).toBe(true);
    expect(ids.has('banned-vinted-go')).toBe(true);
    expect(ids.has('banned-plus-points')).toBe(true);
    expect(ids.has('banned-everything-prints-here')).toBe(true);
    expect(ids.has('banned-mail-experts')).toBe(true);
    expect(ids.has('banned-fill-forms-for-you')).toBe(true);
    expect(ids.has('banned-physical-fax')).toBe(true);
    expect(ids.has('banned-no-door-tag-ever')).toBe(true);
  });

  it('allows legitimate negative-context statements, Kirtland Route 306 references, and Business $35/mo pricing', () => {
    const clean = `---
title: Clean Article
---

Find us in Gristmill Village, next to Pub Frato, just off Crile Road, minutes from SR-44 and I-90.
Driving from Kirtland along Route 306 takes about 12 minutes.
We do not offer 24/7 access, we do not offer passport photos, and there is no physical fax machine.
Personal mailboxes start at $15/month (Mail Only) or $25/month (+10 Packages), month-to-month with no term commitment.
Non-holder walk-in package receiving is $10 per package.

## Business Class Mailbox Pricing
Business mailbox plans start from $35/month for Business Small and $50/month for Business Large.
`;
    const violations = scanTextForSotViolations('content/articles/clean.md', clean);
    expect(violations).toEqual([]);
  });

  it('does not let an unrelated negation in an earlier clause mask a later violation', () => {
    const sample = `---
title: Clause Boundary Test
---

Visit us off Route 306 with no annual contract and 24/7 access.
`;
    const violations = scanTextForSotViolations('content/articles/clause.md', sample);
    const ids = new Set(violations.map((v) => v.ruleId));
    expect(ids.has('banned-route-306')).toBe(true);
    expect(ids.has('banned-no-annual-contract')).toBe(true);
    expect(ids.has('banned-24-7-access')).toBe(true);
  });
});
