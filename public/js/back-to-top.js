/* global module */
(function () {
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (btn) {
      window.addEventListener('scroll', () => {
        btn.classList.toggle('hidden', window.scrollY < 300);
      });
      btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBackToTop);
    } else {
      initBackToTop();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initBackToTop };
  }
  if (typeof window !== 'undefined') {
    window.initBackToTop = initBackToTop;
  }
})();
