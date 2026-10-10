import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '../../data/projects';
import gsap from 'gsap';

interface OverlayProps {
  currentProject: ProjectItem;
  onHoverButton?: (hovered: boolean) => void;
}

export const Overlay: React.FC<OverlayProps> = ({
  currentProject,
  onHoverButton,
}) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // Magnetic hover pull effect on the "Visit Site" pill button
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pullX = (e.clientX - centerX) * 0.28;
    const pullY = (e.clientY - centerY) * 0.28;

    gsap.to(buttonRef.current, {
      x: pullX,
      y: pullY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
    if (onHoverButton) onHoverButton(false);
  };

  const handleMouseEnter = () => {
    if (onHoverButton) onHoverButton(true);
  };

  return (
    <div className="ui-overlay" aria-live="polite">
      {/* Animated Project Title with Masked Reveal */}
      <div className="title-container">
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentProject.id}
            className="project-title"
            initial={{ y: '115%', opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '-115%', opacity: 0, filter: 'blur(8px)' }}
            transition={{
              duration: 0.72,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {currentProject.name}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Single Pill Button: "Visit Site ↗" */}
      <AnimatePresence mode="wait">
        <motion.a
          key={`btn-${currentProject.id}`}
          ref={buttonRef}
          href={currentProject.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={`Visit site for ${currentProject.name}`}
        >
          <span>Visit Site</span>
          <ArrowUpRight className="icon-arrow" aria-hidden="true" />
        </motion.a>
      </AnimatePresence>
    </div>
  );
};
