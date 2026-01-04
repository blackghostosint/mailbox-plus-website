import { useState, useEffect } from 'react';

interface UseTriggerConditionsProps {
    isHighIntentPage: boolean;
    autoExpandDelay?: number;
    scrollThreshold: number;
    hasAppeared: boolean;
}

export function useTriggerConditions({
    isHighIntentPage,
    autoExpandDelay,
    scrollThreshold,
    hasAppeared,
}: UseTriggerConditionsProps) {
    const [hasMetTimerDelay, setHasMetTimerDelay] = useState(false);
    const [scrollPercent, setScrollPercent] = useState(0);
    const [scrollPixels, setScrollPixels] = useState(0);

    const defaultDelay = isHighIntentPage ? 8000 : 15000;
    const delay = autoExpandDelay ?? defaultDelay;

    // Timer logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setHasMetTimerDelay(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    // Scroll tracking
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = docHeight > 0 ? scrollTop / docHeight : 0;

            setScrollPercent(percent);
            setScrollPixels(scrollTop);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Determine conditions
    const hasMetScrollThreshold = scrollPercent >= scrollThreshold;
    const hasMetHeroScroll = scrollPixels >= 600;

    let shouldShowLauncher = false;
    let trigger: 'timer_scroll' | 'timer' | 'hero_scroll' = 'timer_scroll';

    if (hasAppeared) {
        shouldShowLauncher = false;
    } else if (isHighIntentPage) {
        if (hasMetTimerDelay || hasMetHeroScroll) {
            shouldShowLauncher = true;
            trigger = hasMetHeroScroll ? 'hero_scroll' : 'timer';
        }
    } else {
        if (hasMetTimerDelay && hasMetScrollThreshold) {
            shouldShowLauncher = true;
            trigger = 'timer_scroll';
        }
    }

    return {
        shouldShowLauncher,
        trigger,
        hasMetTimerDelay,
        hasMetScrollThreshold,
        hasMetHeroScroll,
        scrollPercent,
    };
}
