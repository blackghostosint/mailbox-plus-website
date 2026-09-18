import { Resend } from 'resend';
import { getStore } from '@netlify/blobs';
import { verifyRecaptchaToken } from './lib/recaptcha';
import { withCors, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';
import { escapeHtml } from './lib/escapeHtml';

// IP-based sliding window rate limiter (max 5 submissions per 10 minutes per IP)
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Case-insensitively extracts the true client IP address from Netlify function headers or Headers instance.
 * Prioritizes Netlify Edge trusted headers ('x-nf-client-connection-ip' and 'client-ip')
 * which are set/overwritten by Netlify Edge proxies and cannot be spoofed by incoming client HTTP headers.
 */
export function getClientIp(
  headers: Headers | Record<string, string | undefined> = new Headers()
): string {
  if (headers instanceof Headers) {
    const nfIp = headers.get('x-nf-client-connection-ip');
    if (nfIp) return nfIp.trim();

    const clientIp = headers.get('client-ip');
    if (clientIp) return clientIp.trim();

    const xForwardedFor = headers.get('x-forwarded-for');
    if (xForwardedFor) {
      const parts = xForwardedFor
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length > 0) return parts[parts.length - 1];
    }
    return 'unknown';
  }

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

export const handler = withCors(
  async (request: Request) => {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
      const clientIp = getClientIp(request.headers);

      if (!(await checkRateLimit(clientIp))) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }),
          { status: 429 }
        );
      }

      const data = await request.json().catch(() => ({}));

      const token = data.recaptchaToken || data.token || data['g-recaptcha-response'];
      const isValid = await verifyRecaptchaToken(token, clientIp);
      if (!isValid) {
        return new Response(JSON.stringify({ error: 'reCAPTCHA verification failed' }), {
          status: 400,
        });
      }

      if (
        !data.email ||
        typeof data.email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
      ) {
        return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400 });
      }

      const stringFields = [
        'name',
        'phone',
        'service',
        'plan',
        'message',
        'barrier_description',
        'url',
        'preferred_contact',
      ];
      for (const field of stringFields) {
        const val = data[field];
        if (val !== undefined && val !== null && typeof val !== 'string') {
          return new Response(JSON.stringify({ error: `Invalid ${field}: must be a string` }), {
            status: 400,
          });
        }
      }

      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing from environment');
        return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 });
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      const name = escapeHtml(data.name || '');
      const email = escapeHtml(data.email || '');
      const phone = escapeHtml(data.phone || '');
      const service = escapeHtml(data.service || '');
      const plan = escapeHtml(data.plan || '');
      const message = escapeHtml(data.message || data.barrier_description || '');
      const url = escapeHtml(data.url || '');
      const preferredContact = escapeHtml(data.preferred_contact || '');

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
      if (url) {
        htmlBody += `<p><strong>URL / Location:</strong> ${url}</p>\n`;
      }
      if (preferredContact) {
        htmlBody += `<p><strong>Preferred Contact:</strong> ${preferredContact}</p>\n`;
      }
      htmlBody += `<p><strong>Message:</strong><br>${message}</p>`;

      let textBody = `New Contact Form Submission\n\nName: ${data.name || ''}\nEmail: ${data.email || ''}\nPhone: ${data.phone || ''}\nService Interest: ${data.service || ''}\n`;
      if (data.plan) {
        textBody += `Plan: ${data.plan}\n`;
      }
      if (data.url) {
        textBody += `URL / Location: ${data.url}\n`;
      }
      if (data.preferred_contact) {
        textBody += `Preferred Contact: ${data.preferred_contact}\n`;
      }
      textBody += `Message:\n${data.message || data.barrier_description || ''}`;

      await resend.emails.send({
        from: 'Mailbox Plus <no-reply@mailboxplusohio.com>',
        to: 'help@mailboxplusohio.com', // your Workspace inbox
        reply_to: data.email, // so replies go back to the sender
        subject: `New Contact Form Submission from ${safeSubjectName}`,
        html: htmlBody,
        text: textBody,
      });

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error('Email sending error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 });
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS }
);

export default handler;
