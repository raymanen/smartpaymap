import { useState, useEffect, useRef } from 'react';

/**
 * Hook for detecting when an element is visible in the viewport
 * and triggering animations based on visibility
 * 
 * @param threshold - Percentage of element that must be visible to trigger (0-1)
 * @param rootMargin - Margin around the root element
 * @returns [ref, isVisible] - Ref to attach to element, and visibility state
 */
export const useScrollAnimation = (threshold = 0.1, rootMargin = '0px') => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Uncomment the next line if you want elements to disappear when out of view
          // } else {
          //   setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  return [ref, isVisible] as const;
}; 