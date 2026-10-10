# Minimal 3D Web Portfolio

An ultra-premium, minimal 3D spatial web portfolio website dedicated exclusively to showcasing web projects.

Built with **Vite**, **React 19**, **TypeScript**, **Three.js** (`@react-three/fiber`, `@react-three/drei`), **@react-three/postprocessing**, **GSAP**, **Lenis**, and **Framer Motion**.

---

## ✦ Core Design & Concept

- **Zero visual clutter**: No navigation bar, no logo, no about section, no email, no personal name, no footer, no paragraphs.
- **The ONLY text allowed on screen**:
  1. The active project name (bottom center, animated masked typography reveal).
  2. A single pill button labeled `"Visit Site ↗"` opening the live project URL in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).
- **Invisible SEO & Accessibility**: Crawlers and screen readers receive a semantic `<nav class="sr-only">` list with all project titles and links for indexing.
- **Cinematic 3D Space**:
  - Dark, near-black environment (`#030303`) with soft volumetric studio lighting.
  - Subtle real-time reflective ground plane using `MeshReflectorMaterial`.
  - Floating ambient dust particle field gently drifting through the depth buffer.
  - Floating 3D "screens": beveled metal chassis with rounded corners, displaying high-resolution project screenshots or looped videos.
  - Arranged along a sweeping curved trajectory in 3D space with continuous depth.
  - Smooth scroll powered by Lenis + GSAP with automatic magnetic snapping to each project.
  - The focused project screen expands subtly, tilts toward cursor pointer coordinates (smooth parallax), and brightens, while distant screens dim and recede.
  - Custom minimal circular cursor with elastic trailing and magnetic attraction over the "Visit Site" pill.
  - 2-second cinematic intro with a 1px asset load line and a smooth camera push through light into the first project.

---

## ✦ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Vite + React 19 + TypeScript** | Build tool and type-safe component architecture |
| **Three.js & @react-three/fiber** | WebGL scene graph and 3D rendering pipeline |
| **@react-three/drei** | High-performance 3D helpers (`RoundedBox`, `MeshReflectorMaterial`) |
| **@react-three/postprocessing** | Bloom, vignette, film grain noise, and subtle chromatic aberration |
| **Lenis & GSAP** | Silky smooth momentum scrolling, ticker loop, and cinematic transitions |
| **Framer Motion** | Masked typography reveals and button exit/entry animations |
| **Vercel** | Production deployment configuration with security headers & caching |

---

## ✦ Project Structure

```
resilient-salk/
├── public/
│   ├── projects/                  # Web project showcase mockups (SVG / PNG / WebP / MP4)
│   │   ├── aura.svg
│   │   ├── kroma.svg
│   │   ├── voxel.svg
│   │   ├── solis.svg
│   │   ├── nebula.svg
│   │   └── chronos.svg
│   └── og-preview.svg             # Open Graph social share image
├── src/
│   ├── components/
│   │   ├── Cursor/
│   │   │   └── CustomCursor.tsx   # Minimal circular cursor with magnetic hover
│   │   ├── Overlay/
│   │   │   ├── IntroLoader.tsx    # 2s intro curtain & minimal top progress line
│   │   │   └── Overlay.tsx        # Masked project name & "Visit Site ↗" pill button
│   │   └── Scene/
│   │       ├── CameraRig.tsx      # Smooth camera progression along 3D curve
│   │       ├── DustParticles.tsx  # Ambient floating dust particles
│   │       ├── Effects.tsx        # Post-processing (Bloom, Vignette, Noise, Aberration)
│   │       ├── Floor.tsx          # MeshReflectorMaterial reflective ground
│   │       ├── Lighting.tsx       # Soft studio lighting with cool & warm rims
│   │       ├── ProjectScreen.tsx  # Floating beveled glass/metal 3D screen
│   │       └── Scene.tsx          # Fullscreen WebGL Canvas wrapper
│   ├── data/
│   │   └── projects.ts            # Central projects dataset (only 1 file to edit!)
│   ├── hooks/
│   │   ├── useDevicePerformance.ts# DPR capping, mobile & reduced-motion detection
│   │   └── useScrollProgress.ts   # Lenis + GSAP scroll progress & snapping
│   ├── styles/
│   │   └── index.css              # Custom styling, typography, and cursor rules
│   ├── utils/
│   │   └── curveLayout.ts         # Trajectory curve math and camera framing
│   ├── App.tsx                    # Root application coordinator
│   └── main.tsx                   # DOM entrypoint
├── index.html                     # SEO meta tags, Open Graph, fonts, favicon & a11y list
├── package.json
├── tsconfig.json
├── vercel.json                    # Vercel deployment headers and asset caching
└── vite.config.ts
```

---

## ✦ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized, minified production build inside `dist/`.

### 4. Preview Production Build
```bash
npm run preview
```

---

## ✦ How to Add a Project or Replace Screenshots

Adding a new project is completely automated. You only need to touch **one file**: [`src/data/projects.ts`](file:///c:/Users/ahmu0/Documents/antigravity/resilient-salk/src/data/projects.ts).

### Step 1: Add your media
Place your image (`.webp`, `.png`, `.jpg`, `.svg`) or looped video (`.mp4`, `.webm`) inside the `public/projects/` directory:
```
public/projects/my-new-project.webp
```
> **Recommended Media Dimensions**: 1600 × 1000 pixels (16:10 aspect ratio) for crisp display on high-DPI retina screens.

### Step 2: Add one object to `src/data/projects.ts`
Open [`src/data/projects.ts`](file:///c:/Users/ahmu0/Documents/antigravity/resilient-salk/src/data/projects.ts) and add your project to the `projects` array:

```typescript
{
  id: 'my-project',
  name: 'My Project Name',
  url: 'https://myproject.com',
  media: '/projects/my-new-project.webp',
  color: '#00f2fe', // Optional: subtle ambient glow color
  isVideo: false,   // Optional: set to true if using an MP4 video
}
```

The 3D curved trajectory, camera path, scroll snapping, and HTML overlay will recalculate and adapt automatically.

---

## ✦ Performance & Quality Optimizations

- **Capped Device Pixel Ratio**: `dpr` is capped at 2 (`[1, 2]`) to preserve GPU battery on Retina screens.
- **Adaptive Quality**: Detects low-power devices and mobile viewports:
  - Disables heavy chromatic aberration and film grain noise.
  - Scales dust particle count to prevent CPU bottlenecks.
  - Reduces reflection map resolution from 1024 to 512.
- **Resource Management**: Offscreen video textures automatically pause when out of view (`dist > 1.2`) and resume smoothly upon entering the frustum.
- **Prefers-Reduced-Motion**: Respects the user's OS accessibility preference by substituting fast, simplified transitions.
- **Mobile Responsive**: Adapts spatial trajectory to portrait aspect ratios with vertical swipe interaction.

---

## ✦ Deploying to Vercel

The project includes [`vercel.json`](file:///c:/Users/ahmu0/Documents/antigravity/resilient-salk/vercel.json) pre-configured with security headers and immutable caching for static assets:

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the repository in [Vercel](https://vercel.com).
3. The build command (`npm run build`) and output directory (`dist`) are detected automatically.
4. Click **Deploy**.
