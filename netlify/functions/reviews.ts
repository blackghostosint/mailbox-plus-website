/**
 * Reviews Netlify Function
 * Returns live Google reviews + aggregate rating for Mailbox Plus from the
 * Places API (New) Place Details endpoint.
 *
 * Caching strategy (function-level, Blobs-backed — the authoritative layer):
 *  - The Places payload is stored in Netlify Blobs ('reviews-cache' store,
 *    'gmb-reviews' key) with a fetchedAt timestamp. Requests serve the cached
 *    payload until it is older than BLOB_TTL_MS (6h), so upstream Places calls
 *    are bounded to ~4/day regardless of request volume or CDN behavior.
 *  - Rationale: Netlify-CDN-Cache-Control was observed NOT to hit on this
 *    function (edge returned fwd=miss on every identical request), which
 *    converted every crawler request into a billable Enterprise-SKU Places
 *    call (~$92 Sept 2026). Never rely on the edge layer alone.
 *  - Failure behavior: if Places fetch fails and a stale cached payload
 *    exists, serve the stale payload (source: 'stale') rather than erroring.
 *  - Netlify-CDN-Cache-Control is still set as a best-effort edge hint, but
 *    correctness no longer depends on it.
 *  - Build-time snapshot (astro/src/data/reviews.json) remains the ultimate
 *    fallback for the static build.
 *
 * Routing: exposed at /api/reviews via `config.path` (the [[redirects]]
 * /api/* rule in netlify.toml is not effective on this site — pre-existing
 * issue affecting the rewards functions too).
 *
 * Env: GOOGLE_PLACES_API_KEY (Netlify env var, never committed)
 */

import { getStore } from '@netlify/blobs';
import { withCors, jsonResponse, jsonError, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';
import { logger } from './lib/logger';
import { ReviewsSuccessSchema } from './lib/contracts';

const PLACE_ID = 'ChIJdYHlz2-jMYgRjI1Rfhq1Pc8'; // Mailbox Plus, 7554 Fredle Dr
const API_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK =
  'rating,userRatingCount,reviews(authorAttribution,text,rating,publishTime,relativePublishTimeDescription)';

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
  source: 'live' | 'cache' | 'stale';
}

const CDN_CACHE = 'public, max-age=3600, stale-while-revalidate=86400';
const BLOB_TTL_MS = 6 * 60 * 60 * 1000; // serve from Blobs for 6h → ≤4 upstream calls/day

function getReviewsStore() {
  try {
    return getStore({
      name: 'reviews-cache',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });
  } catch {
    return null;
  }
}

async function readCached(): Promise<Omit<ReviewsPayload, 'source'> | null> {
  try {
    const store = getReviewsStore();
    if (!store) return null;
    const cached = await store.get('gmb-reviews', { type: 'json' });
    if (!cached || typeof cached.fetchedAt !== 'string') return null;
    return cached as Omit<ReviewsPayload, 'source'>;
  } catch (error) {
    logger.warn('Reviews blob read failed; falling through to live fetch', error);
    return null;
  }
}

async function writeCached(payload: Omit<ReviewsPayload, 'source'>): Promise<void> {
  try {
    const store = getReviewsStore();
    if (!store) return;
    await store.setJSON('gmb-reviews', payload);
  } catch (error) {
    logger.warn('Reviews blob write failed; next request will re-fetch', error);
  }
}

function isFresh(cached: { fetchedAt: string }): boolean {
  const fetched = Date.parse(cached.fetchedAt);
  return Number.isFinite(fetched) && Date.now() - fetched < BLOB_TTL_MS;
}

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

export default withCors(
  async () => {
    const cached = await readCached();

    // Fresh cache: serve it, do not touch the Places API.
    if (cached && isFresh(cached)) {
      return jsonResponse(ReviewsSuccessSchema.parse({ ...cached, source: 'cache' }), {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Netlify-CDN-Cache-Control': CDN_CACHE,
        },
      });
    }

    try {
      const fresh = await fetchFromPlaces();
      await writeCached(fresh);
      return jsonResponse(ReviewsSuccessSchema.parse({ ...fresh, source: 'live' }), {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Netlify-CDN-Cache-Control': CDN_CACHE,
        },
      });
    } catch (error) {
      logger.error('Reviews function error', error);
      // Serve stale data rather than erroring if we have any cached payload.
      if (cached) {
        return jsonResponse(ReviewsSuccessSchema.parse({ ...cached, source: 'stale' }), {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'Netlify-CDN-Cache-Control': CDN_CACHE,
          },
        });
      }
      return jsonError('Reviews temporarily unavailable', 502);
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS, rateLimit: { maxRequests: 10, windowMs: 60 * 1000 } }
);

export const config = {
  path: '/api/reviews',
};
