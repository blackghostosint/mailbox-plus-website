// Shared client-side Google reviews loader and card builder.

export interface ReviewItem {
  rating?: number;
  text?: string;
  author?: string;
  authorUri?: string;
  relativeTime?: string;
  publishTime?: string;
}

export interface ReviewsApiData {
  userRatingCount?: number;
  rating?: number;
  reviews?: ReviewItem[];
}

export function buildReviewCard(r: ReviewItem): HTMLElement {
  const article = document.createElement('article');
  article.className =
    'bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-6 flex flex-col';

  // Stars
  const stars = document.createElement('div');
  stars.className = 'flex gap-0.5 mb-3';
  const srLabel = document.createElement('span');
  srLabel.className = 'sr-only';
  srLabel.textContent = `${r.rating || 5} out of 5 stars`;
  stars.appendChild(srLabel);

  for (let i = 1; i <= 5; i++) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute(
      'class',
      `w-4 h-4 ${i <= (r.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-[var(--color-border)] text-[var(--color-border)]'}`
    );
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute(
      'd',
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    );
    svg.appendChild(p);
    stars.appendChild(svg);
  }
  article.appendChild(stars);

  // Quote
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'text-[var(--color-text-primary)] leading-relaxed flex-1';
  const quote = document.createElement('p');
  quote.className = 'line-clamp-5';
  quote.textContent = `“${r.text || ''}”`;
  blockquote.appendChild(quote);
  article.appendChild(blockquote);

  // Footer / author
  const footer = document.createElement('footer');
  footer.className = 'mt-4 pt-4 border-t border-[var(--color-border)]';
  if (r.authorUri) {
    const a = document.createElement('a');
    a.href = r.authorUri;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'text-sm font-semibold text-[var(--color-accent-warm)] hover:underline';
    a.textContent = r.author || 'Google User';
    footer.appendChild(a);
  } else {
    const author = document.createElement('p');
    author.className = 'text-sm font-semibold text-[var(--color-accent-warm)]';
    author.textContent = r.author || 'Google User';
    footer.appendChild(author);
  }
  if (r.relativeTime) {
    const when = document.createElement('p');
    when.className = 'text-xs text-[var(--color-text-secondary)] mt-0.5';
    when.textContent = r.relativeTime;
    footer.appendChild(when);
  }
  article.appendChild(footer);
  return article;
}

export async function initReviewSection(): Promise<void> {
  try {
    const res = await fetch('/api/reviews');
    if (!res.ok) return;
    const data = (await res.json()) as ReviewsApiData;
    if (!data || !Array.isArray(data.reviews) || data.reviews.length === 0) return;

    const countEl = document.getElementById('reviews-count');
    const ratingEl = document.getElementById('reviews-rating');

    if (countEl && typeof data.userRatingCount === 'number') {
      countEl.textContent = String(data.userRatingCount);
    }
    if (ratingEl && typeof data.rating === 'number') {
      ratingEl.textContent = String(data.rating);
    }

    const listEl = document.getElementById('reviews-list');
    if (!listEl) return;

    const newest = data.reviews
      .slice()
      .sort(
        (a, b) => new Date(b.publishTime || 0).getTime() - new Date(a.publishTime || 0).getTime()
      )
      .slice(0, 3);

    if (!newest.length) return;
    listEl.replaceChildren(...newest.map((r) => buildReviewCard(r)));
  } catch (err: unknown) {
    console.warn('Reviews refresh failed, displaying static reviews', err);
  }
}
