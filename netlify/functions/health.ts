/**
 * Health Check Netlify Function
 * Returns 200 OK with timestamp and basic system status
 * Used for uptime monitoring and load balancer health checks
 *
 * @openapi
 * /.netlify/functions/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns 200 OK with timestamp, environment status, and response time
 *     operationId: healthCheck
 *     responses:
 *       '200':
 *         description: System health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                 checks:
 *                   type: object
 *                 responseTime:
 *                   type: number
 */

import type { Context } from 'https://edge.netlify.com/';
import { withCors, jsonResponse, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';

export default withCors(
  async (request: Request, context: Context) => {
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

    return jsonResponse(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'true',
      },
    });
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS, rateLimit: { maxRequests: 60, windowMs: 60 * 1000 } }
);
