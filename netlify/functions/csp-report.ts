/**
 * CSP Report Collector Netlify Function
 * Receives Content-Security-Policy violation reports from browsers
 * Logs them for monitoring
 */

import type { Context } from 'https://edge.netlify.com/';
import { z } from 'zod';

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

export default async (request: Request, context: Context) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

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

    return new Response('OK', {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (err) {
    console.error('[CSP Report Error]', err);
    return new Response('Bad Request', { status: 400 });
  }
};

export const config = {
  path: '/.netlify/functions/csp-report',
};
