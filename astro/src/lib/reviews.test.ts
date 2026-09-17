import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildReviewCard, initReviewSection, type ReviewItem } from './reviews';

describe('reviews module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('buildReviewCard', () => {
    it('builds a review card article element with correct stars and text', () => {
      const review: ReviewItem = {
        rating: 4,
        text: 'Great shipping store!',
        author: 'Jane Doe',
        authorUri: 'https://maps.google.com/contrib/123',
        relativeTime: '2 days ago',
      };

      const card = buildReviewCard(review);

      expect(card.tagName.toLowerCase()).toBe('article');
      expect(card.querySelector('.sr-only')?.textContent).toBe('4 out of 5 stars');
      expect(card.querySelector('blockquote p')?.textContent).toBe('“Great shipping store!”');

      const authorLink = card.querySelector('footer a') as HTMLAnchorElement | null;
      expect(authorLink).not.toBeNull();
      expect(authorLink?.textContent).toBe('Jane Doe');
      expect(authorLink?.href).toBe('https://maps.google.com/contrib/123');
      expect(card.querySelector('footer p')?.textContent).toBe('2 days ago');
    });

    it('handles missing authorUri and relativeTime gracefully', () => {
      const review: ReviewItem = {
        rating: 5,
        text: 'Wonderful service!',
      };

      const card = buildReviewCard(review);

      expect(card.querySelector('.sr-only')?.textContent).toBe('5 out of 5 stars');
      const authorP = card.querySelector('footer p');
      expect(authorP?.textContent).toBe('Google User');
    });
  });

  describe('initReviewSection', () => {
    it('fetches reviews and populates DOM elements', async () => {
      document.body.innerHTML = `
        <span id="reviews-count">0</span>
        <span id="reviews-rating">0</span>
        <div id="reviews-list"></div>
      `;

      const mockData = {
        userRatingCount: 150,
        rating: 4.9,
        reviews: [
          {
            rating: 5,
            text: 'First review',
            author: 'Alice',
            publishTime: '2026-09-15T10:00:00Z',
          },
          {
            rating: 5,
            text: 'Second review',
            author: 'Bob',
            publishTime: '2026-09-16T10:00:00Z',
          },
        ],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockData,
        })
      );

      await initReviewSection();

      expect(document.getElementById('reviews-count')?.textContent).toBe('150');
      expect(document.getElementById('reviews-rating')?.textContent).toBe('4.9');

      const listEl = document.getElementById('reviews-list');
      expect(listEl?.children.length).toBe(2);
      // Newest should be first (Bob)
      expect(listEl?.children[0].querySelector('blockquote p')?.textContent).toBe(
        '“Second review”'
      );
    });

    it('fails gracefully when fetch fails', async () => {
      document.body.innerHTML = `
        <span id="reviews-count">100</span>
        <span id="reviews-rating">4.8</span>
        <div id="reviews-list"><div>Static</div></div>
      `;

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
        })
      );

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await initReviewSection();

      expect(document.getElementById('reviews-count')?.textContent).toBe('100');
      expect(document.getElementById('reviews-list')?.children.length).toBe(1);
      warnSpy.mockRestore();
    });
  });
});
