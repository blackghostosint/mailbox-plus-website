import { verifyRecaptchaToken } from './lib/recaptcha';

export const handler = async (event) => {
  try {
    const data = JSON.parse(event.body || '{}');
    const token = data.token || data.recaptchaToken || data['g-recaptcha-response'];
    const clientIp =
      event.headers?.['client-ip'] || event.headers?.['x-forwarded-for']?.split(',')[0]?.trim();

    const success = await verifyRecaptchaToken(token, clientIp);
    if (!success) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'reCAPTCHA verification failed' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
