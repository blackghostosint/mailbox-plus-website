import { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { z } from 'zod';
import { verifyRecaptchaToken } from './lib/recaptcha';
import {
  registry,
  createValidationErrorResponse,
  ErrorResponseSchema,
} from './lib/openapi-registry';

export const SendReservationEmailRequestSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    plan: z.string().optional(),
    mailboxSize: z.string().optional(),
    term: z.string().optional(),
    token: z.string().optional(),
    recaptchaToken: z.string().optional(),
    'g-recaptcha-response': z.string().optional(),
  })
  .openapi('SendReservationEmailRequest');

export const SendReservationEmailResponseSchema = z
  .object({
    success: z.boolean().optional(),
    id: z.string().optional(),
    error: z.string().optional(),
    details: z.record(z.unknown()).optional(),
  })
  .openapi('SendReservationEmailResponse');

export type SendReservationEmailRequest = z.infer<typeof SendReservationEmailRequestSchema>;
export type SendReservationEmailResponse = z.infer<typeof SendReservationEmailResponseSchema>;

registry.registerPath({
  method: 'post',
  path: '/.netlify/functions/sendReservationEmail',
  summary: 'Send reservation email',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SendReservationEmailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Reservation email sent',
      content: {
        'application/json': {
          schema: SendReservationEmailResponseSchema,
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
      description: 'Server or Resend error',
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

  const parseResult = SendReservationEmailRequestSchema.safeParse(bodyData);
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
      body: JSON.stringify({ error: 'Failed to send reservation email' }),
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, phone, plan, mailboxSize } = data;

    await resend.emails.send({
      from: 'Mailbox Plus <help@mailboxplusohio.com>',
      to: 'help@mailboxplusohio.com',
      subject: `📬 New Mailbox Reservation from ${name}`,
      html: `
        <h2>Mailbox Reservation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Selected Plan:</strong> ${plan || mailboxSize || 'N/A'}</p>
      `,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (error: any) {
    console.error('Resend error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Failed to send reservation email' }),
    };
  }
};

export default handler;
