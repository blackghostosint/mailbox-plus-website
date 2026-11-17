// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initMotion, PENDING_CLASS, ACTIVE_CLASS, SETTLE_MS } from './motion';
import { shouldLoadMotion } from './motion-loader';

type IOCallback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;

class FakeIO {
  static instances: FakeIO[] = [];
  observed = new Set<Element>();
  disconnected = false;
  constructor(public cb: IOCallback) {
    FakeIO.instances.push(this);
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.disconnected = true;
    this.observed.clear();
  }
  fire(el: Element, isIntersecting = true) {
    this.cb([{ isIntersecting, target: el }]);
  }
}

let reduced = false;
const listeners: Array<(e: { matches: boolean }) => void> = [];

function setTop(el: Element, top: number) {
  (el as HTMLElement).getBoundingClientRect = () =>
    ({ top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100 }) as DOMRect;
}

function mount() {
  document.body.innerHTML = `
    <section id="above" data-reveal>Above the fold</section>
    <section id="below" data-reveal>Below the fold</section>
    <div id="grid" data-reveal-stagger><a id="card" href="/x/">Card</a><a href="/y/">Card 2</a></div>
  `;
  setTop(document.getElementById('above')!, 100);
  setTop(document.getElementById('below')!, 2000);
  setTop(document.getElementById('grid')!, 3000);
}

