import { useState, useEffect } from 'react';

const SUPPRESSION_KEY = 'mailbot-dismissed';
const SUPPRESSION_DAYS = 7;

interface SuppressionData {
    dismissedAt: string;
}

export function useSuppression() {
    const [isSuppressed, setIsSuppressed] = useState(false);

    useEffect(() => {
        const checkSuppression = () => {
            try {
                const stored = localStorage.getItem(SUPPRESSION_KEY);
                if (!stored) {
                    setIsSuppressed(false);
                    return;
                }

                const data: SuppressionData = JSON.parse(stored);
                const dismissedDate = new Date(data.dismissedAt);
                const now = new Date();
                const daysSinceDismissal = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

                if (daysSinceDismissal < SUPPRESSION_DAYS) {
                    setIsSuppressed(true);
                } else {
                    localStorage.removeItem(SUPPRESSION_KEY);
                    setIsSuppressed(false);
                }
            } catch {
                setIsSuppressed(false);
            }
        };

        checkSuppression();
    }, []);

    const setSuppression = () => {
        const data: SuppressionData = {
            dismissedAt: new Date().toISOString(),
        };
        localStorage.setItem(SUPPRESSION_KEY, JSON.stringify(data));
        setIsSuppressed(true);
    };

    return { isSuppressed, setSuppression };
}
