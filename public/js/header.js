/**
 * Header navigation drawer controller and keyboard state machine.
 * Complies with WCAG 2.1 SC 2.1.1 (Keyboard) and SC 2.4.3 (Focus Order).
 */

let isOpen = false;
let keydownListenerAttached = false;
let mediaQueryListenerAttached = false;
let mediaQuery = null;

export function getIsOpen() {
  return isOpen;
}

export function openMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (!btn || !menu) return;
  if (isOpen) return;

  isOpen = true;
  menu.style.maxHeight = `${menu.scrollHeight}px`;
  menu.style.opacity = '1';
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('aria-label', 'Close menu');
  if (iconOpen) iconOpen.classList.add('hidden');
  if (iconClose) iconClose.classList.remove('hidden');

  if (!keydownListenerAttached) {
    document.addEventListener('keydown', handleKeydown);
    keydownListenerAttached = true;
  }

  // Focus the first link inside mobile menu when opened
  const firstLink = menu.querySelector('[data-mobile-link]');
  if (firstLink && typeof firstLink.focus === 'function') {
    firstLink.focus();
  }
}

export function closeMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (!btn || !menu) return;
  if (!isOpen) return;

  isOpen = false;
  menu.style.maxHeight = '0';
  menu.style.opacity = '0';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Open menu');
  if (iconOpen) iconOpen.classList.remove('hidden');
  if (iconClose) iconClose.classList.add('hidden');

  if (keydownListenerAttached) {
    document.removeEventListener('keydown', handleKeydown);
    keydownListenerAttached = false;
  }

  // Requirement 4: Restore focus to mobile-menu-btn
  if (btn && typeof btn.focus === 'function') {
    btn.focus();
  }
}

export function toggleMenu() {
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

export function handleKeydown(e) {
  if (!isOpen) return;

  if (e.key === 'Escape' || e.key === 'Esc') {
    e.preventDefault();
    closeMenu();
    return;
  }

  if (e.key === 'Tab') {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    const links = Array.from(menu.querySelectorAll('[data-mobile-link]'));
    const focusableElements = [btn, ...links];
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0]; // #mobile-menu-btn
    const lastElement = focusableElements[focusableElements.length - 1]; // last mobile link
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      // Shift + Tab (backward focus)
      // AC 3: Shift-tabbing backwards from #mobile-menu-btn or the first link wraps focus to the last link in #mobile-menu
      const firstLink = links[0];
      if (
        activeElement === firstElement ||
        activeElement === firstLink ||
        !focusableElements.includes(activeElement)
      ) {
        e.preventDefault();
        if (typeof lastElement.focus === 'function') {
          lastElement.focus();
        }
      }
    } else {
      // Tab (forward focus)
      // AC 2: Tabbing past the last link in #mobile-menu wraps focus back to #mobile-menu-btn or the first link in the menu
      if (activeElement === lastElement || !focusableElements.includes(activeElement)) {
        e.preventDefault();
        if (typeof firstElement.focus === 'function') {
          firstElement.focus();
        }
      }
    }
  }
}

export function handleMediaChange(e) {
  if (e.matches && isOpen) {
    closeMenu();
  }
}

export function initHeader() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  if (!btn.dataset.headerInitialized) {
    btn.dataset.headerInitialized = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu();
    });

    const links = document.querySelectorAll('[data-mobile-link]');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    if (typeof window !== 'undefined' && window.matchMedia) {
      mediaQuery = window.matchMedia('(min-width: 768px)');
      if (!mediaQueryListenerAttached) {
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleMediaChange);
        } else if (mediaQuery.addListener) {
          mediaQuery.addListener(handleMediaChange);
        }
        mediaQueryListenerAttached = true;
      }
    }
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
}
