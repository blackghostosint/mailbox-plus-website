import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { httpClient, httpGet, httpPost, ApiClientError, calculateBackoff } from '../http-client';

describe('http-client module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('calculateBackoff', () => {
    it('calculates deterministic backoff when jitter is disabled', () => {
      expect(
        calculateBackoff(0, {
          initialDelayMs: 300,
          maxDelayMs: 5000,
          backoffFactor: 2,
          jitter: false,
        })
      ).toBe(300);

      expect(
        calculateBackoff(1, {
          initialDelayMs: 300,
          maxDelayMs: 5000,
          backoffFactor: 2,
          jitter: false,
        })
      ).toBe(600);

      expect(
        calculateBackoff(2, {
          initialDelayMs: 300,
          maxDelayMs: 5000,
          backoffFactor: 2,
          jitter: false,
        })
      ).toBe(1200);

      expect(
        calculateBackoff(10, {
          initialDelayMs: 300,
          maxDelayMs: 5000,
          backoffFactor: 2,
          jitter: false,
        })
      ).toBe(5000);
    });

    it('applies full jitter bounding delay between 0 and upper limit', () => {
      for (let i = 0; i < 50; i++) {
        const delay = calculateBackoff(2, {
          initialDelayMs: 300,
          maxDelayMs: 5000,
          backoffFactor: 2,
          jitter: true,
        });
        expect(delay).toBeGreaterThanOrEqual(0);
        expect(delay).toBeLessThanOrEqual(1200);
      }
    });
  });

  describe('httpClient execution & retries', () => {
    it('fetches successfully on first attempt without retrying', async () => {
      const mockData = { success: true };
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockData,
      });

      const promise = httpClient('/api/test', { fetch: fetchMock });
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toEqual(mockData);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('retries transient 503 error and succeeds on 2nd attempt', async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          statusText: 'Service Unavailable',
          json: async () => ({ error: 'Service Unavailable' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ data: 'recovered' }),
        });

      const promise = httpClient('/api/flaky', {
        fetch: fetchMock,
        initialDelayMs: 100,
        maxRetries: 3,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toEqual({ data: 'recovered' });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('exhausts maxRetries on persistent 500 error and throws ApiClientError', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server down' }),
      });

      const promise = httpClient('/api/broken', {
        fetch: fetchMock,
        initialDelayMs: 50,
        maxRetries: 2,
      });

      promise.catch(() => {});
      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow(ApiClientError);
      await expect(promise).rejects.toMatchObject({
        message: 'Server down',
        status: 500,
      });
      expect(fetchMock).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });

    it('does not retry non-transient status code 404', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Not Found' }),
      });

      const promise = httpClient('/api/missing', {
        fetch: fetchMock,
        maxRetries: 3,
      });

      promise.catch(() => {});
      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow(ApiClientError);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('does not retry POST requests by default (idempotency guard)', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        statusText: 'Bad Gateway',
        json: async () => ({ error: 'Bad Gateway' }),
      });

      const promise = httpClient('/api/submit', {
        method: 'POST',
        fetch: fetchMock,
        maxRetries: 3,
      });

      promise.catch(() => {});
      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow(ApiClientError);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('retries POST requests when retryPost: true is explicitly configured', async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
          statusText: 'Bad Gateway',
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ success: true }),
        });

      const promise = httpClient('/api/submit', {
        method: 'POST',
        retryPost: true,
        maxRetries: 2,
        initialDelayMs: 50,
        fetch: fetchMock,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toEqual({ success: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('retries request on timeout and succeeds on retry', async () => {
      let callCount = 0;
      const fetchMock = vi.fn().mockImplementation((_url, options?: { signal?: AbortSignal }) => {
        callCount++;
        if (callCount === 1) {
          return new Promise((_resolve, reject) => {
            options?.signal?.addEventListener('abort', () => {
              const err = new Error('Aborted');
              err.name = 'AbortError';
              reject(err);
            });
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ ok: true }),
        });
      });

      const promise = httpClient('/api/timeout-then-ok', {
        timeout: 100,
        maxRetries: 2,
        initialDelayMs: 50,
        fetch: fetchMock,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('immediately aborts and cancels retries when external custom AbortSignal fires', async () => {
      const controller = new AbortController();
      const fetchMock = vi.fn().mockImplementation((_url, options?: { signal?: AbortSignal }) => {
        return new Promise((_resolve, reject) => {
          options?.signal?.addEventListener('abort', () => {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          });
        });
      });

      const promise = httpClient('/api/cancel', {
        signal: controller.signal,
        maxRetries: 3,
        fetch: fetchMock,
      });

      promise.catch(() => {});
      controller.abort();

      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow(ApiClientError);
      await expect(promise).rejects.toMatchObject({
        message: 'Request aborted',
        isTimeout: false,
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('respects custom shouldRetry predicate function', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Custom error' }),
      });

      const customShouldRetry = vi.fn().mockReturnValue(true);

      const promise = httpClient('/api/custom-retry', {
        fetch: fetchMock,
        maxRetries: 1,
        initialDelayMs: 10,
        shouldRetry: customShouldRetry,
      });

      promise.catch(() => {});
      await vi.runAllTimersAsync();

      expect(customShouldRetry).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('times out when response body parsing json() hangs past timeout budget', async () => {
      const fetchMock = vi.fn().mockImplementation((_url, options?: { signal?: AbortSignal }) => {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () =>
            new Promise((_resolve, reject) => {
              options?.signal?.addEventListener('abort', () => {
                const err = new Error('Aborted');
                err.name = 'AbortError';
                reject(err);
              });
            }),
        });
      });

      const promise = httpClient('/api/hanging-json', {
        timeout: 100,
        maxRetries: 0,
        fetch: fetchMock,
      });

      promise.catch(() => {});
      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow(ApiClientError);
      await expect(promise).rejects.toMatchObject({
        message: 'Request timed out',
        status: 408,
        isTimeout: true,
      });
    });

    it('times out when response body parsing text() hangs past timeout budget', async () => {
      const fetchMock = vi.fn().mockImplementation((_url, options?: { signal?: AbortSignal }) => {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'text/plain' }),
          text: () =>
            new Promise((_resolve, reject) => {
              options?.signal?.addEventListener('abort', () => {
                const err = new Error('Aborted');
                err.name = 'AbortError';
                reject(err);
              });
            }),
        });
      });

      const promise = httpClient('/api/hanging-text', {
        timeout: 100,
        maxRetries: 0,
        fetch: fetchMock,
      });

      promise.catch(() => {});
      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow(ApiClientError);
      await expect(promise).rejects.toMatchObject({
        message: 'Request timed out',
        status: 408,
        isTimeout: true,
      });
    });

    it('times out when error response body parsing json() hangs past timeout budget', async () => {
      const fetchMock = vi.fn().mockImplementation((_url, options?: { signal?: AbortSignal }) => {
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () =>
            new Promise((_resolve, reject) => {
              options?.signal?.addEventListener('abort', () => {
                const err = new Error('Aborted');
                err.name = 'AbortError';
                reject(err);
              });
            }),
        });
      });

      const promise = httpClient('/api/hanging-error-json', {
        timeout: 100,
        maxRetries: 0,
        fetch: fetchMock,
      });

      promise.catch(() => {});
      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow(ApiClientError);
      await expect(promise).rejects.toMatchObject({
        message: 'Request timed out',
        status: 408,
        isTimeout: true,
      });
    });
  });

  describe('httpGet and httpPost helpers', () => {
    it('httpGet uses GET method and httpPost formats JSON payload', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ ok: true }),
      });

      const getPromise = httpGet('/api/get-item', { fetch: fetchMock });
      await vi.runAllTimersAsync();
      await getPromise;

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/get-item',
        expect.objectContaining({ method: 'GET' })
      );

      const postPromise = httpPost('/api/post-item', { key: 'value' }, { fetch: fetchMock });
      await vi.runAllTimersAsync();
      await postPromise;

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/post-item',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ key: 'value' }),
        })
      );
    });
  });
});
