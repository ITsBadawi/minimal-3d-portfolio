import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ProjectItem } from '../../data/projects';
import { getPathPoint } from '../../utils/curveLayout';

interface ProjectScreenProps {
  project: ProjectItem;
  index: number;
  progress: number;
  isMobile: boolean;
  pointer: { x: number; y: number };
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({
  project,
  index,
  progress,
  isMobile,
  pointer,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const screenMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const frameMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Screen dimensions (16:10 aspect ratio)
  const [width, height, depth] = isMobile ? [3.2, 2.0, 0.08] : [4.3, 2.68, 0.08];
  const screenW = width - 0.12;
  const screenH = height - 0.12;

  // Base spatial placement along the curved trajectory
  const baseTransform = useMemo(() => getPathPoint(index, isMobile), [index, isMobile]);

  // Robust texture handling supporting Images, SVGs, and MP4 videos
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

    // Focus distance calculation
    const dist = Math.abs(index - progress);
    const focusFactor = Math.max(0, 1 - Math.min(dist * 1.05, 1)); // 1.0 when active, 0.0 when offscreen

    // Pause offscreen videos to maximize framerate
    if (project.isVideo && videoRef.current) {
      if (dist > 1.2 && !videoRef.current.paused) {
        videoRef.current.pause();
      } else if (dist <= 1.2 && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }

    // 1. Scale: expands subtly when focused (1.06), recedes to 0.90 when distant
    const targetScale = THREE.MathUtils.lerp(0.9, 1.06, focusFactor);
    groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4.5, delta);
    groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, targetScale, 4.5, delta);
    groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, targetScale, 4.5, delta);

    // 2. Parallax tilt: screen tilts toward the cursor when focused
    const parallaxIntensityX = isMobile ? 0.03 : 0.11;
    const parallaxIntensityY = isMobile ? 0.04 : 0.15;

    const targetRotX = baseTransform.rotation[0] - pointer.y * parallaxIntensityX * focusFactor;
    const targetRotY = baseTransform.rotation[1] + pointer.x * parallaxIntensityY * focusFactor;
    const targetRotZ = baseTransform.rotation[2];

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      4.8,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      4.8,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotZ,
      4.8,
      delta
    );

    // 3. Screen display brightness & opacity (crisp OLED punch when focused, dimmed when distant)
    if (screenMatRef.current) {
      const targetOpacity = THREE.MathUtils.lerp(0.24, 1.0, focusFactor);
      screenMatRef.current.opacity = THREE.MathUtils.damp(
        screenMatRef.current.opacity,
        targetOpacity,
        5.5,
        delta
      );
    }

    // 4. Chassis metallic rim intensity
    if (frameMatRef.current) {
      const targetRoughness = THREE.MathUtils.lerp(0.35, 0.18, focusFactor);
      frameMatRef.current.roughness = THREE.MathUtils.damp(
        frameMatRef.current.roughness,
        targetRoughness,
        5.5,
        delta
      );
    }

    // 5. Rear ambient halo light behind screen
    if (pointLightRef.current) {
      const targetLightIntensity = THREE.MathUtils.lerp(0.1, 2.5, focusFactor);
      pointLightRef.current.intensity = THREE.MathUtils.damp(
        pointLightRef.current.intensity,
        targetLightIntensity,
        5.5,
        delta
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={baseTransform.position}
      rotation={baseTransform.rotation}
    >
      {/* Outer Titanium Beveled Frame */}
      <RoundedBox
        args={[width, height, depth]}
        radius={isMobile ? 0.11 : 0.14}
        smoothness={6}
      >
        <meshStandardMaterial
          ref={frameMatRef}
          color="#0c0d12"
          metalness={0.96}
          roughness={0.2}
          envMapIntensity={1.0}
        />
      </RoundedBox>

      {/* Screen Display Surface (OLED emissive aesthetic) */}
      <mesh position={[0, 0, depth / 2 + 0.002]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshBasicMaterial
          ref={screenMatRef}
          map={texture}
          transparent={true}
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Soft Rear Atmospheric Point Light Behind Screen */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0, -0.25]}
        color={project.color || '#38bdf8'}
        intensity={0.1}
        distance={3.8}
        decay={2}
      />
    </group>
  );
};
