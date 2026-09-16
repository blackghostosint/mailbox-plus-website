export async function verifyRecaptchaToken(token?: string, remoteip?: string): Promise<boolean> {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return false;
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error('reCAPTCHA secret key (RECAPTCHA_SECRET_KEY) is missing from environment');
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

    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5');
    if (typeof data.score === 'number' && data.score < minScore) {
      console.warn(`reCAPTCHA score ${data.score} below minimum threshold ${minScore}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    return false;
  }
}
