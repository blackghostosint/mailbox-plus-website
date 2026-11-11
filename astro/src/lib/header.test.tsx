/* eslint-disable no-unused-vars */
// @vitest-environment happy-dom
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeaderNav from '../components/HeaderNav';

const sampleNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services/' },
  { name: 'Track Your Package', href: '/tracking/', placement: 'quick' as const },
  { name: 'Pickup Hours', href: '/pickup-hours/', placement: 'utility' as const },
  { name: 'Contact', href: '/contact-us/' },
  { name: 'Mailbox Rental', href: '/private-mailbox-rental/' },
  { name: 'Amazon Returns', href: '/amazon-counter/', badge: true },
];
const directionsHref = 'https://www.google.com/maps/dir/?api=1&destination=41.66497,-81.24164';

describe('HeaderNav nav regroup (DESIGN_PHASE1_SPEC Task 2)', () => {
  it('keeps quick/utility items out of the desktop nav row', () => {
    render(<HeaderNav navigation={sampleNavigation} directionsHref={directionsHref} />);
    const mainNav = screen.getByRole('navigation', { name: 'Main Navigation' });
    const hrefs = Array.from(mainNav.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([
      '/',
      '/services/',
      '/contact-us/',
      '/private-mailbox-rental/',
      '/amazon-counter/',
    ]);
  });

  it('renders Track Your Package as a header quick action with an accessible name', () => {
    render(<HeaderNav navigation={sampleNavigation} directionsHref={directionsHref} />);
    const quick = document.querySelector('[data-header-action="quick"]')!;
    expect(quick.getAttribute('href')).toBe('/tracking/');
    expect(quick.textContent).toContain('Track Your Package');
  });

  it('renders Get Directions as an external primary button', () => {
    render(<HeaderNav navigation={sampleNavigation} directionsHref={directionsHref} />);
    const dir = document.querySelector('[data-header-action="directions"]')!;
    expect(dir.getAttribute('href')).toBe(directionsHref);
    expect(dir.getAttribute('target')).toBe('_blank');
    expect(dir.getAttribute('rel')).toBe('noopener noreferrer');
    expect(dir.textContent).toContain('Get Directions');
    expect(dir.className).toContain('bg-[var(--color-accent-gold)]');
  });

  it('omits Get Directions when no directionsHref is provided', () => {
    render(<HeaderNav navigation={sampleNavigation} />);
    expect(document.querySelector('[data-header-action="directions"]')).toBeNull();
  });

  it('gives Amazon Returns a pill badge instead of a resting gold text colour', () => {
    render(<HeaderNav navigation={sampleNavigation} />);
    const badges = Array.from(document.querySelectorAll('[data-nav-badge="true"]'));
    expect(badges.length).toBe(2); // desktop + mobile drawer
    for (const badge of badges) {
      expect(badge.getAttribute('href')).toBe('/amazon-counter/');
      expect(badge.className).toContain('rounded-full');
      expect(badge.className).not.toMatch(/(^|\s)text-\[var\(--color-accent-gold\)\]/);
    }
  });

  it('uses gold only on hover/focus states and the single primary button', () => {
    render(<HeaderNav navigation={sampleNavigation} directionsHref={directionsHref} />);
    const restingGold = Array.from(document.querySelectorAll('a, button')).filter((el) =>
      el.className
        .split(/\s+/)
        .some((cls) => /^(text|bg|border)-\[var\(--color-accent-gold(-light)?\)\]$/.test(cls))
    );
    expect(restingGold.map((el) => el.getAttribute('data-header-action'))).toEqual(['directions']);
  });

  it('lists every nav item in the mobile drawer in original order', () => {
    render(<HeaderNav navigation={sampleNavigation} directionsHref={directionsHref} />);
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile Navigation' });
    const hrefs = Array.from(mobileNav.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(sampleNavigation.map((item) => item.href));
  });

  it('animates the drawer with opacity/transform only and hides it from AT when closed', () => {
    render(<HeaderNav navigation={sampleNavigation} />);
    const menu = document.getElementById('mobile-menu')!;
    expect(menu.style.maxHeight).toBe('');
    expect(menu.className).toContain('invisible');
    expect(menu.className).toContain('transition-[opacity,transform,visibility]');
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(menu.className).not.toContain('invisible');
    // visibility must flip instantly on open so focus can land on the first link
    expect(menu.className).toContain('transition-[opacity,transform]');
    expect(menu.className).not.toContain('visibility]');
    expect(menu.style.transform).toBe('translateY(0)');
  });
});

describe('HeaderNav mobile drawer controller & keyboard state machine', () => {
  let mediaQueryListeners: ((e: MediaQueryListEvent) => void)[] = [];

  beforeEach(() => {
    mediaQueryListeners = [];
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (event: string, listener: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          mediaQueryListeners.push(listener);
        }
      },
      removeEventListener: (event: string, listener: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          mediaQueryListeners = mediaQueryListeners.filter((l) => l !== listener);
        }
      },
      dispatchEvent: vi.fn(),
    }));
  });

  it('opens and closes drawer via toggleMenu button click', () => {
    render(<HeaderNav navigation={sampleNavigation} />);

    const btn = screen.getByRole('button', { name: 'Open menu' });
    const mobileMenu = document.getElementById('mobile-menu')!;

    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-controls')).toBe('mobile-menu');

    fireEvent.click(btn);

    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Close menu');
    expect(mobileMenu.style.opacity).toBe('1');

    fireEvent.click(btn);

    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Open menu');
    expect(mobileMenu.style.opacity).toBe('0');
  });

  it('shifts focus to the first mobile link when opened', () => {
    render(<HeaderNav navigation={sampleNavigation} />);

    const btn = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(btn);

    const mobileNav = screen.getByRole('navigation', { name: 'Mobile Navigation' });
    const firstMobileLink = mobileNav.querySelectorAll('a')[0];
    expect(document.activeElement).toBe(firstMobileLink);
  });

  it('closes drawer and restores focus to #mobile-menu-btn when Escape is pressed', () => {
    render(<HeaderNav navigation={sampleNavigation} />);

    const btn = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(btn);

    expect(btn.getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(btn);
  });

  it('traps focus forward: tabbing past the last link wraps focus back to #mobile-menu-btn', () => {
    render(<HeaderNav navigation={sampleNavigation} />);

    const btn = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(btn);

    const mobileNav = screen.getByRole('navigation', { name: 'Mobile Navigation' });
    const links = Array.from(mobileNav.querySelectorAll('a'));
    const lastLink = links[links.length - 1];

    act(() => {
      lastLink.focus();
    });
    expect(document.activeElement).toBe(lastLink);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });

    expect(document.activeElement).toBe(btn);
  });

  it('traps focus backward: Shift-tabbing from #mobile-menu-btn wraps focus to the last link', () => {
    render(<HeaderNav navigation={sampleNavigation} />);

    const btn = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(btn);

    const mobileNav = screen.getByRole('navigation', { name: 'Mobile Navigation' });
    const links = Array.from(mobileNav.querySelectorAll('a'));
    const lastLink = links[links.length - 1];

    act(() => {
      btn.focus();
    });
    expect(document.activeElement).toBe(btn);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(lastLink);
  });

  it('traps focus backward: Shift-tabbing from the first link wraps focus to the last link', () => {
    render(<HeaderNav navigation={sampleNavigation} />);

    const btn = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(btn);

    const mobileNav = screen.getByRole('navigation', { name: 'Mobile Navigation' });
    const links = Array.from(mobileNav.querySelectorAll('a'));
    const firstLink = links[0];
    const lastLink = links[links.length - 1];

    act(() => {
      firstLink.focus();
    });
    expect(document.activeElement).toBe(firstLink);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(lastLink);
  });

  it('closes menu and restores focus to #mobile-menu-btn when a mobile link is clicked', () => {
    render(<HeaderNav navigation={sampleNavigation} />);

    const btn = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(btn);

    const mobileNav = screen.getByRole('navigation', { name: 'Mobile Navigation' });
    const firstLink = mobileNav.querySelectorAll('a')[0];

    fireEvent.click(firstLink);

    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(btn);
  });

  it('automatically closes menu and restores focus to #mobile-menu-btn on screen resize to desktop (>= 1280px)', () => {
    render(<HeaderNav navigation={sampleNavigation} />);

    const btn = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(btn);

    expect(btn.getAttribute('aria-expanded')).toBe('true');

    const mobileNav = screen.getByRole('navigation', { name: 'Mobile Navigation' });
    const links = Array.from(mobileNav.querySelectorAll('a'));
    const secondLink = links[1];

    act(() => {
      secondLink.focus();
    });
    expect(document.activeElement).toBe(secondLink);

    act(() => {
      mediaQueryListeners.forEach((listener) => listener({ matches: true } as MediaQueryListEvent));
    });

    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(btn);
  });
});
