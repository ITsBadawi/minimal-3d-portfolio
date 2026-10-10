import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ProjectItem } from '../../data/projects';
import { Floor } from './Floor';
import { DustParticles } from './DustParticles';
import { Lighting } from './Lighting';
import { Effects } from './Effects';
import { ProjectScreen } from './ProjectScreen';
import { CameraRig } from './CameraRig';

interface SceneProps {
  projects: ProjectItem[];
  progress: number;
  isMobile: boolean;
  introDone: boolean;
  dpr: number;
  particlesCount: number;
  reflectionResolution: number;
  enablePostProcessing: boolean;
  onSelectProject?: (index: number) => void;
  onHoverScreen?: (hovered: boolean) => void;
}

export const Scene: React.FC<SceneProps> = ({
  projects,
  progress,
  isMobile,
  introDone,
  dpr,
  particlesCount,
  reflectionResolution,
  enablePostProcessing,
  onSelectProject,
  onHoverScreen,
}) => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized device coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setPointer({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="canvas-container">
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: [0, 0.74, 10], fov: 45, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        {/* Background & Atmosphere Fog */}
        <color attach="background" args={['#030303']} />
        <fog attach="fog" args={['#030303', 10, 36]} />

        {/* Cinematic Studio Lighting */}
        <Lighting />

        {/* Ambient Subtle Floating Dust */}
        <DustParticles count={particlesCount} />

        {/* Dark Reflective Ground */}
        <Floor resolution={reflectionResolution} />

        {/* Project Screens Arranged along Curved 3D Trajectory */}
        {projects.map((project, i) => (
          <ProjectScreen
            key={project.id}
            project={project}
            index={i}
            totalProjects={projects.length}
            progress={progress}
            isMobile={isMobile}
            pointer={pointer}
            onSelectProject={onSelectProject}
            onHoverScreen={onHoverScreen}
          />
        ))}

        {/* Camera Rig along the 3D Trajectory */}
        <CameraRig
          progress={progress}
          isMobile={isMobile}
          introDone={introDone}
          pointer={pointer}
        />

        {/* Post-Processing Pipeline (Bloom, Vignette, Noise, Aberration) */}
        <Effects
          enablePostProcessing={enablePostProcessing}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
};
