import { z } from 'zod';
import { registry } from './lib/openapi-registry';

export const HealthResponseSchema = z
  .object({
    status: z.string(),
    timestamp: z.string(),
    environment: z.string().optional(),
    checks: z
      .object({
        server: z.string(),
      })
      .optional(),
    responseTime: z.number().optional(),
  })
  .openapi('HealthResponse');

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

registry.registerPath({
  method: 'get',
  path: '/.netlify/functions/health',
  summary: 'Health check endpoint',
  responses: {
    200: {
      description: 'System health status',
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});

export const handler = async () => {
  const startTime = Date.now();
  const healthData: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.CONTEXT || 'unknown',
    checks: {
      server: 'ok',
    },
    responseTime: Date.now() - startTime,
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Check': 'true',
    },
    body: JSON.stringify(healthData),
  };
};

export default handler;
