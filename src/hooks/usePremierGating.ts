import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/storage';

const COOLDOWN_DAYS = 7;

/**
 * Hook to manage the visibility logic for the Premier Signup Modal.
 * Encapsulates permanent suppression and cooldown logic.
 */
export const usePremierGating = () => {
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        const checkGating = () => {
            // 1. Permanent Suppression

            // Stored loyalty identifier check
            if (localStorage.getItem(STORAGE_KEYS.LOYALTY_CARD_ID)) return false;
            if (localStorage.getItem(STORAGE_KEYS.PREMIER_MEMBER_ID)) return false;
            if (localStorage.getItem(STORAGE_KEYS.QR_TOKEN)) return false;

            // Signup completion flag check
            if (localStorage.getItem(STORAGE_KEYS.PREMIER_SIGNUP_COMPLETED) === 'true') return false;

            // 2. 7-Day Cooldown Check
            const lastShown = localStorage.getItem(STORAGE_KEYS.LAST_SHOWN_TIMESTAMP);
            if (!lastShown) return true;

            const now = Date.now();
            const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
            return now - parseInt(lastShown, 10) > cooldownMs;
        };

        setShouldShow(checkGating());
    }, []);

    const markAsShown = () => {
        localStorage.setItem(STORAGE_KEYS.LAST_SHOWN_TIMESTAMP, Date.now().toString());
    };

    const suppressPermanently = () => {
        localStorage.setItem(STORAGE_KEYS.PREMIER_SIGNUP_COMPLETED, 'true');
    };

    return { shouldShow, markAsShown, suppressPermanently };
};
