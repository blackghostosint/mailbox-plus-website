import { useEffect } from 'react';
import { STORAGE_KEYS, URL_PARAMS } from '../constants/storage';

/**
 * Hook to capture Premier Signup signals from URL when users return from the loyalty app.
 * Persists these signals to localStorage for permanent suppression.
 */
export const useSignupSignals = () => {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);

        const signupCompleted =
            params.get(URL_PARAMS.SIGNUP_COMPLETED) === 'true' ||
            params.get(URL_PARAMS.PREMIER_SIGNUP_COMPLETED) === 'true';

        const loyaltyId = params.get(URL_PARAMS.LOYALTY_CARD_ID);
        const memberId = params.get(URL_PARAMS.PREMIER_MEMBER_ID);
        const token = params.get(URL_PARAMS.QR_TOKEN);

        if (signupCompleted) {
            localStorage.setItem(STORAGE_KEYS.PREMIER_SIGNUP_COMPLETED, 'true');
        }
        if (loyaltyId) {
            localStorage.setItem(STORAGE_KEYS.LOYALTY_CARD_ID, loyaltyId);
        }
        if (memberId) {
            localStorage.setItem(STORAGE_KEYS.PREMIER_MEMBER_ID, memberId);
        }
        if (token) {
            localStorage.setItem(STORAGE_KEYS.QR_TOKEN, token);
        }

        // Clean up URL parameters to prevent re-processing on refresh
        if (signupCompleted || loyaltyId || memberId || token) {
            const url = new URL(window.location.href);
            Object.values(URL_PARAMS).forEach(param => url.searchParams.delete(param));
            window.history.replaceState({}, '', url.toString());
        }
    }, []);
};
