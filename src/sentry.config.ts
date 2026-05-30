// Sentry configuration for Mailbox Plus website
// Set up Sentry DSN in environment variables: SENTRY_DSN

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || "production";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    integrations: [
      new BrowserTracing({
        // Set up tracing for React Router
        routingInstrumentation: Sentry.reactRouterV6Instrumentation,
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
    // In production, you might want to lower this to 0.1 or 0.01
    tracesSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,
    
    // Capture 100% of errors in staging, 10% in production
    sampleRate: SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,

    beforeSend(event) {
      // Filter out specific errors if needed
      if (event.exception) {
        const exception = event.exception.values?.[0];
        // Example: Filter out network errors from dev tools
        if (exception?.type === "NetworkError") {
          return null;
        }
      }
      return event;
    },
  });

  console.log(`Sentry initialized: ${SENTRY_ENVIRONMENT} environment`);
} else {
  console.warn("Sentry DSN not found. Error tracking disabled.");
}

export default Sentry;
