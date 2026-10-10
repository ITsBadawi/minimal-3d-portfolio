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
    () => new THREE.Vector2(0.0004, 0.0004),
    []
  );

  if (!enablePostProcessing) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      {/* Subtle bloom calibrated for both dark and light website screenshots */}
      <Bloom
        luminanceThreshold={0.95}
        luminanceSmoothing={0.2}
        intensity={0.22}
        mipmapBlur
      />

      {/* Cinematic vignette darkening edges */}
      <Vignette darkness={0.62} offset={0.32} />

      {/* Very light organic film grain (omitted on mobile for performance) */}
      {!isMobile && (
        <Noise
          opacity={0.02}
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
