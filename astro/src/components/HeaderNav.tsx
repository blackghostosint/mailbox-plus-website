import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface NavItem {
  name: string;
  href: string;
  gold?: boolean;
}

export interface HeaderNavProps {
  navigation: NavItem[];
  children?: React.ReactNode;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ navigation, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const isInitialRender = useRef<boolean>(true);

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

  // Media query listener to close menu on desktop resize (>= 768px)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches && isOpen) {
        setIsOpen(false);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, [isOpen]);

  const menuScrollHeight = menuRef.current?.scrollHeight || 200;

  return (
    <>
      {/* Main Flex Row: Logo / Children, Desktop Navigation, and Mobile Toggle */}
      <div className="flex items-center justify-between h-20">
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
          className="hidden md:flex items-center space-x-8 flex-1 justify-center"
          aria-label="Main Navigation"
        >
          {navigation.map((item) =>
            item.gold ? (
              <a
                key={item.href}
                href={item.href}
                className="text-[15px] font-bold text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-light)] transition-colors"
              >
                {item.name}
              </a>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium text-white/90 hover:text-[var(--color-accent-gold-light)] transition-colors"
              >
                {item.name}
              </a>
            )
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            ref={buttonRef}
            type="button"
            id="mobile-menu-btn"
            className="p-2 rounded-lg text-white/90 hover:text-[var(--color-accent-gold-light)] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
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

      {/* Mobile Menu Dropdown */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className="md:hidden bg-[var(--color-primary-deeper)] border-t border-white/10 overflow-hidden transition-all duration-300 ease-in-out w-full"
        style={{
          maxHeight: isOpen ? `${menuScrollHeight}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <nav className="px-4 py-4 space-y-4" aria-label="Mobile Navigation">
          {navigation.map((item, index) =>
            item.gold ? (
              <a
                key={item.href}
                ref={(el) => {
                  mobileLinkRefs.current[index] = el;
                }}
                href={item.href}
                className="block text-base font-bold text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-light)] transition-colors"
                data-mobile-link
                onClick={closeMenu}
              >
                {item.name}
              </a>
            ) : (
              <a
                key={item.href}
                ref={(el) => {
                  mobileLinkRefs.current[index] = el;
                }}
                href={item.href}
                className="block text-base font-medium text-white/90 hover:text-[var(--color-accent-gold-light)] transition-colors"
                data-mobile-link
                onClick={closeMenu}
              >
                {item.name}
              </a>
            )
          )}
        </nav>
      </div>
    </>
  );
};

export default HeaderNav;
