// home-scroll.ts — Homepage scroll narrative choreography
// (DESIGN_PHASE1_SPEC §1.3, §1.4, §3.2, §4 Task 6).
//
// Guarantees:
// 1. Server-rendered HTML is 100% complete and visible without JS.
// 2. Animates transform (translate3d / scale / scaleX) and opacity ONLY — never layout properties.
// 3. Respects prefers-reduced-motion: reduce (complete no-op; strips inline styles if toggled mid-session)
//    and tier-3 calm pages (data-motion-tier="calm").
// 4. Zero load-time TBT work: passive scroll/resize listeners run rAF-coalesced updates only when
//    scrolling occurs, and memoize clamped progress so off-stage scroll frames skip DOM writes.
// 5. Cleans up across Astro ClientRouter View Transitions (astro:before-swap).

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const PINNED_SELECTOR = '[data-home-pinned]';
const PIN_TRACK_SELECTOR = '[data-home-pin-track]';
const PARALLAX_SECTION_SELECTOR = '[data-home-parallax]';
const STICKY_TOP_PX = 104;

type StylableElement = HTMLElement | SVGElement;
export type HomeScrollCleanup = () => void;

const noop: HomeScrollCleanup = () => {};

export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function computePinProgress(
  rectTop: number,
  rectHeight: number,
  viewportHeight: number,
  stickyTopPx: number = STICKY_TOP_PX
): number {
  const vh = Math.max(1, viewportHeight);
  const startTop = vh * 0.75;
  const stickyRunway = Math.max(0, rectHeight - vh * 0.78);
  const endTop = Math.min(stickyTopPx - stickyRunway, vh * 0.12);
  const span = Math.max(1, startTop - endTop);
  return clamp01((startTop - rectTop) / span);
}

export function shouldAnimateHomeScroll(doc: Document = document): boolean {
  const win = doc.defaultView;
  if (!win) return false;
  if (doc.documentElement.dataset.motionTier === 'calm') return false;
  if (win.matchMedia?.(REDUCED_QUERY).matches) return false;
  return doc.querySelector(PINNED_SELECTOR) !== null;
}

