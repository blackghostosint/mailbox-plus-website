# Performance Optimization Strategy — Draft

## Context / Baseline

Bundle state as of the May 30 survey:

- vendor chunk: ~794 KB raw / ~222 KB gzipped
- index chunk: ~388 KB raw / ~89 KB gzipped
- motion chunk: ~33 KB raw / ~11 KB gzipped
- total JS raw: ~1.5 MB

The vendor chunk is the main problem: it drags React, Sentry, Gemini SDK, router, and misc node modules into one download on first visit.

## Proposed Changes

### 1. Remove unused/risky dependencies (low risk, clean dependency tree)

- Remove `@sentry/react` unless a specific error-tracking feature is active. It accounts for ~150-200 KB.
- Keep `@google/generative-ai` but load it only on the AI/AST page with dynamic import so it doesn't bloat the initial bundle.
- Replace `gray-matter` with a smaller frontmatter-only parser. It also has a known eval-based pattern that is unnecessary on the frontend.
- Run `npm prune` after cleanup.

Risk: low — no UI feature changes involved.

### 2. Replace framer-motion with CSS animations where possible

- `framer-motion` currently forms its own ~32 KB chunk. Several premium signup and hero animations in the current codebase already have CSS-driven equivalents.
- Replace animation-only interactions with CSS transitions/keyframes.
- Scope: motion on the premier signup flow, hero fade-ins, slide-in details, toast animations.
- If a complex FLIP animation is still needed on one specific page, lazy-load motion only there.

Risk: medium — this is a behavior change, so every animated component needs manual verification.

### 3. Better vendor chunk splitting

- Turn chunking into route-aware groups so shared vendor code is reused while page-specific code is split apart.
- Proposed groups:
  - router-common: react, react-dom, react-router-dom
  - ai: @google/generative-ai
  - monitoring: @sentry/react
  - markdown: react-markdown, remark-gfm
  - security: qrcode.react, react-google-recaptcha
  - analytics: react-gtm-module, react-helmet-async
  - utils: uuid and other small helpers
  - ui-libs: @radix-ui and other shared UI code

Risk: low — this is build-time config only.

### 4. Route code splitting + lazy loading

- Convert page-level routes to `React.lazy()` with a small loading fallback.
- Pages to lazy load first: Privacy, Terms, About, Contact.
- Pages likely to hold page-specific heavy logic to evaluate later: Blog/FAQ.

Risk: low — TTLs and Netlify caching will preserve SPA routing behavior.

### 5. Image optimization policy

- Convert public assets to WebP/AVIF where serving them from the same origin is feasible.
- Add width/height attributes to media placeholders to reduce CLS.
- If image hosting is offloaded later, the lazy-loading pattern should still be enforced.

Risk: low.

## Impact vs Effort

1. Unused dependency removal: High impact, 15 min
2. Vendor chunk resplit: High impact, 1-2 hours
3. Route lazy loading: High impact, 1 hour
4. Motion -> CSS: Medium impact, 1-2 hours
5. Image optimization: Medium impact, 30-60 min

## Decision points for Frank (reviewer)

1. Do we drop `@sentry/react` entirely, or just defer-load it?
2. Do we convert all motion to CSS, or keep motion on the premium signup flow?
3. Should we proceed in a single cherry-pick-friendly PR, or a smaller ticket-per-change flow?
