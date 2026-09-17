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
 * Routing: exposed at /api/reviews via `config.path` (the [[redirects]]
 * /api/* rule in netlify.toml is not effective on this site — pre-existing
 * issue affecting the rewards functions too).
 *
 * Env: GOOGLE_PLACES_API_KEY (Netlify env var, never committed)
 */

import { z } from 'zod';
import { withWebCors, DEFAULT_ALLOWED_ORIGINS } from './lib/cors';

const PLACE_ID = 'ChIJdYHlz2-jMYgRjI1Rfhq1Pc8'; // Mailbox Plus, 7554 Fredle Dr
const API_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK =
  'rating,userRatingCount,reviews(authorAttribution,text,rating,publishTime,relativePublishTimeDescription)';

export const ReviewsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 5)),
});

export const ReviewDtoSchema = z.object({
  author: z.string(),
  authorUri: z.string(),
  rating: z.number(),
  text: z.string(),
  relativeTime: z.string(),
  publishTime: z.string(),
});

export const ReviewsResponseSchema = z.object({
  rating: z.number().optional(),
  userRatingCount: z.number().optional(),
  reviews: z.array(ReviewDtoSchema).optional(),
  fetchedAt: z.string().optional(),
  source: z.enum(['live', 'cache']).optional(),
  error: z.string().optional(),
});

export type ReviewDto = z.infer<typeof ReviewDtoSchema>;
export type ReviewsPayload = z.infer<typeof ReviewsResponseSchema>;

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

export default withWebCors(
  async () => {
    try {
      const fresh = await fetchFromPlaces();
      return new Response(JSON.stringify({ ...fresh, source: 'live' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=0, must-revalidate', // browsers always revalidate
          'Netlify-CDN-Cache-Control': CDN_CACHE, // edge caches ~24h
        },
      });
    } catch (error) {
      console.error('Reviews function error:', error);
      return new Response(JSON.stringify({ error: 'Reviews temporarily unavailable' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  { allowOrigin: DEFAULT_ALLOWED_ORIGINS }
);

export const config = {
  path: '/api/reviews',
};
