import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export const ErrorResponseSchema = z
  .object({
    error: z.string(),
    details: z.record(z.unknown()).optional(),
  })
  .openapi('ErrorResponse');

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export function createValidationErrorResponse(error: z.ZodError) {
  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: 'Validation failed',
      details: error.flatten(),
    }),
  };
}
