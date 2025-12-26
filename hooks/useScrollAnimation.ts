"use client";

import { useEffect, useRef, useState, RefObject } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      // If no element, show content anyway to prevent white screen
      setIsVisible(true);
      return;
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    // Check if element is already in viewport on mount
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (isInViewport) {
      setIsVisible(true);
      if (triggerOnce) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

// Animation variants for different effects
export const animationVariants = {
  fadeInUp: {
    hidden: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  fadeInDown: {
    hidden: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  fadeInLeft: {
    hidden: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  fadeInRight: {
    hidden: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  fadeIn: {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
  scaleIn: {
    hidden: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
  slideInUp: {
    hidden: "opacity-0 translate-y-12",
    visible: "opacity-100 translate-y-0",
  },
};

// Stagger delay utility
export const getStaggerDelay = (index: number, baseDelay: number = 100) => ({
  transitionDelay: `${index * baseDelay}ms`,
});
