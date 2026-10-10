import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CustomCursorProps {
  isExpanded: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ isExpanded }) => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current) return;

    // Fast high-performance GSAP quickTo for zero-lag cursor trailing
    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.18, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.18, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isExpanded ? 'expanded' : ''}`}
      aria-hidden="true"
    />
  );
};
