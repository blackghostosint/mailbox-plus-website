/**
 * Health Check Netlify Function
 * Returns 200 OK with timestamp and basic system status
 * Used for uptime monitoring and load balancer health checks
 */

import type { Context } from 'https://edge.netlify.com/';

export default async (request: Request, context: Context) => {
  const startTime = Date.now();

  // Basic health checks
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: Netlify.env.get('CONTEXT') || 'unknown',
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
};
