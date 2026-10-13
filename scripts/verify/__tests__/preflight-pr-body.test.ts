import { describe, it, expect } from 'vitest';
import { validatePRBody } from '../preflight-pr-body.mjs';

describe('preflight-pr-body', () => {
  it('passes on non-article, non-function files with minimal body', () => {
    const res = validatePRBody({
      body: '## What this changes\n\nDocs update only.',
      changedFiles: ['docs/README.md', 'astro/src/components/Header.astro'],
      author: 'blackghostosint',
      isLocal: true,
    });
    expect(res.success).toBe(true);
    expect(res.results.every((r) => r.success)).toBe(true);
  });

  it('fails if netlify/functions changed and Auth Model is missing', () => {
    const res = validatePRBody({
      body: '## What this changes\n\nFix function bug.',
      changedFiles: ['netlify/functions/send-email.ts'],
      author: 'blackghostosint',
      isLocal: true,
    });
    expect(res.success).toBe(false);
    const authGate = res.results.find((r) => r.gate === 'check-auth-model');
    expect(authGate?.success).toBe(false);
  });

  it('passes if netlify/functions changed and Auth Model is present', () => {
    const longAuthSection = `## Endpoint Authentication Models\n\n- **send-email** — caller must present a valid reCAPTCHA token verified server-side, plus per-IP rate limiting of 5/min.`;
    const res = validatePRBody({
      body: `## What this changes\n\nFix function bug.\n\n${longAuthSection}`,
      changedFiles: ['netlify/functions/send-email.ts'],
      author: 'blackghostosint',
      isLocal: true,
    });
    expect(res.success).toBe(true);
  });

  it('fails if content/articles changed and authorship stamp is missing', () => {
    const res = validatePRBody({
      body: '## What this changes\n\nNew article.',
      changedFiles: ['content/articles/pack-ship/test.md'],
      author: 'blackghostosint',
      isLocal: false,
    });
    expect(res.success).toBe(false);
    const ownerGate = res.results.find((r) => r.gate === 'check-article-ownership');
    expect(ownerGate?.success).toBe(false);
  });

  it('passes if content/articles changed and authorship stamp is present', () => {
    const res = validatePRBody({
      body: '## What this changes\n\nNew article.\n\nauthorship: article-writer-bot (in-house)',
      changedFiles: ['content/articles/pack-ship/test.md'],
      author: 'blackghostosint',
      isLocal: false,
    });
    expect(res.success).toBe(true);
  });
});
