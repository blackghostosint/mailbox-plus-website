# Environment Variables

All environment variables are loaded from `.env` at build time via Vite's `import.meta.env` or accessed via `process.env` in serverless functions and Node.js verification scripts.

## Required Variables

| Variable                  | Description                            | Example                  |
| ------------------------- | -------------------------------------- | ------------------------ |
| `VITE_R2_PUBLIC_BASE_URL` | Public R2 bucket base URL for images   | `https://pub-xxx.r2.dev` |
| `VITE_GOOGLE_MAPS_KEY`    | Google Maps API key for embed          | `AIza...`                |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key for contact form | `6Lc...`                 |

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

| Variable               | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 server-side secret key (used by `lib/recaptcha.ts` for token verification)     |
| `RESEND_API_KEY`       | Resend API key for sending contact form emails (`sendEmail.ts`)                             |
| `STRIPE_SECRET_KEY`    | Stripe secret key for mailbox checkout sessions (`create-checkout.ts`, `verify-session.ts`) |
| `CONTACT_EMAIL`        | Destination email for contact form submissions                                              |

### reCAPTCHA Site Key vs. Secret Key

- **`VITE_RECAPTCHA_SITE_KEY` (Public Site Key):** Loaded by front-end pages (`contact-us.astro`, `accessibility.astro`) via `astro/src/lib/env.ts` to render the Google reCAPTCHA v3 client token generator. Safe for client bundles.
- **`RECAPTCHA_SECRET_KEY` (Server Secret Key):** Kept strictly on the server/Netlify function runtime and loaded via `netlify/functions/lib/env.ts` to verify user reCAPTCHA tokens against Google's verification endpoint. **Never** prefix with `VITE_` or expose to the client.

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
