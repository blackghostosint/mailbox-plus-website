import { describe, it, expect } from 'vitest';
import { ensureAuthorshipStamp, parseArgs, prepareAndValidatePRBody } from '../open-article-pr.mjs';
import { IN_HOUSE_STAMP } from '../verify/check-article-ownership.mjs';

describe('open-article-pr', () => {
  it('auto-injects the in-house authorship stamp when touching content/articles/', () => {
    const out = ensureAuthorshipStamp('## Summary\nTest PR', [
      'content/articles/pack-ship/example.md',
    ]);
    expect(out).toContain(IN_HOUSE_STAMP);
  });

  it('does not duplicate the authorship stamp if already present', () => {
    const body = `## Summary\nTest PR\n\n${IN_HOUSE_STAMP}\n`;
    const out = ensureAuthorshipStamp(body, ['content/articles/pack-ship/example.md']);
    expect(out.split(IN_HOUSE_STAMP).length - 1).toBe(1);
  });

  it('does not inject the authorship stamp when no article files are touched', () => {
    const body = '## Summary\nInfra tweak';
    const out = ensureAuthorshipStamp(body, ['scripts/open-article-pr.mjs']);
    expect(out).toBe(body);
  });

  it('passes all gates on a non-article PR without needing article sections', () => {
    const res = prepareAndValidatePRBody({
      body: '## Summary\nTooling update.',
      changedFiles: ['scripts/open-article-pr.mjs'],
    });
    expect(res.success).toBe(true);
  });

  it('fails closed when an article PR is missing required Rule-6 paperwork', () => {
    const res = prepareAndValidatePRBody({
      body: '## Summary\nUpdated article with no paperwork.',
      changedFiles: ['content/articles/pack-ship/compare-shipping-rates-ups-fedex-usps-dhl.md'],
    });
    expect(res.success).toBe(false);
    const ownership = res.results.find((r) => r.gate === 'check-article-ownership');
    expect(ownership?.success).toBe(true);
  });

  it('parses CLI flags cleanly with draft default', () => {
    const opts = parseArgs(['--title', 'Test', '--body-file', 'body.md', '--dry-run']);
    expect(opts.title).toBe('Test');
    expect(opts.bodyFile).toBe('body.md');
    expect(opts.draft).toBe(true);
    expect(opts.dryRun).toBe(true);

    const ready = parseArgs(['--title', 'Test', '--body', 'hi', '--ready']);
    expect(ready.draft).toBe(false);
  });
});
