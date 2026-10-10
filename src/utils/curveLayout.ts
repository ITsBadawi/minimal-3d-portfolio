export interface ScreenTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  diff: number;
}

/**
 * Computes the shortest wrapped distance between a project's index and the continuous scroll progress.
 * Allows seamless 3D arc arrangement where neighboring projects appear on both left and right.
 */
export function getWrappedDiff(index: number, progress: number, total: number): number {
  if (total <= 0) return 0;
  let diff = (index - progress) % total;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

/**
 * Calculates the 3D position and rotation for a screen based on its relative offset `diff`
 * along the curved spatial gallery arc.
 */
export function getArcTransform(diff: number, isMobile: boolean): ScreenTransform {
  const absDiff = Math.abs(diff);
  const sign = Math.sign(diff);

  if (isMobile) {
    // Mobile: Vertical + depth arc so upper and lower neighboring screens are visible
    const x = Math.sin(diff * 0.55) * 1.35;
    const y = 0.78 - diff * 1.85;
    const z = -Math.pow(absDiff, 1.15) * 2.8;

    const rotX = diff * 0.14;
    const rotY = -diff * 0.18;
    const rotZ = -diff * 0.03;

    return {
      position: [x, y, z],
      rotation: [rotX, rotY, rotZ],
      diff,
    };
  }

  // Desktop: Sweeping 3D curved arc where neighboring screens flank left & right in deep space
  const x = sign * (Math.pow(absDiff, 0.88) * 4.15);
  const z = -Math.pow(absDiff, 1.18) * 2.85;
  const y = 0.86 + Math.pow(absDiff, 1.1) * 0.14;

  // Angle screens inward toward the center camera along the curve
  const rotY = -sign * Math.min(absDiff * 0.42, 0.85);
  const rotX = -0.015 * absDiff;
  const rotZ = -sign * Math.min(absDiff * 0.035, 0.08);

  return {
    position: [x, y, z],
    rotation: [rotX, rotY, rotZ],
    diff,
  };
}

/**
 * Calculates camera position and lookAt target with subtle cinematic motion.
 */
export function getCameraTransform(progress: number, isMobile: boolean) {
  const camDistance = isMobile ? 6.2 : 5.8;
  // Subtle organic camera wave as user moves along the path
  const waveX = Math.sin(progress * 0.9) * (isMobile ? 0.06 : 0.18);
  const waveY = Math.cos(progress * 0.7) * (isMobile ? 0.04 : 0.08);

  return {
    cameraPosition: [
      waveX,
      0.74 + waveY,
      camDistance,
    ] as [number, number, number],
    lookAt: [
      waveX * 0.4,
      0.88 + waveY * 0.5,
      0,
    ] as [number, number, number],
  };
}
