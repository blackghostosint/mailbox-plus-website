import { apiFetch } from './api-client';
import { VerifySessionSuccessSchema, type VerifySessionSuccess } from './contracts';

export async function verifyCheckoutSession(sessionId: string): Promise<VerifySessionSuccess> {
  const data = await apiFetch<unknown>(
    '/.netlify/functions/verify-session?session_id=' + encodeURIComponent(sessionId)
  );
  return VerifySessionSuccessSchema.parse(data);
}
