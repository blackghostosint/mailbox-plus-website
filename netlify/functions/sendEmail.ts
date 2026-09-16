import { Resend } from 'resend';
import { verifyRecaptchaToken } from './lib/recaptcha';

export const handler = async (event: any) => {
  try {
    const data = JSON.parse(event.body || '{}');

    const token = data.recaptchaToken || data.token || data['g-recaptcha-response'];
    const clientIp =
      event.headers?.['client-ip'] || event.headers?.['x-forwarded-for']?.split(',')[0]?.trim();
    const isValid = await verifyRecaptchaToken(token, clientIp);
    if (!isValid) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'reCAPTCHA verification failed' }),
      };
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing from environment');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
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
};
