export interface ProjectItem {
  id: string;
  name: string;
  url: string;
  media: string; // Image path or MP4 video URL
  isVideo?: boolean;
  color?: string; // Ambient accent tint
}

/**
 * Array of all web projects showcased in the 3D portfolio.
 * 
 * To add a new project, simply add an object here:
 * {
 *   id: 'unique-id',
 *   name: 'Project Name',
 *   url: 'https://yourproject.com',
 *   media: '/projects/your-screenshot.webp', // or .png, .jpg, .svg, .mp4
 *   color: '#00f2fe'
 * }
 * 
 * The 3D scene curve, camera path, and scroll snaps recalculate automatically.
 */
export const projects: ProjectItem[] = [
  {
    id: 'aura-protocol',
    name: 'Aura Protocol',
    url: 'https://linear.app',
    media: '/projects/aura.svg',
    color: '#00f2fe',
  },
  {
    id: 'kroma-studio',
    name: 'Kroma Studio',
    url: 'https://stripe.com',
    media: '/projects/kroma.svg',
    color: '#e2e8f0',
  },
  {
    id: 'voxel-horizon',
    name: 'Voxel Horizon',
    url: 'https://vercel.com',
    media: '/projects/voxel.svg',
    color: '#f72585',
  },
  {
    id: 'solis-engine',
    name: 'Solis Engine',
    url: 'https://apple.com',
    media: '/projects/solis.svg',
    color: '#f59e0b',
  },
  {
    id: 'nebula-os',
    name: 'Nebula OS',
    url: 'https://github.com',
    media: '/projects/nebula.svg',
    color: '#6366f1',
  },
  {
    id: 'chronos-spatial',
    name: 'Chronos Spatial',
    url: 'https://figma.com',
    media: '/projects/chronos.svg',
    color: '#10b981',
  },
];
