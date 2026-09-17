/* global module */
// Mobile menu toggle — vanilla JS
(function () {
  function initHeader() {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    var iconOpen = document.getElementById('menu-icon-open');
    var iconClose = document.getElementById('menu-icon-close');
    if (btn && menu) {
      btn.addEventListener('click', function () {
        var isOpen = menu.style.maxHeight !== '0px' && menu.style.maxHeight !== '';
        menu.style.maxHeight = isOpen ? '0' : '500px';
        menu.style.opacity = isOpen ? '0' : '1';
        btn.setAttribute('aria-expanded', String(!isOpen));
        btn.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
        if (iconOpen) iconOpen.classList.toggle('hidden');
        if (iconClose) iconClose.classList.toggle('hidden');
      });
      // Close on link click
      document.querySelectorAll('[data-mobile-link]').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.style.maxHeight = '0';
          menu.style.opacity = '0';
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Open menu');
          if (iconOpen) iconOpen.classList.remove('hidden');
          if (iconClose) iconClose.classList.add('hidden');
        });
      });
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initHeader);
    } else {
      initHeader();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initHeader };
  }
  if (typeof window !== 'undefined') {
    window.initHeader = initHeader;
  }
})();
