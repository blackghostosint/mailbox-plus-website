import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ReviewSection from './ReviewSection.astro';
import reviewsData from '../data/reviews.json';

describe('ReviewSection.astro container rendering', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders aggregate rating, user review count, and aggregate star accessibility text', async () => {
    const result = await container.renderToString(ReviewSection);

    expect(result).toContain(`id="reviews-rating">${reviewsData.rating}</span>`);
    expect(result).toContain(`${reviewsData.rating} out of 5 stars`);
    expect(result).toContain(`id="reviews-count">${reviewsData.userRatingCount}</span>`);
    expect(result).toContain('verified Google reviews');
  });

  it('renders Google place outbound link', async () => {
    const result = await container.renderToString(ReviewSection);

    expect(result).toContain('ChIJdYHlz2-jMYgRjI1Rfhq1Pc8');
    expect(result).toContain('See all reviews on Google');
  });

  it('renders top 3 reviews from reviewsData with stars and text', async () => {
    const result = await container.renderToString(ReviewSection);
    const expectedShown = (reviewsData.reviews || []).slice(0, 3);

    expect(expectedShown.length).toBeGreaterThan(0);

    expectedShown.forEach((review) => {
      expect(result).toContain(review.author);
      expect(result).toContain(`${review.rating} out of 5 stars`);
      expect(result).toContain(review.text);

      if (review.authorUri) {
        expect(result).toContain(`href="${review.authorUri}"`);
      }
    });
  });

  it('calculates star SVG color classes correctly based on rating', async () => {
    const result = await container.renderToString(ReviewSection);

    // Yellow star class fill-yellow-400 text-yellow-400
    expect(result).toContain('fill-yellow-400');
  });
});
