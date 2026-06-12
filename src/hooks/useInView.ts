import { useEffect, useRef, useState } from 'react';

/**
 * Hook to track whether an element is in the viewport.
 *
 * Performance: Uses IntersectionObserver which is more efficient than scroll listeners.
 */
export function useInView(options: any = {}) {
  const { once = true, threshold, root, rootMargin } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

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

  return [ref, isInView] as const;
}
