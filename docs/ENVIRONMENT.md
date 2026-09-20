# Environment Variables

All environment variables are loaded from `.env` at build time via Vite's `import.meta.env` or accessed via `process.env` in serverless functions and Node.js verification scripts.

## Required Variables

| Variable                  | Description                                                      | Example                  |
| ------------------------- | ---------------------------------------------------------------- | ------------------------ |
| `VITE_R2_PUBLIC_BASE_URL` | Public R2 bucket base URL for images                             | `https://pub-xxx.r2.dev` |
| `VITE_GOOGLE_MAPS_KEY`    | Google Maps API key for embed                                    | `AIza...`                |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key for contact form (or `RECAPTCHA_SITE_KEY`) | `6Lc...`                 |

## Optional Variables

| Variable                  | Description                                                   | Default      |
| ------------------------- | ------------------------------------------------------------- | ------------ |
| `VITE_SENTRY_DSN`         | Sentry DSN for error tracking                                 | (none)       |
| `VITE_SENTRY_ENVIRONMENT` | Sentry environment tag                                        | `production` |
| `GEMINI_API_KEY`          | Gemini API key for Node test scripts and embedding generation | (none)       |
| `GEMINI_TIMEOUT_SECONDS`  | Gemini API timeout                                            | `90`         |

### Pre-Flight Verification Variables (Optional)

Used by local and CI pre-flight verification scripts (`scripts/verify/verify.mjs`):

| Variable              | Description                                                    | Default                                               |
| --------------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| `R2_PUBLIC_BASE`      | CDN base URL override for checking image asset availability    | `https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev` |
| `ARTICLE_DRAFTS_DIR`  | Directory path for fact-check receipts and article drafts      | `content/drafts` (`.factchecks` in CI)                |
| `HEADING_OVERLAP_MAX` | Maximum allowable heading-variation overlap ratio for articles | `0.6`                                                 |

### Gemini API Key Configuration

- **Server Secret:** `GEMINI_API_KEY` is used strictly by server/build-time scripts (such as `npm run test:retrieval` and `npm run build:embeddings`). It must not use the `VITE_` prefix to prevent Vite from inlining secrets into client JavaScript bundles.

## Netlify Function Variables

These are set in the Netlify dashboard (Site settings > Environment variables) for production functions, or in local `.env` when executing functions locally:

| Variable                | Description                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `RECAPTCHA_SECRET_KEY`  | reCAPTCHA v3 server-side secret key (used by `lib/recaptcha.ts` for token verification)     |
| `RECAPTCHA_MIN_SCORE`   | Minimum allowable reCAPTCHA v3 score threshold (default: `0.5`)                             |
| `RESEND_API_KEY`        | Resend API key for sending contact form emails (`sendEmail.ts`)                             |
| `STRIPE_SECRET_KEY`     | Stripe secret key for mailbox checkout sessions (`create-checkout.ts`, `verify-session.ts`) |
| `CONTACT_EMAIL`         | Destination email for contact form submissions                                              |
| `GOOGLE_PLACES_API_KEY` | Google Places API key for Google reviews sync (`reviews.ts`, `fetch-reviews.mjs`)           |
| `SITE_URL`              | Primary site origin URL for CORS and checkout redirects (`create-checkout.ts`, `cors.ts`)   |
| `NETLIFY_SITE_ID`       | Netlify Site ID for Netlify Blobs storage (`reviews.ts`, `rate-limiter.ts`)                 |
| `NETLIFY_AUTH_TOKEN`    | Netlify Auth Token for Netlify Blobs storage (`reviews.ts`, `rate-limiter.ts`)              |

### Script & Build Environment Variables (Optional)

| Variable               | Description                                                                            | Default |
| ---------------------- | -------------------------------------------------------------------------------------- | ------- |
| `DIST_DIR`             | Compiled distribution output directory path (`scripts/lib/dist-path.mjs`)              | `dist`  |
| `AUDIT_BASE_URL`       | Base URL override for accessibility auditing (`scripts/audit-a11y.mjs`)                | (none)  |
| `BASE_URL`             | Alternative base URL override for accessibility auditing (`scripts/audit-a11y.mjs`)    | (none)  |
| `MODEL_API_KEY`        | Model API key override for article copy review (`scripts/review-article-copy.ts`)      | (none)  |
| `OPENROUTER_API_KEY`   | OpenRouter API key override for article copy review (`scripts/review-article-copy.ts`) | (none)  |
| `VITE_NETLIFY_CONTEXT` | Netlify context tag (`astro/src/utils/articleLoader.ts`)                               | (none)  |

### reCAPTCHA Site Key vs. Secret Key

- **`VITE_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SITE_KEY` (Public Site Key):** Loaded by front-end pages (`contact-us.astro`, `accessibility.astro`) to render the Google reCAPTCHA v3 client token generator. Safe for client bundles.
- **`RECAPTCHA_SECRET_KEY` (Server Secret Key):** Kept strictly on the server/Netlify function runtime to verify user reCAPTCHA tokens against Google's verification endpoint. **Never** prefix with `VITE_` or expose to the client.

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
