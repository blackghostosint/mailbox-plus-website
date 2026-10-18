import { logger } from './logger';
import { getRecaptchaMinScore } from './fallbacks';
import { jsonError, type WebHandler } from './cors';
import { getClientIp } from './rate-limiter';

export interface RecaptchaOptions {
  action?: string;
}

export async function verifyRecaptchaToken(token?: string, remoteip?: string): Promise<boolean> {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return false;
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    logger.error('reCAPTCHA secret key (RECAPTCHA_SECRET_KEY) is missing from environment');
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const bodyParams = new URLSearchParams({
      secret,
      response: token,
    });
    if (remoteip) {
      bodyParams.append('remoteip', remoteip);
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { success?: boolean; score?: number };
    if (!data.success) {
      return false;
    }

    const minScore = getRecaptchaMinScore();
    if (typeof data.score === 'number' && data.score < minScore) {
      logger.warn('reCAPTCHA score below minimum threshold', { score: data.score, minScore });
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error verifying reCAPTCHA token', error);
    return false;
  }
}

export const recaptchaVerifier = {
  verify: verifyRecaptchaToken,
};

/**
 * Composable higher-order middleware function that wraps Netlify serverless handlers
 * to enforce reCAPTCHA v3 token verification on state-changing requests (e.g. POST).
 */
export function withRecaptcha(handler: WebHandler, _options?: RecaptchaOptions): WebHandler {
  return async (request: Request, context?: any) => {
    const method = request.method ? request.method.toUpperCase() : 'GET';

    // Bypass reCAPTCHA check for read-only / non-POST requests (GET, OPTIONS, etc.)
    if (method !== 'POST') {
      return handler(request, context);
    }

    const headerToken =
      request.headers.get('x-recaptcha-token') ||
      request.headers.get('recaptcha-token') ||
      request.headers.get('recaptchaToken') ||
      undefined;

    let bodyToken: string | undefined;
    if (!request.bodyUsed) {
      try {
        const clonedReq = request.clone();
        const body = await clonedReq.json();
        if (body && typeof body === 'object' && typeof body.recaptchaToken === 'string') {
          bodyToken = body.recaptchaToken;
        } else if (body && typeof body === 'object' && typeof body.recaptcha_token === 'string') {
          bodyToken = body.recaptcha_token;
        }
      } catch {
        // Body was not valid JSON or could not be cloned
      }
    }

    const token = headerToken || bodyToken;
    const clientIp = getClientIp(request.headers);

    const isValid = await recaptchaVerifier.verify(token, clientIp);
    if (!isValid) {
      return jsonError('reCAPTCHA verification failed', 400);
    }

    return handler(request, context);
  };
}
