import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/storage';
import { siteConfig } from '../config/siteConfig';

const COOLDOWN_DAYS = 10;

/**
 * Hook to manage the visibility logic for the Plus Points Signup Modal.
 * Encapsulates permanent suppression, cooldown, and session guard logic.
 * Same settings for mobile and desktop.
 */
export const usePlusPointsGating = () => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Hard disable from config — even if the component is mounted
    if (siteConfig.plusPointsSignupModalEnabled !== true) {
      setShouldShow(false);
      return;
    }

    const checkGating = () => {
      // 1. Permanent Suppression — already a member
      const isMember =
        localStorage.getItem(STORAGE_KEYS.LOYALTY_CARD_ID) ||
        localStorage.getItem(STORAGE_KEYS.PREMIER_MEMBER_ID) ||
        localStorage.getItem(STORAGE_KEYS.QR_TOKEN) ||
        localStorage.getItem(STORAGE_KEYS.PREMIER_SIGNUP_COMPLETED) === 'true' ||
        localStorage.getItem(STORAGE_KEYS.PLUS_POINTS_SIGNUP_COMPLETED) === 'true';

      if (isMember) return false;

      // 2. Explicit Dismissal — user clicked "Don't show again"
      if (localStorage.getItem(STORAGE_KEYS.PLUS_POINTS_MODAL_DISMISSED) === 'true') return false;

      // 3. Session Guard — prevent showing again in same session
      if (sessionStorage.getItem(STORAGE_KEYS.PLUS_POINTS_MODAL_SHOWN_SESSION) === 'true')
        return false;

      // 4. 10-Day Cooldown
      const lastShown = localStorage.getItem(STORAGE_KEYS.PLUS_POINTS_LAST_SHOWN);
      if (!lastShown) return true; // never shown — show it

      const now = Date.now();
      const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      return now - parseInt(lastShown, 10) > cooldownMs;
    };

    setShouldShow(checkGating());
  }, []);

  const markAsShown = () => {
    localStorage.setItem(STORAGE_KEYS.PLUS_POINTS_LAST_SHOWN, Date.now().toString());
    sessionStorage.setItem(STORAGE_KEYS.PLUS_POINTS_MODAL_SHOWN_SESSION, 'true');
    setShouldShow(false);
  };

  const dismissPermanently = () => {
    localStorage.setItem(STORAGE_KEYS.PLUS_POINTS_MODAL_DISMISSED, 'true');
    setShouldShow(false);
  };

  const suppressPermanently = () => {
    localStorage.setItem(STORAGE_KEYS.PLUS_POINTS_SIGNUP_COMPLETED, 'true');
    setShouldShow(false);
  };

  return { shouldShow, markAsShown, dismissPermanently, suppressPermanently };
};
