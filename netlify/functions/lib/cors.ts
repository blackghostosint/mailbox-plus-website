import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';

export const DEFAULT_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

function hasHeader(headers: Record<string, any>, name: string): boolean {
  const lowerName = name.toLowerCase();
  return Object.keys(headers).some((k) => k.toLowerCase() === lowerName);
}

/**
 * Higher-order middleware wrapper for AWS Lambda-style Netlify Functions handlers.
 * Intercepts OPTIONS preflight requests (returning 204 with CORS headers),
 * handles unhandled exceptions (returning 500 JSON with CORS headers),
 * and ensures default CORS & Content-Type headers on all responses while preserving custom headers.
 */
export function withCors(handler: Handler): Handler {
  return async (event: HandlerEvent, context: HandlerContext) => {
    const httpMethod = (event.httpMethod || '').toUpperCase();

    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          ...DEFAULT_CORS_HEADERS,
        },
        body: '',
      };
    }

    try {
      const response = (await handler(event, context)) || { statusCode: 200 };
      const resObj: HandlerResponse =
        typeof response === 'number' ? { statusCode: response } : response;

      const existingHeaders: Record<string, string | number | boolean> = resObj.headers || {};
      const mergedHeaders: Record<string, string | number | boolean> = { ...existingHeaders };

      if (!hasHeader(mergedHeaders, 'Access-Control-Allow-Origin')) {
        mergedHeaders['Access-Control-Allow-Origin'] =
          DEFAULT_CORS_HEADERS['Access-Control-Allow-Origin'];
      }
      if (!hasHeader(mergedHeaders, 'Access-Control-Allow-Methods')) {
        mergedHeaders['Access-Control-Allow-Methods'] =
          DEFAULT_CORS_HEADERS['Access-Control-Allow-Methods'];
      }
      if (!hasHeader(mergedHeaders, 'Access-Control-Allow-Headers')) {
        mergedHeaders['Access-Control-Allow-Headers'] =
          DEFAULT_CORS_HEADERS['Access-Control-Allow-Headers'];
      }
      if (!hasHeader(mergedHeaders, 'Content-Type')) {
        mergedHeaders['Content-Type'] = 'application/json';
      }

      return {
        ...resObj,
        headers: mergedHeaders,
      };
    } catch (error) {
      console.error('Unhandled error in Netlify function handler:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          ...DEFAULT_CORS_HEADERS,
        },
        body: JSON.stringify({ error: 'Internal server error' }),
      };
    }
  };
}

export type WebHandler = (request: Request, context?: any) => Promise<Response> | Response;

/**
 * Higher-order middleware wrapper for Web Standard Request/Response Netlify Functions handlers.
 * Intercepts OPTIONS preflight requests (returning 204 with CORS headers),
 * handles unhandled exceptions (returning 500 JSON with CORS headers),
 * and ensures default CORS & Content-Type headers on all responses while preserving custom headers.
 */
export function withWebCors(handler: WebHandler): WebHandler {
  return async (request: Request, context?: any) => {
    const method = request.method ? request.method.toUpperCase() : 'GET';

    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...DEFAULT_CORS_HEADERS,
        },
      });
    }

    try {
      const response = await handler(request, context);
      const headers = new Headers(response.headers);

      if (!headers.has('Access-Control-Allow-Origin')) {
        headers.set(
          'Access-Control-Allow-Origin',
          DEFAULT_CORS_HEADERS['Access-Control-Allow-Origin']
        );
      }
      if (!headers.has('Access-Control-Allow-Methods')) {
        headers.set(
          'Access-Control-Allow-Methods',
          DEFAULT_CORS_HEADERS['Access-Control-Allow-Methods']
        );
      }
      if (!headers.has('Access-Control-Allow-Headers')) {
        headers.set(
          'Access-Control-Allow-Headers',
          DEFAULT_CORS_HEADERS['Access-Control-Allow-Headers']
        );
      }
      if (
        !headers.has('Content-Type') ||
        headers.get('Content-Type') === 'text/plain;charset=UTF-8'
      ) {
        headers.set('Content-Type', 'application/json');
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      console.error('Unhandled error in Web Standard function handler:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...DEFAULT_CORS_HEADERS,
        },
      });
    }
  };
}