export function initHomeScroll(doc: Document = document): HomeScrollCleanup {
  if (!shouldAnimateHomeScroll(doc)) return noop;
  const win = doc.defaultView;
  if (!win) return noop;
  const view = win;

  const pinnedSection = doc.querySelector<HTMLElement>(PINNED_SELECTOR);
  if (!pinnedSection) return noop;

  const pinTrack = pinnedSection.querySelector<HTMLElement>(PIN_TRACK_SELECTOR) || pinnedSection;
  const parallaxSection = doc.querySelector<HTMLElement>(PARALLAX_SECTION_SELECTOR);

  const progressBar = pinnedSection.querySelector<StylableElement>('[data-pin-progress]');
  const routesLayer = pinnedSection.querySelector<StylableElement>('[data-pin-routes]');
  const haloLayer = pinnedSection.querySelector<StylableElement>('[data-pin-halo]');
  const markerLayer = pinnedSection.querySelector<StylableElement>('[data-pin-marker]');
  const cardLayer = pinnedSection.querySelector<StylableElement>('[data-pin-card]');
  const parallaxLayer =
    parallaxSection?.querySelector<StylableElement>('[data-parallax-layer]') || null;

  const allLayers = [
    progressBar,
    routesLayer,
    haloLayer,
    markerLayer,
    cardLayer,
    parallaxLayer,
  ].filter((el): el is StylableElement => el !== null);

  if (allLayers.length === 0) return noop;

  let listening = false;
  let scheduled = false;
  let frameId = 0;
  let lastPinP = -1;
  let lastAreaP = -1;

  const updateFrame = () => {
    scheduled = false;
    frameId = 0;
    const vh = view.innerHeight || doc.documentElement.clientHeight || 900;

    // Read phase first (batch all layout reads before any style writes).
    const pinRect = pinTrack.getBoundingClientRect();
    const parallaxRect =
      parallaxSection && parallaxLayer ? parallaxSection.getBoundingClientRect() : null;

    const p = computePinProgress(pinRect.top, pinRect.height, vh);

    // Write phase (transform + opacity only; memoized so off-stage frames do zero writes).
    if (Math.abs(p - lastPinP) > 0.0005) {
      lastPinP = p;
      if (progressBar) {
        progressBar.style.transform = `scaleX(${(0.16 + p * 0.84).toFixed(3)})`;
      }
      if (routesLayer) {
        const y = ((1 - p) * 10).toFixed(2);
        const s = (0.96 + p * 0.04).toFixed(3);
        routesLayer.style.transform = `translate3d(0, ${y}px, 0) scale(${s})`;
        routesLayer.style.opacity = (0.72 + p * 0.28).toFixed(3);
      }
      if (haloLayer) {
        const s = (0.86 + p * 0.24).toFixed(3);
        haloLayer.style.transform = `scale(${s})`;
        haloLayer.style.opacity = (0.55 + p * 0.4).toFixed(3);
      }
      if (markerLayer) {
        const y = ((1 - p) * -14).toFixed(2);
        markerLayer.style.transform = `translate3d(0, ${y}px, 0)`;
      }
      if (cardLayer) {
        const y = (12 - p * 18).toFixed(2);
        cardLayer.style.transform = `translate3d(0, ${y}px, 0)`;
      }
    }

    if (parallaxRect && parallaxLayer) {
      const totalSpan = Math.max(1, vh + parallaxRect.height);
      const areaP = clamp01((vh - parallaxRect.top) / totalSpan);
      if (Math.abs(areaP - lastAreaP) > 0.0005) {
        lastAreaP = areaP;
        const driftY = ((0.5 - areaP) * 28).toFixed(2);
        parallaxLayer.style.transform = `translate3d(0, ${driftY}px, 0)`;
      }
    }
  };

  const scheduleFrame = () => {
    if (scheduled) return;
    scheduled = true;
    const id = view.requestAnimationFrame(updateFrame);
    if (scheduled) {
      frameId = id;
    }
  };

  function syncListeners() {
    const shouldListen = !doc.hidden;
    if (shouldListen && !listening) {
      listening = true;
      view.addEventListener('scroll', scheduleFrame, { passive: true });
      view.addEventListener('resize', scheduleFrame, { passive: true });
    } else if (!shouldListen && listening) {
      listening = false;
      view.removeEventListener('scroll', scheduleFrame);
      view.removeEventListener('resize', scheduleFrame);
      if (scheduled && frameId) {
        view.cancelAnimationFrame(frameId);
      }
      scheduled = false;
      frameId = 0;
    }
  }

  syncListeners();

  const onVisibility = () => {
    syncListeners();
  };

  const clearInlineStyles = () => {
    lastPinP = -1;
    lastAreaP = -1;
    for (const el of allLayers) {
      el.style.removeProperty('transform');
      el.style.removeProperty('opacity');
    }
  };

  const reducedMql = view.matchMedia?.(REDUCED_QUERY);

  function teardown() {
    if (listening) {
      listening = false;
      view.removeEventListener('scroll', scheduleFrame);
      view.removeEventListener('resize', scheduleFrame);
    }
    if (scheduled && frameId) {
      view.cancelAnimationFrame(frameId);
    }
    scheduled = false;
    frameId = 0;
    clearInlineStyles();
    doc.removeEventListener('visibilitychange', onVisibility);
    reducedMql?.removeEventListener?.('change', onReducedChange);
    delete pinnedSection!.dataset.scrollReady;
  }

  function onReducedChange(event: MediaQueryListEvent) {
    if (event.matches) {
      teardown();
    }
  }

  doc.addEventListener('visibilitychange', onVisibility);
  reducedMql?.addEventListener?.('change', onReducedChange);
  pinnedSection.dataset.scrollReady = 'true';

  return teardown;
}
