// Central API Fetch Client with timeout enforcement and error parsing.

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

export type ApiFetchInput = Parameters<typeof fetch>[0];
export type ApiFetchInit = NonNullable<Parameters<typeof fetch>[1]>;

export interface ApiFetchOptions extends Omit<ApiFetchInit, 'signal'> {
  /**
   * Request timeout in milliseconds. Defaults to 15000 (15 seconds).
   */
  timeout?: number;
  /**
   * Optional external AbortSignal to cancel the request.
   */
  signal?: AbortSignal;
}

/**
 * Shared API fetch wrapper enforcing standard request timeouts and structured error handling.
 */
export async function apiFetch<T = unknown>(
  input: ApiFetchInput,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { timeout = 15000, signal: customSignal, ...fetchInit } = options;

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let isTimedOut = false;

  if (timeout > 0) {
    timer = setTimeout(() => {
      isTimedOut = true;
      controller.abort();
    }, timeout);
  }

  const onCustomAbort = () => {
    controller.abort(customSignal?.reason);
  };

  if (customSignal) {
    if (customSignal.aborted) {
      controller.abort(customSignal.reason);
    } else {
      customSignal.addEventListener('abort', onCustomAbort, { once: true });
    }
  }

  try {
    const res = await fetch(input, {
      ...fetchInit,
      signal: controller.signal,
    });

    if (!res.ok) {
      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        // Response body was not JSON or failed to parse
      }

      let errorMessage = `HTTP error ${res.status || 500}`;
      if (data && typeof data === 'object') {
        const errObj = data as Record<string, unknown>;
        if (typeof errObj.error === 'string' && errObj.error.trim()) {
          errorMessage = errObj.error;
        } else if (typeof errObj.message === 'string' && errObj.message.trim()) {
          errorMessage = errObj.message;
        }
      } else if (res.statusText) {
        errorMessage = res.statusText;
      }

      throw new ApiClientError(errorMessage, {
        status: typeof res.status === 'number' ? res.status : 500,
        data,
      });
    }

    if (res.status === 204) {
      return null as T;
    }

    const contentType = res.headers?.get('content-type') || '';
    if (contentType.includes('application/json') || contentType.includes('+json')) {
      return (await res.json()) as T;
    }

    if (typeof res.text === 'function') {
      const text = await res.text();
      if (!text) {
        return null as T;
      }
      try {
        return JSON.parse(text) as T;
      } catch {
        return text as unknown as T;
      }
    }

    if (typeof res.json === 'function') {
      return (await res.json()) as T;
    }

    return null as T;
  } catch (err: unknown) {
    if (err instanceof ApiClientError) {
      throw err;
    }

    if (isTimedOut || (err instanceof Error && err.name === 'AbortError' && isTimedOut)) {
      throw new ApiClientError('Request timed out', {
        status: 408,
        isTimeout: true,
        cause: err,
      });
    }

    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiClientError('Request aborted', {
        isTimeout: false,
        cause: err,
      });
    }

    const message = err instanceof Error ? err.message : 'Network error';
    throw new ApiClientError(message, {
      cause: err,
    });
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    if (customSignal) {
      customSignal.removeEventListener('abort', onCustomAbort);
    }
  }
}

apiFetch.get = <T = unknown>(input: ApiFetchInput, options?: ApiFetchOptions): Promise<T> =>
  apiFetch<T>(input, { ...options, method: 'GET' });

apiFetch.post = <T = unknown>(
  input: ApiFetchInput,
  body?: unknown,
  options?: ApiFetchOptions
): Promise<T> =>
  apiFetch<T>(input, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

export const apiGet = apiFetch.get;
export const apiPost = apiFetch.post;
