// motion-loader.ts — tiny always-on entry for the motion layer (DESIGN_PHASE1_SPEC §4 Task 3).
// It ships on every page, stays a few hundred bytes, and only fetches the reveal module
// (motion.ts, a separate lazy chunk) when the page has reveal targets, the browser
// supports IntersectionObserver, and the visitor has not asked for reduced motion.

const TARGETS = '[data-reveal], [data-reveal-stagger]';

export function shouldLoadMotion(doc: Document = document): boolean {
  const win = doc.defaultView;
  if (!win || typeof win.IntersectionObserver !== 'function') return false;
  // Tier-3 pages (articles) opt out of scroll reveals: they inherit the calm
  // CSS-only micro-interactions from shared components and nothing else.
  if (doc.documentElement.dataset.motionTier === 'calm') return false;
  if (win.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  return doc.querySelector(TARGETS) !== null;
}

export function loadMotion(doc: Document = document): Promise<void> {
  if (!shouldLoadMotion(doc)) return Promise.resolve();
  return import('./motion')
    .then(({ initMotion }) => {
      initMotion(doc);
    })
    .catch(() => {
      // Motion is decorative: if the chunk fails to load, content is already visible.
    });
}
