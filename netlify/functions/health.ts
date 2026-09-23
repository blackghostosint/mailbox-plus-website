/**
 * Health Check Netlify Function
 * Endpoint: /.netlify/functions/health
 *
 * Authorization & Anti-Abuse Model (AGENTS.md Rule 7):
 * - Auth: Public / Unauthenticated uptime monitoring endpoint.
 * - Identity & Verification: Anonymous health check probe (no token or session required).
 * - Rate Limiting & CORS: Restricted to DEFAULT_ALLOWED_ORIGINS.
 *   Enforces sliding-window IP rate limiting via @netlify/blobs (60 requests / 1 min).
 *
 * Dependencies (AGENTS.md Rule 2):
 * - Relies on @netlify/functions for Context types and @types/node for Node.js runtime types.
 */

import type { Context } from '@netlify/functions';
import { withCors, jsonResponse, jsonError, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';
import { HealthSuccessSchema } from './lib/contracts';

export default withCors(
  async (request: Request, context: Context) => {
    if (request.method && request.method.toUpperCase() !== 'GET') {
      return jsonError('Method Not Allowed', 405);
    }

    const startTime = Date.now();

    const netlifyGlobal = (
      globalThis as unknown as { Netlify?: { env?: { get: (key: string) => string | undefined } } }
    ).Netlify;

    // Basic health checks
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment:
        (typeof netlifyGlobal !== 'undefined' && netlifyGlobal.env?.get('CONTEXT')) ||
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

    const validatedPayload = HealthSuccessSchema.parse(healthData);

    return jsonResponse(validatedPayload, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'true',
      },
    });
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS, rateLimit: { maxRequests: 60, windowMs: 60 * 1000 } }
);
