import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { verifyRecaptchaToken } from './lib/recaptcha';
import { registry, createValidationErrorResponse, ErrorResponseSchema } from './lib/openapi-registry';

export const VerifyRecaptchaRequestSchema = z
  .object({
    token: z.string().optional(),
    recaptchaToken: z.string().optional(),
    'g-recaptcha-response': z.string().optional(),
  })
  .refine(
    (data) => !!(data.token || data.recaptchaToken || data['g-recaptcha-response']),
    { message: 'A reCAPTCHA token is required' }
  )
  .openapi('VerifyRecaptchaRequest');

export const VerifyRecaptchaResponseSchema = z
  .object({
    success: z.boolean(),
    score: z.number().optional(),
    error: z.string().optional(),
    details: z.any().optional(),
  })
  .openapi('VerifyRecaptchaResponse');

export type VerifyRecaptchaRequest = z.infer<typeof VerifyRecaptchaRequestSchema>;
export type VerifyRecaptchaResponse = z.infer<typeof VerifyRecaptchaResponseSchema>;

registry.registerPath({
  method: 'post',
  path: '/.netlify/functions/verifyRecaptcha',
  summary: 'Verify reCAPTCHA token',
  request: {
    body: {
      content: {
        'application/json': {
          schema: VerifyRecaptchaRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'reCAPTCHA verification result',
      content: {
        'application/json': {
          schema: VerifyRecaptchaResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation failed or reCAPTCHA verification failed',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Server error',
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
      body: JSON.stringify({ success: false, error: 'Invalid JSON body' }),
    };
  }

  const parseResult = VerifyRecaptchaRequestSchema.safeParse(bodyData);
  if (!parseResult.success) {
    return createValidationErrorResponse(parseResult.error);
  }

  const data = parseResult.data;
  const token = data.token || data.recaptchaToken || data['g-recaptcha-response'];
  const clientIp =
    event.headers?.['client-ip'] || event.headers?.['x-forwarded-for']?.split(',')[0]?.trim();

  try {
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
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

export default handler;
