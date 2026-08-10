/**
 * Reviews Netlify Function
 * Returns live Google reviews + aggregate rating for Mailbox Plus from the
 * Places API (New) Place Details endpoint.
 *
 * Caching strategy (no Blobs dependency):
 *  - Netlify-CDN-Cache-Control: public, max-age=86400, stale-while-revalidate=86400
 *    → the CDN serves one cached payload for 24h and revalidates in the
 *      background after that. Netlify edge caching means ~1 upstream Places
 *      call/day → deep inside the free tier. (Low-traffic URLs can be evicted
 *      earlier, which just means the function re-fetches live — still free.)
 *  - Build-time snapshot (astro/src/data/reviews.json) is the ultimate
 *    fallback: the static HTML + schema render from it regardless, and this
 *    function only powers the client-side freshness refresh.
 *
 * NOTE: this deliberately does NOT use Netlify Blobs — NETLIFY_BLOBS_CONTEXT
 * is not injected in this site's function runtime (the site's existing
 * customer/referral functions hit MissingBlobsEnvironmentError too).
 *
 * Env: GOOGLE_PLACES_API_KEY (Netlify env var, never committed)
 */

import { Handler } from '@netlify/functions';

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
  source: 'live' | 'cache';
}

const CDN_CACHE = 'public, max-age=86400, stale-while-revalidate=86400';

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
  try {
    const fresh = await fetchFromPlaces();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=0, must-revalidate', // browsers always revalidate
        'Netlify-CDN-Cache-Control': CDN_CACHE, // edge caches ~24h
      },
      body: JSON.stringify({ ...fresh, source: 'live' }),
    };
  } catch (error) {
    console.error('Reviews function error:', error);
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Reviews temporarily unavailable' }),
    };
  }
};
