# Contributing to Mailbox Plus Website

## Getting Started

1. Clone the repository
2. Run `npm install` and `cd astro && npm ci`
3. Copy `.env.example` to `.env` and fill in required variables
4. Run `npm run dev` to start the Astro development server

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
- Use `getServiceImageUrl()` from `astro/src/utils/getServiceImageUrl.ts` for image paths
- Article featured images should be ~400×225 WebP at 16:9 aspect ratio
- Use `<SmartImage>` component with `priority` on LCP/hero images, lazy otherwise

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
