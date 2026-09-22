import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import handler from '../reviews';
import { createMockNetlifyRequest, createMockNetlifyContext } from './helpers/test-harness';

const { mockGetStore, mockStoreGet, mockStoreSet, mockStoreSetJSON } = vi.hoisted(() => ({
  mockGetStore: vi.fn(),
  mockStoreGet: vi.fn(),
  mockStoreSet: vi.fn(),
  mockStoreSetJSON: vi.fn(),
}));

vi.mock('@netlify/blobs', () => ({
  getStore: mockGetStore,
}));

describe('reviews function handler', () => {
  const originalEnv = process.env;
  let ipCounter = 1;
  const mockFetch = vi.fn();

  const createRequest = (clientIp?: string) => {
    return createMockNetlifyRequest({
      url: 'https://example.com/api/reviews',
      method: 'GET',
      clientIp: clientIp || `10.3.0.${ipCounter++}`,
    });
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubGlobal('fetch', mockFetch);

    process.env = {
      ...originalEnv,
      GOOGLE_PLACES_API_KEY: 'mock_google_places_key',
    };

    const blobStorage = new Map<string, any>();

    mockStoreGet.mockImplementation(async (key: string) => blobStorage.get(key) || null);
    mockStoreSet.mockImplementation(async (key: string, val: any) => blobStorage.set(key, val));
    mockStoreSetJSON.mockImplementation(async (key: string, val: any) => blobStorage.set(key, val));

    mockGetStore.mockReturnValue({
      get: mockStoreGet,
      set: mockStoreSet,
      setJSON: mockStoreSetJSON,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = originalEnv;
  });

  it('handles OPTIONS preflight request and returns status 204 with CORS headers', async () => {
    const req = createMockNetlifyRequest({
      url: 'https://example.com/api/reviews',
      method: 'OPTIONS',
      headers: {
        Origin: 'https://mailboxplusohio.com',
      },
    });
    const ctx = createMockNetlifyContext();

    const res = await handler(req, ctx);
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://mailboxplusohio.com');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBeTruthy();
    expect(res.headers.get('Access-Control-Allow-Headers')).toBeTruthy();
  });

  it('enforces rate limiting of 10 requests per minute and returns status 429 on 11th attempt', async () => {
    delete process.env.GOOGLE_PLACES_API_KEY;
    const clientIp = '203.0.113.103';

    for (let i = 0; i < 10; i++) {
      const req = createRequest(clientIp);
      const ctx = createMockNetlifyContext({ ip: clientIp });
      const res = await handler(req, ctx);
      expect(res.status).toBe(502);
    }

    const req11 = createRequest(clientIp);
    const ctx11 = createMockNetlifyContext({ ip: clientIp });
    const res11 = await handler(req11, ctx11);

    expect(res11.status).toBe(429);
    expect(res11.headers.get('Retry-After')).toBeTruthy();
    expect(res11.headers.get('X-RateLimit-Limit')).toBe('10');
    expect(res11.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(res11.headers.get('X-RateLimit-Reset')).toBeTruthy();
    expect(await res11.json()).toEqual({ error: 'Too many requests. Please try again later.' });
  });

  it('returns 502 when GOOGLE_PLACES_API_KEY is missing and no cached payload exists', async () => {
    delete process.env.GOOGLE_PLACES_API_KEY;

    const ctx = createMockNetlifyContext();
    const res = await handler(createRequest(), ctx);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'Reviews temporarily unavailable' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 502 when upstream Places API returns non-200 and no cached payload exists', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue('Internal Server Error'),
    });

    const ctx = createMockNetlifyContext();
    const res = await handler(createRequest(), ctx);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'Reviews temporarily unavailable' });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('successfully fetches, transforms raw Places API JSON into ReviewDto structures, and sets CDN cache headers', async () => {
    const samplePlacesData = {
      rating: 4.9,
      userRatingCount: 120,
      reviews: [
        {
          authorAttribution: {
            displayName: 'Jane Doe',
            uri: 'https://maps.google.com/jane',
          },
          rating: 5,
          text: { text: 'Great service and fast shipping!' },
          relativePublishTimeDescription: 'a week ago',
          publishTime: '2026-09-10T12:00:00Z',
        },
        {
          authorAttribution: {},
          rating: 4,
          text: {},
          relativePublishTimeDescription: 'a month ago',
          publishTime: '2026-08-10T12:00:00Z',
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(samplePlacesData),
    });

    const ctx = createMockNetlifyContext();
    const res = await handler(createRequest(), ctx);
    expect(res.status).toBe(200);

    const headers = res.headers;
    expect(headers.get('Netlify-CDN-Cache-Control')).toBe(
      'public, max-age=3600, stale-while-revalidate=86400'
    );

    const body = await res.json();
    expect(body.source).toBe('live');
    expect(body.rating).toBe(4.9);
    expect(body.userRatingCount).toBe(120);
    expect(body.reviews).toHaveLength(2);

    expect(body.reviews[0]).toEqual({
      author: 'Jane Doe',
      authorUri: 'https://maps.google.com/jane',
      rating: 5,
      text: 'Great service and fast shipping!',
      relativeTime: 'a week ago',
      publishTime: '2026-09-10T12:00:00Z',
    });

    expect(body.reviews[1]).toEqual({
      author: 'Google User',
      authorUri: '',
      rating: 4,
      text: '',
      relativeTime: 'a month ago',
      publishTime: '2026-08-10T12:00:00Z',
    });

    expect(mockStoreSetJSON).toHaveBeenCalledWith('gmb-reviews', {
      rating: 4.9,
      userRatingCount: 120,
      reviews: body.reviews,
      fetchedAt: expect.any(String),
    });
  });

  it('serves fresh cached payload without calling Google Places API', async () => {
    const freshCache = {
      rating: 5.0,
      userRatingCount: 50,
      reviews: [],
      fetchedAt: new Date(Date.now() - 60 * 1000).toISOString(), // 1 minute old
    };

    mockStoreGet.mockImplementation(async (key: string) => {
      if (key === 'gmb-reviews') return freshCache;
      return null;
    });

    const ctx = createMockNetlifyContext();
    const res = await handler(createRequest(), ctx);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({
      ...freshCache,
      source: 'cache',
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('serves stale cached payload with status 200 when Google Places API fetch fails', async () => {
    const staleCache = {
      rating: 4.8,
      userRatingCount: 90,
      reviews: [],
      fetchedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours old (>6h TTL)
    };

    mockStoreGet.mockImplementation(async (key: string) => {
      if (key === 'gmb-reviews') return staleCache;
      return null;
    });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: vi.fn().mockResolvedValue('Service Unavailable'),
    });

    const ctx = createMockNetlifyContext();
    const res = await handler(createRequest(), ctx);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({
      ...staleCache,
      source: 'stale',
    });

    expect(res.headers.get('Netlify-CDN-Cache-Control')).toBe(
      'public, max-age=3600, stale-while-revalidate=86400'
    );
  });
});
