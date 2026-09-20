# Contributing to Mailbox Plus Website

> **AI agents:** hard rules live in [AGENTS.md](AGENTS.md) — read it before writing any code.

## Getting Started

1. Clone the repository
2. Run `npm install` (installs root and `astro` workspace dependencies via npm workspaces with unified `package-lock.json`)
3. Copy `.env.example` to `.env` and fill in required variables
4. Run `npm run verify:doctor` to verify repository environment sanity
5. Run `npm run dev` to start the Astro development server

## Pre-Flight Verification Workflow

Before opening a pull request, contributors must run local pre-flight checks to ensure CI pipelines pass on first attempt:

1. **Environment Sanity (`npm run verify:doctor`):**
   Confirms repo root resolution, root and `astro` workspace dependencies (including active `node_modules/mailbox-plus-astro` workspace symbolic link and unified `package-lock.json` structure), branch hygiene, and CSP alignment.
2. **Local Content Verification (`npm run verify`):**
   Verifies changed or newly added content against strict frontmatter schemas, internal link formats (mandatory trailing slashes), image CDN availability, heading diversity, and fact-check receipt requirements.
3. **Corpus & Strict Verification Options:**
   - `npm run verify -- --strict`: Runs strict pre-flight checks locally (matching CI PR enforcement).
   - `npm run verify:articles`: Runs verification across all articles in `content/articles/`.

### Workspace Notes & Prerequisite Justification

- **BaseLayout Frontmatter**: `astro/src/layouts/BaseLayout.astro` uses standard Astro frontmatter delimiters (`---`). Correcting the `|---` typo at line 1 is a mandatory prerequisite for `npm run check` (`astro check`) and `npm run build` (`astro build`) to pass cleanly.
- **Transitive Dependency Drift**: Lockfile unification under npm workspaces (`astro/package-lock.json` removal and root `package-lock.json` regeneration) includes authorized patch-level transitive updates (such as `tinyglobby` `0.2.16` -> `0.2.17`).
- **PR Body Documentation Rules**: All PRs involving lockfile unification or prerequisite fixes must document both the prerequisite justification and transitive dependency drift directly in the PR body description.

## Project Structure

```
astro/
├── src/
│   ├── components/          # .astro + React islands (Header, Footer, CTAs, SmartImage)
│   ├── config/              # Site configuration
│   │   ├── services/        # Service definitions (data-driven pages)
│   │   ├── faqs/            # FAQ data per category
│   │   ├── micro-problems/  # Micro-problem page configs
│   │   └── pageMeta.ts      # Page-level SEO metadata
│   ├── pages/               # File-based routes (.astro → URL)
│   ├── layouts/             # BaseLayout, ServiceLayout
│   ├── utils/               # Utility functions (schema, article loader, helpers) + vitest tests
│   ├── data/                # Static JSON data (site structure, links, sitemap)
│   └── styles/              # Global styles + design tokens
├── astro.config.mjs         # Astro config (publicDir: ../public, outDir: ../dist)
├── tailwind.config.mjs      # Tailwind config
└── tsconfig.json            # TypeScript config
content/articles/            # Article markdown (YAML frontmatter)
public/                      # Static assets (served at /)
scripts/                     # Article/sitemap/SEO audit tooling
netlify/functions/           # Serverless functions
```

## Design System

See [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) for the full design token reference and [docs/DESIGN_VISION.md](./docs/DESIGN_VISION.md) for the design rationale.

### Key Principles

- **Warm/gold aesthetic** — cream paper backgrounds, deep navy anchors, two-tone accents (gold on dark, terracotta on light)
- **Use design tokens** — always use `var(--color-*)` or Tailwind token classes, never hardcoded hex values
- **Use shadow tokens** — `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` instead of arbitrary values
- **Use border-radius tokens** — `rounded-lg` (26px) for cards, `rounded-xl` (30px) for panels
- **Responsive first** — use `sm:`, `md:`, `lg:` breakpoints consistently
- **Accessibility** — all images must have alt text, interactive elements must have focus indicators

## Code Style

- TypeScript strict mode is enabled
- ESLint + Prettier enforce code style (run `npm run lint`)
- Astro components are server-rendered by default; use islands only for interactive behavior
- Always prefer Tailwind `hover:`/`focus:`/`enabled:` variants over inline `onMouseEnter`/`onMouseLeave`

## Images

- Store images in the R2 bucket (`mailbox-plus-images`)
- Use `getServiceImageUrl()` from `astro/src/lib/storage.ts` for image paths
- Article featured images should be ~400×225 WebP at 16:9 aspect ratio
- Use `<SmartImage>` component with `priority` on LCP/hero images, lazy otherwise

## Adding a New Static Page

1. Define page metadata (title, description, optional schema, geo tags) in `astro/src/config/pageMeta.ts` with the route path as key (e.g., `'/about-us'`).
2. Create the page component in `astro/src/pages/` wrapped with `<BaseLayout>`.
3. `BaseLayout` automatically inspects the route path (`Astro.url.pathname`) and supplies `title`, `description`, geo metadata (`geo.region`, `geo.placename`, `geo.position`, `ICBM`), and JSON-LD schema from `pageMeta.ts` when explicit props are omitted.
4. Run `npm run build` and `npm run seo:check-metadata` to verify.

## Adding a New Service Page

1. Create a service config in `astro/src/config/services/`
2. Add the route/slug in the config (file-based pages are generated from config)
3. Add page metadata in `astro/src/config/pageMeta.ts`
4. Run `npm run build` to verify

## Adding a New Article

1. Create a markdown file in `content/articles/{category}/` with frontmatter
2. Frontmatter must include: `title`, `description`, `slug`, `pubDate`, `category`, `status`
3. Set `status: draft` for preview, `status: published` for live
4. Articles are auto-discovered by `articleLoader.ts`
5. Run `npm run audit:articles` to validate links/frontmatter against the sitemap

## Commit Convention

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance, cleanup
- `docs:` — documentation changes
- `style:` — formatting, no logic changes
- `refactor:` — code restructuring
- `test:` — adding/updating tests
- `a11y:` — accessibility improvements
- `perf:` — performance improvements

## Branch Protection

- All changes must go through pull requests
- CI must pass (build, check, lint, test)
- Branch protection requires 1 approval
- Squash merge only (no merge commits)
- No direct commits to `main` — always use feature branches
- PR must be up-to-date with `main` before merging
