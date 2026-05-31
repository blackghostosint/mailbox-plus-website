# Security Runbook — Mailbox Plus Website

**Stack:** React 19 + TypeScript + Vite 7 → Netlify (CDN + Functions)
**Threat model:** Small business website — defacement, spam, data breach, supply chain
**Last updated:** 2026-05-31

---

## 1. Security Posture Summary

### What's already protected ✅

| Control                | Implementation                      | Location                     |
| ---------------------- | ----------------------------------- | ---------------------------- |
| CSP Headers            | Strict policy with report-uri       | `netlify.toml:33-43`         |
| HSTS                   | 1 year, includeSubDomains           | `netlify.toml:32`            |
| X-Frame-Options        | DENY (clickjacking)                 | `netlify.toml:28`            |
| X-Content-Type-Options | nosniff                             | `netlify.toml:29`            |
| Referrer-Policy        | strict-origin-when-cross-origin     | `netlify.toml:30`            |
| Permissions-Policy     | camera/mic/geo disabled             | `netlify.toml:31`            |
| Error tracking         | Sentry with PII scrubbing           | `src/sentry.config.ts`       |
| Input sanitization     | reCAPTCHA on forms                  | `src/pages/ContactUs.tsx`    |
| Dependency scanning    | `npm audit` in CI                   | GitHub Actions               |
| Branch protection      | Required reviews, CI checks         | GitHub settings              |
| No PII in logs         | Sentry PII scrubbing                | `src/sentry.config.ts:38-52` |
| Env var isolation      | `.env` gitignored, Netlify injected | `.env.example`               |

### Known gaps ⚠️

| Risk                                             | Severity | Mitigation needed                   |
| ------------------------------------------------ | -------- | ----------------------------------- |
| `unsafe-inline` in CSP script-src                | Medium   | Remove — use nonces/hashes for GTM  |
| No rate limiting on `/api/*` (Netlify Functions) | Medium   | Add function-level rate limiting    |
| No dependency auto-update (Dependabot)           | Low      | Enable in GitHub settings           |
| No automated security scanning in CI             | Low      | Add `npm audit` + Snyk/Trivy step   |
| R2 bucket is public (intentional for images)     | Low      | Monitor for unusual access patterns |
| No WAF (Netlify doesn't offer one)               | Low      | CSP + headers provide baseline      |

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

| Secret                    | Where to update                           | Impact                |
| ------------------------- | ----------------------------------------- | --------------------- |
| `VITE_R2_PUBLIC_BASE_URL` | Netlify dashboard → Environment variables | Image URLs break      |
| `VITE_GEMINI_API_KEY`     | Netlify + `.env` local                    | Chatbot stops working |
| `RECAPTCHA_SITE_KEY`      | Netlify dashboard                         | Contact form fails    |
| `VITE_SENTRY_DSN`         | Netlify + `.env` local                    | Error tracking stops  |
| Netlify deploy token      | GitHub → Settings → Secrets               | CI/CD breaks          |
| GitHub PAT                | GitHub → Settings → Tokens                | gh CLI breaks         |

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
npm run test:e2e  # Verify all E2E tests pass

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

- **Inline scripts** → Usually GTM/google-analytics (expected with `unsafe-inline`)
- **External scripts** → Could indicate XSS injection
- **Image loads from unexpected domains** → Could indicate hotlinking or injection

---

## 6. Secure Development Practices

### Before every deploy

```bash
npm run typecheck      # TypeScript validation
npm run lint           # ESLint
npm test               # Unit tests
npm run test:e2e       # E2E tests (requires dev server)
npm run build          # Production build verification
```

### Code review security checklist

- [ ] No hardcoded secrets or tokens
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

## 7. Contact & Resources

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
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com https://ssl.gstatic.com https://www.google-analytics.com https://www.googleapis.com https://www.gstatic.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' https://*.r2.dev https://pub-4515923f088c4228b1756250c1b20c6f.r2.dev https://*.netlify.app data:;
  connect-src 'self' https://www.google.com https://analytics.google.com https://stats.g.doubleclick.net https://mailboxplusohio.com https://*.netlify.app https://ingesteer.services-prod.nsvcs.net;
  frame-src 'self' https://www.googletagmanager.com https://www.google.com https://www.recaptcha.net https://app.netlify.com;
  report-uri https://mailboxplusohio.com/.netlify/functions/csp-report

Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Appendix B: Security Test (add to E2E suite)

```typescript
// e2e/security.spec.ts — add to Playwright tests
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
