import type { ReviewDto, ReviewsSuccessData } from './contracts.ts';

export const PLACES_PLACE_ID = 'ChIJdYHlz2-jMYgRjI1Rfhq1Pc8'; // Mailbox Plus, 7554 Fredle Dr
export const PLACES_API_URL = `https://places.googleapis.com/v1/places/${PLACES_PLACE_ID}`;
export const PLACES_FIELD_MASK =
  'rating,userRatingCount,reviews(authorAttribution,text,rating,publishTime,relativePublishTimeDescription)';

export const DEFAULT_REVIEW_AUTHOR = 'Google User';
export const DEFAULT_REVIEW_RATING = 5;

export interface PlacesAuthorAttribution {
  displayName?: string | null;
  uri?: string | null;
}

export interface PlacesReviewText {
  text?: string | null;
}

export interface PlacesRawReview {
  authorAttribution?: PlacesAuthorAttribution | null;
  rating?: number | null;
  text?: PlacesReviewText | null;
  relativePublishTimeDescription?: string | null;
  publishTime?: string | null;
}

export interface PlacesApiResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: (PlacesRawReview | null | undefined)[] | null;
}

export interface TransformPlacesOptions {
  note?: string;
}

export type TransformedReview = Required<ReviewDto>;

export type PlacesReviewsPayload = Omit<ReviewsSuccessData, 'source'> & {
  reviews: TransformedReview[];
  fetchedAt: string;
  note?: string;
};

/**
 * Returns review author display name, falling back to DEFAULT_REVIEW_AUTHOR ('Google User').
 */
export function getFallbackReviewAuthor(author?: string | null): string {
  if (author && typeof author === 'string' && author.trim() !== '') {
    return author.trim();
  }
  return DEFAULT_REVIEW_AUTHOR;
}

/**
 * Returns review numerical rating, falling back to DEFAULT_REVIEW_RATING (5).
 */
export function getFallbackReviewRating(rating?: number | null): number {
  if (typeof rating === 'number' && Number.isFinite(rating) && rating > 0) {
    return rating;
  }
  return DEFAULT_REVIEW_RATING;
}

/**
 * Transforms a raw Google Places API (New) Place Details payload into the canonical site review payload.
 */
export function transformPlacesData(
  data: PlacesApiResponse | null | undefined = {},
  options?: TransformPlacesOptions
): PlacesReviewsPayload {
  const reviews: TransformedReview[] = Array.isArray(data?.reviews)
    ? data.reviews.map((r) => ({
        author: getFallbackReviewAuthor(r?.authorAttribution?.displayName),
        authorUri: typeof r?.authorAttribution?.uri === 'string' ? r.authorAttribution.uri : '',
        rating: getFallbackReviewRating(r?.rating),
        text: typeof r?.text?.text === 'string' ? r.text.text : '',
        relativeTime:
          typeof r?.relativePublishTimeDescription === 'string'
            ? r.relativePublishTimeDescription
            : '',
        publishTime: typeof r?.publishTime === 'string' ? r.publishTime : '',
      }))
    : [];

  const payload: PlacesReviewsPayload = {
    rating: data?.rating as number,
    userRatingCount: data?.userRatingCount as number,
    reviews,
    fetchedAt: new Date().toISOString(),
  };

  if (options?.note !== undefined) {
    payload.note = options.note;
  }

  return payload;
}
