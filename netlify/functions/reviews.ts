/**
 * Reviews Netlify Function
 * Returns live Google reviews + aggregate rating for Mailbox Plus from the
 * Places API (New) Place Details endpoint.
 *
 * Caching:
 *  - Server-side: Netlify Blobs cache with 24h TTL (daily refresh is plenty;
 *    a new review shows up within a day).
 *  - CDN: Cache-Control set so Netlify's edge caches the response for 15 min
 *    (stale-while-revalidate 1h) to absorb bursts without hitting Blobs/API.
 *
 * Env: GOOGLE_PLACES_API_KEY (Netlify env var, never committed)
 */

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const PLACE_ID = 'ChIJdYHlz2-jMYgRjI1Rfhq1Pc8'; // Mailbox Plus, 7554 Fredle Dr
const API_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK =
  'rating,userRatingCount,reviews(authorAttribution,text,rating,publishTime,relativePublishTimeDescription)';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const BLOB_STORE = 'reviews-cache';
const BLOB_KEY = 'mpo-live-reviews';

interface ReviewDto {
  author: string;
  authorUri: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

interface ReviewsPayload {
  rating: number;
  userRatingCount: number;
  reviews: ReviewDto[];
  fetchedAt: string;
  source: 'live' | 'cache';
}

const getCacheStore = () =>
  getStore({
    name: BLOB_STORE,
    siteID: process.env.NETLIFY_SITE_ID || '7a885e38-5ed0-4988-bc5c-a6007fce97a4',
    token: process.env.NETLIFY_AUTH_TOKEN,
  });

async function fetchFromPlaces(): Promise<Omit<ReviewsPayload, 'source'>> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY is not set');
  }

  const res = await fetch(API_URL, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
  });

  if (!res.ok) {
    throw new Error(`Places API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const reviews: ReviewDto[] = (data.reviews || []).map((r: any) => ({
    author: r.authorAttribution?.displayName || 'Google User',
    authorUri: r.authorAttribution?.uri || '',
    rating: r.rating || 5,
    text: r.text?.text || '',
    relativeTime: r.relativePublishTimeDescription || '',
    publishTime: r.publishTime || '',
  }));

  return {
    rating: data.rating,
    userRatingCount: data.userRatingCount,
    reviews,
    fetchedAt: new Date().toISOString(),
  };
}

export const handler: Handler = async () => {
  const store = getCacheStore();

  try {
    // 1) Try cache first
    const cachedRaw = await store.get(BLOB_KEY);
    if (cachedRaw) {
      const cached: ReviewsPayload = JSON.parse(cachedRaw);
      const age = Date.now() - new Date(cached.fetchedAt).getTime();
      if (age < CACHE_TTL_MS) {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=900, stale-while-revalidate=3600',
          },
          body: JSON.stringify({ ...cached, source: 'cache' }),
        };
      }
    }

    // 2) Cache miss or stale → fetch live
    const fresh = await fetchFromPlaces();
    await store.set(BLOB_KEY, JSON.stringify(fresh), { metadata: { fetchedAt: fresh.fetchedAt } });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900, stale-while-revalidate=3600',
      },
      body: JSON.stringify({ ...fresh, source: 'live' }),
    };
  } catch (error) {
    console.error('Reviews function error:', error);

    // 3) Serve stale cache on upstream failure rather than a 500
    try {
      const cachedRaw = await store.get(BLOB_KEY);
      if (cachedRaw) {
        const cached: ReviewsPayload = JSON.parse(cachedRaw);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300',
          },
          body: JSON.stringify({ ...cached, source: 'cache' }),
        };
      }
    } catch {
      // ignore secondary failure
    }

    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Reviews temporarily unavailable' }),
    };
  }
};
