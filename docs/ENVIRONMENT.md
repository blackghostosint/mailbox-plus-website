# Environment Variables

All environment variables are loaded from `.env` at build time via Vite's `import.meta.env`.

## Required Variables

| Variable                  | Description                            | Example                  |
| ------------------------- | -------------------------------------- | ------------------------ |
| `VITE_R2_PUBLIC_BASE_URL` | Public R2 bucket base URL for images   | `https://pub-xxx.r2.dev` |
| `VITE_GOOGLE_MAPS_KEY`    | Google Maps API key for embed          | `AIza...`                |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key for contact form | `6Lc...`                 |

## Optional Variables

| Variable                      | Description                    | Default      |
| ----------------------------- | ------------------------------ | ------------ |
| `VITE_SENTRY_DSN`             | Sentry DSN for error tracking  | (none)       |
| `VITE_SENTRY_ENVIRONMENT`     | Sentry environment tag         | `production` |
| `VITE_GEMINI_API_KEY`         | Gemini API key for AI features | (none)       |
| `VITE_GEMINI_TIMEOUT_SECONDS` | Gemini API timeout             | `90`         |

## Netlify Function Variables

These are set in the Netlify dashboard (Site settings > Environment variables), not in `.env`:

| Variable               | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 server-side secret                |
| `SENDGRID_API_KEY`     | SendGrid API key for contact form emails       |
| `CONTACT_EMAIL`        | Destination email for contact form submissions |

## Setting Up Local Development

1. Copy `.env.example` to `.env`
2. Fill in the required variables
3. Run `npm run dev`

## Production Deployment

All `VITE_` variables are injected at build time. Set them in:

- Netlify dashboard: Site settings > Environment variables
- Or in `.env` file (not committed to git)

Netlify function variables are set separately in the Netlify dashboard.
