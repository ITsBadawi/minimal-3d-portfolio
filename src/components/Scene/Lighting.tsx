import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Lighting: React.FC = () => {
  const spotlightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (spotlightRef.current) {
      // Smooth tracking of camera trajectory
      spotlightRef.current.position.x = state.camera.position.x * 0.7;
      spotlightRef.current.position.z = state.camera.position.z + 2.5;
    }
  });

  return (
    <group>
      {/* Soft atmospheric ambient light */}
      <ambientLight intensity={0.5} color="#e2e8f0" />

      {/* Main overhead studio key spotlight */}
      <spotLight
        ref={spotlightRef}
        position={[0, 8, 4]}
        angle={0.65}
        penumbra={0.85}
        intensity={7}
        color="#ffffff"
        castShadow={false}
      />

      {/* Cool cyan rim light from left to catch metallic chamfers */}
      <directionalLight
        position={[-7, 5, 2]}
        intensity={0.8}
        color="#38bdf8"
      />

      {/* Subtle silver-white rim light from right */}
      <directionalLight
        position={[7, 4, -8]}
        intensity={0.5}
        color="#cbd5e1"
      />

      {/* Soft subtle floor bounce */}
      <pointLight
        position={[0, -1.9, -5]}
        intensity={0.4}
        color="#0f172a"
        distance={20}
      />
    </group>
  );
};
