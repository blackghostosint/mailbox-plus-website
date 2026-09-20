import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiFetch, apiGet, apiPost, ApiClientError } from '../api-client';

describe('api-client module', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('fetches successfully and parses JSON response', async () => {
    const mockData = { id: '123', name: 'Test' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockData,
    });
    vi.stubGlobal('fetch', fetchMock);

    const promise = apiFetch<{ id: string; name: string }>('/api/test');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('returns null for HTTP 204 No Content responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers(),
    });
    vi.stubGlobal('fetch', fetchMock);

    const promise = apiFetch('/api/no-content');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBeNull();
  });

  it('enforces request timeout when fetch takes longer than timeout limit', async () => {
    const fetchMock = vi.fn().mockImplementation(
      (_url, options?: { signal?: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          if (options?.signal) {
            options.signal.addEventListener('abort', () => {
              const err = new Error('Aborted');
              err.name = 'AbortError';
              reject(err);
            });
          }
        })
    );
    vi.stubGlobal('fetch', fetchMock);

    const promise = apiFetch('/api/slow', { timeout: 1000 });
    promise.catch(() => {});

    vi.advanceTimersByTime(1001);

    await expect(promise).rejects.toThrow(ApiClientError);
    await expect(promise).rejects.toMatchObject({
      message: 'Request timed out',
      isTimeout: true,
      status: 408,
    });
  });

  it('extracts error message from JSON error response (data.error)', async () => {
    const errorResponse = { error: 'Invalid email address provided.' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => errorResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    const promise = apiFetch('/api/submit');
    promise.catch(() => {});
    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow(ApiClientError);
    await expect(promise).rejects.toMatchObject({
      message: 'Invalid email address provided.',
      status: 400,
      data: errorResponse,
      isTimeout: false,
    });
  });

  it('extracts error message from JSON error response (data.message fallback)', async () => {
    const errorResponse = { message: 'Resource not found' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => errorResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    const promise = apiFetch('/api/item');
    promise.catch(() => {});
    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow(ApiClientError);
    await expect(promise).rejects.toMatchObject({
      message: 'Resource not found',
      status: 404,
      data: errorResponse,
    });
  });

  it('falls back to statusText or status code when error body is not JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => {
        throw new Error('Not JSON');
      },
    });
    vi.stubGlobal('fetch', fetchMock);

    const promise = apiFetch('/api/error');
    promise.catch(() => {});
    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow(ApiClientError);
    await expect(promise).rejects.toMatchObject({
      message: 'Internal Server Error',
      status: 500,
    });
  });

  it('wraps network rejection errors into ApiClientError', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    const promise = apiFetch('/api/network-fail');
    promise.catch(() => {});
    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow(ApiClientError);
    await expect(promise).rejects.toMatchObject({
      message: 'Failed to fetch',
      isTimeout: false,
    });
  });

  it('handles external AbortSignal cancellation', async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn().mockImplementation(
      (_url, options?: { signal?: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          options?.signal?.addEventListener('abort', () => {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          });
        })
    );
    vi.stubGlobal('fetch', fetchMock);

    const promise = apiFetch('/api/abort', { signal: controller.signal });
    promise.catch(() => {});
    controller.abort();

    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow(ApiClientError);
    await expect(promise).rejects.toMatchObject({
      message: 'Request aborted',
      isTimeout: false,
    });
  });

  it('apiGet and apiPost helper functions wrap method and headers correctly', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const getPromise = apiGet('/api/data');
    await vi.runAllTimersAsync();
    await getPromise;

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/data',
      expect.objectContaining({
        method: 'GET',
      })
    );

    const postPromise = apiPost('/api/data', { foo: 'bar' });
    await vi.runAllTimersAsync();
    await postPromise;

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/data',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ foo: 'bar' }),
      })
    );
  });
});
