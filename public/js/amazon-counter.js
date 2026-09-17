/* global module */
(function () {
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Copied!');
    }
  }

  function showToast(message) {
    const existing = document.querySelector('.copy-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function initAmazonCounter() {
    // Share fuel-math image — Web Share API on mobile, copy link fallback on desktop
    const fuelMathBtn = document.getElementById('share-fuelmath-btn');
    if (fuelMathBtn) {
      fuelMathBtn.addEventListener('click', () => {
        if (navigator.share) {
          navigator
            .share({
              title: 'Amazon Returns Counter for Concord Twp',
              text: "One truck's route beats 100 neighbors driving 40. Help bring Amazon returns to Concord Twp!",
              url: window.location.href,
            })
            .catch(() => {}); // user cancelled
        } else {
          copyToClipboard(window.location.href);
        }
      });
    }

    // Copy link buttons (hero + plan)
    document.querySelectorAll('[id^="copy-link-btn"]').forEach((btn) => {
      btn.addEventListener('click', () => copyToClipboard(window.location.href));
    });

    // Copy caption buttons (hero + plan)
    document.querySelectorAll('[id^="copy-caption-btn"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const firstCopyBtn = document.querySelector('.share-copy-btn');
        const caption = firstCopyBtn ? firstCopyBtn.getAttribute('data-copy') || '' : '';
        copyToClipboard(caption);
      });
    });

    // Share copy buttons (Instagram, TikTok)
    document.querySelectorAll('.share-copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');
        if (text) copyToClipboard(text);
      });
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAmazonCounter);
    } else {
      initAmazonCounter();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initAmazonCounter, copyToClipboard, showToast };
  }
  if (typeof window !== 'undefined') {
    window.initAmazonCounter = initAmazonCounter;
  }
})();
