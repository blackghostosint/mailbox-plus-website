import { Resend } from 'resend';
import { verifyRecaptchaToken } from './lib/recaptcha';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export const handler = async (event) => {
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

    const { name, email, phone, plan } = data;

    await resend.emails.send({
      from: 'Mailbox Plus <help@mailboxplusohio.com>',
      to: 'help@mailboxplusohio.com',
      subject: `📬 New Mailbox Reservation from ${name}`,
      html: `
        <h2>Mailbox Reservation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Selected Plan:</strong> ${plan}</p>
      `,
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error('Resend error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
