import { logger } from './logger';
import { checkRateLimit, getClientIp, type RateLimitOptions } from './rate-limiter';

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
  rateLimit?: RateLimitOptions | boolean;
}

export function isDevelopmentEnvironment(): boolean {
  const netlifyDev = process.env.NETLIFY_DEV?.toLowerCase();
  const context = process.env.CONTEXT?.toLowerCase();
  const nodeEnv = process.env.NODE_ENV?.toLowerCase();

  // NETLIFY_DEV='true' explicitly indicates local Netlify dev server execution
  if (netlifyDev === 'true' || netlifyDev === '1') {
    return true;
  }

  // Remote Netlify execution contexts (production, deploy-preview, branch-deploy, staging, etc.) are non-development
  if (context && context !== 'development') {
    return false;
  }

  // NODE_ENV='development' indicates local dev environment
  if (nodeEnv === 'development') {
    return true;
  }

  // Non-development or ambiguous execution contexts default securely to production origin filtering
  return false;
}

export function isLoopbackOrigin(origin: string | RegExp): boolean {
  if (typeof origin === 'string') {
    try {
      const url = new URL(
        origin.startsWith('http://') || origin.startsWith('https://') ? origin : `http://${origin}`
      );
      const hostname = url.hostname.toLowerCase();
      return (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '::1' ||
        hostname === '0.0.0.0'
      );
    } catch {
      return /localhost|127\.0\.0\.1|\[::1\]/i.test(origin);
    }
  }
  if (origin instanceof RegExp) {
    return (
      origin.test('http://localhost') ||
      origin.test('http://127.0.0.1') ||
      origin.test('http://[::1]')
    );
  }
  return false;
}

export function getDefaultAllowedOrigins(): (string | RegExp)[] {
  const baseOrigins: (string | RegExp)[] = [
    process.env.SITE_URL || 'https://mailboxplusohio.com',
    'https://mailboxplusohio.com',
    'https://mailboxplus.netlify.app',
    'https://mailboxplusohio.netlify.app',
    /^https:\/\/deploy-preview-\d+--mailboxplus(?:ohio)?\.netlify\.app$/,
  ];

  if (isDevelopmentEnvironment()) {
    return [...baseOrigins, /localhost(:\d+)?$/, /127\.0\.0\.1(:\d+)?$/];
  }

  return baseOrigins.filter((origin) => !isLoopbackOrigin(origin));
}

let customAdditions: (string | RegExp)[] = [];
let mutatedStore: (string | RegExp)[] | null = null;

export function resetDefaultAllowedOriginsState(): void {
  customAdditions = [];
  mutatedStore = null;
}

function getCurrentOrigins(): (string | RegExp)[] {
  if (mutatedStore !== null) {
    return mutatedStore;
  }
  return [...getDefaultAllowedOrigins(), ...customAdditions];
}

