# Mailbox Plus Website

The official website for Mailbox Plus — a community-focused pack & ship retail store in Concord Township, Ohio.

**Live site:** [mailboxplusohio.com](https://mailboxplusohio.com)

## Tech Stack

| Layer     | Technology                                             |
| --------- | ------------------------------------------------------ |
| Framework | Astro 5 (SSG) + React islands                          |
| Language  | TypeScript (strict)                                    |
| Styling   | Tailwind CSS 3 + CSS custom properties (design tokens) |
| Testing   | Vitest (unit, in `astro/`)                             |
| CI/CD     | GitHub Actions → Netlify                               |
| Analytics | Google Analytics 4, Meta Pixel                         |

## Project Layout

The **Astro app is the entire site** — there is no legacy frontend.

```
astro/                     # The Astro application (build: cd astro && npm run build)
  src/pages/               # .astro pages (routes)
  src/components/          # .astro + React islands
  src/config/              # Service configs, micro-problems, FAQs
  src/data/                # sitemap-config.json, internalLinks.json, siteStructure.json
  src/utils/               # Shared utilities (+ vitest unit tests)
content/articles/          # Article markdown (YAML frontmatter)
public/                    # Static assets (Astro publicDir)
scripts/                   # Article/sitemap/SEO audit tooling
netlify/functions/         # Serverless functions
```

## Quick Start

```bash
npm install
cd astro && npm ci
cp .env.example .env    # Fill in required variables
npm run dev             # Astro dev server
npm run build           # Production build (cd astro && npm run build)
npm test                # Astro unit tests (vitest)
npm run check           # Astro type check (astro check)
npm run lint            # ESLint
```

## Architecture

### Data-Driven Pages

Service pages are defined as configuration objects in `astro/src/config/services/`. Each service specifies its slug, SEO metadata, hero content, features, and FAQs. This allows adding new services without creating new page components.

### Routing

Astro file-based routing — every `.astro` file in `astro/src/pages/` is a route. Dynamic routes use `[slug].astro`.

### Design System

CSS custom properties defined in `astro/src/styles/` power the entire visual system. See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for the full token reference.

### Environment Variables

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for all required and optional environment variables.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

Private — Mailbox Plus of Ohio, LLC
