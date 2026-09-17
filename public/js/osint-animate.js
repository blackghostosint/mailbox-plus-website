/* global module */
(function () {
  function initOsintAnimate() {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sections = document.querySelectorAll('.osint-page section[data-animate]');
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 }
    );
    for (const section of sections) {
      section.classList.add('section-hidden');
      observer.observe(section);
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initOsintAnimate);
    } else {
      initOsintAnimate();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initOsintAnimate };
  }
  if (typeof window !== 'undefined') {
    window.initOsintAnimate = initOsintAnimate;
  }
})();
