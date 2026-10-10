import { describe, it, expect } from 'vitest';
import { checkOwnerClaims } from '../check-owner-claims.mjs';

// Injectable article reader: tests never touch the real content/articles tree,
// so they cannot drift with published copy.
const mkReader = (files: Record<string, string>) => (rel: string) =>
  rel in files ? files[rel] : null;

const FM = '---\ntitle: T\nslug: s\n---\n';

const CLAIMED = `${FM}The best pack and ship counter in town. We have packed thousands of shipments.
Unlike the UPS Store, we inspect every box. We pack fragile items in-house.`;

const CLEAN = `${FM}Drop off your return at the counter. The clerk weighs it and prints the label.
Store hours are 9 to 6 weekdays. Bring the receipt and the item in its original box.`;

const LONG_LEDGER = `- "the best pack and ship counter" [superlative] — ⏳ awaiting Frank
- "packed thousands of shipments" [experience-figure] — ⚠️ softened to "packed shipments every week since 2019"
- "Unlike the UPS Store" [third-party-categorical] — ✅ approved 2026-10-09 (verified counter-observation)
- "We pack fragile items" [packing-guidance] — ✅ approved 2026-10-09`;

describe('check-owner-claims', () => {
  it('skips when no article files changed', () => {
    const r = checkOwnerClaims({
      body: 'anything',
      changedFiles: ['astro/src/pages/index.astro', 'docs/README.md'],
      readFile: mkReader({}),
    });
    expect(r.success).toBe(true);
    expect(r.applicable).toBe(false);
  });

  it('passes on claim-free article copy without requiring a section', () => {
    const files = { 'content/articles/pack-ship/clean.md': CLEAN };
    const r = checkOwnerClaims({
      body: '## Summary\nA clean article.',
      changedFiles: ['content/articles/pack-ship/clean.md'],
      readFile: mkReader(files),
    });
    expect(r.success).toBe(true);
    expect(r.applicable).toBe(true);
    expect(r.detectedCount).toBe(0);
  });

  it('fails with missing_section when claim-laden copy has no Business Claims section', () => {
    const files = { 'content/articles/pack-ship/claims.md': CLAIMED };
    const r = checkOwnerClaims({
      body: '## Summary\nNew article.\n\n## Gates\nAll green.',
      changedFiles: ['content/articles/pack-ship/claims.md'],
      readFile: mkReader(files),
    });
    expect(r.success).toBe(false);
    expect(r.reason).toBe('missing_section');
    // every Rule-3 class represented in the fixture is detected
    const cats = new Set(r.detected!.map((d) => d.category));
    expect(cats.has('superlative')).toBe(true);
    expect(cats.has('experience-figure')).toBe(true);
    expect(cats.has('third-party-categorical')).toBe(true);
    expect(cats.has('packing-guidance')).toBe(true);
  });

  it('fails with hollow_section when the section is under the char threshold', () => {
    const files = { 'content/articles/pack-ship/claims.md': CLAIMED };
    const r = checkOwnerClaims({
      body: '## Business Claims\n\nTBD',
      changedFiles: ['content/articles/pack-ship/claims.md'],
      readFile: mkReader(files),
    });
    expect(r.success).toBe(false);
    expect(r.reason).toBe('hollow_section');
  });

  it('fails with under_marked when the ledger has fewer status markers than detected claims', () => {
    const files = { 'content/articles/pack-ship/claims.md': CLAIMED };
    const r = checkOwnerClaims({
      body: `## Business Claims — Rule 3 (owner sign-off required)\n\n${'- filler line without a status marker, padded out to clear the character threshold so the hollow check passes and only the marker count fails. '.repeat(2)}\n- one real entry ⏳ awaiting Frank`,
      changedFiles: ['content/articles/pack-ship/claims.md'],
      readFile: mkReader(files),
    });
    expect(r.success).toBe(false);
    expect(r.reason).toBe('under_marked');
    expect(r.markerCount!).toBeLessThan(r.detectedCount!);
  });

  it('passes when every detected claim has a status marker in the ledger', () => {
    const files = { 'content/articles/pack-ship/claims.md': CLAIMED };
    const r = checkOwnerClaims({
      body: `## Business Claims — Rule 3 (owner sign-off required)\n\n${LONG_LEDGER}`,
      changedFiles: ['content/articles/pack-ship/claims.md'],
      readFile: mkReader(files),
    });
    expect(r.success).toBe(true);
    expect(r.markerCount!).toBeGreaterThanOrEqual(r.detectedCount!);
  });

  it('strips frontmatter so frontmatter-only words cannot trigger or mask detection', () => {
    const files = {
      'content/articles/pack-ship/fm.md': `---\ntitle: The Best Guide\n---\nThe clerk prints the label and you are done.`,
    };
    const r = checkOwnerClaims({
      body: 'no section',
      changedFiles: ['content/articles/pack-ship/fm.md'],
      readFile: mkReader(files),
    });
    // "best" appears ONLY in frontmatter -> not detected -> gate passes without a section
    expect(r.success).toBe(true);
    expect(r.detectedCount).toBe(0);
  });

  it('sanitizes angle brackets from echoed match text', () => {
    const files = {
      'content/articles/pack-ship/xss.md': `${FM}We pack <script>alert(1)</script> boxes — the best service, thousands of happy customers.`,
    };
    const r = checkOwnerClaims({
      body: 'no section',
      changedFiles: ['content/articles/pack-ship/xss.md'],
      readFile: mkReader(files),
    });
    expect(r.success).toBe(false);
    for (const d of r.detected!) {
      expect(d.match).not.toContain('<');
      expect(d.match).not.toContain('>');
    }
  });
});
