import { z } from 'zod';

/**
 * Standard Error Response Schema
 * Backward compatibility: { error: string }
 */
export const ErrorResponseSchema = z.object({
  error: z.string(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * 1. create-checkout Endpoint Contract
 */
export const ValidCheckoutTiers = z.enum([
  'small_mail_only',
  'small_packages10',
  'large_mail_only',
  'large_packages10',
  'business_small',
  'business_large',
]);
export type ValidCheckoutTier = z.infer<typeof ValidCheckoutTiers>;

export const CreateCheckoutRequestSchema = z.object({
  tier: z.string().refine((val) => ValidCheckoutTiers.options.includes(val as ValidCheckoutTier), {
    message: `Invalid tier. Must be one of: ${ValidCheckoutTiers.options.join(', ')}`,
  }),
});
export type CreateCheckoutRequest = z.infer<typeof CreateCheckoutRequestSchema>;

export const CreateCheckoutSuccessSchema = z.object({
  url: z.string().url(),
});
export type CreateCheckoutSuccess = z.infer<typeof CreateCheckoutSuccessSchema>;

export const CreateCheckoutResponseSchema = z.union([
  CreateCheckoutSuccessSchema,
  ErrorResponseSchema,
]);

/**
 * 2. sendEmail Endpoint Contract
 */
export const SendEmailRequestSchema = z.object({
  name: z.string().nullable().optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().nullable().optional(),
  service: z.string().nullable().optional(),
  plan: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  barrier_description: z.string().nullable().optional(),
  preferred_contact: z.string().nullable().optional(),
  recaptchaToken: z.string().nullable().optional(),
  token: z.string().nullable().optional(),
  'g-recaptcha-response': z.string().nullable().optional(),
});
export type SendEmailRequest = z.infer<typeof SendEmailRequestSchema>;

export const SendEmailSuccessSchema = z.object({
  success: z.literal(true),
});
export type SendEmailSuccess = z.infer<typeof SendEmailSuccessSchema>;

export const SendEmailResponseSchema = z.union([SendEmailSuccessSchema, ErrorResponseSchema]);

/**
 * 3. reviews Endpoint Contract
 */
export const ReviewsQuerySchema = z.object({}).optional();

export const ReviewDtoSchema = z.object({
  author: z.string().optional(),
  authorUri: z.string().optional(),
  rating: z.number().optional(),
  text: z.string().optional(),
  relativeTime: z.string().optional(),
  publishTime: z.string().optional(),
});
export type ReviewDto = z.infer<typeof ReviewDtoSchema>;

export const ReviewsSuccessSchema = z.object({
  rating: z.number(),
  userRatingCount: z.number(),
  reviews: z.array(ReviewDtoSchema),
  fetchedAt: z.string().optional(),
  source: z.enum(['live', 'cache', 'stale']).optional(),
});
export type ReviewsSuccess = z.infer<typeof ReviewsSuccessSchema>;

export const ReviewsResponseSchema = z.union([ReviewsSuccessSchema, ErrorResponseSchema]);

/**
 * 4. verify-session Endpoint Contract
 */
export const VerifySessionQuerySchema = z.object({
  session_id: z.string().regex(/^cs_(test|live)_[A-Za-z0-9]+$/, 'Invalid session_id'),
});
export type VerifySessionQuery = z.infer<typeof VerifySessionQuerySchema>;

export const VerifySessionSuccessSchema = z.object({
  ok: z.literal(true),
  tier: z.string().nullable(),
  product: z.string(),
  amount: z.number(),
  currency: z.string(),
});
export type VerifySessionSuccess = z.infer<typeof VerifySessionSuccessSchema>;

export const VerifySessionResponseSchema = z.union([
  VerifySessionSuccessSchema,
  ErrorResponseSchema,
]);

/**
 * 5. csp-report Endpoint Contract
 */
export const CspReportBodySchema = z
  .object({
    'document-uri': z.string().optional(),
    documentUri: z.string().optional(),
    documentURL: z.string().optional(),
    'violated-directive': z.string().optional(),
    violatedDirective: z.string().optional(),
    'blocked-uri': z.string().optional(),
    blockedUri: z.string().optional(),
    blockedURL: z.string().optional(),
    'source-file': z.string().optional(),
    sourceFile: z.string().optional(),
    'line-number': z.union([z.number(), z.string()]).optional(),
    lineNumber: z.union([z.number(), z.string()]).optional(),
    'column-number': z.union([z.number(), z.string()]).optional(),
    columnNumber: z.union([z.number(), z.string()]).optional(),
    'effective-directive': z.string().optional(),
    effectiveDirective: z.string().optional(),
    'original-policy': z.string().optional(),
    originalPolicy: z.string().optional(),
    disposition: z.string().optional(),
    referrer: z.string().optional(),
    'status-code': z.union([z.number(), z.string()]).optional(),
    statusCode: z.union([z.number(), z.string()]).optional(),
    sample: z.string().optional(),
    'script-sample': z.string().optional(),
    scriptSample: z.string().optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((val) => val !== undefined), {
    message: 'CSP report body must contain at least one valid CSP field',
  });

export const ModernCspReportItemSchema = z
  .object({
    type: z.string().optional(),
    age: z.number().optional(),
    url: z.string().optional(),
    user_agent: z.string().optional(),
    userAgent: z.string().optional(),
    body: CspReportBodySchema,
  })
  .strict();

export const CspReportRequestSchema = z.union([
  z.array(ModernCspReportItemSchema).min(1),
  ModernCspReportItemSchema,
  z.object({ 'csp-report': CspReportBodySchema }).strict(),
  CspReportBodySchema,
]);
export type CspReportRequest = z.infer<typeof CspReportRequestSchema>;

export const CspReportSuccessSchema = z.null();
export type CspReportSuccess = z.infer<typeof CspReportSuccessSchema>;

export const CspReportResponseSchema = z.union([CspReportSuccessSchema, ErrorResponseSchema]);

/**
 * 6. health Endpoint Contract
 */
export const HealthSuccessSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  environment: z.string(),
  checks: z.record(z.string(), z.string()),
  responseTime: z.number(),
});
export type HealthSuccess = z.infer<typeof HealthSuccessSchema>;

export const HealthResponseSchema = z.union([HealthSuccessSchema, ErrorResponseSchema]);
