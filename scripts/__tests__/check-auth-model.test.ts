import { describe, it, expect } from 'vitest';
import { checkAuthModel } from '../check-auth-model.mjs';

describe('check-auth-model', () => {
  it('passes when netlify/functions/ files are not changed', () => {
    const result = checkAuthModel({
      body: 'Some PR body text',
      changedFiles: ['astro/src/components/Header.astro', 'docs/README.md'],
    });

    expect(result.success).toBe(true);
    expect(result.functionsTouched).toBe(false);
  });

  it('rejects when netlify/functions/ files are changed but Endpoint Authentication Models section is missing', () => {
    const result = checkAuthModel({
      body: 'This PR fixes a bug in the endpoint.\n\n## Summary\nUpdated function logic.',
      changedFiles: ['netlify/functions/quote-calculator.ts'],
    });

    expect(result.success).toBe(false);
    expect(result.functionsTouched).toBe(true);
    expect(result.reason).toBe('missing_section');
  });

  it('rejects when Endpoint Authentication Models section content length is under 120 characters', () => {
    const result = checkAuthModel({
      body: '## Endpoint Authentication Models\n\nCalls public API.',
      changedFiles: ['netlify/functions/quote-calculator.ts'],
    });

    expect(result.success).toBe(false);
    expect(result.functionsTouched).toBe(true);
    expect(result.reason).toBe('hollow_section');
    expect(result.contentLength).toBeLessThan(120);
  });

  it('accepts when Endpoint Authentication Models section content length is 120 characters or greater', () => {
    const validSectionBody = `
## Endpoint Authentication Models

This PR updates the quote calculator endpoint.
- Caller identity: Proven via JWT bearer token in Authorization header.
- Endpoint permissions: Public read access for rates endpoint, authenticated write access.
- Rate limiting: Standard 100 requests per minute IP-based throttling applied at edge router.
`;
    const result = checkAuthModel({
      body: validSectionBody,
      changedFiles: ['netlify/functions/quote-calculator.ts'],
    });

    expect(result.success).toBe(true);
    expect(result.functionsTouched).toBe(true);
    expect(result.contentLength).toBeGreaterThanOrEqual(120);
  });

  it('completely strips HTML angle brackets (< and >) from PR body text', () => {
    const htmlInjectedBody = `
## Endpoint Authentication Models

<script>alert("xss")</script>
This PR updates the payment endpoint.
- Identity: Proven via API key header <span class="badge">Secret</span>.
- Rate limit: 60 requests/minute enforced by edge proxy.
- Security audit: Validated with zero HTML injection vulnerabilities permitted.
`;
    const result = checkAuthModel({
      body: htmlInjectedBody,
      changedFiles: ['netlify/functions/payment.ts'],
    });

    expect(result.sanitizedContent).not.toContain('<');
    expect(result.sanitizedContent).not.toContain('>');
    expect(result.sanitizedContent).toContain('scriptalert("xss")/script');
  });
});
