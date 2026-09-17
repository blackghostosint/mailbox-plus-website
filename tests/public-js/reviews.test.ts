// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import reviewsMod from '../../public/js/reviews.js';

describe('reviews.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <span id="reviews-count">0</span>
      <span id="reviews-rating">0</span>
      <div id="reviews-list"></div>
    `;
  });

  it('builds card safely with textContent', () => {
    const card = reviewsMod.buildCard({
      author: '<script>alert(1)</script>John',
      text: '<img src=x onerror=alert(1)> Great service!',
      rating: 5,
      relativeTime: '2 days ago',
    });

    expect(card.querySelector('blockquote p')?.textContent).toContain('Great service!');
    expect(card.innerHTML).not.toContain('<script>');
  });

  it('fetches reviews and updates DOM', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        userRatingCount: 42,
        rating: 4.9,
        reviews: [
          { author: 'Alice', text: 'Loved it', rating: 5, publishTime: '2026-01-01T00:00:00Z' },
        ],
      }),
    });

    await reviewsMod.initReviews();

    expect(document.getElementById('reviews-count')?.textContent).toBe('42');
    expect(document.getElementById('reviews-rating')?.textContent).toBe('4.9');
    expect(document.getElementById('reviews-list')?.children.length).toBe(1);
  });
});
