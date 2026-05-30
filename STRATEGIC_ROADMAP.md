# Mailbox Plus Website — Strategic Modernization Roadmap

**Owner:** Marcus "Marc" Vance, Principal Engineer  
**Created:** May 30, 2026  
**Philosophy:** Clean slate. Remove confusion. Implement best practices. Build for stability.

---

## Document Strategy

This is the **single source of truth** for modernizing the Mailbox Plus website. All previous PRDs, audit docs, and planning files are now obsolete. Refer to this document only.

---

## Phase 0: Clean Slate (Immediate)

### Goals

- Remove confusing legacy documentation
- Archive obsolete PRDs
- Establish single planning artifact

### Actions

- [ ] Create `archive/` directory for old documentation
- [ ] Move obsolete files to `archive/`:
  - `V2 Design System & Aesthetic Specification.md` → superseded by Phase 5
  - `PERFORMANCE_OPTIMIZATION.md` → superseded by Phase 3
  - `SECURITY_BEST_PRACTICES.md` → superseded by Phase 4
  - `TECH_STACK.md` → superseded by Phase 2
  - `SITE_GUIDE.md` → obsolete
  - `PROJECT_UPDATES.md` → obsolete
  - All `lint-*.txt`, `ts_errors.txt`, `build-error.txt` → obsolete
  - `a11y-report.md` → move to Phase 5
  - `FAQ_DATABASE.md` → keep (business data)
  - `internal-linking-*.md` → obsolete (Phase 3 will redo SEO)
  - `MICRO_PROBLEM_*.md` → obsolete (Phase 3 will consolidate pages)
  - `GOVERNANCE_*.md` → obsolete
  - `HERO_IMAGES_IMPLEMENTATION.md` → obsolete
  - `SEO_LANDING_PAGES.md` → obsolete
  - `README_PERF_MOBILE_OPTIMIZATION.md` → obsolete
  - `diagnostic_report.json`, `button-report.json` → obsolete
  - `test-output.txt`, `test-v1-template.ts` → obsolete

### Success Criteria

- Root directory contains no `.txt` error logs
- No conflicting PRDs exist
- Single roadmap drives all work

---

## Phase 1: Infrastructure & Deployment (Weeks 1-2)

**Priority: CRITICAL** — Nothing else matters if deployment is fragile.

### 1.1 Staging Environment

**Goal:** Test changes safely before production.

**Actions:**

- [ ] Create `staging` branch in GitHub
- [ ] Configure Netlify deploy preview for PRs
- [ ] Set up `staging.mailboxplusohio.com` subdomain
- [ ] Isolate staging environment variables (`.env.staging`)

**Files to create:**

- `netlify.toml` — add staging context block
- `.github/workflows/deploy-staging.yml` — staging CI/CD

### 1.2 CI/CD Hardening

**Goal:** Automate quality gates.

**Actions:**

- [ ] Add GitHub Actions workflow with:
  - TypeScript type checking (`tsc --noEmit`)
  - ESLint with zero warnings policy
  - Build verification
  - Bundle size check (max 500KB main chunk)
- [ ] Configure branch protection on `main`:
  - Require PR reviews
  - Require CI checks to pass
  - Disallow direct pushes

**Files to create:**

- `.github/workflows/ci.yml`

### 1.3 Monitoring & Alerting

**Goal:** Know when things break.

**Actions:**

- [ ] Integrate Sentry for error tracking:
  - Install `@sentry/react`
  - Configure in `main.tsx`
  - Set up Sentry project for staging + production
- [ ] Add uptime monitoring:
  - Pingdom or UptimeRobot for `mailboxplusohio.com`
  - Alert on HTTP 4xx/5xx errors
- [ ] Add performance monitoring:
  - Lighthouse CI in GitHub Actions
  - Track Core Web Vitals (LCP, CLS, INP)

**Files to create:**

- `sentry.config.ts`

### 1.4 Health Checks

**Goal:** Verify site is alive.

**Actions:**

- [ ] Create Netlify Function `/api/health`:
  - Returns 200 OK with timestamp
  - Checks R2 image CDN connectivity
- [ ] Add to monitoring dashboard

**Files to create:**

- `netlify/functions/health.ts`

### Success Criteria

- [ ] All PRs have staging deploy previews
- [ ] CI fails if bundle exceeds 500KB
- [ ] Sentry receives errors from production
- [ ] Uptime monitoring alerts on downtime