beforeEach(() => {
  FakeIO.instances = [];
  reduced = false;
  listeners.length = 0;
  vi.useFakeTimers();
  vi.stubGlobal('IntersectionObserver', FakeIO);
  Object.defineProperty(window, 'IntersectionObserver', { value: FakeIO, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  window.matchMedia = ((query: string) => ({
    matches: query.includes('reduce') ? reduced : false,
    media: query,
    addEventListener: (_: string, fn: (e: { matches: boolean }) => void) => listeners.push(fn),
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
  document.documentElement.removeAttribute('data-motion-tier');
  document.documentElement.removeAttribute('data-motion');
  mount();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('initMotion (scroll reveals, DESIGN_PHASE1_SPEC Task 3)', () => {
  it('ships visible markup: nothing is hidden before the module runs', () => {
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(0);
  });

  it('hides only targets that start below the viewport', () => {
    initMotion(document);
    expect(document.getElementById('above')!.classList.contains(PENDING_CLASS)).toBe(false);
    expect(document.getElementById('below')!.classList.contains(PENDING_CLASS)).toBe(true);
    expect(document.getElementById('grid')!.classList.contains(PENDING_CLASS)).toBe(true);
    expect(FakeIO.instances[0].observed.size).toBe(2);
  });

  it('reveals once on intersection and stops observing (once: true)', () => {
    initMotion(document);
    const below = document.getElementById('below')!;
    const io = FakeIO.instances[0];
    io.fire(below, false);
    expect(below.classList.contains(PENDING_CLASS)).toBe(true);
    io.fire(below);
    expect(below.classList.contains(PENDING_CLASS)).toBe(false);
    expect(below.classList.contains(ACTIVE_CLASS)).toBe(true);
    expect(io.observed.has(below)).toBe(false);
    vi.advanceTimersByTime(SETTLE_MS);
    expect(below.classList.contains(ACTIVE_CLASS)).toBe(false);
    // A second intersection does not re-hide or re-animate.
    io.fire(below);
    expect(below.className).toBe('');
  });

  it('is a no-op under prefers-reduced-motion', () => {
    reduced = true;
    initMotion(document);
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(0);
    expect(FakeIO.instances.length).toBe(0);
  });

  it('is a no-op without IntersectionObserver', () => {
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined, configurable: true });
    initMotion(document);
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(0);
  });

  it('reveals everything if reduced motion is switched on mid-session', () => {
    initMotion(document);
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(2);
    listeners.forEach((fn) => fn({ matches: true }));
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(0);
  });

  it('reveals a pending block when keyboard focus moves into it', () => {
    initMotion(document);
    const card = document.getElementById('card')!;
    card.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(document.getElementById('grid')!.classList.contains(PENDING_CLASS)).toBe(false);
  });

  it('reveals targets skipped by a jump scroll (never intersected)', () => {
    initMotion(document);
    // Simulate an End-key jump: the block is now above the viewport, IO never fired.
    setTop(document.getElementById('below')!, -500);
    setTop(document.getElementById('grid')!, -200);
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(50);
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(0);
  });

  it('reveals everything before printing', () => {
    initMotion(document);
    window.dispatchEvent(new Event('beforeprint'));
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(0);
  });

  it('sets dataset.motion = ready and returns noop when all targets are above the fold', () => {
    document.body.innerHTML = '<section id="above" data-reveal>Above fold</section>';
    setTop(document.getElementById('above')!, 100);
    const cleanup = initMotion(document);
    expect(document.documentElement.dataset.motion).toBe('ready');
    cleanup();
  });

  it('reveals targets skipped by keyboard jump keys (End, PageDown)', () => {
    initMotion(document);
    setTop(document.getElementById('below')!, -500);
    setTop(document.getElementById('grid')!, -200);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    vi.advanceTimersByTime(50);
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(0);
  });

  it('wraps window.scrollTo, window.scroll, and window.scrollBy to trigger sweep and restores them on cleanup', () => {
    const origScrollTo = vi.fn();
    const origScroll = vi.fn();
    const origScrollBy = vi.fn();
    window.scrollTo = origScrollTo;
    window.scroll = origScroll;
    window.scrollBy = origScrollBy;

    const cleanup = initMotion(document);
    setTop(document.getElementById('below')!, -500);

    window.scrollTo(0, 500);
    expect(origScrollTo).toHaveBeenCalledWith(0, 500);

    window.scroll(0, 500);
    expect(origScroll).toHaveBeenCalledWith(0, 500);

    window.scrollBy(0, 100);
    expect(origScrollBy).toHaveBeenCalledWith(0, 100);

    cleanup();
    expect(window.scrollTo).toBe(origScrollTo);
    expect(window.scroll).toBe(origScroll);
    expect(window.scrollBy).toBe(origScrollBy);
  });

  it('cancels active animations when element settles', () => {
    initMotion(document);
    const below = document.getElementById('below')!;
    const mockAnim = { cancel: vi.fn() };
    (below as unknown as { getAnimations: () => unknown[] }).getAnimations = () => [mockAnim];

    FakeIO.instances[0].fire(below);
    expect(below.classList.contains(ACTIVE_CLASS)).toBe(true);

    vi.advanceTimersByTime(SETTLE_MS);
    expect(below.classList.contains(ACTIVE_CLASS)).toBe(false);
    expect(mockAnim.cancel).toHaveBeenCalled();
  });

  it('clears active timers on cleanup while reveal transition is pending', () => {
    const cleanup = initMotion(document);
    const below = document.getElementById('below')!;
    FakeIO.instances[0].fire(below);
    expect(below.classList.contains(ACTIVE_CLASS)).toBe(true);
    cleanup();
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(0);
  });

  it('cleanup restores full visibility and disconnects', () => {
    const cleanup = initMotion(document);
    cleanup();
    expect(document.querySelectorAll(`.${PENDING_CLASS}`).length).toBe(0);
    expect(FakeIO.instances[0].disconnected).toBe(true);
  });
});

describe('shouldLoadMotion (lazy loader gate)', () => {
  it('loads when targets exist and motion is allowed', () => {
    expect(shouldLoadMotion(document)).toBe(true);
  });

  it('skips pages without reveal targets', () => {
    document.body.innerHTML = '<p>No targets</p>';
    expect(shouldLoadMotion(document)).toBe(false);
  });

  it('skips calm (tier-3 article) pages', () => {
    document.documentElement.dataset.motionTier = 'calm';
    expect(shouldLoadMotion(document)).toBe(false);
  });

  it('skips under prefers-reduced-motion', () => {
    reduced = true;
    expect(shouldLoadMotion(document)).toBe(false);
  });
});
