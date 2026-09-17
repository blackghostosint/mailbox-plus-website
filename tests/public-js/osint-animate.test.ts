// @vitest-environment happy-dom
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import osintMod from '../../public/js/osint-animate.js';

describe('osint-animate.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="osint-page">
        <section data-animate id="sec-1">Section 1</section>
      </div>
    `;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('adds section-hidden class and section-visible on intersection', () => {
    let observerCallback: any = null;

    class MockIntersectionObserver {
      constructor(cb: any) {
        observerCallback = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    // @ts-ignore
    window.IntersectionObserver = MockIntersectionObserver;

    osintMod.initOsintAnimate();

    const sec = document.getElementById('sec-1') as HTMLElement;
    expect(sec.classList.contains('section-hidden')).toBe(true);

    // Simulate intersection
    if (observerCallback) {
      observerCallback([{ isIntersecting: true, target: sec }]);
    }

    expect(sec.classList.contains('section-visible')).toBe(true);
  });
});
