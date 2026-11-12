// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  clamp01,
  computePinProgress,
  initHomeScroll,
  shouldAnimateHomeScroll,
} from './home-scroll';

function mockMatchMedia(initialMatches: boolean) {
  let current = initialMatches;
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    get matches() {
      return current;
    },
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_type: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.add(cb);
    },
    removeEventListener: (_type: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.delete(cb);
    },
    trigger(next: boolean) {
      current = next;
      listeners.forEach((cb) => cb({ matches: next } as MediaQueryListEvent));
    },
  };
  window.matchMedia = (() => mql as unknown as MediaQueryList) as typeof window.matchMedia;
  return mql;
}

function setRect(el: Element, top: number, height: number) {
  (el as HTMLElement).getBoundingClientRect = () =>
    ({
      top,
      bottom: top + height,
      left: 0,
      right: 1200,
      width: 1200,
      height,
      x: 0,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect;
}

const MARKUP = `
  <section id="visit-us" data-home-pinned>
    <div class="home-pin-track" data-home-pin-track>
      <div class="home-pin-stage">
        <div data-pin-progress></div>
        <svg aria-hidden="true">
          <g data-pin-routes></g>
          <g data-pin-halo></g>
          <g data-pin-marker></g>
          <g data-pin-card></g>
        </svg>
      </div>
    </div>
  </section>
  <section id="home-service-areas" data-home-parallax>
    <svg data-parallax-layer aria-hidden="true"></svg>
  </section>
`;

describe('home-scroll narrative choreography (DESIGN_PHASE1_SPEC §3.2, §4 Task 6)', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(16);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    document.documentElement.removeAttribute('data-motion-tier');
    document.body.innerHTML = MARKUP;
    setRect(document.querySelector('[data-home-pin-track]')!, 1200, 1200);
    setRect(document.getElementById('home-service-areas')!, 2500, 500);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('clamps progress strictly to [0, 1] across desktop sticky and mobile unpinned geometries', () => {
    expect(clamp01(-0.4)).toBe(0);
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(1.8)).toBe(1);

    expect(computePinProgress(900, 1200, 900)).toBe(0);
    const mid = computePinProgress(100, 1200, 900);
    expect(mid).toBeGreaterThan(0.2);
    expect(mid).toBeLessThan(0.9);
    expect(computePinProgress(-500, 1200, 900)).toBe(1);
  });

  it('gates activation on homepage pin presence, calm tier, and prefers-reduced-motion', () => {
    mockMatchMedia(false);
    expect(shouldAnimateHomeScroll(document)).toBe(true);

    document.documentElement.dataset.motionTier = 'calm';
    expect(shouldAnimateHomeScroll(document)).toBe(false);
    document.documentElement.removeAttribute('data-motion-tier');

    mockMatchMedia(true);
    expect(shouldAnimateHomeScroll(document)).toBe(false);

    mockMatchMedia(false);
    document.body.innerHTML = '<main><p>Interior page</p></main>';
    expect(shouldAnimateHomeScroll(document)).toBe(false);
  });

  it('does zero work at load before scroll and updates transform/opacity only on scroll', () => {
    const mql = mockMatchMedia(false);
    const cleanup = initHomeScroll(document);
    const pinned = document.getElementById('visit-us')!;
    const track = document.querySelector('[data-home-pin-track]')!;
    const areas = document.getElementById('home-service-areas')!;
    const progressEl = document.querySelector<HTMLElement>('[data-pin-progress]')!;
    const routesEl = document.querySelector<HTMLElement>('[data-pin-routes]')!;
    const haloEl = document.querySelector<HTMLElement>('[data-pin-halo]')!;
    const markerEl = document.querySelector<HTMLElement>('[data-pin-marker]')!;
    const cardEl = document.querySelector<HTMLElement>('[data-pin-card]')!;
    const parallaxEl = document.querySelector<HTMLElement>('[data-parallax-layer]')!;

    expect(pinned.dataset.scrollReady).toBe('true');
    // Zero load-time TBT work: no rAF or style mutation until user scrolls.
    expect(progressEl.style.transform).toBe('');

    setRect(track, 80, 1200);
    setRect(areas, 320, 500);
    window.dispatchEvent(new Event('scroll'));

    expect(progressEl.style.transform).toMatch(/^scaleX\(/);
    expect(routesEl.style.transform).toMatch(/^translate3d\(/);
    expect(routesEl.style.opacity).not.toBe('');
    expect(haloEl.style.transform).toMatch(/^scale\(/);
    expect(markerEl.style.transform).toMatch(/^translate3d\(/);
    expect(cardEl.style.transform).toMatch(/^translate3d\(/);
    expect(parallaxEl.style.transform).toMatch(/^translate3d\(/);

    // Never mutates layout properties (top/left/width/height/margin/padding).
    for (const el of [progressEl, routesEl, haloEl, markerEl, cardEl, parallaxEl]) {
      expect(el.style.top).toBe('');
      expect(el.style.left).toBe('');
      expect(el.style.width).toBe('');
      expect(el.style.height).toBe('');
      expect(el.style.margin).toBe('');
    }

    // Mid-session prefers-reduced-motion toggle strips all inline transforms/opacities immediately.
    mql.trigger(true);
    for (const el of [progressEl, routesEl, haloEl, markerEl, cardEl, parallaxEl]) {
      expect(el.style.transform).toBe('');
      expect(el.style.opacity).toBe('');
    }
    expect(pinned.dataset.scrollReady).toBeUndefined();

    cleanup();
  });

  it('is a complete no-op under prefers-reduced-motion: reduce', () => {
    mockMatchMedia(true);
    const cleanup = initHomeScroll(document);
    const pinned = document.getElementById('visit-us')!;

    expect(pinned.dataset.scrollReady).toBeUndefined();
    cleanup();
  });
});
