import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { getCameraTransform } from '../../utils/curveLayout';

interface CameraRigProps {
  progress: number;
  isMobile: boolean;
  introDone: boolean;
  pointer: { x: number; y: number };
}

export const CameraRig: React.FC<CameraRigProps> = ({
  progress,
  isMobile,
  introDone,
  pointer,
}) => {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const introZOffset = useRef({ offset: 6.0 }); // Starts 6 units pushed back

  useEffect(() => {
    // 2-second intro: camera pushes through light into the first project
    gsap.to(introZOffset.current, {
      offset: 0,
      duration: 2.2,
      ease: 'power3.out',
      delay: 0.2,
    });
  }, []);

  useFrame((_, delta) => {
    // 1. Calculate path target
    const { cameraPosition, lookAt } = getCameraTransform(progress, isMobile);

    // 2. Add subtle camera parallax from pointer
    const swayX = pointer.x * (isMobile ? 0.08 : 0.25);
    const swayY = pointer.y * (isMobile ? 0.06 : 0.18);

    const targetX = cameraPosition[0] + swayX;
    const targetY = cameraPosition[1] + swayY;
    const targetZ = cameraPosition[2] + introZOffset.current.offset;

    // 3. Smooth damp camera position
    const dampingSpeed = introDone ? 4.2 : 2.5;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, dampingSpeed, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, dampingSpeed, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, dampingSpeed, delta);

    // 4. Smooth damp lookAt target
    const targetLookAtX = lookAt[0] + swayX * 0.3;
    const targetLookAtY = lookAt[1] + swayY * 0.3;
    const targetLookAtZ = lookAt[2];

    lookAtTarget.current.x = THREE.MathUtils.damp(
      lookAtTarget.current.x,
      targetLookAtX,
      dampingSpeed,
      delta
    );
    lookAtTarget.current.y = THREE.MathUtils.damp(
      lookAtTarget.current.y,
      targetLookAtY,
      dampingSpeed,
      delta
    );
    lookAtTarget.current.z = THREE.MathUtils.damp(
      lookAtTarget.current.z,
      targetLookAtZ,
      dampingSpeed,
      delta
    );

    camera.lookAt(lookAtTarget.current);
  });

  return null;
};
