# Plan: Migrate Mailbox Plus Website to Astro (SSG)

## Context

Bing Webmaster Tools reports 109 pages missing meta descriptions and H1 tags. The site is a React SPA — meta tags are injected by `react-helmet-async` after JavaScript runs, but Bing's crawler does not reliably execute JavaScript. Google's crawler does execute JS, so Google shows no issues.

The fix is to move to Astro (Static Site Generation), which renders all HTML — including `<head>` meta tags — at build time, making them visible to all crawlers regardless of JS support.

**Branch:** `feat/astro-migration`
**Strategy:** "Astro shell with React islands" — wrap all existing React components in Astro pages that server-render `<head>` tags. Existing React components are preserved as client islands. This minimizes rewrite risk while fixing the root cause immediately.

---

## Migration Strategy

Instead of rewriting every component from scratch, we use Astro's React integration:
- Astro handles routing, `<head>`, and static HTML shell
- Existing React `.tsx` components become **client islands** (`client:load`)
- Gradually convert pure-static components to `.astro` over time (optional optimization)

This means Bing (and all crawlers) will see the full `<head>` immediately, while all interactive functionality is preserved.

---

## Phase 1: Foundation Setup

**Goal:** Get Astro installed and building alongside the existing code — nothing broken.

### Steps

1. **Install Astro and integrations**
   ```bash
   npm install astro @astrojs/react @astrojs/tailwind @astrojs/sitemap
   npm install -D @astrojs/check
   ```

