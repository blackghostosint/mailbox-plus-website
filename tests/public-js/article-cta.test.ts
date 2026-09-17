// @vitest-environment happy-dom
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ctaMod from '../../public/js/article-cta.js';

describe('article-cta.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="article-bottom-cta" data-category="mailbox-rentals" data-slug="chardon-mailbox">
        CTA Content
      </div>
    `;
    // @ts-ignore
    window.gtag = vi.fn();
  });

  it('observes article-bottom-cta and triggers gtag on intersection', () => {
    let observerCallback: any = null;

    class MockIntersectionObserver {
      constructor(callback: any) {
        observerCallback = callback;
      }
      observe() {}
      disconnect() {}
    }

    // @ts-ignore
    window.IntersectionObserver = MockIntersectionObserver;

    ctaMod.initArticleCta();

    // Trigger intersection
    const el = document.getElementById('article-bottom-cta') as HTMLElement;
    if (observerCallback) {
      observerCallback([{ isIntersecting: true, target: el }]);
    }

    expect(window.gtag).toHaveBeenCalledWith('event', 'article_cta_view', {
      cta_category: 'mailbox-rentals',
      cta_slug: 'chardon-mailbox',
      page_path: '/',
    });
  });
});
