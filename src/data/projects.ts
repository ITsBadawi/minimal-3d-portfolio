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
 *   media: '/projects/your-screenshot.png',
 *   color: '#f59e0b'
 * }
 * 
 * The 3D scene curve, camera path, and scroll snaps recalculate automatically.
 */
export const projects: ProjectItem[] = [
  {
    id: 'autovia',
    name: 'AUTOVIA',
    url: 'https://autovia-showroom.vercel.app/',
    media: '/projects/autovia.png',
    color: '#f59e0b',
  },
  {
    id: 'luma-clinic',
    name: 'LUMA CLINIC',
    url: 'https://luma-clinic-website.vercel.app/',
    media: '/projects/luma-clinic.png',
    color: '#10b981',
  },
  {
    id: 'iron-pulse',
    name: 'IRON PULSE',
    url: 'https://iron-pulse-gym-eosin.vercel.app/',
    media: '/projects/iron-pulse.png',
    color: '#ef4444',
  },
  {
    id: 'darazen',
    name: 'DARAZEN',
    url: 'https://darazen.com/',
    media: '/projects/darazen.png',
    color: '#8b5cf6',
  },
  {
    id: 'halo-agency',
    name: 'HALO AGENCY',
    url: 'https://halo-agency-website.vercel.app/',
    media: '/projects/halo-agency.png',
    color: '#a855f7',
  },
];
