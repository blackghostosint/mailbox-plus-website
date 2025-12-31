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
            // 1. Permanent Suppression (Precedence: Member status check first)
            const isMember =
                localStorage.getItem(STORAGE_KEYS.LOYALTY_CARD_ID) ||
                localStorage.getItem(STORAGE_KEYS.PREMIER_MEMBER_ID) ||
                localStorage.getItem(STORAGE_KEYS.QR_TOKEN) ||
                localStorage.getItem(STORAGE_KEYS.PREMIER_SIGNUP_COMPLETED) === 'true';

            if (isMember) return false;

            // 2. Explicit Dismissal Flag (Suppresses modal forever)
            if (localStorage.getItem(STORAGE_KEYS.PREMIER_MODAL_DISMISSED) === 'true') return false;

            // 3. Session Guard (Prevents showing multiple times per session)
            if (sessionStorage.getItem(STORAGE_KEYS.PREMIER_MODAL_SHOWN_SESSION) === 'true') return false;

            // 4. 7-Day Cooldown (Temporal suppression)
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
        sessionStorage.setItem(STORAGE_KEYS.PREMIER_MODAL_SHOWN_SESSION, 'true');
        setShouldShow(false); // Prevent re-triggering
    };

    const dismissPermanently = () => {
        localStorage.setItem(STORAGE_KEYS.PREMIER_MODAL_DISMISSED, 'true');
        setShouldShow(false);
    };

    const suppressPermanently = () => {
        localStorage.setItem(STORAGE_KEYS.PREMIER_SIGNUP_COMPLETED, 'true');
        setShouldShow(false);
    };

    return { shouldShow, markAsShown, dismissPermanently, suppressPermanently };
};
