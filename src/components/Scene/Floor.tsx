import React from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';

interface FloorProps {
  resolution?: number;
}

export const Floor: React.FC<FloorProps> = ({ resolution = 1024 }) => {
  return (
    <mesh position={[0, -2.1, -15]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[70, 70]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={resolution}
        mirror={0.45}
        mixBlur={0.85}
        mixStrength={1.5}
        roughness={0.4}
        depthScale={1.2}
        minDepthThreshold={0.3}
        maxDepthThreshold={1.5}
        color="#060608"
        metalness={0.8}
      />
    </mesh>
  );
};
