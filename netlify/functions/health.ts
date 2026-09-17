/**
 * Health Check Netlify Function
 * Returns 200 OK with timestamp and basic system status
 * Used for uptime monitoring and load balancer health checks
 */

import type { Context } from 'https://edge.netlify.com/';
import { z } from 'zod';
import { withWebCors, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';

export const HealthQuerySchema = z.object({}).catchall(z.string()).optional();

export default withWebCors(
  async (request: Request, context: Context) => {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const queryResult = HealthQuerySchema.safeParse(queryParams);
    if (!queryResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid query parameters', details: queryResult.error.flatten() }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const startTime = Date.now();

    // Basic health checks
    const healthData = {
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
