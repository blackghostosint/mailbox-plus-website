import { Resend } from 'resend';
import { z } from 'zod';
import { verifyRecaptchaToken } from './lib/recaptcha';

export const SendEmailSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().default(''),
  service: z.string().optional().default(''),
  message: z.string().min(1, 'Message is required'),
  recaptchaToken: z.string().optional(),
  token: z.string().optional(),
  'g-recaptcha-response': z.string().optional(),
});

export const SendEmailResponseSchema = z.object({
  success: z.boolean().optional(),
  error: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

export type SendEmailRequest = z.infer<typeof SendEmailSchema>;
export type SendEmailResponse = z.infer<typeof SendEmailResponseSchema>;

export const handler = async (event: any) => {
  try {
    let bodyData: any;
    try {
      bodyData = JSON.parse(event.body || '{}');
    } catch {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }

    const parseResult = SendEmailSchema.safeParse(bodyData);
    if (!parseResult.success) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Validation failed',
          details: parseResult.error.flatten(),
        }),
      };
    }

    const data = parseResult.data;
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
      to: 'help@mailboxplusohio.com',
      reply_to: data.email,
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to send message' }),
    };
  }
};
