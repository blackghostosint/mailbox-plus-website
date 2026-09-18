/**
 * Centralized sanitizing logger module for Netlify Functions.
 * Ensures PII, session details, and API credentials are scrubbed before emitting
 * structured JSON execution logs.
 */

// Note: 'message' is intentionally included in SENSITIVE_KEYS to redact user-submitted
// freeform message fields (e.g. contact form bodies) in logged context objects for PII protection.
// Top-level log messages (LogPayload.message) and Error.message remain preserved via sanitizeString.
const SENSITIVE_KEYS = new Set([
  'email',
  'phone',
  'name',
  'address',
  'message',
  'barrier_description',
  'recaptchatoken',
  'g-recaptcha-response',
  'grecaptcharesponse',
  'token',
  'secret',
  'authorization',
  'cookie',
  'set-cookie',
  'key',
  'password',
  'stripe_secret_key',
  'resend_api_key',
  'google_places_api_key',
  'x-goog-api-key',
  'x-api-key',
  'api_key',
  'apikey',
  'access_token',
  'refresh_token',
]);

/**
 * Checks whether a given property or key name represents sensitive information that must be redacted.
 */
export function isSensitiveKey(key: string): boolean {
  if (!key) return false;
  const lower = key.toLowerCase();
  if (SENSITIVE_KEYS.has(lower)) return true;

  const stripped = lower.replace(/[-_]/g, '');
  if (SENSITIVE_KEYS.has(stripped)) return true;

  // Substring or suffix checks for secret / token / key names
  if (
    lower.endsWith('token') ||
    lower.endsWith('secret') ||
    lower.endsWith('password') ||
    lower.endsWith('key') ||
    lower.includes('secret') ||
    lower.includes('password') ||
    lower.includes('auth') ||
    lower.includes('cookie')
  ) {
    return true;
  }

  return false;
}

// Regex patterns for scrubbing PII / credentials in freeform text strings
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const BEARER_REGEX = /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi;
const URL_QUERY_SENSITIVE_REGEX =
  /([?&](?:token|secret|key|api_key|password|auth|authorization|access_token|cookie|email)=)([^&]*)/gi;
const STRIPE_KEY_REGEX = /(?:sk|pk)_(?:live|test)_[0-9a-zA-Z]+/gi;
const RESEND_KEY_REGEX = /re_[0-9a-zA-Z_]{10,}/gi;
const KEY_VAL_TEXT_REGEX =
  /((?:secret|key|token|password|api_key)\s+(?:is\s+|:\s*|=?\s*))([a-zA-Z0-9_.-]{4,})/gi;

/**
 * Sanitizes freeform string values by redacting emails, bearer tokens, API keys, and sensitive URL query parameters.
 */
export function sanitizeString(str: string): string {
  if (!str) return str;
  return str
    .replace(EMAIL_REGEX, '[REDACTED]')
    .replace(BEARER_REGEX, 'Bearer [REDACTED]')
    .replace(URL_QUERY_SENSITIVE_REGEX, '$1[REDACTED]')
    .replace(STRIPE_KEY_REGEX, '[REDACTED]')
    .replace(RESEND_KEY_REGEX, '[REDACTED]')
    .replace(KEY_VAL_TEXT_REGEX, '$1[REDACTED]');
}

/**
 * Recursively scrubs log context objects, redacting values for sensitive keys and
 * stripping headers / payloads from third-party objects.
 */
export function sanitizeValue(val: unknown, visited = new WeakSet<object>()): unknown {
  if (val === null || val === undefined) {
    return val;
  }

  if (typeof val === 'string') {
    return sanitizeString(val);
  }

  if (typeof val !== 'object' && typeof val !== 'function') {
    return val;
  }

  if (typeof val === 'object') {
    if (visited.has(val)) {
      return '[CIRCULAR]';
    }
    visited.add(val);

    if (val instanceof Date) {
      return val.toISOString();
    }

    if (val instanceof Error) {
      return sanitizeError(val, visited);
    }

    if (Array.isArray(val)) {
      return val.map((item) => sanitizeValue(item, visited));
    }

    if (val instanceof Map) {
      const sanitizedMap: Record<string, unknown> = {};
      for (const [k, v] of val.entries()) {
        const keyStr = String(k);
        if (isSensitiveKey(keyStr)) {
          sanitizedMap[keyStr] = '[REDACTED]';
        } else {
          sanitizedMap[keyStr] = sanitizeValue(v, visited);
        }
      }
      return sanitizedMap;
    }

    if (val instanceof Set) {
      return Array.from(val).map((item) => sanitizeValue(item, visited));
    }

    // Plain objects / class instances
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(val)) {
      if (isSensitiveKey(key)) {
        result[key] = '[REDACTED]';
        continue;
      }

      const propValue = (val as Record<string, unknown>)[key];

      // Strip headers or body from third-party request/response sub-objects
      if (
        (key === 'config' || key === 'request' || key === 'response' || key === 'raw') &&
        propValue &&
        typeof propValue === 'object'
      ) {
        result[key] = sanitizeThirdPartyObj(propValue, visited);
        continue;
      }

      result[key] = sanitizeValue(propValue, visited);
    }

    return result;
  }

  return String(val);
}

