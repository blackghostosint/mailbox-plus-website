// Central API Fetch Client with timeout enforcement and error parsing.

import { httpClient, ApiClientError, type HttpClientOptions } from './http-client';

export { ApiClientError };

export type ApiFetchInput = Parameters<typeof fetch>[0];
export type ApiFetchInit = NonNullable<Parameters<typeof fetch>[1]>;

export interface ApiFetchOptions extends HttpClientOptions {
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
 * Shared API fetch wrapper enforcing standard request timeouts, structured error handling, and exponential backoff retries.
 */
export async function apiFetch<T = unknown>(
  input: ApiFetchInput,
  options: ApiFetchOptions = {}
): Promise<T> {
  return httpClient<T>(input as string | URL | Request, {
    timeout: 15000,
    maxRetries: 3,
    ...options,
  });
}

apiFetch.get = <T = unknown>(input: ApiFetchInput, options?: ApiFetchOptions): Promise<T> =>
  apiFetch<T>(input, { ...options, method: 'GET' });

apiFetch.post = <T = unknown>(
  input: ApiFetchInput,
  body?: unknown,
  options?: ApiFetchOptions
): Promise<T> =>
  httpClient.post<T>(input as string | URL | Request, body, {
    timeout: 15000,
    maxRetries: 3,
    ...options,
  });

export const apiGet = apiFetch.get;
export const apiPost = apiFetch.post;
