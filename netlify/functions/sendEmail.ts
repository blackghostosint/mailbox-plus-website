import { Resend } from 'resend';
import { verifyRecaptchaToken } from './lib/recaptcha';
import { withCors, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';
import { escapeHtml } from './lib/escapeHtml';
import { logger } from './lib/logger';
import { getClientIp } from './lib/rate-limiter';

export { getClientIp };

export const handler = withCors(
  async (request: Request) => {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
      const clientIp = getClientIp(request.headers);

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
        logger.error('RESEND_API_KEY is missing from environment');
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
      logger.error('Email sending error', error);
      return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 });
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS, rateLimit: { maxRequests: 5, windowMs: 10 * 60 * 1000 } }
);

export default handler;
