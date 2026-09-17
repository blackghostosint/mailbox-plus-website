// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import backMod from '../../public/js/back-to-top.js';

describe('back-to-top.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="back-to-top" class="hidden">Top</button>
    `;
    window.scrollTo = vi.fn();
  });

  it('toggles hidden class on scroll and scrolls to top on click', () => {
    backMod.initBackToTop();

    const btn = document.getElementById('back-to-top') as HTMLButtonElement;
    expect(btn.classList.contains('hidden')).toBe(true);

    // Simulate scroll down
    Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
    window.dispatchEvent(new Event('scroll'));

    expect(btn.classList.contains('hidden')).toBe(false);

    // Click button
    btn.click();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
