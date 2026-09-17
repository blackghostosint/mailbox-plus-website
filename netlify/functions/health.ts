/**
 * Health Check Netlify Function
 * Returns 200 OK with timestamp and basic system status
 * Used for uptime monitoring and load balancer health checks
 */

import type { Context } from 'https://edge.netlify.com/';
import { z } from 'zod';
import { withWebCors, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';

export const HealthQuerySchema = z.object({
  verbose: z
    .string()
    .optional()
    .transform((val) => val === 'true' || val === '1'),
});

export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  environment: z.string(),
  checks: z.record(z.string()),
  responseTime: z.number(),
});

export type HealthQuery = z.infer<typeof HealthQuerySchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export default withWebCors(
  async (request: Request, context: Context) => {
    const startTime = Date.now();

    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    HealthQuerySchema.safeParse(queryParams);

    // Basic health checks
    const healthData: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment:
        (typeof Netlify !== 'undefined' && Netlify.env?.get('CONTEXT')) ||
        process.env.CONTEXT ||
        'unknown',
      checks: {
        // Add more checks as needed (database, external APIs, etc.)
        server: 'ok',
      },
      responseTime: 0, // Will be calculated below
    };

    // You can add more sophisticated checks here:
    // - Check R2 image CDN connectivity
    // - Check API endpoints
    // - Check database connectivity (if applicable)

    const responseTime = Date.now() - startTime;
    healthData.responseTime = responseTime;

    return new Response(JSON.stringify(healthData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'true',
      },
    });
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS }
);
