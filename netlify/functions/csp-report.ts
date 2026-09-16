import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { registry, createValidationErrorResponse, ErrorResponseSchema } from './lib/openapi-registry';

export const CspReportRequestSchema = z
  .object({
    'csp-report': z.record(z.any()).optional(),
  })
  .passthrough()
  .openapi('CspReportRequest');

export const CspReportResponseSchema = z
  .object({
    status: z.string(),
  })
  .openapi('CspReportResponse');

export type CspReportRequest = z.infer<typeof CspReportRequestSchema>;
export type CspReportResponse = z.infer<typeof CspReportResponseSchema>;

registry.registerPath({
  method: 'post',
  path: '/.netlify/functions/csp-report',
  summary: 'Collect CSP violation reports',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CspReportRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Report accepted',
      content: {
        'application/json': {
          schema: CspReportResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid request payload',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let bodyData: any;
  try {
    bodyData = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const parseResult = CspReportRequestSchema.safeParse(bodyData);
  if (!parseResult.success) {
    return createValidationErrorResponse(parseResult.error);
  }

  const data = parseResult.data;
  const report = data['csp-report'] || data;

  console.warn(
    '[CSP Violation]',
    JSON.stringify({
      documentUri: report['document-uri'] || report.documentUri,
      violatedDirective: report['violated-directive'] || report.violatedDirective,
      blockedUri: report['blocked-uri'] || report.blockedUri,
      sourceFile: report['source-file'] || report.sourceFile,
      lineNumber: report['line-number'] || report.lineNumber,
      timestamp: new Date().toISOString(),
      userAgent: event.headers?.['user-agent'] || 'unknown',
    })
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ status: 'ok' }),
  };
};

export default handler;

export const config = {
  path: '/.netlify/functions/csp-report',
};
