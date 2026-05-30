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

    // Optional: Enable session replay for staging
    // replaysSessionSampleRate: 0.1,
    // replaysOnErrorSampleRate: 1.0,

    beforeSend(event) {
      // Filter out specific errors if needed
      if (event.exception) {
        const exception = event.exception.values?.[0];
        // Example: Filter out network errors from dev tools
        if (exception?.type === 'NetworkError') {
          return null;
        }
      }
      return event;
    },
  });

  console.log(`Sentry initialized: ${SENTRY_ENVIRONMENT} environment`);
} else {
  console.warn('Sentry DSN not found. Error tracking disabled.');
}

export default Sentry;
