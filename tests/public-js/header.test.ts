// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import headerModule from '../../public/js/header.js';

describe('header.js mobile menu', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header>
        <button id="mobile-menu-btn" aria-expanded="false" aria-label="Open menu">
          <span id="menu-icon-open">Open</span>
          <span id="menu-icon-close" class="hidden">Close</span>
        </button>
        <div id="mobile-menu" style="max-height: 0px; opacity: 0;">
          <a data-mobile-link href="/services/">Services</a>
          <a data-mobile-link href="/contact/">Contact</a>
        </div>
      </header>
    `;
    headerModule.initHeader();
  });

  it('toggles mobile menu on button click', () => {
    const btn = document.getElementById('mobile-menu-btn') as HTMLButtonElement;
    const menu = document.getElementById('mobile-menu') as HTMLDivElement;
    const iconOpen = document.getElementById('menu-icon-open') as HTMLSpanElement;
    const iconClose = document.getElementById('menu-icon-close') as HTMLSpanElement;

    expect(btn.getAttribute('aria-expanded')).toBe('false');

    btn.click();

    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(menu.style.maxHeight).toBe('500px');
    expect(menu.style.opacity).toBe('1');
    expect(iconOpen.classList.contains('hidden')).toBe(true);
    expect(iconClose.classList.contains('hidden')).toBe(false);

    btn.click();

    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(menu.style.maxHeight).toBe('0');
    expect(menu.style.opacity).toBe('0');
  });

  it('closes mobile menu on link click', () => {
    const btn = document.getElementById('mobile-menu-btn') as HTMLButtonElement;
    const menu = document.getElementById('mobile-menu') as HTMLDivElement;
    const link = document.querySelector('[data-mobile-link]') as HTMLAnchorElement;

    // Open drawer
    btn.click();
    expect(menu.style.maxHeight).toBe('500px');

    // Click nav link inside drawer
    link.click();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(menu.style.maxHeight).toBe('0');
    expect(menu.style.opacity).toBe('0');
  });
});
