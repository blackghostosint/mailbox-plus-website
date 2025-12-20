import React, { useEffect, useState, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PremierSignupModal Component
 * 
 * A responsive popup for Mailbox Plus Premier signup.
 * - Shows once every 7 days per user/device.
 * - Desktop: Prominent QR code for phone handoff.
 * - Mobile: Direct CTA button.
 * - Design: Minimal, premium, integrated with the site's V2 aesthetic.
 */

const SIGNUP_URL = 'https://mailbox-plus-loyalty-card.web.app/#/register?campaign=website-signup';
const STORAGE_KEY = 'premierSignupPopupLastShown';
const COOLDOWN_DAYS = 7;

export const PremierSignupModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Check if the popup should be shown
    useEffect(() => {
        const lastShown = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

        if (!lastShown || now - parseInt(lastShown, 10) > cooldownMs) {
            // Small delay before showing to ensure it's not too jarring on initial load
            const timer = setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem(STORAGE_KEY, now.toString());
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

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
            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements && focusableElements.length > 0) {
                (focusableElements[0] as HTMLElement).focus();

                const handleTab = (e: KeyboardEvent) => {
                    if (e.key !== 'Tab') return;

                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

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

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-md overflow-hidden bg-white text-slate-900 shadow-2xl rounded-[26px]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 transition-colors z-10"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
                            {/* Content */}
                            <div className="mb-2">
                                <h2
                                    id="modal-headline"
                                    className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight"
                                >
                                    Join Mailbox Plus Premier
                                </h2>
                                <p className="mt-2 text-[#0855B1] font-medium text-sm sm:text-base">
                                    Your services, made more rewarding — automatically.
                                </p>
                            </div>

                            {/* Desktop / Desktop+ QR View */}
                            <div className="hidden sm:flex flex-col items-center mt-6">
                                <p className="text-slate-500 text-sm mb-6 max-w-[280px]">
                                    Scan with your phone to get your digital Premier card instantly.
                                </p>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 group">
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
                                    className="text-xs text-slate-400 hover:text-[#0855B1] transition-colors underline underline-offset-4"
                                >
                                    Continue on this device
                                </a>
                            </div>

                            {/* Mobile View */}
                            <div className="flex sm:hidden flex-col items-center mt-4 w-full">
                                <p className="text-slate-500 text-sm mb-8">
                                    Get your digital Premier card instantly.
                                </p>

                                <a
                                    href={SIGNUP_URL}
                                    className="w-full py-4 bg-[#0855B1] text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform text-center inline-block"
                                >
                                    Add Premier Card to My Phone
                                </a>
                            </div>

                            {/* Secondary Copy */}
                            <div className="mt-8 flex flex-col gap-1">
                                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-2">
                                    <span>Takes under 30 seconds</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span>No physical card required</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
