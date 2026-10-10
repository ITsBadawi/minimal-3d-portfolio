import { useState, useCallback } from 'react';
import { projects } from './data/projects';
import { useDevicePerformance } from './hooks/useDevicePerformance';
import { useScrollProgress } from './hooks/useScrollProgress';
import { Scene } from './components/Scene/Scene';
import { Overlay } from './components/Overlay/Overlay';
import { IntroLoader } from './components/Overlay/IntroLoader';
import { CustomCursor } from './components/Cursor/CustomCursor';

export function App() {
  const [cursorExpanded, setCursorExpanded] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const device = useDevicePerformance();
  const { progress, activeIndex, scrollToIndex } = useScrollProgress({
    totalProjects: projects.length,
    prefersReducedMotion: device.prefersReducedMotion,
  });

  const currentProject = projects[activeIndex] || projects[0];

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  return (
    <main role="main">
      {/* 2-Second Cinematic Intro & Minimal Progress Line */}
      <IntroLoader onIntroComplete={handleIntroComplete} />

      {/* Interactive Spring Cursor */}
      <CustomCursor isExpanded={cursorExpanded} />

      {/* 3D WebGL Canvas Scene */}
      <Scene
        projects={projects}
        progress={progress}
        isMobile={device.isMobile}
        introDone={introDone}
        dpr={device.dpr}
        particlesCount={device.particlesCount}
        reflectionResolution={device.reflectionResolution}
        enablePostProcessing={device.enablePostProcessing}
        onSelectProject={scrollToIndex}
        onHoverScreen={setCursorExpanded}
      />

      {/* HTML Overlay: Project Title & "Visit Site ↗" Button */}
      <Overlay
        currentProject={currentProject}
        onHoverButton={setCursorExpanded}
      />
    </main>
  );
}

export default App;
