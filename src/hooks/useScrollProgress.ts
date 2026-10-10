import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

interface UseScrollProgressProps {
  totalProjects: number;
  prefersReducedMotion?: boolean;
}

export interface ScrollProgressState {
  progress: number; // Continuous 0 to (totalProjects - 1)
  activeIndex: number; // Discrete active index
  scrollToIndex: (index: number) => void;
  isScrolling: boolean;
}

export function useScrollProgress({
  totalProjects,
  prefersReducedMotion = false,
}: UseScrollProgressProps): ScrollProgressState {
  const [progress, setProgress] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  const lenisRef = useRef<Lenis | null>(null);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSnappingRef = useRef<boolean>(false);
  const targetIndexRef = useRef<number>(0);

  // Programmatically animate to a specific project index
  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, totalProjects - 1));
      targetIndexRef.current = clamped;
      isSnappingRef.current = true;

      const targetScroll = clamped * window.innerHeight;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetScroll, {
          duration: prefersReducedMotion ? 0.3 : 1.4,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          onComplete: () => {
            isSnappingRef.current = false;
          },
        });
      }
    },
    [totalProjects, prefersReducedMotion]
  );

  useEffect(() => {
    // Initialize Lenis for smooth scroll
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.4 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      infinite: false,
    });

    lenisRef.current = lenis;

    // RAF loop with GSAP ticker integration
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Scroll listener to update progress
    const onScroll = () => {
      setIsScrolling(true);
      const maxScroll = (totalProjects - 1) * window.innerHeight;
      if (maxScroll <= 0) return;

      const currentScroll = lenis.scroll;
      const rawProgress = (currentScroll / maxScroll) * (totalProjects - 1);
      const clampedProgress = Math.max(0, Math.min(rawProgress, totalProjects - 1));
      
      setProgress(clampedProgress);
      const nearest = Math.round(clampedProgress);
      setActiveIndex(nearest);

      // Snap to nearest project when user stops scrolling
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      snapTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        if (!isSnappingRef.current) {
          const nearestTarget = Math.round(clampedProgress);
          scrollToIndex(nearestTarget);
        }
      }, 160);
    };

    lenis.on('scroll', onScroll);

    // Keyboard navigation (Arrow keys, Space, PageUp/Down)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = Math.min(prev + 1, totalProjects - 1);
          scrollToIndex(next);
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          scrollToIndex(next);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, [totalProjects, prefersReducedMotion, scrollToIndex]);

  return {
    progress,
    activeIndex,
    scrollToIndex,
    isScrolling,
  };
}
