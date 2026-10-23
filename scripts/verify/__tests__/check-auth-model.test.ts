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

  it('passes when only package/config files under netlify/functions/ are changed', () => {
    const result = checkAuthModel({
      body: 'Lockfile update PR description',
      changedFiles: [
        'package.json',
        'package-lock.json',
        'netlify/functions/package-lock.json',
        'netlify/functions/package.json',
        'netlify/functions/tsconfig.json',
      ],
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

  it('rejects when Endpoint Authentication Models section contains only HTML template comments', () => {
    const templateBody = `
## Endpoint Authentication Models (rule 7 — required if functions touched)

<!-- For EACH endpoint touched, state: who may call it, how identity is proven
     (token / session / signed request / public), and rate limiting. Example:

- **sendEmail** — caller must present a valid reCAPTCHA token, verified
  server-side (\`verifyRecaptchaToken\`), plus per-IP rate limiting (5/min).
- **csp-report** — public browser CSP sink; no caller identity; rate-limited 10/min.
-->
`;
    const result = checkAuthModel({
      body: templateBody,
      changedFiles: ['netlify/functions/sendEmail.ts'],
    });

    expect(result.success).toBe(false);
    expect(result.functionsTouched).toBe(true);
    expect(result.reason).toBe('hollow_section');
    expect(result.contentLength).toBe(0);
  });

  it('rejects when Endpoint Authentication Models heading is commented out in HTML comment', () => {
    const commentedHeadingBody = `
<!-- ## Endpoint Authentication Models
- **sendEmail** — public endpoint with reCAPTCHA verification and rate limiting.
-->
`;
    const result = checkAuthModel({
      body: commentedHeadingBody,
      changedFiles: ['netlify/functions/sendEmail.ts'],
    });

    expect(result.success).toBe(false);
    expect(result.functionsTouched).toBe(true);
    expect(result.reason).toBe('missing_section');
  });

  it('accepts PR body with template comments when substantive user text >= 120 chars is provided', () => {
    const bodyWithTemplateAndUserText = `
## Endpoint Authentication Models (rule 7 — required if functions touched)

<!-- For EACH endpoint touched, state: who may call it, how identity is proven
     (token / session / signed request / public), and rate limiting. Example:
- **sendEmail** — caller must present a valid reCAPTCHA token
-->

- **verify-session** — caller must supply valid session token in Cookie, verified against DB. Rate limit 30 req/min.
- **create-checkout** — caller must be authenticated customer session with valid cart item IDs. Rate limit 10 req/min.
`;
    const result = checkAuthModel({
      body: bodyWithTemplateAndUserText,
      changedFiles: ['netlify/functions/verify-session.ts'],
    });

    expect(result.success).toBe(true);
    expect(result.functionsTouched).toBe(true);
    expect(result.contentLength).toBeGreaterThanOrEqual(120);
    expect(result.sanitizedContent).not.toContain('sendEmail');
    expect(result.sanitizedContent).toContain('verify-session');
  });
});
