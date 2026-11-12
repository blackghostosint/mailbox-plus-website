// hero-scene.ts — GSAP choreography for the homepage SVG counter scene
// (DESIGN_PHASE1_SPEC §1.3, §1.4, §3.1, §3.2, §4 Task 5).
//
// Guarantees:
// 1. Static markup ships 100% visible (opacity: 1, resting position). Never touches <h1> (LCP).
// 2. Animates transform (x/y/scale/rotation) and opacity ONLY.
// 3. Respects prefers-reduced-motion: reduce — skips loading GSAP entirely when reduced motion
//    is active, and immediately kills/clears all tweens if toggled mid-session.
// 4. Pauses ambient loop when scrolled off-screen (IntersectionObserver) or tab hidden.
// 5. Cleans up cleanly across Astro ClientRouter View Transitions (astro:before-swap).

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const SCENE_SELECTOR = '[data-counter-scene]';

export type HeroSceneCleanup = () => void;
const noop: HeroSceneCleanup = () => {};

export function shouldAnimateHeroScene(doc: Document = document): boolean {
  const win = doc.defaultView;
  if (!win) return false;
  if (win.matchMedia?.(REDUCED_QUERY).matches) return false;
  return doc.querySelector(SCENE_SELECTOR) !== null;
}

export async function initHeroScene(doc: Document = document): Promise<HeroSceneCleanup> {
  if (!shouldAnimateHeroScene(doc)) return noop;
  const win = doc.defaultView;
  if (!win) return noop;
  const view = win;

  let cancelled = false;
  let cleanupFn: HeroSceneCleanup = noop;

  const { gsap } = await import('gsap');

  // Re-verify state after async chunk import (reduced-motion or navigation may have occurred).
  if (cancelled || !shouldAnimateHeroScene(doc)) return noop;

  const scene = doc.querySelector<HTMLElement>(SCENE_SELECTOR);
  if (!scene || !scene.isConnected) return noop;

  const q = (sel: string) => scene.querySelector<SVGElement>(sel);
  const boxMain = q('[data-scene-box-main]');
  const boxSide = q('[data-scene-box-side]');
  const label = q('[data-scene-label]');
  const beam = q('[data-scene-beam]');
  const scanline = q('[data-scene-scanline]');
  const badge = q('[data-scene-badge]');
  const rateHighlight = q('[data-scene-rate-highlight]');
  const alpacka = q('[data-scene-alpacka]');
  const alpackaHead = q('[data-scene-alpacka-head]');

  const targets = [
    boxMain,
    boxSide,
    label,
    beam,
    scanline,
    badge,
    rateHighlight,
    alpacka,
    alpackaHead,
  ].filter((el): el is SVGElement => el !== null);

  if (targets.length === 0) return noop;

  // Entrance beat (≤ 1.0s, subtle transform settle; opacity stays readable from frame 0).
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (boxSide) {
    intro.fromTo(boxSide, { y: -8 }, { y: 0, duration: 0.5 }, 0);
  }
  if (boxMain) {
    intro.fromTo(boxMain, { y: -10 }, { y: 0, duration: 0.55 }, 0.06);
  }
  if (label) {
    intro.fromTo(label, { y: -4 }, { y: 0, duration: 0.45 }, 0.14);
  }
  if (rateHighlight) {
    intro.fromTo(
      rateHighlight,
      { scaleX: 0.92, opacity: 0.75, transformOrigin: 'left center' },
      { scaleX: 1, opacity: 1, duration: 0.45 },
      0.18
    );
  }
  if (alpacka) {
    intro.fromTo(alpacka, { y: -6 }, { y: 0, duration: 0.5 }, 0.2);
  }

  // Ambient scan choreography loop (transform + opacity only).
  const loop = gsap.timeline({
    repeat: -1,
    repeatDelay: 2.2,
    paused: true,
    defaults: { ease: 'sine.inOut' },
  });

  if (beam) {
    loop.fromTo(beam, { opacity: 0.55 }, { opacity: 1, duration: 0.45 }, 0);
  }
  if (scanline) {
    loop.fromTo(scanline, { y: -18, opacity: 0.5 }, { y: 12, opacity: 1, duration: 0.75 }, 0);
    loop.to(scanline, { y: 0, opacity: 0.85, duration: 0.55 }, 0.75);
  }
  if (badge) {
    loop.fromTo(
      badge,
      { y: 0, scale: 1, transformOrigin: 'center center' },
      { y: -4, scale: 1.03, duration: 0.32, ease: 'power2.out' },
      0.55
    );
    loop.to(badge, { y: 0, scale: 1, duration: 0.4, ease: 'power2.inOut' }, 0.92);
  }
  if (alpackaHead) {
    loop.to(alpackaHead, { rotation: -4, transformOrigin: '444px 248px', duration: 0.28 }, 0.62);
    loop.to(alpackaHead, { rotation: 0, duration: 0.35 }, 0.92);
  }
  if (beam) {
    loop.to(beam, { opacity: 0.65, duration: 0.5 }, 1.0);
  }

  intro.eventCallback('onComplete', () => {
    if (!cancelled && inView && !doc.hidden) {
      loop.play();
    }
  });

  let inView = true;
  let observer: IntersectionObserver | null = null;
  if (typeof view.IntersectionObserver === 'function') {
    const io = new view.IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
          inView = entry.isIntersecting;
          if (!inView) {
            loop.pause();
          } else if (!intro.isActive() && !doc.hidden) {
            loop.play();
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(scene);
    observer = io;
  }

  const onVisibility = () => {
    if (doc.hidden) {
      loop.pause();
    } else if (inView && !intro.isActive()) {
      loop.play();
    }
  };

  const reducedMql = view.matchMedia?.(REDUCED_QUERY);
  const teardown = () => {
    cancelled = true;
    intro.kill();
    loop.kill();
    gsap.set(targets, { clearProps: 'transform,opacity' });
    observer?.disconnect();
    observer = null;
    doc.removeEventListener('visibilitychange', onVisibility);
    reducedMql?.removeEventListener?.('change', onReducedChange);
    delete scene.dataset.sceneReady;
  };

  function onReducedChange(e: MediaQueryListEvent) {
    if (e.matches) teardown();
  }

  doc.addEventListener('visibilitychange', onVisibility);
  reducedMql?.addEventListener?.('change', onReducedChange);
  scene.dataset.sceneReady = 'true';
  cleanupFn = teardown;

  return () => {
    cancelled = true;
    cleanupFn();
  };
}

export function scheduleHeroScene(doc: Document = document): HeroSceneCleanup {
  if (!shouldAnimateHeroScene(doc)) return noop;
  const win = doc.defaultView;
  if (!win) return noop;
  const view: Window = win;

  let activeCleanup: HeroSceneCleanup = noop;
  let disposed = false;
  let timerId = 0;
  let idleId = 0;

  const start = () => {
    if (disposed) return;
    initHeroScene(doc)
      .then((cleanup) => {
        if (disposed) {
          cleanup();
        } else {
          activeCleanup = cleanup;
        }
      })
      .catch(() => {
        // Decorative choreography only — static SVG fallback is already rendered.
      });
  };

  const ric = (
    view as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    }
  ).requestIdleCallback;

  if (typeof ric === 'function') {
    idleId = ric.call(view, start, { timeout: 300 });
  } else {
    timerId = view.setTimeout(start, 80);
  }

  return () => {
    disposed = true;
    if (idleId) {
      (view as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId);
    }
    if (timerId) {
      view.clearTimeout(timerId);
    }
    activeCleanup();
  };
}
