import { describe, it, expect } from 'vitest';
import { checkArticlePaperwork } from '../check-article-paperwork.mjs';
import { validatePRBody } from '../preflight-pr-body.mjs';

describe('check-article-paperwork (Rule 6)', () => {
  it('skips when no content/articles/ files are changed', () => {
    const res = checkArticlePaperwork({
      body: '## Summary\nInfra fix only.',
      changedFiles: ['scripts/verify/verify.mjs'],
    });
    expect(res.success).toBe(true);
    expect(res.reason).toBe('not_applicable');
  });

  it('skips pure article deletions when fileStatuses marks them removed', () => {
    const res = checkArticlePaperwork({
      body: '## Summary\nPrune dead article.',
      changedFiles: ['content/articles/pack-ship/old.md'],
      fileStatuses: { 'content/articles/pack-ship/old.md': 'removed' },
    });
    expect(res.success).toBe(true);
    expect(res.reason).toBe('deletions_only');

    const full = validatePRBody({
      body: '## Summary\nPrune dead article.',
      changedFiles: ['content/articles/pack-ship/old.md'],
      fileStatuses: { 'content/articles/pack-ship/old.md': 'removed' },
    });
    expect(full.success).toBe(true);
  });

  it('rejects PR #993 regression: 48/48 check count without a copy review score', () => {
    const pr993Body = [
      '## Summary',
      'Register tokens in `.factchecks/notarize-car-title-ohio.sources.json`.',
      'Verified locally: strict verify 48/48 ALL CHECKS PASSED.',
      '## Business Claims — Rule 3 (owner sign-off required)',
      'No Rule-3 business claims in this article.',
      'authorship: article-writer-bot (in-house)',
    ].join('\n');

    const res = checkArticlePaperwork({
      body: pr993Body,
      changedFiles: ['content/articles/notary/notarize-car-title-ohio.md'],
    });
    expect(res.success).toBe(false);
    expect(res.reason).toBe('missing_or_low_score');

    const full = validatePRBody({
      body: pr993Body,
      changedFiles: ['content/articles/notary/notarize-car-title-ohio.md'],
    });
    expect(full.success).toBe(false);
  });

  it('rejects missing .factchecks/ receipt reference even when score is present', () => {
    const res = checkArticlePaperwork({
      body: 'Copy review score: 86/100 PASS',
      changedFiles: ['content/articles/pack-ship/new-guide.md'],
    });
    expect(res.success).toBe(false);
    expect(res.reason).toBe('missing_receipt');
  });

  it('passes when both .factchecks/ receipt reference and passing score (>=65) are recorded', () => {
    const res = checkArticlePaperwork({
      body: [
        '- Copy review score: 80/100 PASS (deepseek/deepseek-v4.1-flash @ calibrated floor 65)',
        '- Fact-check receipt: `.factchecks/amazon-po-box-delivery.factcheck.md`',
      ].join('\n'),
      changedFiles: ['content/articles/pack-ship/amazon-po-box-delivery.md'],
    });
    expect(res.success).toBe(true);
    expect(res.score).toBe(80);
  });
});
