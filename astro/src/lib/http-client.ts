// Universal HTTP Fetch Client with exponential backoff and timeout enforcement.

export class ApiClientError extends Error {
  status?: number;
  data?: unknown;
  isTimeout: boolean;

  constructor(
    message: string,
    options?: {
      status?: number;
      data?: unknown;
      isTimeout?: boolean;
      cause?: unknown;
    }
  ) {
    super(message, { cause: options?.cause });
    this.name = 'ApiClientError';
    this.status = options?.status;
    this.data = options?.data;
    this.isTimeout = options?.isTimeout ?? false;

    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

/* eslint-disable no-unused-vars */
export interface HttpClientOptions extends Omit<
  NonNullable<Parameters<typeof fetch>[1]>,
  'signal'
> {
  /**
   * Request timeout per attempt in milliseconds. Defaults to 15000 (15 seconds).
   */
  timeout?: number;
  /**
   * Maximum number of retry attempts for transient errors. Defaults to 3 retries.
   */
  maxRetries?: number;
  /**
   * Initial delay before backoff in milliseconds. Defaults to 300 ms.
   */
  initialDelayMs?: number;
  /**
   * Maximum delay between retries in milliseconds. Defaults to 5000 ms.
   */
  maxDelayMs?: number;
  /**
   * Exponential backoff factor. Defaults to 2.
   */
  backoffFactor?: number;
  /**
   * List of HTTP status codes that trigger a retry.
   * Defaults to [408, 429, 500, 502, 503, 504].
   */
  retryStatuses?: number[];
  /**
   * Whether to retry POST (and other non-idempotent) requests. Defaults to false.
   */
  retryPost?: boolean;
  /**
   * Optional custom predicate function to determine whether a retry should occur.
   */
  shouldRetry?: (
    error?: ApiClientError | unknown,
    response?: Response,
    attempt?: number
  ) => boolean;
  /**
   * Custom fetch implementation to use (useful for unit testing or custom environments).
   */
  fetch?: typeof globalThis.fetch;
  /**
   * Optional external AbortSignal to cancel the request.
   */
  signal?: AbortSignal;
}
/* eslint-enable no-unused-vars */

/**
 * Calculates exponential backoff delay with full jitter.
 */
export function calculateBackoff(
  attempt: number,
  options?: {
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffFactor?: number;
    jitter?: boolean;
  }
): number {
  const initial = options?.initialDelayMs ?? 300;
  const max = options?.maxDelayMs ?? 5000;
  const factor = options?.backoffFactor ?? 2;
  const useJitter = options?.jitter ?? true;

  const temp = Math.min(max, initial * Math.pow(factor, attempt));
  if (!useJitter) {
    return temp;
  }
  return Math.floor(Math.random() * temp);
}

/**
 * Wraps body parsing in a Promise that rejects with an AbortError if the signal is aborted.
 */
function parseBodyWithSignal<T>(
  parseFn: () => Promise<T>,
  signal: AbortSignal,
  getIsTimedOut: () => boolean
): Promise<T> {
  if (signal.aborted) {
    const err = new Error(getIsTimedOut() ? 'Request timed out' : 'Request aborted');
    err.name = 'AbortError';
    return Promise.reject(err);
  }

  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      const err = new Error(getIsTimedOut() ? 'Request timed out' : 'Request aborted');
      err.name = 'AbortError';
      reject(err);
    };

    signal.addEventListener('abort', onAbort, { once: true });

    parseFn()
      .then((res) => {
        signal.removeEventListener('abort', onAbort);
        resolve(res);
      })
      .catch((err) => {
        signal.removeEventListener('abort', onAbort);
        reject(err);
      });
  });
}

/**
 * Shared API fetch wrapper enforcing standard timeouts, structured error handling, and exponential backoff retries.
 */
