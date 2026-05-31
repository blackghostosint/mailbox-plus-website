// Sentry configuration for Mailbox Plus website
// Set up Sentry DSN in environment variables: VITE_SENTRY_DSN

import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,

    // Performance monitoring - sample rate for transactions
    tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,

    // Error sampling
    sampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,

    // Do not send PII by default
    sendDefaultPii: false,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeSend(event, _hint) {
      // Filter out network errors
      if (event.exception) {
        const exception = event.exception.values?.[0];
        if (exception?.type === 'NetworkError') {
          return null;
        }
      }

      // Scrub potential PII from URLs
      if (event.request?.url) {
        try {
          const url = new URL(event.request.url);
          // Remove query params that might contain PII (email, phone, etc.)
          ['email', 'phone', 'name', 'address', 'token', 'key', 'password'].forEach((param) => {
            url.searchParams.delete(param);
          });
          event.request.url = url.toString();
        } catch {
          // Invalid URL, skip scrubbing
        }
      }

      // Scrub user email/ID if somehow set
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }

      return event;
    },
  });

  console.log(`Sentry initialized: ${SENTRY_ENVIRONMENT} environment`);
} else {
  console.warn('Sentry DSN not found. Error tracking disabled.');
}

export default Sentry;