function sanitizeThirdPartyObj(obj: unknown, visited: WeakSet<object>): unknown {
  if (!obj || typeof obj !== 'object') return sanitizeValue(obj, visited);
  if (visited.has(obj as object)) return '[CIRCULAR]';
  visited.add(obj as object);

  const result: Record<string, unknown> = {};
  for (const k of Object.keys(obj)) {
    if (k === 'headers' || k === 'requestHeaders' || k === 'responseHeaders') {
      result[k] = '[STRIPPED]';
    } else if (k === 'body' || k === 'data' || k === 'payload') {
      result[k] = '[STRIPPED]';
    } else if (isSensitiveKey(k)) {
      result[k] = '[REDACTED]';
    } else {
      result[k] = sanitizeValue((obj as Record<string, unknown>)[k], visited);
    }
  }
  return result;
}

export interface SanitizedError {
  name: string;
  message: string;
  code?: string | number;
  stack?: string;
  [key: string]: unknown;
}

/**
 * Normalizes caught exception instances into safe, serializable error objects.
 */
export function sanitizeError(err: unknown, visited = new WeakSet<object>()): SanitizedError {
  if (err instanceof Error) {
    if (visited.has(err)) {
      return { name: err.name || 'Error', message: '[CIRCULAR_ERROR]' };
    }
    visited.add(err);

    const sanitizedErr: SanitizedError = {
      name: err.name || 'Error',
      message: sanitizeString(err.message || String(err)),
    };

    const code =
      (err as any).code ||
      (err as any).statusCode ||
      (err as any).status ||
      (err as any).raw?.code ||
      (err as any).type;
    if (code !== undefined) {
      sanitizedErr.code = code;
    }

    if (typeof err.stack === 'string') {
      sanitizedErr.stack = sanitizeString(err.stack);
    }

    // Capture extra properties on custom Error instances (e.g., StripeError, AxiosError)
    const extraKeys = Object.getOwnPropertyNames(err).filter(
      (k) => !['name', 'message', 'stack'].includes(k)
    );
    for (const key of extraKeys) {
      if (isSensitiveKey(key)) {
        sanitizedErr[key] = '[REDACTED]';
      } else {
        const val = (err as any)[key];
        if (
          (key === 'config' || key === 'request' || key === 'response' || key === 'raw') &&
          val &&
          typeof val === 'object'
        ) {
          sanitizedErr[key] = sanitizeThirdPartyObj(val, visited);
        } else {
          sanitizedErr[key] = sanitizeValue(val, visited);
        }
      }
    }

    return sanitizedErr;
  }

  if (typeof err === 'object' && err !== null) {
    const errObj = err as Record<string, unknown>;
    const name = typeof errObj.name === 'string' ? errObj.name : 'Error';
    const message =
      typeof errObj.message === 'string'
        ? sanitizeString(errObj.message)
        : sanitizeString(JSON.stringify(sanitizeValue(errObj, visited)));

    const sanitizedErr: SanitizedError = { name, message };

    if (
      errObj.code !== undefined &&
      (typeof errObj.code === 'string' || typeof errObj.code === 'number')
    ) {
      sanitizedErr.code = errObj.code;
    }
    if (typeof errObj.stack === 'string') {
      sanitizedErr.stack = sanitizeString(errObj.stack);
    }

    return sanitizedErr;
  }

  return {
    name: 'Error',
    message: sanitizeString(String(err)),
  };
}

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogPayload {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: unknown;
  error?: SanitizedError;
}

function writeLog(
  level: LogLevel,
  message: string,
  contextOrError?: unknown,
  maybeError?: unknown
): void {
  try {
    let context: unknown = undefined;
    let err: unknown = undefined;

    if (contextOrError !== undefined) {
      if (
        contextOrError instanceof Error ||
        (maybeError === undefined &&
          typeof contextOrError === 'object' &&
          contextOrError !== null &&
          'message' in contextOrError &&
          'stack' in contextOrError)
      ) {
        err = contextOrError;
      } else {
        context = contextOrError;
        err = maybeError;
      }
    }

    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      level,
      message: sanitizeString(message),
    };

    if (context !== undefined) {
      payload.context = sanitizeValue(context);
    }

    if (err !== undefined) {
      payload.error = sanitizeError(err);
    }

    const jsonLog = JSON.stringify(payload);

    if (level === 'error') {
      console.error(jsonLog);
    } else if (level === 'warn') {
      console.warn(jsonLog);
    } else {
      console.info(jsonLog);
    }
  } catch {
    // Non-blocking Error Fallback
    try {
      const fallbackMsg = JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message: '[LOGGING_ERROR] Failed to format error log',
      });
      if (level === 'error') console.error(fallbackMsg);
      else if (level === 'warn') console.warn(fallbackMsg);
      else console.info(fallbackMsg);
    } catch {
      console.error('[LOGGING_ERROR] Failed to format error log');
    }
  }
}

export const logger = {
  info(message: string, context?: unknown): void {
    writeLog('info', message, context);
  },
  warn(message: string, contextOrError?: unknown, error?: unknown): void {
    writeLog('warn', message, contextOrError, error);
  },
  error(message: string, contextOrError?: unknown, error?: unknown): void {
    writeLog('error', message, contextOrError, error);
  },
};
