/* global module */
(function () {
  function initArticleCta() {
    if (!('IntersectionObserver' in window)) return;
    var ctaEl = document.getElementById('article-bottom-cta');
    if (!ctaEl) return;
    var seen = false;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !seen) {
            seen = true;
            if (typeof window.gtag === 'function') {
              window.gtag('event', 'article_cta_view', {
                cta_category: ctaEl.getAttribute('data-category') || 'general',
                cta_slug: ctaEl.getAttribute('data-slug') || '',
                page_path: window.location.pathname,
              });
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ctaEl);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initArticleCta);
    } else {
      initArticleCta();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initArticleCta };
  }
  if (typeof window !== 'undefined') {
    window.initArticleCta = initArticleCta;
  }
})();