2. **Create `astro.config.mjs`** in project root:
   - Enable React integration (`@astrojs/react`)
   - Enable Tailwind integration (`@astrojs/tailwind`)
   - Enable Sitemap integration (`@astrojs/sitemap`)
   - Set `output: 'static'` (fully static, no SSR server needed)
   - Set `site: 'https://mailboxplusohio.com'`
   - Configure Netlify adapter (optional — static output doesn't require it)
   - Preserve `@` path alias pointing to `./src`

3. **Update `tsconfig.json`**
   - Extend `astro/tsconfigs/strict`
   - Preserve existing compiler options (jsx: react-jsx, types: schema-dts, react, react-dom)

4. **Update `tailwind.config.js`** content paths:
   - Add `'./src/**/*.{astro,html}'` to the content array
   - Keep all existing entries

5. **Update `package.json` scripts:**
   ```json
   "dev": "astro dev",
   "build": "astro build",
   "preview": "astro preview"
   ```
   Keep all other scripts (`build:embeddings`, `generate:article-sitemap`, `audit:articles`, etc.)

6. **Update `netlify.toml`** — no changes needed (publish = "dist" is Astro's default output)

7. **Update ESLint config** — add `.astro` file support

**Critical files to create/modify:**
- `astro.config.mjs` (new)
- `tsconfig.json`
- `tailwind.config.js`
- `package.json`

---

## Phase 2: Layout & Shared Infrastructure

**Goal:** Create the Astro layout shell that all pages will use.

### Steps

1. **Create `src/layouts/Layout.astro`**
   - Props: `title`, `description`, `canonical?`, `keywords?`, `ogImage?`, `schema?`, `robots?`, `geoRegion?`, `geoPlacename?`, `geoPosition?`
   - Statically renders full `<head>` with: title, meta description, canonical, OG tags, Twitter cards, geo meta, JSON-LD schemas, favicons, GTM script
   - Includes Google Fonts preloads (currently in `index.html`)
   - Includes R2 hero image preload (currently in `index.html`)
   - Body: `<slot />` for page content
   - Body also includes GTM noscript iframe

2. **Migrate `index.html` content into Layout.astro**
   - GTM script → head of Layout.astro
   - Font preloads → head of Layout.astro
   - R2 image preloads → head of Layout.astro
   - Remove `index.html` (Astro generates its own entry)

3. **Keep existing React components** — Header, Footer, MailbotPlusChat, PremierSignupModal stay as `.tsx` files. They will be imported into `.astro` pages as React islands.

4. **Create `src/pages/index.astro`** (homepage) as the first test to confirm Astro is building correctly.

**Critical files:**
- `src/layouts/Layout.astro` (new)
- `index.html` (delete after Layout.astro is working)

---

## Phase 3: Content Collections (Articles)

**Goal:** Migrate articles to Astro Content Collections for type-safe, build-time article loading.

### Steps

1. **Create `src/content/config.ts`** defining the `articles` collection schema with zod, matching existing `ArticleFrontmatter` interface:
   - `title`, `description`, `slug`, `category`, `intentKey`, `pubDate`, `image`, `imageAlt`, `relatedServices`, `author`, `keywords`

2. **Move articles** from `content/articles/` → `src/content/articles/`
   - Keep all subdirectory structure (pack-ship/, etc.)
   - All existing `.md` files move as-is (frontmatter stays identical)

3. **Create `src/pages/articles/index.astro`** (article listing)
   - Use `getCollection('articles')` instead of `getAllArticles()`
   - Renders static HTML listing (no React needed)

4. **Create `src/pages/articles/[slug].astro`** (individual article)
   - `getStaticPaths()` calls `getCollection('articles')` at build time
   - Each article gets its own static HTML page
   - Meta description and title rendered in `<head>` via Layout.astro
   - Article body rendered via React `ArticleMarkdown` island or native Astro markdown

5. **Update `src/utils/articleLoader.ts`** — keep for any scripts that still reference it, but article pages no longer use it

6. **Update `generate-article-sitemap.cjs` script** if needed — or let `@astrojs/sitemap` handle it automatically

**Critical files:**
- `src/content/config.ts` (new)
- `src/content/articles/**/*.md` (moved from `content/articles/`)
- `src/pages/articles/index.astro` (new)
- `src/pages/articles/[slug].astro` (new)
- `src/utils/articleLoader.ts` (update or deprecate)

---

## Phase 4: Static Service Pages

**Goal:** Convert all service and marketing pages to `.astro` files with server-rendered `<head>`.

### Strategy
For each page: create a `.astro` file that uses `Layout.astro` with the page's specific title/description, then renders the existing React component as a `client:load` island. This is the safest approach — zero functional change, just server-rendered meta tags.

### Page Groups (convert in this order)

**Group A — Simple marketing pages** (no complex data fetching):
- `src/pages/index.astro` (Home)
- `src/pages/about-us.astro`
- `src/pages/contact-us.astro`
- `src/pages/services.astro`
- `src/pages/privacy.astro`
- `src/pages/terms.astro`
- `src/pages/tracking.astro`
- `src/pages/shipping-partners.astro`
- `src/pages/pickup-hours.astro`
- `src/pages/ask-mailbox-plus.astro`

**Group B — Service category landing pages:**
- `src/pages/pack-ship/index.astro`
- `src/pages/copy-print/index.astro`
- `src/pages/home-business/index.astro`

**Group C — Pack & Ship service pages** (13 routes):
- `src/pages/pack-ship/artwork-shipping.astro`
- `src/pages/pack-ship/bicycle-shipping.astro`
- `src/pages/pack-ship/fedex-shipping.astro`
- ... (all remaining pack-ship sub-pages)

**Group D — Copy & Print service pages** (7 routes):
- `src/pages/copy-print/business-cards.astro`
- ... etc.

**Group E — Home & Business service pages** (7 routes):
- `src/pages/home-business/mailbox-rental.astro`
- ... etc.

**Group F — Specialty pages** (2 routes):
- `src/pages/specialty/digital-fingerprinting.astro`
- `src/pages/specialty/insurance.astro`

**Group G — SEO landing pages** (20+ competitor alternative pages):
- `src/pages/ups-store-alternative-concord-township.astro`
- `src/pages/fedex-office-alternative-concord-township.astro`
- ... (all concord-township-* pages)

**Group H — Additional standalone pages:**
- `src/pages/fedex-easy-returns.astro`
- `src/pages/nuuly-returns.astro`
- `src/pages/amazon-returns-guide.astro`
- `src/pages/amazon-returns-drop-off-concord-township.astro`
- ... (all remaining page-specific .tsx files)

**Group I — Micro problem pages** (18 routes):
- Create `src/pages/micro/[slug].astro` with `getStaticPaths()` driven by `src/config/micro-problems/index.ts`
- Renders `MicroProblemPage` React component as island

**Critical note:** Each `.astro` file passes the correct `title` and `description` to `Layout.astro`. These values come from the corresponding page component's config data (siteConfig, service definitions, etc.).

---

## Phase 5: Dynamic Routes

**Goal:** Convert the two remaining dynamic route templates.

### Service Area Pages

1. **Create `src/pages/service-area/index.astro`**
   - Import `serviceAreas` config and render static HTML listing

2. **Create `src/pages/service-area/[slug].astro`**
   - `getStaticPaths()` iterates `serviceAreas` array from `src/config/serviceAreas.ts`
   - Merges with `localPages.json` overrides (same logic as current `ServiceAreaPage.tsx`)
   - Each slug generates a static HTML page with correct meta in `<head>`
   - Renders `ServicePageV2` React component as `client:load` island

**Critical files:**
- `src/pages/service-area/index.astro` (new)
- `src/pages/service-area/[slug].astro` (new)
- Referenced: `src/config/serviceAreas.ts`, `src/data/localPages.json`

---

## Phase 6: Interactive Islands

**Goal:** Ensure all interactive React components hydrate correctly as Astro islands.

### Components requiring `client:load`
- `Header` (mobile menu toggle, active link detection) — `client:load`
- `MailbotPlusChat` (full chat widget) — `client:idle` (loads after page is interactive)
- `PremierSignupModal` (focus trap, keyboard, localStorage) — `client:idle`
- `FloatingReviewButton` — `client:load`
- `ContactUs` form page (reCAPTCHA, validation) — `client:load`
- `SearchBox` — `client:load`
- `ScrollToTop` — `client:load`

### Components that can be `.astro` (no interactivity)
- `Footer` — pure static links and hours display
- `JsonLd` — just a script tag
- `Breadcrumbs` / `AutoBreadcrumbs` — static navigation
- `CarrierLogos` — static images
- `CTA` section — static markup
- `ServiceGrid` — static markup

### Steps
1. Audit each component for `useState`, `useEffect`, event listeners, browser APIs
2. Convert pure-static components to `.astro` equivalents (optional optimization — not required for v1)
3. For React components kept as islands, confirm they import correctly in `.astro` pages
4. Test focus trap on modal, ESC key on chat widget, mobile menu toggle

---

## Phase 7: Remove Old SPA Infrastructure

**Goal:** Clean up Vite/React Router artifacts once Astro is working.

### Steps
1. **Delete** `src/App.tsx` — replaced by Astro file-based routing
2. **Delete** `src/main.tsx` — replaced by Astro's entry system
3. **Remove** `react-router-dom` from dependencies
4. **Remove** `react-helmet-async` from dependencies (replaced by Layout.astro head)
5. **Remove** `react-gtm-module` from dependencies (GTM now in Layout.astro script tag)
6. **Remove** `vite-plugin-sitemap`, `vite-plugin-node-polyfills`, `@vitejs/plugin-react` from devDependencies
7. **Remove** `vite.config.ts` (replaced by `astro.config.mjs`)
8. **Delete** `index.html` (replaced by Astro's build system)
9. **Update** `src/pages/index.ts` barrel file — no longer needed, delete it
10. **Keep** all other files: siteConfig, serviceAreas, data files, hooks, utils, Netlify functions

---

## Phase 8: 404 & Redirects

1. **Create `src/pages/404.astro`** — replace `public/404.html`
2. **Verify `public/_redirects`** — SPA fallback redirect (`/* /index.html 200`) must be removed (Astro generates real HTML files, no fallback needed)
3. **Verify `public/_headers`** — keep as-is

---

## Phase 9: Sitemap & Robots

1. `@astrojs/sitemap` generates `/sitemap-index.xml` and `/sitemap-0.xml` automatically from all `.astro` pages
2. Update `public/robots.txt` sitemap reference if URL changes
3. Run `node scripts/generate-article-sitemap.cjs` to verify it still works, or deprecate it in favor of Astro's automatic sitemap
4. Update Bing Webmaster Tools and Google Search Console with new sitemap URL after deployment

---

## Phase 10: Testing & Verification

### Local testing
```bash
astro dev           # Confirm all routes load
astro build         # Confirm build completes with no errors
astro preview       # Test production build locally
```

### Verification checklist
- [ ] `curl https://localhost:4321/copy-print/copies | grep "<meta name=\"description\""` — must return content
- [ ] `curl https://localhost:4321/service-area/concord-township | grep "<h1"` — must return H1 tag
- [ ] All 70+ routes return 200
- [ ] Article pages at `/articles/[slug]` render correctly
- [ ] Service area pages at `/service-area/[slug]` render correctly
- [ ] Contact form submits successfully (Netlify function call)
- [ ] Chat widget opens, submits question, returns answer
- [ ] PremierSignupModal appears after delay, ESC closes it
- [ ] Mobile header menu toggles open/closed
- [ ] GTM fires on page load (check Network tab for `gtm.js`)
- [ ] Sitemap at `/sitemap-index.xml` contains all expected URLs
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] View page source on any page — confirm `<meta name="description">` visible without JS

### Netlify deploy preview test
- Deploy branch to Netlify deploy preview
- Rerun Bing Webmaster site scan on preview URL
- Confirm 0 meta description errors

---

## File Inventory Summary

### New files to create
| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro build configuration |
| `src/layouts/Layout.astro` | Main HTML shell with server-rendered head |
| `src/content/config.ts` | Content Collections schema |
| `src/pages/**/*.astro` | ~80 Astro page files |
| `src/pages/articles/[slug].astro` | Dynamic article routes |
| `src/pages/service-area/[slug].astro` | Dynamic service area routes |
| `src/pages/micro/[slug].astro` | Dynamic micro-problem routes |
| `src/pages/404.astro` | Custom 404 page |

### Files to delete
| File | Reason |
|------|--------|
| `index.html` | Replaced by Astro's entry system |
| `src/App.tsx` | Replaced by file-based routing |
| `src/main.tsx` | Replaced by Astro's entry system |
| `src/pages/index.ts` | Barrel file no longer needed |
| `vite.config.ts` | Replaced by astro.config.mjs |
| `public/404.html` | Replaced by src/pages/404.astro |

### Files to move
| From | To |
|------|----|
| `content/articles/**/*.md` | `src/content/articles/**/*.md` |

### Files unchanged
- All `netlify/functions/` — no changes
- All `src/config/` — no changes
- All `src/hooks/` — no changes
- All `src/data/` — no changes
- `src/components/` — mostly unchanged, some become .astro optionally
- `netlify.toml` — no changes
- `tailwind.config.js` — content paths update only
- `public/_redirects`, `public/_headers`, `public/robots.txt`, `public/manifest.json`
- All `scripts/` — no changes
- `knowledge/` — no changes

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| React island hydration mismatch (SSR vs client) | Medium | Use `client:only="react"` for components that use browser APIs on mount |
| SPA `_redirects` fallback interfering | Low | Remove `/* /index.html 200` line from `public/_redirects` |
| `import.meta.env.VITE_*` vars not available in Astro | Low | Vite env vars work in Astro; prefix stays `VITE_` for client-side |
| framer-motion SSR errors | Medium | All components using framer-motion already need `client:load` anyway |
| Gray-matter parser failures from unquoted frontmatter | Existing | Already documented; run audit script before and after article move |
| Missing routes (404s after migration) | Medium | Maintain a route mapping checklist, test every URL from sitemap |
| Netlify `_redirects` SPA fallback removed breaks something | Low | Astro generates real HTML per route; no fallback needed |

---

## Definition of Done

- `astro build` completes with 0 errors
- All URLs in current sitemap return 200 and have `<meta name="description">` in raw page source
- All interactive features work: chat, contact form, header menu, modal
- Netlify deploy preview passes
- PR opened against `main` for review
