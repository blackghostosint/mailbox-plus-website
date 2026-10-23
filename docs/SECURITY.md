# Security Runbook — Mailbox Plus Website

**Stack:** React 19 + TypeScript + Vite 7 → Netlify (CDN + Functions)
**Threat model:** Small business website — defacement, spam, data breach, supply chain
**Last updated:** 2026-05-31

---

## 1. Security Posture Summary

### What's already protected ✅

| Control                | Implementation                                                                  | Location                                                          |
| ---------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| CSP Headers            | Strict policy without unsafe-inline script-src                                  | `netlify.toml:84-95`                                              |
| HSTS                   | 1 year, includeSubDomains                                                       | `netlify.toml:83`                                                 |
| X-Frame-Options        | DENY (clickjacking)                                                             | `netlify.toml:79`                                                 |
| X-Content-Type-Options | nosniff                                                                         | `netlify.toml:80`                                                 |
| Referrer-Policy        | strict-origin-when-cross-origin                                                 | `netlify.toml:81`                                                 |
| Permissions-Policy     | camera/mic/geo disabled                                                         | `netlify.toml:82`                                                 |
| Rate Limiting          | Function-level sliding window rate limiting via Netlify Blobs & memory fallback | `netlify/functions/lib/rate-limiter.ts`                           |
| Error tracking         | Sentry with PII scrubbing                                                       | `astro/src/lib/dom-error.ts`                                      |
| Input sanitization     | reCAPTCHA on forms                                                              | `astro/src/pages/contact-us.astro`                                |
| Dependency scanning    | `npm audit` in CI                                                               | GitHub Actions                                                    |
| Secret Scanning        | Gitleaks local pre-commit hook & CI scanning                                    | `.gitleaks.toml`, `.husky/pre-commit`, `.github/workflows/ci.yml` |
| Branch protection      | Required reviews, CI checks                                                     | GitHub settings                                                   |
| No PII in logs         | Sanitizing logger with PII redaction                                            | `netlify/functions/lib/logger.ts`                                 |
| Env var isolation      | `.env` gitignored, Netlify injected                                             | `.env.example`                                                    |

### Known gaps ⚠️

