# Contributing to Mailbox Plus Website

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in required variables
4. Run `npm run dev` to start the development server

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/          # Header, Footer, Layout
│   ├── sections/        # CTA, ServiceGrid, CompetitorAlternative
│   ├── ui/              # Button, SearchBox, Modal, Accordion, etc.
│   └── SEO/             # Meta, PageMeta, JsonLd
├── config/              # Site configuration
│   ├── services/        # Service definitions (data-driven pages)
│   └── pageMeta.ts      # Page-level SEO metadata
├── pages/               # Route-level page components
├── utils/               # Utility functions
├── lib/                 # API clients, image helpers
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── data/                # Static JSON data (site structure, links)
└── index.css            # Global styles + design tokens
```

## Design System

See [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) for the full design token reference.

### Key Principles

- **Use design tokens** — always use `var(--color-*)` or Tailwind token classes, never hardcoded hex values
- **Use shadow tokens** — `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` instead of arbitrary values
- **Use border-radius tokens** — `rounded-lg` (26px) for cards, `rounded-xl` (30px) for panels
- **Responsive first** — use `sm:`, `md:`, `lg:` breakpoints consistently
- **Accessibility** — all images must have alt text, interactive elements must have focus indicators

## Code Style

- TypeScript strict mode is enabled
- ESLint + Prettier enforce code style (run `npm run lint`)
- Components should be functional with hooks
- Use `React.lazy()` for route-level code splitting

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (requires dev server running)
npx playwright test
```

## Adding a New Service Page

1. Create a service config in `src/config/services/`
2. Add the route in `src/App.tsx`
3. Add page metadata in `src/config/pageMeta.ts`
4. Run `npm run build` to verify

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
- CI must pass (build, lint, typecheck)
- Branch protection requires 1 approval
- No force pushes to `main`
