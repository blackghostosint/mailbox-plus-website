import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { registry, ErrorResponseSchema } from './lib/openapi-registry';

const PLACE_ID = 'ChIJdYHlz2-jMYgRjI1Rfhq1Pc8'; // Mailbox Plus, 7554 Fredle Dr
const API_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK =
  'rating,userRatingCount,reviews(authorAttribution,text,rating,publishTime,relativePublishTimeDescription)';

export const ReviewItemSchema = z.object({
  author: z.string(),
  authorUri: z.string().optional(),
  rating: z.number(),
  text: z.string(),
  relativeTime: z.string().optional(),
  publishTime: z.string().optional(),
});

export const ReviewsResponseSchema = z
  .object({
    rating: z.number(),
    userRatingCount: z.number(),
    reviews: z.array(ReviewItemSchema),
    fetchedAt: z.string().optional(),
    source: z.string().optional(),
    error: z.string().optional(),
  })
  .openapi('ReviewsResponse');

export type ReviewItem = z.infer<typeof ReviewItemSchema>;
export type ReviewsResponse = z.infer<typeof ReviewsResponseSchema>;

registry.registerPath({
  method: 'get',
  path: '/.netlify/functions/reviews',
  summary: 'Fetch live Google reviews',
  responses: {
    200: {
      description: 'Google reviews payload',
      content: {
        'application/json': {
          schema: ReviewsResponseSchema,
        },
      },
    },
    502: {
      description: 'Reviews unavailable error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

const CDN_CACHE = 'public, max-age=86400, stale-while-revalidate=86400';

async function fetchFromPlaces() {
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
  const reviews: ReviewItem[] = (data.reviews || []).map((r: any) => ({
    author: r.authorAttribution?.displayName || 'Google User',
    authorUri: r.authorAttribution?.uri || '',
    rating: r.rating || 5,
    text: r.text?.text || '',
    relativeTime: r.relativePublishTimeDescription || '',
    publishTime: r.publishTime || '',
  }));

  return {
    rating: data.rating || 5,
    userRatingCount: data.userRatingCount || 0,
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
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': CDN_CACHE,
      },
      body: JSON.stringify({ ...fresh, source: 'live' }),
    };
  } catch (error: any) {
    console.error('Reviews function error:', error);
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Reviews temporarily unavailable' }),
    };
  }
};

export default handler;

export const config = {
  path: '/api/reviews',
};
