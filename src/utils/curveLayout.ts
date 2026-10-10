export interface ScreenTransform {
  position: [number, number, number];
  rotation: [number, number, number];
}

/**
 * Calculates the exact 3D position and rotation for any project index along the curved spatial path.
 * Supports continuous evaluation (for smooth camera progression between integer indices).
 */
export function getPathPoint(index: number, isMobile: boolean): ScreenTransform {
  if (isMobile) {
    // Mobile: vertical / depth alignment suited for portrait viewports
    const z = -index * 6.5;
    const x = Math.sin(index * 0.55) * 0.7;
    const y = -index * 0.25 + 0.82;
    const rotY = -Math.sin(index * 0.55) * 0.08;
    const rotX = 0.02;
    const rotZ = 0;

    return {
      position: [x, y, z],
      rotation: [rotX, rotY, rotZ],
    };
  }

  // Desktop: Sweeping cinematic arc with continuous depth and parallax
  const z = -index * 7.5;
  const x = Math.sin(index * 0.58) * 3.6;
  // Elevated gracefully above lower 1/3 title overlay
  const y = Math.cos(index * 0.38) * 0.22 + 0.92;

  // Gentle angular alignment facing along the camera trajectory
  const rotY = -Math.sin(index * 0.58) * 0.24;
  const rotX = -0.01;
  const rotZ = -Math.sin(index * 0.58) * 0.025;

  return {
    position: [x, y, z],
    rotation: [rotX, rotY, rotZ],
  };
}

/**
 * Calculates camera target position and lookAt point for a given scroll progress.
 */
export function getCameraTransform(progress: number, isMobile: boolean) {
  const point = getPathPoint(progress, isMobile);
  const camDistance = isMobile ? 6.3 : 5.9;

  return {
    cameraPosition: [
      point.position[0],
      point.position[1] - 0.14,
      point.position[2] + camDistance,
    ] as [number, number, number],
    lookAt: [
      point.position[0],
      point.position[1] + 0.06,
      point.position[2],
    ] as [number, number, number],
  };
}
