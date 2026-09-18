import { logger } from './logger';
export const DEFAULT_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export type CorsOriginOption = string | (string | RegExp)[] | ((origin: string) => boolean);

export interface CorsOptions {
  allowOrigin?: CorsOriginOption;
  allowMethods?: string;
  allowHeaders?: string;
}

export const DEFAULT_ALLOWED_ORIGINS: (string | RegExp)[] = [
  process.env.SITE_URL || 'https://mailboxplusohio.com',
  'https://mailboxplusohio.com',
  /\.netlify\.app$/,
  /localhost(:\d+)?$/,
  /127\.0\.0\.1(:\d+)?$/,
];

function hasHeader(headers: Record<string, any>, name: string): boolean {
  const lowerName = name.toLowerCase();
  return Object.keys(headers).some((k) => k.toLowerCase() === lowerName);
}

function getHeaderValue(
  headers: Record<string, any> | undefined,
  name: string
): string | undefined {
  if (!headers) return undefined;
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === lowerName) {
      return String(headers[key]);
    }
  }
  return undefined;
}

export function resolveAllowedOrigin(
  reqOrigin: string | undefined,
  option?: CorsOriginOption
): string {
  if (!option || option === '*') {
    return '*';
  }

  if (typeof option === 'string') {
    return option;
  }

  if (typeof option === 'function') {
    if (reqOrigin && option(reqOrigin)) {
      return reqOrigin;
    }
    return typeof DEFAULT_ALLOWED_ORIGINS[0] === 'string'
      ? DEFAULT_ALLOWED_ORIGINS[0]
      : 'https://mailboxplusohio.com';
  }

  if (Array.isArray(option)) {
    if (reqOrigin) {
      const isAllowed = option.some((pattern) => {
        if (typeof pattern === 'string') {
          return pattern === reqOrigin;
        }
        if (pattern instanceof RegExp) {
          return pattern.test(reqOrigin);
        }
        return false;
      });
      if (isAllowed) {
        return reqOrigin;
      }
    }
    const firstStr = option.find((item): item is string => typeof item === 'string');
    return firstStr || 'https://mailboxplusohio.com';
  }

  return '*';
}

function getEffectiveCorsHeaders(
  reqOrigin?: string,
  options?: CorsOptions
): Record<string, string> {
  const allowOrigin = resolveAllowedOrigin(reqOrigin, options?.allowOrigin);
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods':
      options?.allowMethods ?? DEFAULT_CORS_HEADERS['Access-Control-Allow-Methods'],
    'Access-Control-Allow-Headers':
      options?.allowHeaders ?? DEFAULT_CORS_HEADERS['Access-Control-Allow-Headers'],
  };
}

export type WebHandler = (request: Request, context?: any) => Promise<Response> | Response;

/**
 * Higher-order middleware wrapper for Web Standard Request/Response Netlify Functions handlers.
 * Intercepts OPTIONS preflight requests (returning 204 with CORS headers),
 * handles unhandled exceptions (returning 500 JSON with CORS headers),
 * and ensures default CORS & Content-Type headers on all responses while preserving custom headers.
 */
export function withCors(handler: WebHandler, options?: CorsOptions): WebHandler {
  return async (request: Request, context?: any) => {
    const reqOrigin = request.headers.get('origin') || request.headers.get('referer') || undefined;
    const corsHeaders = getEffectiveCorsHeaders(reqOrigin, options);
    const method = request.method ? request.method.toUpperCase() : 'GET';

    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
        },
      });
    }

    try {
      const response = await handler(request, context);
      const headers = new Headers(response.headers);

      if (!headers.has('Access-Control-Allow-Origin')) {
        headers.set('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
      }
      if (!headers.has('Access-Control-Allow-Methods')) {
        headers.set('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods']);
      }
      if (!headers.has('Access-Control-Allow-Headers')) {
        headers.set('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
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
      logger.error(
        'Unhandled error in Web Standard function handler',
        {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
        },
        error
      );
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  };
}

/**
 * @deprecated Use `withCors` instead.
 */
export const withWebCors = withCors;
