import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

interface UseScrollProgressProps {
  totalProjects: number;
  prefersReducedMotion?: boolean;
}

export interface ScrollProgressState {
  progress: number; // Continuous progress (can wrap infinitely)
  activeIndex: number; // Discrete active index [0 .. totalProjects - 1]
  scrollToIndex: (index: number) => void;
  stepBy: (deltaSteps: number) => void;
  isScrolling: boolean;
}

/**
 * Normalizes any float/integer index into [0, totalProjects - 1]
 */
function normalizeIndex(value: number, total: number): number {
  if (total <= 0) return 0;
  return ((Math.round(value) % total) + total) % total;
}

export function useScrollProgress({
  totalProjects,
  prefersReducedMotion = false,
}: UseScrollProgressProps): ScrollProgressState {
  const [progress, setProgress] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  // Mutable animation target & current value driven by GSAP
  const stateRef = useRef({
    current: 0,
    target: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartTarget: 0,
  });

  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const animateToTarget = useCallback(
    (newTarget: number, duration?: number) => {
      stateRef.current.target = newTarget;
      const animDuration =
        duration !== undefined
          ? duration
          : prefersReducedMotion
            ? 0.25
            : 1.05;

      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      tweenRef.current = gsap.to(stateRef.current, {
        current: newTarget,
        duration: animDuration,
        ease: 'power3.out',
        onUpdate: () => {
          const cur = stateRef.current.current;
          setProgress(cur);
          setActiveIndex(normalizeIndex(cur, totalProjects));
        },
        onComplete: () => {
          setIsScrolling(false);
        },
      });
    },
    [totalProjects, prefersReducedMotion]
  );

  // Schedule a gentle snap to the nearest integer project after wheel/drag settles
  const scheduleSnap = useCallback(() => {
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
    }
    snapTimeoutRef.current = setTimeout(() => {
      if (!stateRef.current.isDragging) {
        const nearest = Math.round(stateRef.current.target);
        animateToTarget(nearest, prefersReducedMotion ? 0.25 : 0.85);
      }
    }, 140);
  }, [animateToTarget, prefersReducedMotion]);

  // Step forward or backward by N projects (supports infinite wrapping)
  const stepBy = useCallback(
    (deltaSteps: number) => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      setIsScrolling(true);
      const base = Math.round(stateRef.current.target);
      animateToTarget(base + deltaSteps, prefersReducedMotion ? 0.25 : 1.1);
    },
    [animateToTarget, prefersReducedMotion]
  );

  // Smoothly scroll to a specific project index (0 .. totalProjects - 1) via shortest path
  const scrollToIndex = useCallback(
    (targetIdx: number) => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      setIsScrolling(true);
      const cur = stateRef.current.current;
      let diff = (targetIdx - cur) % totalProjects;
      if (diff > totalProjects / 2) diff -= totalProjects;
      if (diff < -totalProjects / 2) diff += totalProjects;
      animateToTarget(Math.round(cur + diff), prefersReducedMotion ? 0.25 : 1.15);
    },
    [totalProjects, animateToTarget, prefersReducedMotion]
  );

  useEffect(() => {
    // 1. Mouse Wheel & Trackpad Gestures
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setIsScrolling(true);

      // Support both vertical wheel and horizontal trackpad two-finger swipe
      const primaryDelta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      // Normalize wheel delta across mouse wheels and trackpads
      const clampedDelta = Math.max(-120, Math.min(120, primaryDelta));
      const step = clampedDelta * 0.0042;

      const nextTarget = stateRef.current.target + step;
      animateToTarget(nextTarget, prefersReducedMotion ? 0.15 : 0.55);
      scheduleSnap();
    };

    // 2. Mouse Drag & Touch Swipe Gestures
    const handlePointerDown = (e: PointerEvent) => {
      // Ignore clicks on the Visit Site link/button
      if ((e.target as HTMLElement)?.closest('a, button')) return;

      stateRef.current.isDragging = true;
      stateRef.current.dragStartX = e.clientX;
      stateRef.current.dragStartY = e.clientY;
      stateRef.current.dragStartTarget = stateRef.current.current;
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!stateRef.current.isDragging) return;

      const dx = stateRef.current.dragStartX - e.clientX;
      const dy = stateRef.current.dragStartY - e.clientY;

      // Combine horizontal drag and vertical drag naturally
      const dominantDelta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(dominantDelta) > 4) {
        setIsScrolling(true);
        const sensitivity = window.innerWidth < 768 ? 0.0045 : 0.0028;
        const nextTarget =
          stateRef.current.dragStartTarget + dominantDelta * sensitivity;
        animateToTarget(nextTarget, 0.25);
      }
    };

    const handlePointerUp = () => {
      if (!stateRef.current.isDragging) return;
      stateRef.current.isDragging = false;
      const nearest = Math.round(stateRef.current.target);
      animateToTarget(nearest, prefersReducedMotion ? 0.25 : 0.85);
    };

    // 3. Keyboard Navigation (Arrow keys, Space, PageUp/PageDown)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowDown' ||
        e.key === 'ArrowRight' ||
        e.key === 'PageDown' ||
        e.key === ' '
      ) {
        e.preventDefault();
        stepBy(1);
      } else if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowLeft' ||
        e.key === 'PageUp'
      ) {
        e.preventDefault();
        stepBy(-1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      if (tweenRef.current) tweenRef.current.kill();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [animateToTarget, scheduleSnap, stepBy, prefersReducedMotion]);

  return {
    progress,
    activeIndex,
    scrollToIndex,
    stepBy,
    isScrolling,
  };
}
