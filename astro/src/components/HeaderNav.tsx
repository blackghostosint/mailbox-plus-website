import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Where a nav item renders on wide screens (DESIGN_PHASE1_SPEC §4 Task 2 nav regroup):
 * - `primary` (default): main desktop nav row.
 * - `quick`: header quick-action button (Track Your Package).
 * - `utility`: utility bar above the header (Pickup Hours) — rendered by Header.astro.
 * The mobile drawer always lists every item in its original order, so no link is lost
 * below the desktop breakpoint.
 */
export type NavPlacement = 'primary' | 'quick' | 'utility';

export interface NavItem {
  name: string;
  href: string;
  placement?: NavPlacement;
  /** Pill-badge emphasis (replaces the old yellow link colour — spec §3.4). */
  badge?: boolean;
}

export interface HeaderNavProps {
  navigation: NavItem[];
  /** External directions URL; renders the gold primary "Get Directions" header button. */
  directionsHref?: string;
  children?: React.ReactNode;
}

/** Desktop nav breakpoint (Tailwind `xl`). Below it the hamburger drawer is used. */
export const DESKTOP_MIN_WIDTH = 1280;

// Palette discipline (spec §3.4): gold appears only on hover/focus states and on the
// single primary button (Get Directions). Resting nav text is white; the Amazon Returns
// emphasis is a neutral pill, not a gold link.
const focusRing =
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-gold)]';
// Motion layer (spec §3.2, Task 3; classes in global.css): nav links get the underline
// sweep, the pill and action buttons get press/expand. Transform/opacity only (§1.3);
// both reduced-motion blocks in global.css neutralise them.
const navLinkClass = `motion-underline whitespace-nowrap text-lg font-medium text-white/90 hover:text-[var(--color-accent-gold-light)] transition-colors rounded-sm ${focusRing}`;
const badgeClass = `motion-press inline-flex items-center whitespace-nowrap rounded-full border border-white/30 bg-white/10 px-4 py-1 text-lg font-semibold text-white hover:border-[var(--color-accent-gold-light)] hover:text-[var(--color-accent-gold-light)] ${focusRing}`;
const pressable = 'motion-press';
const actionBase = `inline-flex items-center justify-center gap-2 min-h-11 min-w-11 whitespace-nowrap rounded-md px-2.5 sm:px-4 xl:px-3 text-base font-semibold ${pressable} ${focusRing}`;
const quickActionClass = `${actionBase} border border-white/40 text-white hover:border-[var(--color-accent-gold-light)] hover:text-[var(--color-accent-gold-light)]`;
const primaryButtonClass = `${actionBase} bg-[var(--color-accent-gold)] font-bold text-[var(--color-primary-deep)] shadow-sm hover:bg-[var(--color-accent-gold-light)]`;

const iconProps = {
  className: 'w-5 h-5 shrink-0',
  'aria-hidden': true,
  focusable: false,
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
} as const;

const PinIcon: React.FC = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const BoxIcon: React.FC = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

