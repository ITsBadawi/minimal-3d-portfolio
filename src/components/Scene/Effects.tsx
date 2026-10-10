import React, { useMemo } from 'react';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

interface EffectsProps {
  enablePostProcessing?: boolean;
  isMobile?: boolean;
}

export const Effects: React.FC<EffectsProps> = ({
  enablePostProcessing = true,
  isMobile = false,
}) => {
  const aberrationOffset = useMemo(
    () => new THREE.Vector2(0.0006, 0.0006),
    []
  );

  if (!enablePostProcessing) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      {/* Subtle bloom for glowing UI lines and lights */}
      <Bloom
        luminanceThreshold={0.8}
        luminanceSmoothing={0.25}
        intensity={0.4}
        mipmapBlur
      />

      {/* Cinematic vignette darkening edges */}
      <Vignette darkness={0.62} offset={0.32} />

      {/* Very light organic film grain (omitted on mobile for performance) */}
      {!isMobile && (
        <Noise
          opacity={0.022}
          blendFunction={BlendFunction.OVERLAY}
        />
      )}

      {/* Subtle chromatic aberration at lens edges */}
      {!isMobile && (
        <ChromaticAberration
          offset={aberrationOffset}
          radialModulation={false}
          modulationOffset={0.4}
        />
      )}
    </EffectComposer>
  );
};
