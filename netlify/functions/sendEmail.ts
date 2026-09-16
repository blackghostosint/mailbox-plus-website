import { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { z } from 'zod';
import { verifyRecaptchaToken } from './lib/recaptcha';
import {
  registry,
  createValidationErrorResponse,
  ErrorResponseSchema,
} from './lib/openapi-registry';

export const SendEmailRequestSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    service: z.string().optional(),
    message: z.string().min(1, 'Message is required'),
    token: z.string().optional(),
    recaptchaToken: z.string().optional(),
    'g-recaptcha-response': z.string().optional(),
  })
  .openapi('SendEmailRequest');

export const SendEmailResponseSchema = z
  .object({
    success: z.boolean().optional(),
    id: z.string().optional(),
    error: z.string().optional(),
    details: z.record(z.unknown()).optional(),
  })
  .openapi('SendEmailResponse');

export type SendEmailRequest = z.infer<typeof SendEmailRequestSchema>;
export type SendEmailResponse = z.infer<typeof SendEmailResponseSchema>;

registry.registerPath({
  method: 'post',
  path: '/.netlify/functions/sendEmail',
  summary: 'Send contact form email',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SendEmailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Email sent successfully',
      content: {
        'application/json': {
          schema: SendEmailResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation failed or reCAPTCHA error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Email sending failed',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

export const handler: Handler = async (event) => {
  let bodyData: any;
  try {
    bodyData = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const parseResult = SendEmailRequestSchema.safeParse(bodyData);
  if (!parseResult.success) {
    return createValidationErrorResponse(parseResult.error);
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

  try {
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
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${data.service || 'N/A'}</p>
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

export default handler;
