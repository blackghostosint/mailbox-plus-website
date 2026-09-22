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
      const report: Record<string, any> =
        body && typeof body === 'object' && 'csp-report' in body && body['csp-report']
          ? (body['csp-report'] as Record<string, any>)
          : (body as Record<string, any>);

      // Log the violation with automatic parameter / URL redaction
      logger.warn('[CSP Violation]', {
        documentUri: report['document-uri'] || report.documentUri,
        violatedDirective: report['violated-directive'] || report.violatedDirective,
        blockedUri: report['blocked-uri'] || report.blockedUri,
        sourceFile: report['source-file'] || report.sourceFile,
        lineNumber: report['line-number'] || report.lineNumber,
        userAgent: request.headers.get('user-agent') || 'unknown',
      });

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
