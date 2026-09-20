/**
 * CSP Report Collector Netlify Function
 * Receives Content-Security-Policy violation reports from browsers
 * Logs them for monitoring (in production, forward to Sentry or a logging service)
 *
 * @openapi
 * /.netlify/functions/csp-report:
 *   post:
 *     summary: Collect CSP violation reports
 *     description: Receives Content-Security-Policy violation reports from browsers and logs them
 *     operationId: cspReport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               csp-report:
 *                 type: object
 *                 properties:
 *                   document-uri:
 *                     type: string
 *                   violated-directive:
 *                     type: string
 *                   blocked-uri:
 *                     type: string
 *                   source-file:
 *                     type: string
 *                   line-number:
 *                     type: integer
 *     responses:
 *       '204':
 *         description: Violation report logged successfully
 *       '400':
 *         description: Bad request
 *       '405':
 *         description: Method not allowed
 */

import type { Context } from 'https://edge.netlify.com/';
import { withCors, jsonError, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';
import { logger } from './lib/logger';

export default withCors(
  async (request: Request, context: Context) => {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return jsonError('Method not allowed', 405);
    }

    try {
      const body = await request.json();
      const report = body['csp-report'] || body;

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
