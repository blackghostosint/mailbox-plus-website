import { describe, it, expect } from 'vitest';
import { ReviewsSuccessDataSchema } from './contracts.ts';
import {
  PLACES_PLACE_ID,
  PLACES_API_URL,
  PLACES_FIELD_MASK,
  DEFAULT_REVIEW_AUTHOR,
  DEFAULT_REVIEW_RATING,
  getFallbackReviewAuthor,
  getFallbackReviewRating,
  transformPlacesData,
} from './placesReviews.js';

describe('placesReviews (shared module)', () => {
  describe('constants', () => {
    it('exports canonical Google Places API configuration constants', () => {
      expect(PLACES_PLACE_ID).toBe('ChIJdYHlz2-jMYgRjI1Rfhq1Pc8');
      expect(PLACES_API_URL).toBe(`https://places.googleapis.com/v1/places/${PLACES_PLACE_ID}`);
      expect(PLACES_FIELD_MASK).toBe(
        'rating,userRatingCount,reviews(authorAttribution,text,rating,publishTime,relativePublishTimeDescription)'
      );
      expect(DEFAULT_REVIEW_AUTHOR).toBe('Google User');
      expect(DEFAULT_REVIEW_RATING).toBe(5);
    });
  });

  describe('getFallbackReviewAuthor', () => {
    it('returns trimmed author display name when valid', () => {
      expect(getFallbackReviewAuthor('  Jane Smith  ')).toBe('Jane Smith');
    });

    it('falls back to DEFAULT_REVIEW_AUTHOR for null, undefined, or whitespace-only values', () => {
      expect(getFallbackReviewAuthor(null)).toBe('Google User');
      expect(getFallbackReviewAuthor(undefined)).toBe('Google User');
      expect(getFallbackReviewAuthor('')).toBe('Google User');
      expect(getFallbackReviewAuthor('   ')).toBe('Google User');
    });
  });

  describe('getFallbackReviewRating', () => {
    it('returns rating when finite and positive', () => {
      expect(getFallbackReviewRating(5)).toBe(5);
      expect(getFallbackReviewRating(4)).toBe(4);
      expect(getFallbackReviewRating(4.5)).toBe(4.5);
    });

    it('falls back to DEFAULT_REVIEW_RATING for missing, non-positive, or non-finite values', () => {
      expect(getFallbackReviewRating(undefined)).toBe(5);
      expect(getFallbackReviewRating(null)).toBe(5);
      expect(getFallbackReviewRating(0)).toBe(5);
      expect(getFallbackReviewRating(-2)).toBe(5);
      expect(getFallbackReviewRating(Number.NaN)).toBe(5);
      expect(getFallbackReviewRating(Number.POSITIVE_INFINITY)).toBe(5);
    });
  });

  describe('transformPlacesData', () => {
    it('transforms valid Places API response into canonical ReviewsSuccessData-compatible payload', () => {
      const raw = {
        rating: 4.9,
        userRatingCount: 112,
        reviews: [
          {
            authorAttribution: {
              displayName: '  Alex Carter ',
              uri: 'https://www.google.com/maps/contrib/12345/reviews',
            },
            rating: 5,
            text: { text: 'Fast and friendly packing service!' },
            relativePublishTimeDescription: '3 days ago',
            publishTime: '2026-11-20T15:30:00Z',
          },
        ],
      };

      const transformed = transformPlacesData(raw);

      expect(transformed.rating).toBe(4.9);
      expect(transformed.userRatingCount).toBe(112);
      expect(transformed.reviews).toEqual([
        {
          author: 'Alex Carter',
          authorUri: 'https://www.google.com/maps/contrib/12345/reviews',
          rating: 5,
          text: 'Fast and friendly packing service!',
          relativeTime: '3 days ago',
          publishTime: '2026-11-20T15:30:00Z',
        },
      ]);
      expect(Number.isFinite(Date.parse(transformed.fetchedAt))).toBe(true);
      expect('note' in transformed).toBe(false);

      const parsed = ReviewsSuccessDataSchema.parse({ ...transformed, source: 'live' });
      expect(parsed.reviews).toHaveLength(1);
    });

    it('applies standard fallbacks for missing authorAttribution, blank names, and invalid ratings', () => {
      const raw = {
        rating: 4.8,
        userRatingCount: 25,
        reviews: [
          {
            text: { text: 'Missing author and rating' },
          },
          {
            authorAttribution: { displayName: '   ', uri: null },
            rating: 0,
            text: null,
            relativePublishTimeDescription: null,
            publishTime: undefined,
          },
          null,
        ],
      };

      const transformed = transformPlacesData(raw);

      expect(transformed.reviews).toEqual([
        {
          author: 'Google User',
          authorUri: '',
          rating: 5,
          text: 'Missing author and rating',
          relativeTime: '',
          publishTime: '',
        },
        {
          author: 'Google User',
          authorUri: '',
          rating: 5,
          text: '',
          relativeTime: '',
          publishTime: '',
        },
        {
          author: 'Google User',
          authorUri: '',
          rating: 5,
          text: '',
          relativeTime: '',
          publishTime: '',
        },
      ]);
    });

    it('handles missing, empty, or null review arrays without throwing', () => {
      expect(transformPlacesData().reviews).toEqual([]);
      expect(transformPlacesData(null).reviews).toEqual([]);
      expect(transformPlacesData({ rating: 5, userRatingCount: 10 }).reviews).toEqual([]);
      expect(transformPlacesData({ rating: 5, userRatingCount: 10, reviews: [] }).reviews).toEqual(
        []
      );
      expect(
        transformPlacesData({ rating: 5, userRatingCount: 10, reviews: null }).reviews
      ).toEqual([]);
    });

    it('attaches optional build note only when requested', () => {
      const withNote = transformPlacesData(
        { rating: 5, userRatingCount: 41, reviews: [] },
        { note: 'Refreshed at build time by scripts/fetch-reviews.mjs' }
      );
      expect(withNote.note).toBe('Refreshed at build time by scripts/fetch-reviews.mjs');
    });
  });
});
