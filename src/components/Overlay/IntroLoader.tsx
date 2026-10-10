import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface IntroLoaderProps {
  onIntroComplete: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onIntroComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const curtainRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate / track asset loading progress smoothly
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 25 + 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);

        setTimeout(() => {
          setLoaded(true);

          // Fade out loading progress line
          if (lineRef.current) {
            gsap.to(lineRef.current, {
              opacity: 0,
              duration: 0.4,
              ease: 'power2.out',
            });
          }

          // 2-second cinematic black curtain fade reveal
          if (curtainRef.current) {
            gsap.to(curtainRef.current, {
              opacity: 0,
              duration: 1.8,
              ease: 'power3.inOut',
              onComplete: () => {
                if (curtainRef.current) curtainRef.current.style.display = 'none';
                onIntroComplete();
              },
            });
          }
        }, 300);
      } else {
        setProgress(current);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [onIntroComplete]);

  return (
    <>
      {/* Minimal 1px progress line at the very top (no text) */}
      {!loaded && (
        <div
          ref={lineRef}
          className="loader-line"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Black intro screen curtain */}
      <div ref={curtainRef} className="intro-curtain" />
    </>
  );
};