| Risk                                         | Severity | Mitigation needed                   |
| -------------------------------------------- | -------- | ----------------------------------- |
| No dependency auto-update (Dependabot)       | Low      | Enable in GitHub settings           |
| No third-party SAST/container scanner        | Low      | Add Snyk/Trivy step                 |
| R2 bucket is public (intentional for images) | Low      | Monitor for unusual access patterns |
| No WAF (Netlify doesn't offer one)           | Low      | CSP + headers provide baseline      |

---

## 2. Incident Response

### 2.1 Website defacement / unauthorized change

```bash
# 1. Identify the issue
git log --oneline -10 --all
git diff HEAD~1  # check last commit

# 2. Rollback to last known good deploy
# In Netlify dashboard: Deploys → select previous deploy → "Publish deploy"

# 3. If GitHub is compromised
# Revoke all sessions: GitHub → Settings → Sessions → Revoke all
# Rotate deploy keys and tokens

# 4. Verify integrity
npm run build
npm test
npx playwright test

# 5. Rotate all secrets (see Section 4)
```

### 2.2 Suspicious activity (Sentry alerts)

1. Check Sentry dashboard for error patterns
2. Cross-reference with Netlify access logs
3. If credential leak suspected → rotate immediately (Section 4)
4. If XSS attempt → review CSP reports at `/csp-report` endpoint

### 2.3 Dependency vulnerability (npm audit / Dependabot)

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (patch versions only)
npm audit fix

# For breaking changes, review manually
npm audit --json | python3 -c "
import sys, json
data = json.load(sys.stdin)
for v in data.get('vulnerabilities', {}).values():
    if v['severity'] in ('high', 'critical'):
        print(f\"{v['name']}: {v['severity']} — {v.get('via', [{}])[0].get('title', 'N/A')}\")
"
```

---

## 3. Security Checklist (Run monthly)

### Code & Dependencies

- [ ] Run `npm audit` and review high/critical findings
- [ ] Review `npm outdated` for stale dependencies
- [ ] Audit Gitleaks rules and allowlists in `.gitleaks.toml` for stale or overly broad patterns
- [ ] Verify no `.env` files are committed: `git status --ignored | grep .env`
- [ ] Check for new GitHub security alerts on the repository

### Headers & Configuration

- [ ] Verify CSP is working: check browser console for violations
- [ ] Test HSTS: `curl -I https://mailboxplusohio.com | grep -i strict-transport`
- [ ] Verify X-Frame-Options: `curl -I https://mailboxplusohio.com | grep -i x-frame`

```bash
# Quick header check
curl -sI https://mailboxplusohio.com | grep -iE "content-security|x-frame|x-content-type|strict-transport|referrer-policy|permissions-policy"
```

### Access Control

- [ ] Verify only authorized users have GitHub write access
- [ ] Check Netlify deploy logs for unauthorized deploys
- [ ] Review Sentry error volume for anomalies

---

## 4. Secret Rotation Guide

### When to rotate

- Suspected breach or credential leak
- Developer leaves the project
- Every 90 days (calendar reminder recommended)
- After any accidental commit of secrets

### What to rotate

| Secret / Variable              | Where to update                                                                     | Impact                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `VITE_R2_PUBLIC_BASE_URL`      | Netlify dashboard → Environment variables                                           | Image URLs break                                               |
| `VITE_GOOGLE_MAPS_KEY`         | Netlify dashboard → Environment variables                                           | Google Maps embed fails to render                              |
| `VITE_RECAPTCHA_SITE_KEY`      | Netlify dashboard → Environment variables                                           | Contact form reCAPTCHA widget fails                            |
| `RECAPTCHA_SITE_KEY`           | Netlify dashboard → Environment variables                                           | Form reCAPTCHA widget fails                                    |
| `VITE_NETLIFY_CONTEXT`         | Netlify dashboard → Environment variables                                           | Client build context mismatch                                  |
| `VITE_SENTRY_DSN`              | Netlify + `.env` local                                                              | Error tracking stops                                           |
| `VITE_SENTRY_ENVIRONMENT`      | Netlify dashboard → Environment variables                                           | Error tracking environment miscategorized                      |
| `NETLIFY_SITE_ID`              | Netlify dashboard → Environment variables                                           | Netlify Blobs rate limiting & caching fail                     |
| `NETLIFY_AUTH_TOKEN`           | Netlify dashboard → Environment variables                                           | Netlify Blobs API access fails                                 |
| `GOOGLE_PLACES_API_KEY`        | Netlify dashboard → Environment variables                                           | Live Google business reviews sync fails                        |
| `RECAPTCHA_SECRET_KEY`         | Netlify dashboard → Environment variables                                           | Contact form verification fails                                |
| `RECAPTCHA_ENTERPRISE_PROJECT` | Netlify dashboard → Environment variables                                           | Checkout/contact verification falls back to classic siteverify |
| `RECAPTCHA_ENTERPRISE_KEY_ID`  | Netlify dashboard → Environment variables                                           | Checkout/contact verification falls back to classic siteverify |
| `RECAPTCHA_SA_JSON_B64`        | Netlify dashboard → Environment variables (base64 SA JSON, production context only) | Checkout/contact verification falls back to classic siteverify |
| `RECAPTCHA_MIN_SCORE`          | Netlify dashboard → Environment variables                                           | reCAPTCHA spam threshold misconfigured                         |
| `RESEND_API_KEY`               | Netlify dashboard → Environment variables                                           | Contact form emails fail to send                               |
| `CONTACT_EMAIL`                | Netlify dashboard → Environment variables                                           | Contact form submissions route to wrong email                  |
| `STRIPE_SECRET_KEY`            | Netlify dashboard → Environment variables                                           | Mailbox checkout sessions fail                                 |
| `SITE_URL`                     | Netlify dashboard → Environment variables                                           | Site redirects & CORS origin checks fail                       |
| `CONTEXT`                      | Netlify dashboard → Environment variables                                           | Function context misconfigured                                 |
| `GEMINI_API_KEY`               | Netlify + `.env` local                                                              | Test scripts & embeddings generation fail                      |
| `GEMINI_TIMEOUT_SECONDS`       | Netlify + `.env` local                                                              | Gemini API request timeout threshold changes                   |
| `OPENROUTER_API_KEY`           | `.env` local / CI secrets                                                           | LLM article copy review checks fail                            |
| `MODEL_API_KEY`                | `.env` local / CI secrets                                                           | LLM model copy review checks fail                              |
| `AUDIT_BASE_URL`               | `.env` local                                                                        | Accessibility audit target URL changes                         |
| `BASE_URL`                     | `.env` local                                                                        | Accessibility audit fallback URL changes                       |
| `DIST_DIR`                     | `.env` local                                                                        | Distribution output directory path resolution moves            |
| `R2_PUBLIC_BASE`               | `.env` local                                                                        | CDN image verification checks fail                             |
| `ARTICLE_DRAFTS_DIR`           | `.env` local                                                                        | Fact-check receipt resolution path changes                     |
| `HEADING_OVERLAP_MAX`          | `.env` local                                                                        | Heading overlap gate threshold changes                         |
| Netlify deploy token           | GitHub → Settings → Secrets                                                         | CI/CD breaks                                                   |
| GitHub PAT                     | GitHub → Settings → Tokens                                                          | gh CLI breaks                                                  |

### Rotation procedure

```bash
# 1. Generate new secret at source (Google Cloud, Sentry, etc.)

# 2. Update Netlify
# Netlify dashboard → Site settings → Environment variables → Update

# 3. Redeploy
npx netlify deploy --prod
# Or push to main (auto-deploys)

# 4. Verify
curl -s https://mailboxplusohio.com | head -50  # Check site loads
npm run build && npm run test:e2e  # Verify all E2E tests pass (builds dist/ first for preview server)

# 5. Revoke old secret at source (Google Cloud, Sentry, etc.)

# 6. Update .env locally (never commit)
edit .env  # Update the local copy only
```

---

## 5. CSP Report Monitoring

Violation reports are sent to the Netlify function at `/.netlify/functions/csp-report`.

To check for violations:

```bash
# In Netlify dashboard → Functions → csp-report → Logs
# Or add Sentry logging to the CSP report function
```

Common violations to watch for:

- **Inline scripts** → Violations indicating attempted execution of inline scripts (no longer allowed under strict CSP)
- **External scripts** → Could indicate XSS injection
- **Image loads from unexpected domains** → Could indicate hotlinking or injection

---

## 6. Serverless API Authorization Policies

All serverless API handlers in `netlify/functions/` must comply with strict authorization policy and pull request disclosure rules governed by [AGENTS.md Rule 7](../AGENTS.md#7-state-the-auth-model-for-every-api-change).

### 6.1 Policy Requirements

- **Explicit Authorization Standards:** Every endpoint must define its caller access boundaries and verification mechanism. Input validation (e.g. Zod schema parsing), path existence checks, or field whitelists do NOT constitute an authorization model.
- **Mandatory PR Disclosures:** Any pull request adding or modifying files under `netlify/functions/` must include a populated `## Endpoint Authentication Models` section in the PR description (see [.github/pull_request_template.md](../.github/pull_request_template.md)).
- **Substantive Content Threshold:** The disclosure section must contain at least **120 characters** of substantive documentation explaining endpoint caller models, identity mechanisms, and rate limits.

### 6.2 Required Disclosure Fields

For every serverless function added or modified, the pull request body must detail:

1. **Caller Eligibility:** Who is authorized to call the endpoint (e.g., public unauthenticated frontend clients, verified customer sessions, edge webhooks).
2. **Identity & Verification Standard:** How caller identity or authorization is verified (e.g., reCAPTCHA v3 score verification via `RECAPTCHA_SECRET_KEY`, Stripe session lookup, or explicit unauthenticated public access).
3. **Rate Limiting & Abuse Controls:** Rate limiting strategy enforced via Netlify Blobs sliding-window storage or LRU in-memory fallback in [netlify/functions/lib/rate-limiter.ts](../netlify/functions/lib/rate-limiter.ts) (e.g., 5 requests / 10 minutes for [netlify/functions/sendEmail.ts](../netlify/functions/sendEmail.ts), 10 requests / 1 minute for [netlify/functions/create-checkout.ts](../netlify/functions/create-checkout.ts)).

### 6.3 Automated CI Enforcement & Pre-Flight Checks

- **CI Check Gate:** Pull requests touching `netlify/functions/` execute `node scripts/verify/check-auth-model.mjs` in `.github/workflows/ci.yml`. PRs lacking the `## Endpoint Authentication Models` section or containing hollow descriptions will fail CI validation.
- **Local Pre-Flight Execution:** Developers can test authorization disclosure compliance locally prior to opening PRs:

  ```bash
  npm run check:auth-model
  ```

---

## 7. Secret Scanning Guidance

Secret scanning is enforced locally via pre-commit hooks and automatically in CI via Gitleaks to prevent credential exposure in git history.

### 7.1 Configuration & Rule Definition (`.gitleaks.toml`)

- **Default Rule Inheritance:** Inherits Gitleaks' default rule set (`[extend] useDefault = true`) to catch common API keys, tokens, SSH/RSA private keys, and passwords.
- **Regex Allowlists (`regexes`):** Defines global exceptions for verified non-secret test strings, mock data, and placeholder keys:
  - Stripe test keys (`dummy_stripe_secret_key`, `sk_test_placeholder`, `sk_test_[a-zA-Z0-9_]+`, `pk_test_[a-zA-Z0-9_]+`)
  - Mock secret patterns (`sk-test-.*`, `secret_123`, `secret_[a-zA-Z0-9_]+`, `vite_secret_456`, `vite_secret_.*`, `dummy_.*`, `mock_.*`, `sk-local`)
  - Resend test keys (`test_resend_key`, `test_[a-zA-Z0-9_]+_key`)
  - Regional domain slug identifiers (`chardon-returns-r1`, `fedex-demand-surcharges-2026`, `hambden-returns-r1`, `kirtland-hills-returns-r1`, `2027-fedex-ups-surcharge-forecast`)
- **Path Allowlists (`paths`):** Excludes mock env definitions and backend test directories:
  - `\.env\.example`
  - `netlify/functions/__tests__/`
  - `netlify/functions/lib/` (matching backend test files)

### 7.2 Pre-commit Triggers & Local Setup

- **Pre-commit Hook:** Configured in `.husky/pre-commit` to execute `gitleaks protect --staged --no-banner --redact`.
- **Local CLI Installation:**
  - macOS: `brew install gitleaks`
  - Linux/WSL: Download from [Gitleaks Releases](https://github.com/gitleaks/gitleaks/releases) or `go install github.com/gitleaks/gitleaks/v8@latest`
- **Fallback Behavior:** If Gitleaks is not installed locally, the pre-commit hook logs a warning and allows the commit, relying on the mandatory `secret-scanning` job in `.github/workflows/ci.yml` (`gitleaks-action` v2) as a CI gate.
- **Manual Scan Commands:**

  ```bash
  # Scan staged changes prior to commit
  gitleaks protect --staged --verbose

  # Scan repository history locally
  gitleaks detect --source . --verbose
  ```

### 7.3 Remediation & False Positives

When Gitleaks flags a potential match:

1. **Verify Nature of Match:** Confirm whether the flagged string is a real credential or a harmless mock/test placeholder.
2. **For False Positives / Test Fixtures:**
   - Update `.gitleaks.toml` under `[allowlist]` with a specific regex entry in `regexes` or path pattern in `paths`.
   - Run `gitleaks protect --staged --verbose` to verify the rule permits the commit.
   - Commit the updated `.gitleaks.toml`.
3. **For Real Credentials:**
   - **Do NOT** add real secrets or credentials to `.gitleaks.toml` allowlists.
   - Immediately rotate the leaked credential at the upstream provider following the [Secret Rotation Guide](#4-secret-rotation-guide).
   - Unstage or remove the commit containing the secret (`git reset HEAD~1` or history purge).
   - Distribute the replacement credentials securely via Netlify environment variables or local `.env`.

---

## 8. Secure Development Practices

### Before every deploy

```bash
npm run typecheck      # TypeScript validation
npm run lint           # ESLint
npm test               # Unit tests
npm run build          # Production build (builds dist/ static artifacts required for preview server)
npm run test:e2e       # E2E tests (launches preview server automatically serving dist/)
```

### Code review security checklist

- [ ] No hardcoded secrets or tokens
- [ ] Secret scanning checks: verify no real credentials in diff and confirm any new mock/test tokens align with `.gitleaks.toml` allowlist rules
- [ ] No `console.log` with sensitive data (stripped in prod by Vite)
- [ ] All form inputs have validation
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] New dependencies are from trusted sources
- [ ] CSP still passes after changes (check browser console)

### Dependencies

- [ ] Only install packages from npm (no git URLs)
- [ ] Pin versions in `package.json` (no `^` for security-critical packages)
- [ ] Review `npm audit` before merging PRs

---

## 9. Contact & Resources

| Resource               | URL                                                                |
| ---------------------- | ------------------------------------------------------------------ |
| Sentry dashboard       | `https://sentry.io/organizations/mailbox-plus`                     |
| Netlify dashboard      | `https://app.netlify.com/sites/mailboxplus`                        |
| GitHub security alerts | `https://github.com/blackghostosint/mailbox-plus-website/security` |
| CSP reports            | Netlify Functions → csp-report                                     |
| npm audit              | Run `npm audit` locally or check GitHub security tab               |

---

## Appendix A: Security Headers Reference

Current header values (from `netlify.toml`):

```
Content-Security-Policy: default-src 'self';
  base-uri 'self';
  script-src 'self' https://www.googletagmanager.com https://connect.facebook.net https://www.google.com https://www.gstatic.com https://news.google.com;
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  img-src 'self' https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev https://*.netlify.app https://www.facebook.com https://www.google.com https://www.googletagmanager.com https://news.google.com data:;
  connect-src 'self' https://www.google.com https://news.google.com https://mailboxplusohio.com https://*.netlify.app https://ingesteer.services-prod.nsvcs.net https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com;
  frame-src 'self' https://www.google.com https://news.google.com https://www.recaptcha.net https://app.netlify.com;
  report-uri https://mailboxplusohio.com/.netlify/functions/csp-report;
  report-to csp-endpoint;

Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Appendix B: Security Test (add to E2E suite)

```typescript
// tests/e2e/security.spec.ts — add to Playwright tests
import { test, expect } from '@playwright/test';

test.describe('Security headers', () => {
  test('CSP header is present', async ({ request }) => {
    const response = await request.get('/');
    const csp = response.headers()['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
  });

  test('HSTS header is present', async ({ request }) => {
    const response = await request.get('/');
    const hsts = response.headers()['strict-transport-security'];
    expect(hsts).toBeDefined();
    expect(hsts).toContain('max-age=31536000');
  });

  test('X-Frame-Options is DENY', async ({ request }) => {
    const response = await request.get('/');
    expect(response.headers()['x-frame-options']).toBe('DENY');
  });

  test('X-Content-Type-Options is nosniff', async ({ request }) => {
    const response = await request.get('/');
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
  });

  test('no server version headers leaked', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    expect(headers['server']).toBeUndefined();
    expect(headers['x-powered-by']).toBeUndefined();
  });
});
```
