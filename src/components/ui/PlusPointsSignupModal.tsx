import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import X from '~icons/lucide/x';
import Gift from '~icons/lucide/gift';
import ChevronRight from '~icons/lucide/chevron-right';

import { usePlusPointsGating } from '../../hooks/usePlusPointsGating';

/**
 * PlusPointsSignupModal Component
 *
 * A 3D-style popup inviting visitors to join Plus Points.
 * - Shows at most once every 10 days per user/device.
 * - Same layout for mobile and desktop (button only, no QR code).
 * - 3D raised-card effect via layered shadows and subtle CSS perspective.
 * - Easy to close: X button, ESC key, backdrop click.
 */
export const PlusPointsSignupModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { shouldShow, markAsShown, dismissPermanently } = usePlusPointsGating();

  // Small delay before showing so it's not jarring on initial load
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
    markAsShown(); // Start 10-day cooldown when user clicks X
  }, [markAsShown]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  // Focus trap
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      const getFocusableElements = () => {
        const elements =
          modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) || [];
        return Array.from(elements).filter(
          (el) => (el as HTMLElement).offsetParent !== null
        ) as HTMLElement[];
      };

      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
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
      style={{ perspective: '1200px' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="plus-points-modal-headline"
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

      {/* Modal Card — 3D raised effect */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md overflow-hidden bg-white text-[var(--color-text-primary)] animate-fade-in-up"
        style={{
          borderRadius: '26px',
          transform: 'rotateX(2deg)',
          boxShadow: `
            0 4px 6px -2px rgba(0,0,0,0.08),
            0 12px 24px -8px rgba(0,0,0,0.15),
            0 30px 60px -12px rgba(0,0,0,0.25),
            0 6px 0 0 var(--color-accent-gold, #f7c82a)
          `,
        }}
      >
        {/* Navy header bar with gold accent */}
        <div
          className="px-8 sm:px-10 pt-10 pb-6 text-white"
          style={{
            background: 'linear-gradient(135deg, #285a8e 0%, #162c45 100%)',
            borderRadius: '26px 26px 0 0',
          }}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-1.5 text-white/70 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full"
            aria-label="Close modal"
          >
            <X width={18} height={18} />
          </button>

          {/* Icon badge */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-[var(--color-accent-gold)] mb-4 border border-white/20">
            <Gift width={24} height={24} />
          </div>

          {/* Headline */}
          <h2
            id="plus-points-modal-headline"
            className="text-2xl sm:text-3xl font-bold leading-tight"
          >
            You deserve to be rewarded
            <br />
            <span className="text-[var(--color-accent-gold)]">for shipping.</span>
          </h2>
        </div>

        {/* Body */}
        <div className="px-8 sm:px-10 pt-6 pb-8 sm:pb-10 flex flex-col items-center text-center">
          <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed mb-6 max-w-xs sm:max-w-sm">
            Earn points on every shipment — shipping, printing, mailbox rentals. Free tape, free
            packing, even free mailbox months.
          </p>

          {/* CTA Button */}
          <Link
            to="/rewards/join"
            onClick={closeModal}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #a45c40 0%, #c4765a 100%)',
              color: '#fff',
            }}
          >
            Join Plus Points Free
            <ChevronRight width={20} height={20} />
          </Link>

          {/* Utility info */}
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-[11px] text-[var(--color-text-secondary)] flex items-center justify-center gap-2">
              <span>Takes 30 seconds</span>
              <span className="w-1 h-1 bg-[var(--color-border)] rounded-full" />
              <span>No password needed</span>
            </p>

            {/* Dismiss permanently */}
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