---

## Phase 2: Code Quality & Stability (Weeks 3-4)

**Priority: HIGH** — Technical debt slows future work.

### 2.1 Testing Framework

**Goal:** Verify behavior, enable refactoring.

**Actions:**

- [ ] Install test dependencies:
  - `vitest` (faster than Jest for Vite projects)
  - `@testing-library/react`
  - `@testing-library/jest-dom`
  - `jsdom` (test environment)
- [ ] Configure `vitest.config.ts`
- [ ] Write first tests for critical paths:
  - `SmartImage` component
  - `getServiceImageUrl` utility
  - `PageMeta` component
- [ ] Aim for 60% coverage on `src/lib/` and `src/components/ui/`

**Files to create:**

- `vitest.config.ts`
- `src/**/*.test.tsx` (test files)

### 2.2 Linting & Formatting

**Goal:** Consistent code style, catch errors early.

**Actions:**

- [ ] Install Prettier:
  - `prettier`, `eslint-config-prettier`
- [ ] Configure `.prettierrc`:
  - 2 spaces indent
  - Single quotes
  - Trailing commas
- [ ] Update ESLint config to integrate Prettier
- [ ] Fix all existing ESLint warnings (run `eslint --fix`)

**Files to create:**

- `.prettierrc`
- `.prettierignore`

### 2.3 Pre-commit Hooks

**Goal:** Prevent bad code from entering repo.

**Actions:**

- [ ] Install Husky + lint-staged:
  - `husky`
  - `lint-staged`
- [ ] Configure `.husky/pre-commit`:
  - Run ESLint on staged files
  - Run Prettier on staged files
  - Run TypeScript check on staged files
- [ ] Add `prepare` script to `package.json`

**Files to create:**

- `.husky/pre-commit`
- Update `package.json` scripts

### 2.4 TypeScript Audit

**Goal:** Ensure type safety is real, not fake.

**Actions:**

- [ ] Review `tsconfig.app.json`:
  - Ensure `strict: true` (already set)
  - Add `noImplicitAny: true`
  - Add `strictNullChecks: true`
- [ ] Fix all `any` types in codebase
- [ ] Ensure all API responses have interfaces

### 2.5 Package Hygiene

**Goal:** Clean dependency tree.

**Actions:**

- [ ] Remove unused dependencies:
  - `resend` (not used)
  - `@svgr/plugin-jsx` (not used)
  - `@typescript-eslint/eslint-plugin` (not used)
  - `@typescript-eslint/parser` (not used)
  - `autoprefixer` (Tailwind handles this)
  - `postcss` (not needed)
- [ ] Fix vulnerabilities:
  - `npm audit fix --force` (upgrades vite to v8, breaking change — test thoroughly)
  - OR pin to vite 5.x and ignore dev-only vulns (current approach)

### Success Criteria

- [ ] `npm test` passes with >60% coverage
- [ ] `npm run lint` passes with 0 warnings
- [ ] Pre-commit hooks run successfully
- [ ] No `any` types in new code
- [ ] Zero unused dependencies

---

## Phase 3: Performance & SEO Consolidation (Weeks 5-6)

**Priority: HIGH** — Site speed and search rankings directly impact business.

### 3.1 Bundle Optimization

**Goal:** Reduce initial load time.

**Actions:**

- [ ] Fix Vite code splitting (current config has issues):
  - Remove `splitVendorChunkPlugin()` (does nothing with manualChunks)
  - Convert `manualChunks` to function form for better splitting
  - Split by route + vendor chunks
- [ ] Remove or lazy-load heavy dependencies:
  - **framer-motion (32KB gzipped):** Replace with CSS animations
  - **react-markdown (156KB):** Lazy load only on article pages
  - **react-calendar:** Lazy load only on pages that use it
- [ ] Lower `chunkSizeWarningLimit` to 500KB
- [ ] Implement tree-shaking audit with `npm run build -- --report`

**Files to modify:**

- `vite.config.ts`

### 3.2 Image Pipeline

**Goal:** Serve optimal images for every device.

**Actions:**

- [ ] Install Sharp for image processing:
  - `sharp` + `sharp-cli`
- [ ] Create build script `scripts/optimize-images.ts`:
  - Generate WebP and AVIF versions
  - Generate multiple sizes (320w, 640w, 1024w, 1920w)
  - Output to `public/images/optimized/`
