import { apiFetch } from './api-client';
import { CspReportRequestSchema, type CspReportRequest } from './contracts';

export async function sendCspReport(report: CspReportRequest): Promise<void> {
  const validatedReport = CspReportRequestSchema.parse(report);
  await apiFetch<unknown>('/.netlify/functions/csp-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedReport),
  });
}
