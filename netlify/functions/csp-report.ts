/**
 * CSP Report Collector Netlify Function
 * Receives Content-Security-Policy violation reports from browsers
 * Logs them for monitoring (in production, forward to Sentry or a logging service)
 */

import type { Context } from 'https://edge.netlify.com/';
import { z } from 'zod';
import { withWebCors, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';

export const CspReportSchema = z.object({
  'csp-report': z
    .object({
      'document-uri': z.string().optional(),
      'violated-directive': z.string().optional(),
      'blocked-uri': z.string().optional(),
      'source-file': z.string().optional(),
      'line-number': z.number().optional(),
    })
    .passthrough()
    .optional(),
  documentUri: z.string().optional(),
  violatedDirective: z.string().optional(),
  blockedUri: z.string().optional(),
  sourceFile: z.string().optional(),
  lineNumber: z.number().optional(),
});

export type CspReportRequest = z.infer<typeof CspReportSchema>;

export default withWebCors(
  async (request: Request, context: Context) => {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const rawBody = await request.json();
      const parseResult = CspReportSchema.safeParse(rawBody);

      let report: any = {};
      if (parseResult.success) {
        report = parseResult.data['csp-report'] || parseResult.data;
      } else {
        report = rawBody['csp-report'] || rawBody || {};
      }

      // Log the violation (in production, send to Sentry or a logging service)
      console.warn(
        '[CSP Violation]',
        JSON.stringify({
          documentUri: report['document-uri'] || report.documentUri,
          violatedDirective: report['violated-directive'] || report.violatedDirective,
          blockedUri: report['blocked-uri'] || report.blockedUri,
          sourceFile: report['source-file'] || report.sourceFile,
          lineNumber: report['line-number'] || report.lineNumber,
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent') || 'unknown',
        })
      );

      return new Response(null, {
        status: 204,
      });
    } catch (err) {
      console.error('[CSP Report Error]', err);
      return new Response('Bad Request', { status: 400 });
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS }
);

export const config = {
  path: '/.netlify/functions/csp-report',
};
