// motion.ts — shared scroll-reveal module (DESIGN_PHASE1_SPEC §3.2, §4 Task 3).
//
// Contract:
// - Markup is always complete and visible. `[data-reveal]` (single block) and
//   `[data-reveal-stagger]` (grid whose children fade in sequence) are plain
//   attributes; with JS off, or before this module runs, nothing is hidden.
// - On init, only elements that sit entirely BELOW the initial viewport get the
//   hidden `reveal-pending` state. Anything the visitor can already see is never
//   touched, so nothing flashes visible→hidden and no LCP candidate is hidden.
// - IntersectionObserver reveals each element once (`once: true` semantics:
//   unobserved after the first intersection). A rAF-throttled scroll sweep catches
//   targets a jump scroll carried past the viewport without intersecting. The
//   animation is CSS-only
//   (opacity + transform, tokens --duration-reveal / --ease-out-quart /
//   --motion-distance-reveal in global.css).
// - prefers-reduced-motion: reduce → the module is a no-op (and global.css forces
//   the pending state visible as a second line of defence). Switching the
//   preference mid-session, keyboard focus into a pending block, and printing
//   all reveal immediately.
// Loaded lazily from BaseLayout only on pages that contain reveal targets.

export const REVEAL_SELECTOR = '[data-reveal], [data-reveal-stagger]';
export const PENDING_CLASS = 'reveal-pending';
export const ACTIVE_CLASS = 'reveal-in';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
// Longest reveal = --duration-reveal (600ms) + max stagger delay (6 × 80ms) + slack.
// After it, `reveal-in` is dropped so hover transitions (e.g. .motion-lift) are not
// stretched by the reveal's longer transition/delay.
export const SETTLE_MS = 1200;

type Cleanup = () => void;
const noop: Cleanup = () => {};

export function initMotion(doc: Document = document): Cleanup {
  const win = doc.defaultView;
  if (!win || typeof win.IntersectionObserver !== 'function') return noop;
  // Non-null alias for the hoisted detachSweep(), where `win` narrowing doesn't reach.
  const view: Window = win;
  const reduced = win.matchMedia?.(REDUCED_QUERY);
  if (reduced?.matches) return noop;

  const viewportBottom = win.innerHeight || doc.documentElement.clientHeight;
  // Read phase (all rects first), then write phase — one forced layout total.
  const candidates = Array.from(doc.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter(
    (el) => !el.classList.contains(PENDING_CLASS) && !el.classList.contains(ACTIVE_CLASS)
  );
  const below = candidates.filter((el) => el.getBoundingClientRect().top >= viewportBottom);
  if (below.length === 0) {
    doc.documentElement.dataset.motion = 'ready';
    return noop;
  }

  const timers = new Set<ReturnType<typeof setTimeout>>();
  const pending = new Set<HTMLElement>(below);

  const reveal = (el: HTMLElement) => {
    if (!pending.delete(el)) return;
    observer.unobserve(el);
    el.classList.add(ACTIVE_CLASS);
    el.classList.remove(PENDING_CLASS);
    const t = setTimeout(() => {
      el.classList.remove(ACTIVE_CLASS);
      timers.delete(t);
    }, SETTLE_MS);
    timers.add(t);
  };

  const revealAll = () => {
    for (const el of Array.from(pending)) {
      pending.delete(el);
      observer.unobserve(el);
      el.classList.remove(PENDING_CLASS);
    }
    detachSweep();
  };

  const observer = new win.IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      }
      if (pending.size === 0) detachSweep();
    },
    // Reveal once the block is ~40px into the viewport.
    { rootMargin: '0px 0px -40px 0px', threshold: 0 }
  );

  // Safety net: a jump scroll (End key, anchor link, fast fling) can carry a target
  // from below the viewport to above it without it ever intersecting, so the observer
  // never fires. A rAF-throttled passive scroll sweep reveals anything whose top has
  // passed the viewport bottom. Detached as soon as nothing is pending.
  let frame = 0;
  let sweeping = false;
  const sweep = () => {
    frame = 0;
    const bottom = win.innerHeight || doc.documentElement.clientHeight;
    const passed = Array.from(pending).filter((el) => el.getBoundingClientRect().top < bottom);
    passed.forEach(reveal);
    if (pending.size === 0) detachSweep();
  };
  const onScroll = () => {
    if (!frame) frame = win.requestAnimationFrame(sweep);
  };
  function detachSweep() {
    if (!sweeping) return;
    sweeping = false;
    view.removeEventListener('scroll', onScroll);
    if (frame) view.cancelAnimationFrame(frame);
    frame = 0;
  }

  for (const el of below) {
    el.classList.add(PENDING_CLASS);
    observer.observe(el);
  }
  win.addEventListener('scroll', onScroll, { passive: true });
  sweeping = true;

  const onFocusIn = (event: Event) => {
    const target = event.target as Element | null;
    const host = target?.closest?.(`.${PENDING_CLASS}`) as HTMLElement | null;
    if (host) reveal(host);
  };
  const onReducedChange = (event: MediaQueryListEvent) => {
    if (event.matches) revealAll();
  };

  doc.addEventListener('focusin', onFocusIn);
  win.addEventListener('beforeprint', revealAll);
  reduced?.addEventListener?.('change', onReducedChange);
  doc.documentElement.dataset.motion = 'ready';

  return () => {
    revealAll();
    observer.disconnect();
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
    doc.removeEventListener('focusin', onFocusIn);
    win.removeEventListener('beforeprint', revealAll);
    reduced?.removeEventListener?.('change', onReducedChange);
  };
}