export const HeaderNav: React.FC<HeaderNavProps> = ({ navigation, directionsHref, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const mobileLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const isInitialRender = useRef<boolean>(true);

  const primaryItems = navigation.filter((item) => (item.placement ?? 'primary') === 'primary');
  const quickItems = navigation.filter((item) => item.placement === 'quick');

  // Close menu function with focus restoration
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    if (buttonRef.current && typeof buttonRef.current.focus === 'function') {
      buttonRef.current.focus();
    }
  }, []);

  // Open menu function with focus shift
  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen, closeMenu, openMenu]);

  // Focus placement on open
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (isOpen) {
      const firstLink = mobileLinkRefs.current[0];
      if (firstLink && typeof firstLink.focus === 'function') {
        firstLink.focus();
      }
    }
  }, [isOpen]);

  // Keyboard state machine & focus trap (Escape & Tab)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key === 'Tab') {
        const btn = buttonRef.current;
        const validLinks = mobileLinkRefs.current.filter(
          (link): link is HTMLAnchorElement => link !== null
        );
        const focusableElements: HTMLElement[] = btn ? [btn, ...validLinks] : validLinks;
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const firstLink = validLinks[0];
        const activeElement = document.activeElement;

        if (e.shiftKey) {
          // Shift + Tab (backward focus)
          if (
            activeElement === firstElement ||
            activeElement === firstLink ||
            !focusableElements.includes(activeElement as HTMLElement)
          ) {
            e.preventDefault();
            if (lastElement && typeof lastElement.focus === 'function') {
              lastElement.focus();
            }
          }
        } else {
          // Tab (forward focus)
          if (
            activeElement === lastElement ||
            !focusableElements.includes(activeElement as HTMLElement)
          ) {
            e.preventDefault();
            if (firstElement && typeof firstElement.focus === 'function') {
              firstElement.focus();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, closeMenu]);

  // Media query listener to close menu on resize to the desktop breakpoint
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches && isOpen) {
        closeMenu();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, [isOpen, closeMenu]);

  return (
    <>
      {/* Main row: logo, desktop nav, quick actions, mobile toggle */}
      <div className="flex items-center justify-between gap-2 sm:gap-6 xl:gap-4 h-20">
        {children || (
          <a href="/" className="flex items-center space-x-2">
            <img
              src="/logo.webp"
              alt="Mailbox Plus - Concord Township, OH"
              width="256"
              height="80"
              className="h-12 w-auto object-contain brightness-0 invert"
            />
          </a>
        )}

        {/* Desktop Navigation */}
        <nav
          className="hidden xl:flex items-center gap-5 flex-1 justify-center"
          aria-label="Main Navigation"
        >
          {primaryItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.badge ? badgeClass : navLinkClass}
              data-nav-badge={item.badge ? 'true' : undefined}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Header quick actions — icon-only (label kept for screen readers) below `sm` */}
        <div className="flex items-center gap-1.5 sm:gap-3 ml-auto xl:ml-0">
          {quickItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={quickActionClass}
              data-header-action="quick"
            >
              <BoxIcon />
              <span className="sr-only sm:not-sr-only">{item.name}</span>
            </a>
          ))}
          {directionsHref && (
            // Mirrors OutboundLink.astro's external-link contract (target/rel/sr-only note).
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryButtonClass}
              data-header-action="directions"
            >
              <PinIcon />
              <span className="sr-only sm:not-sr-only">Get Directions</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}

          {/* Mobile Menu Toggle */}
          <button
            ref={buttonRef}
            type="button"
            id="mobile-menu-btn"
            className={`xl:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-white/90 hover:text-[var(--color-accent-gold-light)] hover:bg-white/10 transition-colors ${focusRing}`}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
          >
            <svg
              id="menu-icon-open"
              className={`w-6 h-6 ${isOpen ? 'hidden' : ''}`}
              aria-hidden="true"
              focusable="false"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              id="menu-icon-close"
              className={`w-6 h-6 ${isOpen ? '' : 'hidden'}`}
              aria-hidden="true"
              focusable="false"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer — absolutely positioned under the sticky header so opening it never
          shifts page layout. Animates opacity + transform only (spec §1.3). `visibility`
          flips instantly on open (so focus can land on the first link) and is delayed on
          close via the transition so the fade completes; closed links leave the tab order.
          The global prefers-reduced-motion block zeroes the transition. */}
      <div
        id="mobile-menu"
        className={`xl:hidden absolute inset-x-0 top-full bg-[var(--color-primary-deeper)] border-t border-white/10 shadow-lg duration-[var(--duration-base)] ease-[var(--ease-out-quart)] ${
          isOpen
            ? 'visible transition-[opacity,transform]'
            : 'invisible pointer-events-none transition-[opacity,transform,visibility]'
        }`}
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-0.5rem)',
        }}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col items-start gap-5"
          aria-label="Mobile Navigation"
        >
          {navigation.map((item, index) => (
            <a
              key={item.href}
              ref={(el) => {
                mobileLinkRefs.current[index] = el;
              }}
              href={item.href}
              className={item.badge ? badgeClass : `block ${navLinkClass}`}
              data-mobile-link
              data-nav-badge={item.badge ? 'true' : undefined}
              onClick={closeMenu}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default HeaderNav;
