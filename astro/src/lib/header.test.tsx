/* eslint-disable no-unused-vars */
// @vitest-environment happy-dom
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeaderNav from '../components/HeaderNav';

const sampleNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services/' },
  { name: 'Track Your Package', href: '/tracking/' },
  { name: 'Pickup Hours', href: '/pickup-hours/' },
  { name: 'Contact', href: '/contact-us/' },
  { name: 'Mailbox Rental', href: '/private-mailbox-rental/' },
  { name: 'Amazon Returns', href: '/amazon-counter/', gold: true },
];

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

  it('automatically closes menu and restores focus to #mobile-menu-btn on screen resize to desktop (>= 768px)', () => {
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
