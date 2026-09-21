# Environment Variables

All environment variables are loaded from `.env` at build time via Vite's `import.meta.env` or accessed via `process.env` in serverless functions and Node.js verification scripts.

## Required Variables

| Variable                  | Description                                                      | Example                                               |
| ------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| `VITE_R2_PUBLIC_BASE_URL` | Public R2 bucket base URL for images                             | `https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev` |
| `VITE_GOOGLE_MAPS_KEY`    | Google Maps API key for embed                                    | `AIza...`                                             |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key for contact form (or `RECAPTCHA_SITE_KEY`) | `6Lc...`                                              |

## Client Build & Runtime Context Variables

| Variable                  | Description                                                                             | Default       |
| ------------------------- | --------------------------------------------------------------------------------------- | ------------- |
| `VITE_NETLIFY_CONTEXT`    | Netlify deployment context passed to Vite client (`production`, `deploy-preview`, etc.) | `development` |
| `VITE_SENTRY_DSN`         | Sentry DSN for error tracking                                                           | (none)        |
| `VITE_SENTRY_ENVIRONMENT` | Sentry environment tag                                                                  | `production`  |

## Netlify Function Variables

These are set in the Netlify dashboard (Site settings > Environment variables) for production functions, or in local `.env` when executing functions locally:

| Variable                | Description                                                                                                                     | Default / Fallback            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `NETLIFY_SITE_ID`       | Netlify Site ID for `@netlify/blobs` storage (rate limiting & response caching)                                                 | (none)                        |
| `NETLIFY_AUTH_TOKEN`    | Netlify Auth Token for `@netlify/blobs` API access                                                                              | (none)                        |
| `GOOGLE_PLACES_API_KEY` | Google Places API key for fetching live Google business reviews (`netlify/functions/reviews.ts`)                                | (none)                        |
| `RECAPTCHA_SECRET_KEY`  | reCAPTCHA v3 server-side secret key (used by `netlify/functions/lib/recaptcha.ts` for token verification)                       | (none)                        |
| `RECAPTCHA_MIN_SCORE`   | Minimum score threshold for reCAPTCHA v3 verification                                                                           | `0.5`                         |
| `RESEND_API_KEY`        | Resend API key for sending contact form emails (`netlify/functions/sendEmail.ts`)                                               | (none)                        |
| `STRIPE_SECRET_KEY`     | Stripe secret key for mailbox checkout sessions (`netlify/functions/create-checkout.ts`, `netlify/functions/verify-session.ts`) | `dummy_stripe_secret_key`     |
| `CONTACT_EMAIL`         | Destination email for contact form submissions                                                                                  | `help@mailboxplusohio.com`    |
| `SITE_URL`              | Site base URL for CORS origin checks and checkout redirect resolution                                                           | `https://mailboxplusohio.com` |
| `CONTEXT`               | Netlify deployment context (`production`, `deploy-preview`, `branch-deploy`) in health checks                                   | `development`                 |
| `NETLIFY_DEV`           | Netlify CLI environment variable indicating local dev server execution (`true`)                                                 | (none)                        |

### reCAPTCHA Site Key vs. Secret Key

- **`VITE_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SITE_KEY` (Public Site Key):** Loaded by front-end pages (`astro/src/pages/contact-us.astro`, `astro/src/pages/accessibility.astro`) to render the Google reCAPTCHA v3 client token generator. Safe for client bundles.
- **`RECAPTCHA_SECRET_KEY` (Server Secret Key):** Kept strictly on the server/Netlify function runtime to verify user reCAPTCHA tokens against Google's verification endpoint. **Never** prefix with `VITE_` or expose to the client.

## Tooling & Pre-Flight Verification Variables

Used by local and CI scripts (`scripts/verify/verify.mjs`, `scripts/audit-a11y.mjs`, `scripts/review-article-copy.ts`):

| Variable                 | Description                                                                | Default                                               |
| ------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------- |
| `GEMINI_API_KEY`         | Gemini API key for knowledge retrieval test suite and embedding generation | (none)                                                |
| `GEMINI_TIMEOUT_SECONDS` | Gemini API request timeout in seconds                                      | `90`                                                  |
| `OPENROUTER_API_KEY`     | OpenRouter API key for LLM direct-response copy review checks              | (none)                                                |
| `MODEL_API_KEY`          | Model API key override for LLM article copy review checks                  | (none)                                                |
| `AUDIT_BASE_URL`         | Target base URL for accessibility audits in `scripts/audit-a11y.mjs`       | `http://localhost:4173`                               |
| `BASE_URL`               | Alternative base URL fallback for accessibility audits                     | `http://localhost:4173`                               |
| `DIST_DIR`               | Compiled distribution output directory path override                       | `dist` / `astro/dist`                                 |
| `R2_PUBLIC_BASE`         | CDN base URL override for checking image asset availability                | `https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev` |
| `ARTICLE_DRAFTS_DIR`     | Directory path for fact-check receipts and article drafts                  | `content/drafts` (`.factchecks` in CI)                |
| `HEADING_OVERLAP_MAX`    | Maximum allowable heading-variation overlap ratio for articles             | `0.6`                                                 |

### Gemini API Key Configuration

- **Server Secret:** `GEMINI_API_KEY` is used strictly by server/build-time scripts (such as `npm run test:retrieval` and `npm run build:embeddings`). It must not use the `VITE_` prefix to prevent Vite from inlining secrets into client JavaScript bundles.

## Setting Up Local Development

1. Copy `.env.example` to `.env`
2. Fill in the required variables
3. Run `npm run verify:doctor` to confirm environment sanity
4. Run `npm run dev`

## Production Deployment

All `VITE_` variables are injected at build time. Set them in:

- Netlify dashboard: Site settings > Environment variables
- Or in `.env` file (not committed to git)

Netlify function variables are set separately in the Netlify dashboard.
