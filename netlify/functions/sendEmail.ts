import { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { verifyRecaptchaToken } from './lib/recaptcha';
import { withCors, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';

// IP-based sliding window rate limiter (max 5 submissions per 10 minutes per IP)
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (!record || now > record.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export const handler: Handler = withCors(
  async (event: any) => {
    if (event.httpMethod && event.httpMethod.toUpperCase() !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    try {
      const clientIp =
        event.headers?.['client-ip'] ||
        event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
        'unknown';

      if (!checkRateLimit(clientIp)) {
        return {
          statusCode: 429,
          body: JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        };
      }

      const data = JSON.parse(event.body || '{}');

      const token = data.recaptchaToken || data.token || data['g-recaptcha-response'];
      const isValid = await verifyRecaptchaToken(token, clientIp);
      if (!isValid) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'reCAPTCHA verification failed' }),
        };
      }

      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing from environment');
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to send message' }),
        };
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Mailbox Plus <no-reply@mailboxplusohio.com>',
        to: 'help@mailboxplusohio.com', // your Workspace inbox
        reply_to: data.email, // so replies go back to the sender
        subject: `New Contact Form Submission from ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Service Interest:</strong> ${data.service}</p>
          <p><strong>Message:</strong><br>${data.message}</p>
        `,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to send message' }),
      };
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS }
);
