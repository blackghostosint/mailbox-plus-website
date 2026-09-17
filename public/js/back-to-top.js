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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackToTop);
  } else {
    initBackToTop();
  }
})();
