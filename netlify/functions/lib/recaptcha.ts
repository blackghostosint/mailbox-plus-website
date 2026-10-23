import { logger } from './logger';
import { getRecaptchaMinScore } from './fallbacks';
import { httpClient } from './http-client';
import { jsonError, type WebHandler } from './cors';
import { getClientIp } from './rate-limiter';
import * as crypto from 'crypto';

export interface RecaptchaOptions {
  action?: string;
}

// ---------- reCAPTCHA Enterprise verification ----------
// The classic siteverify endpoint rejects Enterprise tokens (verified 2026-10-21),
// and the production secret/site-key pair was mismatched. When the Enterprise
// env vars are present we verify via the assessments API using a self-signed
// service-account JWT; otherwise we fall back to classic siteverify.

interface SaCredentials {
  client_email: string;
  private_key: string;
  project_id: string;
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function getEnterpriseConfig() {
  const project = process.env.RECAPTCHA_ENTERPRISE_PROJECT;
  const keyId = process.env.RECAPTCHA_ENTERPRISE_KEY_ID;
  const saB64 = process.env.RECAPTCHA_SA_JSON_B64;
  if (!project || !keyId || !saB64) return null;
  try {
    const sa = JSON.parse(Buffer.from(saB64, 'base64').toString('utf8')) as SaCredentials;
    if (!sa.client_email || !sa.private_key) return null;
    return { project, keyId, sa };
  } catch {
    logger.error('RECAPTCHA_SA_JSON_B64 is not valid base64 JSON');
    return null;
  }
}

async function getAccessToken(sa: SaCredentials): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt - 120 > now) {
    return cachedAccessToken.token;
  }
  try {
    const header = { alg: 'RS256', typ: 'JWT' };
    const claims = {
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3300,
    };
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const unsigned = `${b64(header)}.${b64(claims)}`;
    const signature = crypto
      .createSign('RSA-SHA256')
      .update(unsigned)
      .sign(sa.private_key.replace(/\\n/g, '\n'))
      .toString('base64url');
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: `${unsigned}.${signature}`,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      logger.error('Enterprise token exchange failed', { status: res.status });
      return null;
    }
    const data = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) return null;
    cachedAccessToken = {
      token: data.access_token,
      expiresAt: now + (data.expires_in ?? 3600),
    };
    return cachedAccessToken.token;
  } catch (error) {
    logger.error('Error minting Enterprise access token', error);
    return null;
  }
}

async function verifyEnterprise(
  token: string,
  cfg: NonNullable<ReturnType<typeof getEnterpriseConfig>>
): Promise<boolean> {
  const accessToken = await getAccessToken(cfg.sa);
  if (!accessToken) return false;
  try {
    const res = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${cfg.project}/assessments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: { token, siteKey: cfg.keyId },
        }),
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) {
      logger.error('Enterprise assessment request failed', { status: res.status });
      return false;
    }
    const data = (await res.json()) as {
      tokenProperties?: { valid?: boolean; invalidReason?: string };
      riskAnalysis?: { score?: number };
    };
    if (!data.tokenProperties?.valid) {
      logger.warn('Enterprise token invalid', {
        reason: data.tokenProperties?.invalidReason,
      });
      return false;
    }
    const minScore = getRecaptchaMinScore();
    const score = data.riskAnalysis?.score;
    if (typeof score === 'number' && score < minScore) {
      logger.warn('Enterprise score below minimum threshold', { score, minScore });
      return false;
    }
    return true;
  } catch (error) {
    logger.error('Error verifying Enterprise token', error);
    return false;
  }
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

  // Prefer reCAPTCHA Enterprise verification when configured (classic siteverify
  // cannot validate Enterprise tokens — verified 2026-10-21).
  const enterprise = getEnterpriseConfig();
  if (enterprise) {
    return verifyEnterprise(token, enterprise);
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
