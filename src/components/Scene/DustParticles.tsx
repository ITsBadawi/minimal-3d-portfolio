import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DustParticlesProps {
  count?: number;
}

export const DustParticles: React.FC<DustParticlesProps> = ({ count = 120 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions and random drift seeds
  const [positions, driftFactors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const drift = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread across camera view frustum
      pos[i3] = (Math.random() - 0.5) * 24;
      pos[i3 + 1] = (Math.random() - 0.5) * 12 + 0.5;
      pos[i3 + 2] = -Math.random() * 42 + 4;

      drift[i3] = (Math.random() - 0.5) * 0.002;
      drift[i3 + 1] = Math.random() * 0.003 + 0.001; // gentle upward rise
      drift[i3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return [pos, drift];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Gentle floating sine motion
      array[i3] += Math.sin(time * 0.4 + i) * 0.003;
      array[i3 + 1] += driftFactors[i3 + 1] * (delta * 60);

      // Wrap around vertically if floated too high
      if (array[i3 + 1] > 6) {
        array[i3 + 1] = -2.5;
      }
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ffffff"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