export async function httpClient<T = unknown>(
  input: string | URL | Request,
  options: HttpClientOptions = {}
): Promise<T> {
  const {
    timeout = 15000,
    maxRetries = 3,
    initialDelayMs = 300,
    maxDelayMs = 5000,
    backoffFactor = 2,
    retryStatuses = [408, 429, 500, 502, 503, 504],
    retryPost = false,
    shouldRetry: customShouldRetry,
    fetch: fetchImpl,
    signal: customSignal,
    ...fetchInit
  } = options;

  const activeFetch = fetchImpl || globalThis.fetch;
  if (typeof activeFetch !== 'function') {
    throw new ApiClientError('No fetch implementation available');
  }

  const method = (fetchInit.method || 'GET').toUpperCase();
  const isIdempotent = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'].includes(method);
  const canRetry = isIdempotent || retryPost;
  const effectiveMaxRetries = canRetry ? maxRetries : 0;

  let attempt = 0;

  while (true) {
    if (customSignal?.aborted) {
      throw new ApiClientError('Request aborted', {
        isTimeout: false,
        cause: customSignal.reason,
      });
    }

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let isAttemptTimedOut = false;

    if (timeout > 0) {
      timer = setTimeout(() => {
        isAttemptTimedOut = true;
        controller.abort();
      }, timeout);
    }

    const onCustomAbort = () => {
      controller.abort(customSignal?.reason);
    };

    if (customSignal) {
      customSignal.addEventListener('abort', onCustomAbort, { once: true });
    }

    let response: Response | undefined;
    let errorToThrow: ApiClientError | undefined;

    try {
      response = await activeFetch(input, {
        ...fetchInit,
        signal: controller.signal,
      });

      if (response.ok) {
        if (response.status === 204) {
          return null as T;
        }

        const parseSuccessBody = async (): Promise<T> => {
          const contentType = response?.headers?.get('content-type') || '';
          if (contentType.includes('application/json') || contentType.includes('+json')) {
            return (await response!.json()) as T;
          }

          if (typeof response?.text === 'function') {
            const text = await response.text();
            if (!text) {
              return null as T;
            }
            try {
              return JSON.parse(text) as T;
            } catch {
              return text as unknown as T;
            }
          }

          if (typeof response?.json === 'function') {
            return (await response.json()) as T;
          }

          return null as T;
        };

        return await parseBodyWithSignal(
          parseSuccessBody,
          controller.signal,
          () => isAttemptTimedOut
        );
      } else {
        let data: unknown = null;
        try {
          data = await parseBodyWithSignal(
            () => response!.json(),
            controller.signal,
            () => isAttemptTimedOut
          );
        } catch (bodyErr) {
          if (isAttemptTimedOut || controller.signal.aborted) {
            throw bodyErr;
          }
          // Response body was not JSON
        }

        let errorMessage = `HTTP error ${response.status || 500}`;
        if (data && typeof data === 'object' && data !== null) {
          const errObj = data as Record<string, unknown>;
          if (typeof errObj.error === 'string' && errObj.error.trim()) {
            errorMessage = errObj.error;
          }
        } else if (response.statusText) {
          errorMessage = response.statusText;
        }

        errorToThrow = new ApiClientError(errorMessage, {
          status: typeof response.status === 'number' ? response.status : 500,
          data,
        });
      }
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        errorToThrow = err;
      } else if (
        isAttemptTimedOut ||
        (err instanceof Error && err.name === 'AbortError' && isAttemptTimedOut)
      ) {
        errorToThrow = new ApiClientError('Request timed out', {
          status: 408,
          isTimeout: true,
          cause: err,
        });
      } else if (err instanceof Error && err.name === 'AbortError' && customSignal?.aborted) {
        errorToThrow = new ApiClientError('Request aborted', {
          isTimeout: false,
          cause: err,
        });
      } else {
        const message = err instanceof Error ? err.message : 'Network error';
        errorToThrow = new ApiClientError(message, {
          cause: err,
        });
      }
    } finally {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
      if (customSignal) {
        customSignal.removeEventListener('abort', onCustomAbort);
      }
    }

    const isCustomAborted = customSignal?.aborted;
    let shouldRetryThis = false;

    if (!isCustomAborted && attempt < effectiveMaxRetries) {
      const isTimeoutError =
        Boolean(errorToThrow?.isTimeout) || isAttemptTimedOut || errorToThrow?.status === 408;
      const isNetworkError = !response || errorToThrow?.status === undefined;

      if (customShouldRetry) {
        shouldRetryThis = customShouldRetry(errorToThrow, response, attempt);
      } else if (isTimeoutError || isNetworkError) {
        shouldRetryThis = true;
      } else if (response) {
        shouldRetryThis = retryStatuses.includes(response.status);
      } else if (errorToThrow) {
        shouldRetryThis = true;
      }
    }

    if (shouldRetryThis) {
      const delay = calculateBackoff(attempt, {
        initialDelayMs,
        maxDelayMs,
        backoffFactor,
        jitter: true,
      });
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    throw errorToThrow ?? new ApiClientError('Unknown network error');
  }
}

httpClient.get = <T = unknown>(
  input: string | URL | Request,
  options?: HttpClientOptions
): Promise<T> => httpClient<T>(input, { ...options, method: 'GET' });

httpClient.post = <T = unknown>(
  input: string | URL | Request,
  body?: unknown,
  options?: HttpClientOptions
): Promise<T> => {
  const isStringOrForm =
    typeof body === 'string' ||
    body instanceof URLSearchParams ||
    (typeof FormData !== 'undefined' && body instanceof FormData);

  const defaultHeaders: Record<string, string> = isStringOrForm
    ? {}
    : { 'Content-Type': 'application/json' };

  return httpClient<T>(input, {
    ...options,
    method: 'POST',
    headers: {
      ...defaultHeaders,
      ...(options?.headers as Record<string, string> | undefined),
    },
    body: isStringOrForm ? (body as string | FormData | URLSearchParams) : JSON.stringify(body),
  });
};

export const httpGet = httpClient.get;
export const httpPost = httpClient.post;
