# Mailbox Plus Website - Core Directives & Operating Protocols

## 1. Project Identity & Context

**Mission Statement:** 
Transform the Mailbox Plus physical store presence into a premium digital experience that solves real-world local service friction for Lake County, Ohio residents. The primary problem is helping local customers discover and understand our comprehensive shipping, notary, mailbox, and business services while establishing authority over national competitors (UPS Store, FedEx Office) through hyper-local SEO and premium UX.

**Business Logic:**
- Content is data-driven through centralized configuration files (`src/config/*`)
- Every service page must include local geo-targeting (Concord Township, Mentor, Painesville, Lake County)
- Services are organized hierarchically: Pillar Pages → Category Pages → Individual Service Pages
- Micro-problem pages must reduce real-world friction or be archived (quarterly governance)
- Internal linking follows strict upward/horizontal/downward relationship models
- All business data (hours, location, contact) is single-source-of-truth from `siteConfig.ts`

**Target Audience:**
- Primary: Local consumers in Lake County, Ohio seeking shipping, mailbox, notary, printing services
- Secondary: Small businesses needing virtual mailbox, shredding, or bulk shipping services
- Tertiary: SEO traffic targeting competitor alternatives ("UPS Store alternative near me")

---

## 2. Technical Stack & Architecture

**Frontend:** 
- React 18.3 with TypeScript (strict mode enabled)
- Vite 5.4 as build tool and dev server
- React Router 6.25 for client-side routing

**Styling:** 
- Tailwind CSS 3.4 with custom design system
- Premium glassmorphism aesthetic (blur, gradients, soft shadows)
- Brand blue: `#0855B1`
- Framer Motion 12 for animations

**UI Libraries:**
- Radix UI (Accordion, etc.)
- Lucide React for icons
- Custom component library in `src/components`

**Infrastructure:**
- Cloudflare R2 for hero image hosting
- Netlify for static site deployment
- Vite build target: ES2018
- Automated sitemap generation via `vite-plugin-sitemap`

**Backend/Services:** 
- Static site (no backend) with client-side routing
- Schema.org JSON-LD for structured data
- Google Tag Manager for analytics
- reCAPTCHA integration for forms

**Folder Map:**
```
/src/pages/          Page components for all routes
/src/components/     Reusable UI components
  /ui/              Atomic components (buttons, cards, modals)
  /sections/        Composite sections (CTA, FAQ, ServiceGrid)
  /layout/          Layout components (Header, Footer)
/src/config/         Data-driven configuration
  /services/        Service definitions by category
  /faqs/            FAQ content
  /micro-problems/  Micro-problem page configurations
/src/data/           JSON data files
  routes.json       All routes for sitemap
  anchorText.json   SEO anchor text variations
  internalLinks.json Link relationships
/src/utils/          Helper functions
/src/types/          TypeScript type definitions
/public/             Static assets, _redirects, _headers
/scripts/            Node.js automation scripts
```

---

## 3. Engineering Standards (The "Contract")

