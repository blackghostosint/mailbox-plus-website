import React, { useEffect, useState, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import X from '~icons/lucide/x';

import { usePremierGating } from '../../hooks/usePremierGating';

/**
 * PremierSignupModal Component
 *
 * A responsive popup for Mailbox Plus Premier signup.
 * - Shows once every 7 days per user/device.
 * - Desktop: Prominent QR code for phone handoff.
 * - Mobile: Direct CTA button.
 * - Design: Minimal, premium, integrated with the site's V2 aesthetic.
 */

import { siteConfig } from '../../config/siteConfig';

const SIGNUP_URL =
  siteConfig.premierSignupUrl ||
  'https://mailbox-plus-loyalty-card.web.app/#/register?campaign=website-signup';

export const PremierSignupModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { shouldShow, markAsShown, dismissPermanently } = usePremierGating();

  // Small delay before showing to ensure it's not too jarring on initial load
  useEffect(() => {
    if (shouldShow) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        markAsShown();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldShow, markAsShown]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    markAsShown(); // Start 7-day cooldown when user clicks X
  }, [markAsShown]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  // Focus trap logic
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      const getFocusableElements = () => {
        const elements =
          modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) || [];
        // Filter out elements that are hidden (offsetParent is null)
        return Array.from(elements).filter(
          (el) => (el as HTMLElement).offsetParent !== null
        ) as HTMLElement[];
      };

      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        // Initial focus
        focusableElements[0].focus();

        const handleTab = (e: KeyboardEvent) => {
          if (e.key !== 'Tab') return;

          const currentElements = getFocusableElements();
          if (currentElements.length === 0) return;

          const firstElement = currentElements[0];
          const lastElement = currentElements[currentElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        };

        window.addEventListener('keydown', handleTab);
        return () => window.removeEventListener('keydown', handleTab);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      {/* Backdrop */}
      <div
        onClick={closeModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') closeModal();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        className="absolute inset-0 bg-[var(--color-text-primary)]/40 backdrop-blur-sm animate-fade-in"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md overflow-hidden bg-white text-[var(--color-text-primary)] shadow-2xl rounded-[26px] animate-fade-in-up"
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors z-10"
          aria-label="Close modal"
        >
          <X width={20} height={20} />
        </button>

        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
          {/* Content */}
          <div className="mb-2">
            <h2
              id="modal-headline"
              className="text-2xl sm:text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight"
            >
              Join Mailbox Plus Premier
            </h2>
            <p className="mt-2 text-[var(--color-primary)] font-medium text-sm sm:text-base">
              Your services, made more rewarding — automatically.
            </p>
          </div>

          {/* Desktop / Desktop+ QR View */}
          <div className="hidden sm:flex flex-col items-center mt-6">
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-[280px]">
              Scan with your phone to get your digital Premier card instantly.
            </p>
            <div className="p-4 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-bg-secondary)] mb-6 group">
              <QRCodeSVG
                value={SIGNUP_URL}
                size={160}
                level="H"
                includeMargin={false}
                className="mx-auto"
              />
            </div>
            <a
              href={SIGNUP_URL}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-4"
            >
              Continue on this device
            </a>
          </div>

          {/* Mobile View */}
          <div className="flex sm:hidden flex-col items-center mt-4 w-full">
            <p className="text-[var(--color-text-secondary)] text-sm mb-8">
              Get your digital Premier card instantly.
            </p>

            <a
              href={SIGNUP_URL}
              className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl shadow-lg shadow-[var(--color-primary)]/20 active:scale-[0.98] transition-transform text-center inline-block"
            >
              Add Premier Card to My Phone
            </a>
          </div>

          {/* Secondary Copy */}
          <div className="mt-8 flex flex-col gap-3">
            <p className="text-[11px] text-[var(--color-text-secondary)] flex items-center justify-center gap-2">
              <span>Takes under 30 seconds</span>
              <span className="w-1 h-1 bg-[var(--color-border)] rounded-full" />
              <span>No physical card required</span>
            </p>
            <button
              onClick={dismissPermanently}
              className="text-[10px] text-[var(--color-border)] hover:text-[var(--color-text-secondary)] transition-colors uppercase tracking-widest font-medium"
            >
              Don&apos;t show again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
