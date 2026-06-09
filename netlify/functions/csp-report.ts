/**
 * CSP Report Collector Netlify Function
 * Receives Content-Security-Policy violation reports from browsers
 * Logs them for monitoring (in production, forward to Sentry or a logging service)
 */

import type { Context } from 'https://edge.netlify.com/';

export default async (request: Request, context: Context) => {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const report = body['csp-report'] || body;

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