**Code Style:**
- TypeScript strict mode enabled (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`)
- React functional components only (no class components)
- Named exports for components
- 2-space indentation (enforced by ESLint)
- File naming: PascalCase for components, camelCase for utilities
- Import alias: `@/` resolves to `./src`

**Component Architecture:**
- Components must be reusable and data-driven
- Use composition over props drilling
- Mandatory props: `className` for style extensibility
- All internal links MUST use `<InternalLink>` component (never `<a>` or `<Link>`)
- All external links MUST include `rel="noopener noreferrer"`

**State Management:**
- Local component state with `useState` for UI state
- No global state management library (not needed for static site)
- URL state via React Router for routing
- LocalStorage for persistent user preferences (e.g., modal dismissal)

**Error Handling:**
- TypeScript strict typing prevents most runtime errors
- Graceful degradation for missing images/data
- Console warnings for development issues
- No try-catch blocks needed for static content rendering

**UI/UX Standards:**
- **8-point grid system** for spacing (Tailwind: 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, etc.)
- **Mobile-first design** (always test responsive breakpoints)
- **WCAG AA compliance** required
  - All images need meaningful `alt` text
  - Semantic HTML (`h1` → `h2` → `h3`)
  - Color contrast ratios meet AA standards
  - Keyboard navigation support
- **Premium aesthetic** (see V2 Design System specification)
  - Glassmorphism: `backdrop-filter: blur(24px)`, `rgba(255,255,255,0.70)`
  - Border radius: 24-32px for cards
  - Animations: Framer Motion with `ease-out` timing
  - No harsh colors (orange, neon, pure black backgrounds prohibited)

**Performance Constraints:**
- Hero images must be optimized (JPEG 80-85% or WebP)
- Lazy load page components in `App.tsx`
- Code splitting via Vite `splitVendorChunkPlugin`
- Manual chunks: vendor (React, React-DOM), motion (Framer Motion)
- Target: Lighthouse 90+ performance score

---

## 4. Operating Protocols (AI Persona)

**Workflow:** 
Use the **PRAR (Perceive, Reason, Act, Refine)** cycle for all tasks:
1. **Perceive:** Read existing code, configs, and documentation before making changes
2. **Reason:** Understand relationships (e.g., service config → page component → route → sitemap)
3. **Act:** Make minimal, targeted changes following established patterns
4. **Refine:** Verify changes by running lint, checking routes, validating links

**Documentation Mandate:** 
Update `PROJECT_UPDATES.md` after every successful implementation using this format:
```markdown
## YYYY-MM-DD — Short Title of Change

**Summary**
Plain-English explanation of what was changed and why.

**Scope**
- High-level files/areas affected

**Notes**
- Important implications or follow-ups
```

**Verification Protocol:**
NEVER assume success. Always verify:
- Run `npm run lint` to check for linting errors
- Check `npm run typecheck` for TypeScript errors
- Verify routes are added to `src/data/routes.json`
- Run `node scripts/validate-links.cjs` for internal link integrity
- Visually inspect changes in browser at `http://localhost:5173`

**Consultative Mode:**
Proactively ask clarifying questions before:
- Creating new service categories
- Changing design system tokens
- Modifying SEO metadata patterns
- Altering core navigation structure
- Breaking existing internal link relationships

**Definition of Done:**
A task is complete ONLY when:
- [ ] Code passes ESLint (`npm run lint`)
- [ ] Code passes TypeScript checks (`npm run typecheck`)
- [ ] Changes are visually verified in browser
- [ ] Internal links are validated (if applicable)
- [ ] `PROJECT_UPDATES.md` is updated
- [ ] Service config is updated (for new services)
- [ ] Route is added to `routes.json` (for new pages)
- [ ] Accessibility is maintained (images have alt text, semantic HTML)

---

## 5. Testing Strategy & TDD Mandate

**Current State:**
The project does NOT currently have a comprehensive testing infrastructure. Testing is primarily manual through browser verification and linting.

**Future TDD Cycle (To Be Implemented):**
When testing infrastructure is added:
1. Write a failing test for new feature/fix
2. Implement minimum code to pass test
3. Refactor and ensure all lints pass
4. Run test suite and verify coverage

**Tooling (Planned):**
- Vitest for unit testing
- React Testing Library for component testing
- E2E testing via Playwright (future consideration)

**Current Verification Process:**
1. **Linting:** `npm run lint` (ESLint + jsx-a11y)
2. **Type Checking:** `npm run typecheck` (TypeScript strict mode)
3. **Link Validation:** `node scripts/validate-links.cjs`
4. **Accessibility Audit:** `npm run lint:a11y`
5. **Manual Testing:** Visual inspection in browser (desktop + mobile)
6. **Micro-Problem Audit:** `npm run audit:micro-problems` (quarterly governance)

**Coverage Standard:**
- All new components must pass accessibility checks
- All new service pages must pass link validation
- All TypeScript must compile without errors in strict mode

---

## 6. Security & Deployment

**Secret Management:**
- **Local Development:** Use `.env` file (never commit to Git)
  - `VITE_R2_PUBLIC_BASE_URL` - Cloudflare R2 image hosting URL
  - Any API keys (reCAPTCHA, GTM) prefixed with `VITE_`
- **Production:** Netlify environment variables dashboard
- **Security Rule:** No secrets in source code. All environment variables must use `VITE_` prefix to be exposed to client

**CI/CD:**
- **Platform:** Netlify
- **Trigger:** Push to `main` branch
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Deploy Previews:** Automatic for all pull requests
- **Automated Checks:** 
  - Build must succeed (Vite compile)
  - No lint errors or TypeScript errors will be caught during build

**Security Posture:**
- **Dependency Scanning:** Manual `npm audit` (run before major releases)
- **External Links:** All use `rel="noopener noreferrer"` for security
- **Headers:** Security headers configured in `public/_headers`
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
- **HTTPS:** Enforced by Netlify
- **SPA Security:** `public/_redirects` handles routing without exposing server errors

**Deployment Checklist:**
Before merging to `main`:
- [ ] Run `npm run lint` (zero errors)
- [ ] Run `npm run typecheck` (zero errors)
- [ ] Verify `routes.json` includes all new pages
- [ ] Test Deploy Preview link from PR
- [ ] Check mobile responsiveness
- [ ] Verify hero images load from R2
- [ ] Confirm sitemap regenerates correctly

---

## 7. Known Issues & Quirks

### Framework-Specific Gotchas

**React Router SPA Routing:**
- **Issue:** Direct navigation to deep routes (e.g., `/pack-ship/fedex-shipping`) returns 404 on page refresh
- **Solution:** `public/_redirects` contains `/* /index.html 200` to handle all routes client-side
- **Never:** Remove or modify this redirect rule

**Vite Environment Variables:**
- **Issue:** Only variables prefixed with `VITE_` are exposed to client code
- **Solution:** Always prefix env vars with `VITE_` when they need to be accessed in React components
- **Gotcha:** Changing `.env` requires dev server restart (`npm run dev`)

**Tailwind CSS Purging:**
- **Issue:** Dynamic class names (e.g., `text-${color}`) get purged in production
- **Solution:** Use full class names or add safelist to `tailwind.config.js`
- **Never:** Construct class names dynamically with template literals

### Project-Specific Bugs

**Premier Signup Modal Re-Trigger (RESOLVED 2025-12-30):**
- **Previous Issue:** Modal kept reappearing after dismissal
- **Root Cause:** `markAsShown()` updated storage but not state
- **Solution:** Added `setShouldShow(false)` to immediately update state
- **Prevention:** Always update both storage AND state for modals

**Micro-Problem Page Bloat:**
- **Issue:** SEO temptation to create hundreds of low-value micro-problem pages
- **Governance:** Quarterly audit required (`/micro-problem-quarterly-audit` workflow)
- **Rule:** "A micro-problem page must reduce real-world friction. If it doesn't, it doesn't deserve to exist."
- **Enforcement:** Run `npm run audit:micro-problems` and review performance data

**Internal Link Fragility:**
- **Issue:** Easy to break internal link relationships by renaming routes
- **Solution:** Run `node scripts/validate-links.cjs` before commits
- **Gotcha:** Must update BOTH `routes.json` AND `internalLinks.json` when creating new pages

### Design System Constraints

**Color Palette Violations:**
- **Prohibited:** Orange, harsh reds, neon greens, pure black backgrounds
- **Required:** Blue-based monochromatic palette (`#0855B1` brand blue)
- **Enforcement:** Code review and visual QA

**Animation Performance:**
- **Issue:** Over-animating causes jank on mobile
- **Solution:** Limit animations to `opacity` and `transform` properties only
- **Never:** Animate `width`, `height`, or `margin` directly
- **Best Practice:** Use `will-change` sparingly and remove after animation

### TypeScript Strict Mode Gotchas

**Unused Variables:**
- **Error:** `noUnusedLocals` will fail build for any unused imports/variables
- **Solution:** Remove unused code immediately or prefix with `_` (e.g., `_unusedVar`)

**Missing Type Definitions:**
- **Issue:** Some third-party packages don't have `@types/*` definitions
- **Solution:** Add ambient declarations in `src/vite-env.d.ts` if needed

---

## Appendix: Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run lint:a11y` | Run accessibility audit |
| `npm run typecheck` | TypeScript type checking |
| `npm run audit:micro-problems` | Run micro-problem quarterly audit |
| `node scripts/validate-links.cjs` | Validate internal link integrity |

---

## Appendix: Critical File Locations

**Configuration:**
- `src/config/siteConfig.ts` - Business info (phone, hours, address) - SINGLE SOURCE OF TRUTH
- `src/config/pageMeta.ts` - SEO metadata defaults
- `src/config/services.ts` - Aggregated service definitions
- `src/data/routes.json` - All routes for sitemap
- `src/data/anchorText.json` - SEO anchor text variations
- `src/data/internalLinks.json` - Link relationships

**Documentation:**
- `SITE_GUIDE.md` - Comprehensive developer guide
- `V2 Design System & Aesthetic Specification.md` - Design rules
- `GOVERNANCE_QUICK_REFERENCE.md` - Micro-problem governance
- `MICRO_PROBLEM_GOVERNANCE.md` - Authoritative policy
- `PROJECT_UPDATES.md` - Living changelog

**Workflows:**
- `.agent/workflows/micro-problem-quarterly-audit.md` - Quarterly audit process

---

*This document is a living specification. Update it when core architecture, standards, or workflows change.*
