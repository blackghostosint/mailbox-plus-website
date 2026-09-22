/**
 * CSP Report Collector Netlify Function
 * Endpoint: /.netlify/functions/csp-report
 *
 * Authorization & Anti-Abuse Model (AGENTS.md Rule 7):
 * - Auth: Public / Unauthenticated endpoint (no user login or token required).
 * - Identity & Verification: Receives anonymous browser Content-Security-Policy violation reports.
 * - Rate Limiting & CORS: Restricted to DEFAULT_ALLOWED_ORIGINS.
 *   Enforces sliding-window IP rate limiting via @netlify/blobs (10 requests / 1 min).
 *
 * Dependencies (AGENTS.md Rule 2):
 * - Relies on @netlify/functions for Context types and @types/node for Node.js runtime types.
 */

import type { Context } from '@netlify/functions';
import { withCors, jsonError, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';
import { logger } from './lib/logger';
import { CspReportRequestSchema } from './lib/contracts';

export default withCors(
  async (request: Request, context: Context) => {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return jsonError('Method not allowed', 405);
    }

    try {
      const rawBody = await request.json();
      const parsed = CspReportRequestSchema.safeParse(rawBody);
      if (!parsed.success) {
        return jsonError('Bad Request', 400);
      }
      const body = parsed.data;
      const reports = Array.isArray(body) ? body : [body];

      for (const item of reports) {
        const details: Record<string, any> =
          item && typeof item === 'object' && 'csp-report' in item && item['csp-report']
            ? (item['csp-report'] as Record<string, any>)
            : item && typeof item === 'object' && 'body' in item && item.body
              ? (item.body as Record<string, any>)
              : (item as Record<string, any>);

        const topUrl =
          item && typeof item === 'object' && 'url' in item ? (item.url as string) : undefined;
        const topUa =
          item && typeof item === 'object'
            ? 'user_agent' in item
              ? (item.user_agent as string)
              : 'userAgent' in item
                ? (item.userAgent as string)
                : undefined
            : undefined;

        // Log the violation with automatic parameter / URL redaction
        logger.warn('[CSP Violation]', {
          documentUri:
            details['document-uri'] || details.documentUri || details.documentURL || topUrl,
          violatedDirective: details['violated-directive'] || details.violatedDirective,
          blockedUri: details['blocked-uri'] || details.blockedUri || details.blockedURL,
          sourceFile: details['source-file'] || details.sourceFile,
          lineNumber: details['line-number'] || details.lineNumber,
          userAgent: topUa || request.headers.get('user-agent') || 'unknown',
        });
      }

      return new Response(null, {
        status: 204,
      });
    } catch (err) {
      logger.error('[CSP Report Error]', err);
      return jsonError('Bad Request', 400);
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS, rateLimit: { maxRequests: 10, windowMs: 60 * 1000 } }
);

export const config = {
  path: '/.netlify/functions/csp-report',
};