export const DEFAULT_ALLOWED_ORIGINS: (string | RegExp)[] = new Proxy([] as (string | RegExp)[], {
  get(target, prop, receiver) {
    const currentOrigins = getCurrentOrigins();
    if (prop === 'length') {
      return currentOrigins.length;
    }
    if (prop === Symbol.iterator) {
      return currentOrigins[Symbol.iterator].bind(currentOrigins);
    }
    if (prop === 'push') {
      return (...items: (string | RegExp)[]) => {
        if (mutatedStore !== null) {
          mutatedStore.push(...items);
          return mutatedStore.length;
        }
        customAdditions.push(...items);
        return getCurrentOrigins().length;
      };
    }
    if (prop === 'unshift') {
      return (...items: (string | RegExp)[]) => {
        if (mutatedStore === null) {
          mutatedStore = [...getCurrentOrigins()];
        }
        return mutatedStore.unshift(...items);
      };
    }
    if (prop === 'pop') {
      return () => {
        if (mutatedStore === null) {
          mutatedStore = [...getCurrentOrigins()];
        }
        return mutatedStore.pop();
      };
    }
    if (prop === 'shift') {
      return () => {
        if (mutatedStore === null) {
          mutatedStore = [...getCurrentOrigins()];
        }
        return mutatedStore.shift();
      };
    }
    if (prop === 'splice') {
      return (start: number, deleteCount?: number, ...items: (string | RegExp)[]) => {
        if (mutatedStore === null) {
          mutatedStore = [...getCurrentOrigins()];
        }
        return deleteCount !== undefined
          ? mutatedStore.splice(start, deleteCount, ...items)
          : mutatedStore.splice(start);
      };
    }
    if (prop === 'sort') {
      return (compareFn?: (a: string | RegExp, b: string | RegExp) => number) => {
        if (mutatedStore === null) {
          mutatedStore = [...getCurrentOrigins()];
        }
        mutatedStore.sort(compareFn);
        return receiver;
      };
    }
    if (prop === 'reverse') {
      return () => {
        if (mutatedStore === null) {
          mutatedStore = [...getCurrentOrigins()];
        }
        mutatedStore.reverse();
        return receiver;
      };
    }
    if (prop === 'fill') {
      return (value: string | RegExp, start?: number, end?: number) => {
        if (mutatedStore === null) {
          mutatedStore = [...getCurrentOrigins()];
        }
        mutatedStore.fill(value, start, end);
        return receiver;
      };
    }
    if (prop === 'copyWithin') {
      return (targetIdx: number, start: number, end?: number) => {
        if (mutatedStore === null) {
          mutatedStore = [...getCurrentOrigins()];
        }
        mutatedStore.copyWithin(targetIdx, start, end);
        return receiver;
      };
    }
    const value = Reflect.get(currentOrigins, prop);
    if (typeof value === 'function') {
      return value.bind(currentOrigins);
    }
    return value;
  },
  set(target, prop, value, receiver) {
    if (mutatedStore === null) {
      mutatedStore = [...getCurrentOrigins()];
    }
    return Reflect.set(mutatedStore, prop, value);
  },
  defineProperty(target, prop, descriptor) {
    if (mutatedStore === null) {
      mutatedStore = [...getCurrentOrigins()];
    }
    return Reflect.defineProperty(mutatedStore, prop, descriptor);
  },
  deleteProperty(target, prop) {
    if (mutatedStore === null) {
      mutatedStore = [...getCurrentOrigins()];
    }
    return Reflect.deleteProperty(mutatedStore, prop);
  },
  has(target, prop) {
    const currentOrigins = getCurrentOrigins();
    return Reflect.has(currentOrigins, prop);
  },
  ownKeys(target) {
    const currentOrigins = getCurrentOrigins();
    return Reflect.ownKeys(currentOrigins);
  },
  getOwnPropertyDescriptor(target, prop) {
    const currentOrigins = getCurrentOrigins();
    if (prop === 'length') {
      return {
        value: currentOrigins.length,
        writable: true,
        enumerable: false,
        configurable: false,
      };
    }
    const descriptor = Reflect.getOwnPropertyDescriptor(currentOrigins, prop);
    if (descriptor) {
      return {
        ...descriptor,
        configurable: true,
      };
    }
    return undefined;
  },
});

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

/**
 * Creates a JSON Response object with explicit Content-Type: application/json header.
 */
export function jsonResponse(data: unknown, init: number | ResponseInit = 200): Response {
  const options: ResponseInit = typeof init === 'number' ? { status: init } : { ...init };
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return new Response(JSON.stringify(data), {
    ...options,
    headers,
  });
}

/**
 * Creates a standardized JSON error Response object with { error: message } body.
 */
export function jsonError(message: string, init: number | ResponseInit = 400): Response {
  const options: ResponseInit = typeof init === 'number' ? { status: init } : { ...init };
  return jsonResponse({ error: message }, options);
}

export type WebHandler = (request: Request, context?: any) => Promise<Response> | Response;

/**
 * Higher-order middleware wrapper for Web Standard Request/Response Netlify Functions handlers.
 * Intercepts OPTIONS preflight requests (returning 204 with CORS headers),
 * handles unhandled exceptions (returning 500 JSON with CORS headers),
 * evaluates rate limiting if enabled,
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

    if (options?.rateLimit) {
      try {
        const clientIp = getClientIp(request.headers);
        const rateLimitOpts = typeof options.rateLimit === 'object' ? options.rateLimit : {};
        const urlPath = request.url
          ? new URL(request.url).pathname.replace(/[^a-zA-Z0-9_.-]/g, '_')
          : '';
        const effectiveOpts: RateLimitOptions = {
          keyPrefix: urlPath,
          ...rateLimitOpts,
        };
        const limitResult = await checkRateLimit(clientIp, effectiveOpts);
        if (!limitResult.allowed) {
          const retryAfterSeconds = Math.max(1, Math.ceil(limitResult.resetMs / 1000));
          const maxRequests = rateLimitOpts?.maxRequests ?? 10;
          logger.warn('Rate limit exceeded', {
            clientIp,
            url: request.url,
            method: request.method,
            count: limitResult.count,
            limit: maxRequests,
          });
          return new Response(
            JSON.stringify({ error: 'Too many requests. Please try again later.' }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
                'Retry-After': String(retryAfterSeconds),
                'X-RateLimit-Limit': String(maxRequests),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': String(Math.ceil((Date.now() + limitResult.resetMs) / 1000)),
              },
            }
          );
        }
      } catch (err) {
        logger.warn('Rate limit evaluation error, failing open', err);
      }
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
      if (!headers.has('Content-Type') && response.status !== 204 && response.body !== null) {
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
