# Mailbox Plus Website

The official website for Mailbox Plus — a community-focused pack & ship retail store in Concord Township, Ohio.

**Live site:** [mailboxplusohio.com](https://mailboxplusohio.com)

## Tech Stack

| Layer         | Technology                                             |
| ------------- | ------------------------------------------------------ |
| Frontend      | React 19, TypeScript (strict), Vite 7                  |
| Desktop shell | Tauri v2                                               |
| Styling       | Tailwind CSS 3 + CSS custom properties (design tokens) |
| Testing       | Vitest (unit), Playwright (E2E)                        |
| CI/CD         | GitHub Actions → Netlify                               |
| Monitoring    | Sentry                                                 |
| Analytics     | Google Analytics 4, Google Tag Manager                 |

## Quick Start

```bash
npm install
cp .env.example .env    # Fill in required variables
npm run dev             # Dev server at http://localhost:5173
npm run build           # Production build
npm test                # Unit tests
npm run lint            # ESLint + typecheck
```

## Architecture

### Data-Driven Pages

Service pages are defined as configuration objects in `src/config/services/`. Each service specifies its slug, SEO metadata, hero content, features, and FAQs. This allows adding new services without creating new page components.

### Routing

React Router v6 handles all client-side routing. Routes are defined in `src/App.tsx` with lazy-loaded page components for optimal bundle splitting.

### Design System

CSS custom properties defined in `src/index.css` power the entire visual system. See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for the full token reference.

### Environment Variables

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for all required and optional environment variables.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

Private — Mailbox Plus of Ohio, LLC