- [ ] Update `SmartImage` component to use `srcset`
- [ ] Configure R2 bucket for optimized images

**Files to create:**

- `scripts/optimize-images.ts`
- Update `src/components/SmartImage.tsx`

### 3.3 SEO Consolidation (CRITICAL)

**Goal:** Eliminate duplicate content penalty risk.

**Actions:**

- [ ] Analyze current SEO pages:
  - Count of "Concord Township" pages: ~20
  - Identify common patterns
- [ ] Create dynamic route system:
  - Single `MicroProblemPage.tsx` template
  - Use React Router's `:slug` parameter
  - Data-driven page generation from `content/micro-problems/*.md`
- [ ] Implement dynamic sitemap generation
- [ ] Add canonical URL enforcement
- [ ] Redirect old static pages to new dynamic URLs (301 redirects in `netlify.toml`)

**Files to create:**

- `src/pages/MicroProblemPage.tsx` (rewrite)
- `content/micro-problems/` (markdown files for each SEO page)
- Update `vite.config.ts` sitemap config

**Files to remove:**

- All `src/pages/*-concord-township.tsx` (after redirect testing)

### 3.4 Core Web Vitals

**Goal:** Achieve green scores in Lighthouse.

**Actions:**

- [ ] Optimize Largest Contentful Paint (LCP):
  - Preload hero image
  - Use `fetchPriority="high"` on SmartImage
  - Eliminate render-blocking resources
- [ ] Optimize Cumulative Layout Shift (CLS):
  - Add `aspect-ratio` to images
  - Reserve space for dynamic content
- [ ] Optimize Interaction to Next Paint (INP):
  - Defer non-critical JavaScript
  - Use `requestIdleCallback` for analytics

### Success Criteria

- [ ] Main bundle < 400KB gzipped
- [ ] Lighthouse score > 90 on mobile
- [ ] Zero duplicate content issues (SEO)
- [ ] All images have WebP/AVIF + srcset

---

## Phase 4: Security & Hardening (Weeks 7-8)

**Priority: MEDIUM** — Current setup is decent, needs hardening.

### 4.1 Dependency Security

**Goal:** Zero known vulnerabilities.

**Actions:**

- [ ] Upgrade Vite to v8 (breaking change, requires testing):
  - Test all features after upgrade
  - Fix any breaking changes
- [ ] Or accept current state (dev-only vulns) and document in `SECURITY.md`
- [ ] Enable GitHub Dependabot:
  - Create `.github/dependabot.yml`
  - Auto-create PRs for dependency updates

**Files to create:**

- `.github/dependabot.yml`

### 4.2 API Security

**Goal:** Protect backend services.

**Actions:**

- [ ] Move Gemini API key to Netlify Function:
  - Create `netlify/functions/gemini-chat.ts`
  - Remove API key from client bundle
  - Add rate limiting (max 10 requests/minute per IP)
- [ ] Add input validation to all Netlify Functions
- [ ] Implement CORS policy for Functions

**Files to create:**

- `netlify/functions/gemini-chat.ts`

### 4.3 CSP Tightening

**Goal:** Minimize attack surface.

**Actions:**

- [ ] Review current CSP in `netlify.toml`:
  - Remove `unsafe-inline` from `script-src` (use nonces instead)
  - Remove `unsafe-inline` from `style-src` (use hashes)
  - Tighten `connect-src` to only required domains
- [ ] Test CSP with `report-only` mode first
- [ ] Set up CSP violation reporting endpoint

### 4.4 Penetration Testing

**Goal:** Find real vulnerabilities.

**Actions:**

- [ ] Run automated security scan:
  - OWASP ZAP or Nikto
- [ ] Manual testing:
  - Test reCAPTCHA bypass
  - Test XSS in form inputs
  - Test open redirects
- [ ] Document findings in `SECURITY_AUDIT.md`

### Success Criteria

- [ ] Zero high/critical vulnerabilities in `npm audit`
- [ ] Gemini API key not in client bundle
- [ ] CSP passes securityheaders.com test with A rating
- [ ] Penetration test passes

---

## Phase 5: Design System & UX (Weeks 9-10)

**Priority: MEDIUM** — Polish and consistency.

### 5.1 Component Library

**Goal:** Reusable, consistent UI components.

**Actions:**

- [ ] Audit current components:
  - `src/components/ui/` — 10 components
  - Identify inconsistencies
- [ ] Create component API standards:
  - Props interface with JSDoc
  - Default props
  - Error boundaries
