import React, { useRef, useEffect, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ProjectItem } from '../../data/projects';
import { getWrappedDiff, getArcTransform } from '../../utils/curveLayout';

interface ProjectScreenProps {
  project: ProjectItem;
  index: number;
  totalProjects: number;
  progress: number;
  isMobile: boolean;
  pointer: { x: number; y: number };
  onSelectProject?: (index: number) => void;
  onHoverScreen?: (hovered: boolean) => void;
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({
  project,
  index,
  totalProjects,
  progress,
  isMobile,
  pointer,
  onSelectProject,
  onHoverScreen,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const screenMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const frameMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Screen dimensions (16:10 aspect ratio)
  const [width, height, depth] = isMobile ? [3.0, 1.88, 0.08] : [3.95, 2.47, 0.08];
  const screenW = width - 0.12;
  const screenH = height - 0.12;

  // Initial placement
  const initialDiff = getWrappedDiff(index, 0, totalProjects);
  const initialTransform = getArcTransform(initialDiff, isMobile);

  // Robust texture handling supporting Images, SVGs, and MP4 videos
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let active = true;

    if (project.isVideo) {
      const vid = document.createElement('video');
      vid.src = project.media;
      vid.crossOrigin = 'anonymous';
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = 'auto';
      vid.play().catch(() => {});
      videoRef.current = vid;

      const vidTexture = new THREE.VideoTexture(vid);
      vidTexture.colorSpace = THREE.SRGBColorSpace;
      vidTexture.minFilter = THREE.LinearFilter;
      vidTexture.magFilter = THREE.LinearFilter;
      if (active) setTexture(vidTexture);

      return () => {
        active = false;
        vid.pause();
        vid.src = '';
        vidTexture.dispose();
      };
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = project.media;
      img.onload = () => {
        if (!active) return;
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1600, 1000);
          const tex = new THREE.CanvasTexture(canvas);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          setTexture(tex);
        }
      };

      return () => {
        active = false;
      };
    }
  }, [project.media, project.isVideo]);

  // Ensure Three.js material recompiles when texture attaches
  useEffect(() => {
    if (screenMatRef.current && texture) {
      screenMatRef.current.map = texture;
      screenMatRef.current.needsUpdate = true;
    }
  }, [texture]);

  // Animation & Parallax loop
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const diff = getWrappedDiff(index, progress, totalProjects);
    const absDiff = Math.abs(diff);
    const arcTransform = getArcTransform(diff, isMobile);

    // Focus factor: 1.0 when centered, 0.0 when >= 1 project away
    const focusFactor = Math.max(0, 1 - Math.min(absDiff, 1));

    // Pause offscreen videos to maximize framerate
    if (project.isVideo && videoRef.current) {
      if (absDiff > 1.2 && !videoRef.current.paused) {
        videoRef.current.pause();
      } else if (absDiff <= 1.2 && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }

    // 1. Position along the 3D arc
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      arcTransform.position[0],
      6.5,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      arcTransform.position[1],
      6.5,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      arcTransform.position[2],
      6.5,
      delta
    );

    // 2. Scale: expands when focused (1.06), scales down smoothly with distance along arc
    const targetScale =
      absDiff < 1
        ? THREE.MathUtils.lerp(0.84, 1.06, focusFactor)
        : Math.max(0.72, 0.84 - (absDiff - 1) * 0.1);

    groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 5.5, delta);
    groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, targetScale, 5.5, delta);
    groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, targetScale, 5.5, delta);

    // 3. Parallax tilt: screen tilts toward the cursor when focused
    const parallaxIntensityX = isMobile ? 0.03 : 0.11;
    const parallaxIntensityY = isMobile ? 0.04 : 0.15;

    const targetRotX = arcTransform.rotation[0] - pointer.y * parallaxIntensityX * focusFactor;
    const targetRotY = arcTransform.rotation[1] + pointer.x * parallaxIntensityY * focusFactor;
    const targetRotZ = arcTransform.rotation[2];

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      5.5,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      5.5,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotZ,
      5.5,
      delta
    );

    // 4. Screen display brightness & opacity (1.0 when focused, 0.52 for immediate neighbors, 0.28 for far)
    if (screenMatRef.current) {
      const targetOpacity =
        absDiff <= 1
          ? THREE.MathUtils.lerp(0.52, 1.0, focusFactor)
          : Math.max(0.24, 0.52 - (absDiff - 1) * 0.24);

      screenMatRef.current.opacity = THREE.MathUtils.damp(
        screenMatRef.current.opacity,
        targetOpacity,
        6.0,
        delta
      );
    }

    // 5. Chassis metallic rim intensity
    if (frameMatRef.current) {
      const targetRoughness = THREE.MathUtils.lerp(0.32, 0.18, focusFactor);
      frameMatRef.current.roughness = THREE.MathUtils.damp(
        frameMatRef.current.roughness,
        targetRoughness,
        5.5,
        delta
      );
    }

    // 6. Rear ambient halo light behind screen
    if (pointLightRef.current) {
      const targetLightIntensity = THREE.MathUtils.lerp(0.25, 2.6, focusFactor);
      pointLightRef.current.intensity = THREE.MathUtils.damp(
        pointLightRef.current.intensity,
        targetLightIntensity,
        5.5,
        delta
      );
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Only treat as click if pointer didn't drag far
    if (pointerDownPos.current) {
      const dx = Math.abs(e.clientX - pointerDownPos.current.x);
      const dy = Math.abs(e.clientY - pointerDownPos.current.y);
      if (dx > 8 || dy > 8) return;
    }
    if (onSelectProject) {
      onSelectProject(index);
    }
  };

  return (
    <group
      ref={groupRef}
      position={initialTransform.position}
      rotation={initialTransform.rotation}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (onHoverScreen) onHoverScreen(true);
      }}
      onPointerOut={() => {
        if (onHoverScreen) onHoverScreen(false);
      }}
    >
      {/* Outer Titanium Beveled Frame */}
      <RoundedBox
        args={[width, height, depth]}
        radius={isMobile ? 0.11 : 0.14}
        smoothness={6}
      >
        <meshStandardMaterial
          ref={frameMatRef}
          color="#101218"
          metalness={0.95}
          roughness={0.2}
          envMapIntensity={1.1}
        />
      </RoundedBox>

      {/* Screen Display Surface (OLED emissive aesthetic) */}
      <mesh position={[0, 0, depth / 2 + 0.002]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshBasicMaterial
          ref={screenMatRef}
          map={texture}
          transparent={true}
          opacity={0.6}
          toneMapped={true}
        />
      </mesh>

      {/* Soft Rear Atmospheric Point Light Behind Screen */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0, -0.25]}
        color={project.color || '#38bdf8'}
        intensity={0.25}
        distance={4.2}
        decay={2}
      />
    </group>
  );
};
