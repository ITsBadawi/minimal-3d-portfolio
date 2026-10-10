import { useState, useEffect } from 'react';

export interface DeviceTier {
  isMobile: boolean;
  isLowPower: boolean;
  prefersReducedMotion: boolean;
  dpr: number;
  particlesCount: number;
  reflectionResolution: number;
  enablePostProcessing: boolean;
}

export function useDevicePerformance(): DeviceTier {
  const [deviceTier, setDeviceTier] = useState<DeviceTier>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isLowPower: false,
        prefersReducedMotion: false,
        dpr: 1.5,
        particlesCount: 120,
        reflectionResolution: 1024,
        enablePostProcessing: true,
      };
    }

    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) ||
      navigator.maxTouchPoints > 1;

    const cores = navigator.hardwareConcurrency || 4;
    // Check if low power device
    const isLowPowerDevice = cores < 4 || (isMobileDevice && cores <= 4);

    const reducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    // Cap DPR between 1 and 2
    const rawDpr = window.devicePixelRatio || 1;
    const cappedDpr = isLowPowerDevice ? 1 : Math.min(Math.max(rawDpr, 1), 2);

    return {
      isMobile: isMobileDevice,
      isLowPower: isLowPowerDevice,
      prefersReducedMotion: reducedMotion,
      dpr: cappedDpr,
      particlesCount: isLowPowerDevice ? 45 : 140,
      reflectionResolution: isLowPowerDevice ? 512 : 1024,
      enablePostProcessing: !isLowPowerDevice,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth <= 768 || navigator.maxTouchPoints > 1;
      setDeviceTier((prev) => ({
        ...prev,
        isMobile: isMobileDevice,
      }));
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setDeviceTier((prev) => ({
        ...prev,
        prefersReducedMotion: e.matches,
      }));
    };

    window.addEventListener('resize', handleResize);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return deviceTier;
}