- [ ] Build missing components:
  - `Card` (used in many pages)
  - `Section` (standardized spacing)
  - `Container` (max-width wrapper)
- [ ] Document components with Storybook (optional, nice-to-have)

### 5.2 Design Token System

**Goal:** Single source of truth for design values.

**Actions:**

- [ ] Extend Tailwind config with design tokens:
  - Colors from V2 spec (#0855B1, etc.)
  - Spacing scale
  - Border radius scale
  - Typography scale
- [ ] Replace hardcoded colors in components:
  - `bg-[#0855B1]` → `bg-brand-blue`
  - `text-[#064080]` → `text-brand-blue-dark`
- [ ] Create `design-tokens.js` for non-Tailwind usage

**Files to modify:**

- `tailwind.config.js`
- `src/styles/design-tokens.js` (new)

### 5.3 Accessibility Audit

**Goal:** WCAG 2.1 AA compliance.

**Actions:**

- [ ] Run automated a11y audit:
  - axe DevTools
  - Lighthouse a11y audit
- [ ] Manual testing:
  - Keyboard navigation
  - Screen reader testing (NVDA/VoiceOver)
  - Color contrast verification
- [ ] Fix issues:
  - Add `aria-label` to icon buttons
  - Ensure focus indicators visible
  - Add skip navigation link
- [ ] Update `a11y-report.md` with findings

### 5.4 Responsive Testing

**Goal:** Perfect display on all devices.

**Actions:**

- [ ] Test breakpoints:
  - Mobile: 320px, 375px, 414px
  - Tablet: 768px, 1024px
  - Desktop: 1280px, 1920px
- [ ] Fix layout issues:
  - Overflow on small screens
  - Font sizes on mobile
  - Touch target sizes (min 44x44px)
- [ ] Test on real devices (or Chrome DevTools)

### Success Criteria

- [ ] All components documented with props
- [ ] Zero hardcoded colors in components
- [ ] WCAG 2.1 AA compliance
- [ ] Responsive layouts verified at all breakpoints

---

## Phase 6: Documentation & Handoff (Week 11)

**Priority: LOW** — But necessary for continuity.

### Actions

- [ ] Create `CONTRIBUTING.md`:
  - How to set up local dev
  - How to run tests
  - How to create new pages
  - Code review guidelines
- [ ] Update `README.md`:
  - Project description
  - Tech stack
  - Setup instructions
  - Scripts explanation
- [ ] Create `ARCHITECTURE.md`:
  - Folder structure explanation
  - Data flow diagrams
  - Key design decisions
- [ ] Video walkthrough (optional):
  - Record 10-minute demo of codebase
  - Store in Google Drive / Notion

---

## Appendix A: Quick Wins (Do Immediately)

These can be done in parallel with Phase 0:

1. **Fix package.json name:**
   - Change `"name": "vite-react-typescript-starter"` to `"mailbox-plus-website"`

2. **Remove `react-helmet-async`:**
   - Already using `react-helmet-async` but consider migrating to built-in React 19 `<title>` and `<meta>` when possible

3. **Add `.env.example`:**
   - Document required environment variables:
     - `VITE_R2_PUBLIC_BASE_URL`
     - `VITE_GEMINI_API_KEY`
     - `RECAPTCHA_SITE_KEY`

4. **Fix `netlify.toml` CSP:**
   - Remove `img-src data:` (security risk, allows arbitrary data URIs)
   - Use specific R2 domain instead

---

## Appendix B: Effort vs Impact Matrix

| Task                  | Effort | Impact | Phase |
| --------------------- | ------ | ------ | ----- |
| Staging environment   | Low    | High   | 1     |
| Sentry integration    | Low    | High   | 1     |
| Remove unused deps    | Low    | Medium | 2     |
| Prettier + Husky      | Medium | High   | 2     |
| Unit tests            | High   | High   | 2     |
| SEO consolidation     | High   | High   | 3     |
| Image optimization    | Medium | High   | 3     |
| framer-motion removal | Medium | Medium | 3     |
| CSP tightening        | Medium | Medium | 4     |
| Design tokens         | Medium | Medium | 5     |

---

## Tracking Progress

Update the checkboxes above as work completes. Each phase should be merged to `main` via PR after:

- All actions completed
- Tests passing
- CI green
- Code review approved

---

**Last Updated:** May 30, 2026  
**Next Review:** After Phase 1 completion
