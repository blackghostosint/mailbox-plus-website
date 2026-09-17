import { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { getStore } from '@netlify/blobs';
import { verifyRecaptchaToken } from './lib/recaptcha';
import { withCors, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';
import { escapeHtml } from './lib/escapeHtml';

// IP-based sliding window rate limiter (max 5 submissions per 10 minutes per IP)
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Case-insensitively extracts the true client IP address from Netlify function headers.
 * Prioritizes Netlify Edge trusted headers ('x-nf-client-connection-ip' and 'client-ip')
 * which are set/overwritten by Netlify Edge proxies and cannot be spoofed by incoming client HTTP headers.
 */
export function getClientIp(headers: Record<string, string | undefined> = {}): string {
  const normalized: Record<string, string> = {};
  for (const [key, val] of Object.entries(headers || {})) {
    if (val) normalized[key.toLowerCase()] = String(val);
  }

  // Netlify Edge injects 'x-nf-client-connection-ip' with the true physical TCP connection IP
  if (normalized['x-nf-client-connection-ip']) {
    return normalized['x-nf-client-connection-ip'].trim();
  }

  // Netlify Edge also populates 'client-ip'
  if (normalized['client-ip']) {
    return normalized['client-ip'].trim();
  }

  // Fallback to 'x-forwarded-for' using the last IP appended by the edge proxy
  if (normalized['x-forwarded-for']) {
    const parts = normalized['x-forwarded-for']
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  return 'unknown';
}

export async function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): Promise<boolean> {
  const now = Date.now();
  const sanitizedIp = ip.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const blobKey = `rate_limit_${sanitizedIp}`;

  // 1. Attempt Netlify Blobs for persistent rate limiting across serverless instances
  try {
    const store = getStore({ name: 'sendEmail-rate-limits', consistency: 'strong' });
    const record = (await store.get(blobKey, { type: 'json' })) as {
      count: number;
      resetAt: number;
    } | null;

    if (!record || now > record.resetAt) {
      await store.setJSON(blobKey, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    await store.setJSON(blobKey, { count: record.count + 1, resetAt: record.resetAt });
    return true;
  } catch {
    // 2. Fallback to in-memory Map store (for local dev, test environments, or when Blobs store is unconfigured)
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
      const clientIp = getClientIp(event.headers);

      if (!(await checkRateLimit(clientIp))) {
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

      if (
        !data.email ||
        typeof data.email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid email address' }),
        };
      }

      const stringFields = ['name', 'phone', 'service', 'plan', 'message'];
      for (const field of stringFields) {
        const val = data[field];
        if (val !== undefined && val !== null && typeof val !== 'string') {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: `Invalid ${field}: must be a string` }),
          };
        }
      }

      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing from environment');
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to send message' }),
        };
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      const name = escapeHtml(data.name || '');
      const email = escapeHtml(data.email || '');
      const phone = escapeHtml(data.phone || '');
      const service = escapeHtml(data.service || '');
      const plan = escapeHtml(data.plan || '');
      const message = escapeHtml(data.message || '');

      const safeSubjectName = String(data.name || 'Customer').replace(/[\r\n]/g, ' ');

      let htmlBody = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service Interest:</strong> ${service}</p>
      `;
      if (plan) {
        htmlBody += `<p><strong>Plan:</strong> ${plan}</p>\n`;
      }
      htmlBody += `<p><strong>Message:</strong><br>${message}</p>`;

      let textBody = `New Contact Form Submission\n\nName: ${data.name || ''}\nEmail: ${data.email || ''}\nPhone: ${data.phone || ''}\nService Interest: ${data.service || ''}\n`;
      if (data.plan) {
        textBody += `Plan: ${data.plan}\n`;
      }
      textBody += `Message:\n${data.message || ''}`;

      await resend.emails.send({
        from: 'Mailbox Plus <no-reply@mailboxplusohio.com>',
        to: 'help@mailboxplusohio.com', // your Workspace inbox
        reply_to: data.email, // so replies go back to the sender
        subject: `New Contact Form Submission from ${safeSubjectName}`,
        html: htmlBody,
        text: textBody,
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
