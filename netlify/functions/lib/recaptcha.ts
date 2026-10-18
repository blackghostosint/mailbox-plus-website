import { logger } from './logger';
import { getRecaptchaMinScore } from './fallbacks';
import { httpClient } from './http-client';

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
    const bodyParams = new URLSearchParams({
      secret,
      response: token,
    });
    if (remoteip) {
      bodyParams.append('remoteip', remoteip);
    }

    const data = await httpClient<{ success?: boolean; score?: number }>(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyParams.toString(),
        timeout: 3000,
        maxRetries: 2,
        retryPost: true,
      }
    );

    if (!data || !data.success) {
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
