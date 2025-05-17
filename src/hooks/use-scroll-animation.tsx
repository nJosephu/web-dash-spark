
import { useState, useEffect, useRef } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const { threshold = 0.1, rootMargin = '0px' } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is visible in the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once it's visible, stop observing
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        root: null, // viewport
        rootMargin,
        threshold,
      }
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

  return { ref, isVisible };
}

export default useScrollAnimation;
