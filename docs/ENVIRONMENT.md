# Environment Variables

All environment variables are loaded from `.env` or Netlify dashboard environment settings.

## Required Runtime Environment Variables

| Variable | Description | Example / Context |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend API key for contact form emails | `re_123456789...` |
| `STRIPE_SECRET_KEY` | Stripe secret key for mailbox checkout sessions | `sk_live_...` |
| `GEMINI_API_KEY` | Google Gemini API key for AI embeddings/chat | `AIzaSy...` |
| `GOOGLE_PLACES_API_KEY` | Google Places API key for Google reviews sync | `AIzaSy...` |
| `NETLIFY_AUTH_TOKEN` | Netlify API authentication token | `nfp_...` |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret key for serverless verification (server-only) | `6Lc...` |
| `SITE_URL` | Canonical site URL (e.g., https://mailboxplusohio.com) | `https://mailboxplusohio.com` |

## Additional Frontend / Build Variables

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_R2_PUBLIC_BASE_URL` | Public R2 bucket base URL for images | `https://pub-xxx.r2.dev` |
| `VITE_GOOGLE_MAPS_KEY` | Google Maps API key for embed | `AIzaSy...` |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key for frontend forms | `6Lc...` |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | `https://...` |
| `VITE_SENTRY_ENVIRONMENT` | Sentry environment tag | `production` |
| `CONTACT_EMAIL` | Destination email for contact form submissions | `info@mailboxplusohio.com` |

## Setting Up Local Development

1. Copy `.env.example` to `.env`
2. Fill in the required variables
3. Run `npm run dev`

## Production Deployment

All `VITE_` variables are injected at build time. Netlify function variables are set separately in the Netlify dashboard under Site settings > Environment variables.

