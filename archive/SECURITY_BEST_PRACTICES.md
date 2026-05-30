# Security Best Practices - Mailbox Plus Website

## Security Audit Summary

**Date:** May 29, 2026  
**Branch:** security/best-practices  
**Auditor:** Security Review

## Current Security Status

### 1. Content Security Policy (CSP) - **MISSING**

**Status:** No CSP configured  
**Location checked:**

- `netlify.toml` - No CSP header
- `index.html` - No CSP meta tag

**Risk:** High - The site is vulnerable to XSS attacks, clickjacking, and other code injection attacks.

**Recommendation:** Implement CSP headers via Netlify configuration:

```toml
# Add to netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev data:;
      connect-src 'self' https://www.google.com https://api.resend.com;
      frame-src 'self' https://www.googletagmanager.com;
    """
```

**Note:** The `'unsafe-inline'` directive is currently required due to:

- Google Tag Manager usage
- Inline styles from dynamic HTML content in configuration files
- Vite dev server requirements

**Future improvement:** Move to nonce-based or hash-based CSP once inline scripts/styles are eliminated.

---

### 2. Dependency Vulnerabilities - **LOW RISK**

**Status:** 8 vulnerabilities found (6 low, 2 moderate)  
**Reference:** See `SECURITY.md` for detailed audit

**Findings:**

- All vulnerabilities are in **dev dependencies only**
- No production runtime code is affected
- Main vulnerable packages: `elliptic`, `esbuild`, `browserify-sign`

**Risk Assessment:** Low - Vulnerabilities only affect build tools, not production bundles.

**Recommendations:**

1. Monitor for non-breaking updates to Vite 5.x
2. Plan upgrade to Vite 8+ in a future major version update
3. Consider using `npm audit --omit=dev` in CI/CD to focus on production vulnerabilities

---

### 3. Environment Variables - **PROPERLY SECURED**

**Status:** ✅ Properly configured

**Findings:**

- `.gitignore` correctly excludes `.env` files (line 23)
- No `.env` files found in repository
- No secrets committed to git history
- Netlify functions properly use `process.env`:
  - `RESEND_API_KEY` in `netlify/functions/sendEmail.js`
  - `VITE_RECAPTCHA_SECRET_KEY` in `netlify/functions/verifyRecaptcha.js`
- Client-side env vars properly prefixed with `VITE_` (Vite convention)

**Recommendation:** Continue current practice - no changes needed.

---

### 4. Netlify Security Headers - **MISSING**

**Status:** No security headers configured  
**Location:** `netlify.toml`

**Current configuration:**

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  included_files = [
    "knowledge/kb.entries.json",
    "knowledge/embeddings.json"
  ]

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

**Missing security headers:**

- `X-Frame-Options` (clickjacking protection)
- `X-Content-Type-Options` (MIME sniffing protection)
- `Referrer-Policy` (referrer leakage protection)
- `Permissions-Policy` (browser feature control)
- `Strict-Transport-Security` (HSTS - force HTTPS)

**Recommendation:** Add security headers to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = """..."""  # See CSP section above
```

---

### 5. Additional Security Findings

#### 5.1 Google Tag Manager

- **Status:** Present in `index.html` (GTM-M48D4D56)
- **Risk:** Low - GTM requires careful management of tags
- **Recommendation:** Regularly audit GTM tags to ensure no malicious scripts are injected

#### 5.2 reCAPTCHA Implementation

- **Status:** ✅ Properly implemented
- Server-side verification in `netlify/functions/verifyRecaptcha.js`
- Secret key stored in environment variable
- **Recommendation:** Continue current practice

#### 5.3 External Resources

- **Fonts:** Loaded from fonts.googleapis.com (legitimate CDN)
- **Images:** Loaded from Cloudflare R2 (pub-21518ce3034449a3a7b5a0b89551f710.r2.dev)
- **Risk:** Low - using reputable CDNs
- **Recommendation:** Consider self-hosting critical fonts to reduce external dependencies

#### 5.4 API Endpoints

- Contact form: `/.netlify/functions/sendEmail`
- reCAPTCHA verification: `/.netlify/functions/verifyRecaptcha`
- **Status:** ✅ Server-side only, no exposed API keys

---

## Implementation Priority

### High Priority (Implement Immediately)

1. **Add security headers to `netlify.toml`** - Protects against clickjacking, MIME sniffing, and other attacks
2. **Implement Content Security Policy** - Critical XSS protection

### Medium Priority (Implement Soon)

3. **Add HSTS header** - Force HTTPS and prevent downgrade attacks
4. **Set Referrer-Policy** - Control referrer information leakage

### Low Priority (Future Improvements)

5. **Upgrade Vite** to version 8+ to resolve build tool vulnerabilities
6. **Self-host Google Fonts** - Reduce dependency on external CDNs
7. **Implement nonce-based CSP** - Eliminate `unsafe-inline` directives

---

## Verification Steps

After implementing recommendations, verify with:

```bash
# Check security headers
curl -I https://your-site.netlify.app

# Validate CSP
# Use browser DevTools Security tab
# Or online tools: https://csp-evaluator.withgoogle.com/

# Run dependency audit
npm audit

# Check for exposed secrets
git log --all --full-history -- '*.env' '*.key' '*.pem'
```

---

## Summary

| Area                  | Status               | Risk        | Action Needed        |
| --------------------- | -------------------- | ----------- | -------------------- |
| CSP                   | ❌ Missing           | High        | Add CSP headers      |
| Security Headers      | ❌ Missing           | Medium-High | Add to netlify.toml  |
| Dependencies          | ⚠️ 8 vulnerabilities | Low         | Monitor/plan upgrade |
| Environment Variables | ✅ Secure            | None        | Continue practice    |
| Secret Management     | ✅ Secure            | None        | Continue practice    |

**Overall Security Posture:** The site has good foundational security (env vars, secret management) but lacks critical HTTP security headers. Implementing the high-priority recommendations will significantly improve the security posture.
