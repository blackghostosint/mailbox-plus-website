import { useEffect, useRef, useState } from 'react';
import type { React } from 'react';

interface UseInViewOptions {
  once?: boolean;
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

/**
 * Hook to track whether an element is in the viewport.
 *
 * Performance: Uses IntersectionObserver which is more efficient than scroll listeners.
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { once = true, threshold, root, rootMargin } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [once, threshold, root, rootMargin]);

  return [ref, isInView];
}
