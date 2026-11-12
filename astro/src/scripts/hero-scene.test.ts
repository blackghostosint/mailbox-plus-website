// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initHeroScene, scheduleHeroScene, shouldAnimateHeroScene } from './hero-scene';

const SCENE_MARKUP = `
  <div id="hero-counter-scene" data-counter-scene aria-hidden="true">
    <svg viewBox="0 0 560 440">
      <g data-scene-box-main></g>
      <g data-scene-box-side></g>
      <g data-scene-label></g>
      <g data-scene-beam></g>
      <g data-scene-scanline></g>
      <g data-scene-badge></g>
      <g data-scene-rate-highlight></g>
      <g data-scene-alpacka><g data-scene-alpacka-head></g></g>
    </svg>
  </div>
`;

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_type: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.add(cb);
    },
    removeEventListener: (_type: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.delete(cb);
    },
    trigger(next: boolean) {
      mql.matches = next;
      listeners.forEach((cb) => cb({ matches: next } as MediaQueryListEvent));
    },
  };
  vi.spyOn(window, 'matchMedia').mockImplementation(() => mql as unknown as MediaQueryList);
  return mql;
}

describe('hero-scene GSAP choreography', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('returns false when scene is absent or prefers-reduced-motion is active', () => {
    mockMatchMedia(false);
    expect(shouldAnimateHeroScene(document)).toBe(false);

    document.body.innerHTML = SCENE_MARKUP;
    expect(shouldAnimateHeroScene(document)).toBe(true);

    mockMatchMedia(true);
    expect(shouldAnimateHeroScene(document)).toBe(false);
  });

  it('is a complete no-op under prefers-reduced-motion: reduce', async () => {
    mockMatchMedia(true);
    document.body.innerHTML = SCENE_MARKUP;

    const cleanup = await initHeroScene(document);
    const scene = document.querySelector<HTMLElement>('[data-counter-scene]')!;
    expect(scene.dataset.sceneReady).toBeUndefined();
    cleanup();
  });

  it('initializes GSAP timelines when motion is allowed and cleans up on teardown or reduced-motion toggle', async () => {
    const mql = mockMatchMedia(false);
    document.body.innerHTML = `<h1 id="hero-heading">Four carriers. One counter. No runaround.</h1>${SCENE_MARKUP}`;

    const cleanup = await initHeroScene(document);
    const scene = document.querySelector<HTMLElement>('[data-counter-scene]')!;
    const h1 = document.getElementById('hero-heading')!;

    expect(scene.dataset.sceneReady).toBe('true');
    // Never touches the H1 LCP element.
    expect(h1.getAttribute('style')).toBeNull();

    // Toggling reduced-motion mid-session kills timelines and clears dataset flag.
    mql.trigger(true);
    expect(scene.dataset.sceneReady).toBeUndefined();

    cleanup();
  });

  it('schedules lazily and cancels cleanly before idle callback runs', () => {
    mockMatchMedia(false);
    document.body.innerHTML = SCENE_MARKUP;

    const cleanup = scheduleHeroScene(document);
    cleanup();

    const scene = document.querySelector<HTMLElement>('[data-counter-scene]')!;
    expect(scene.dataset.sceneReady).toBeUndefined();
  });
});
