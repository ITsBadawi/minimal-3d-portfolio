import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/projects');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const projects = [
  {
    filename: 'aura.svg',
    title: 'AURA PROTOCOL',
    subtitle: 'Decentralized Autonomous Liquidity Network v2.4',
    accent: '#00f2fe',
    accent2: '#4facfe',
    bg: '#05070f',
    type: 'FINANCIAL INFRASTRUCTURE',
    status: 'MAINNET ACTIVE',
    metric1: { label: 'TOTAL VOLUME', val: '$4.82B' },
    metric2: { label: 'LATENCY', val: '1.2ms' },
    metric3: { label: 'NODES', val: '14,820' },
  },
  {
    filename: 'kroma.svg',
    title: 'KROMA STUDIO',
    subtitle: 'Generative Typeface & Spatial Editorial Engine',
    accent: '#ffffff',
    accent2: '#a3a3a3',
    bg: '#09090b',
    type: 'EDITORIAL SYSTEM',
    status: 'SYSTEM 04',
    metric1: { label: 'GLYPH CACHE', val: '64,000+' },
    metric2: { label: 'AXES', val: '12 VAR' },
    metric3: { label: 'KERNING', val: 'OPTICAL' },
  },
  {
    filename: 'voxel.svg',
    title: 'VOXEL HORIZON',
    subtitle: 'Interactive 60FPS WebGL Metaverse Engine',
    accent: '#f72585',
    accent2: '#7209b7',
    bg: '#080511',
    type: 'SPATIAL WEB ENGINE',
    status: 'SHADERS COMPILED',
    metric1: { label: 'FRAME RATE', val: '120 FPS' },
    metric2: { label: 'DRAWCALLS', val: '14' },
    metric3: { label: 'VERTICES', val: '1.4M' },
  },
  {
    filename: 'solis.svg',
    title: 'SOLIS ENGINE',
    subtitle: 'Planetary Clean Power Grid Analytics & ML Telemetry',
    accent: '#f59e0b',
    accent2: '#ef4444',
    bg: '#0a0907',
    type: 'CLIMATE TELEMETRY',
    status: 'GRID SYNCHRONIZED',
    metric1: { label: 'OUTPUT', val: '942 GW' },
    metric2: { label: 'EFFICIENCY', val: '99.4%' },
    metric3: { label: 'REDUCTION', val: '-420 MT' },
  },
  {
    filename: 'nebula.svg',
    title: 'NEBULA OS',
    subtitle: 'Browser-Native Spatial Unix Environment',
    accent: '#6366f1',
    accent2: '#38bdf8',
    bg: '#060714',
    type: 'OPERATING SYSTEM',
    status: 'KERNEL READY',
    metric1: { label: 'CONTAINERS', val: '18 ACTIVE' },
    metric2: { label: 'MEMORY', val: '142 MB' },
    metric3: { label: 'UPTIME', val: '99.99%' },
  },
  {
    filename: 'chronos.svg',
    title: 'CHRONOS SPATIAL',
    subtitle: 'Acoustic Architecture & Virtual Sound Pavilion',
    accent: '#10b981',
    accent2: '#06b6d4',
    bg: '#050c0a',
    type: 'SPATIAL AUDIO',
    status: 'BINAURAL 3D',
    metric1: { label: 'REVERB RT60', val: '1.42s' },
    metric2: { label: 'CHANNELS', val: '64.4' },
    metric3: { label: 'SAMPLE RATE', val: '96 kHz' },
  },
];

for (const p of projects) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="50%" stop-color="#020204"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${p.accent}"/>
      <stop offset="100%" stop-color="${p.accent2}"/>
    </linearGradient>
    <radialGradient id="glowGrad" cx="70%" cy="30%" r="50%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1600" height="1000" fill="url(#bgGrad)"/>
  
  <!-- Ambient Atmospheric Glow -->
  <circle cx="1150" cy="350" r="450" fill="url(#glowGrad)" filter="url(#blurFilter)"/>
  <circle cx="300" cy="750" r="350" fill="${p.accent2}" opacity="0.08" filter="url(#blurFilter)"/>

  <!-- Subtle Precision Grid -->
  <g opacity="0.07" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="120" x2="1600" y2="120"/>
    <line x1="0" y1="240" x2="1600" y2="240"/>
    <line x1="0" y1="360" x2="1600" y2="360"/>
    <line x1="0" y1="480" x2="1600" y2="480"/>
    <line x1="0" y1="600" x2="1600" y2="600"/>
    <line x1="0" y1="720" x2="1600" y2="720"/>
    <line x1="0" y1="840" x2="1600" y2="840"/>

    <line x1="200" y1="0" x2="200" y2="1000"/>
    <line x1="400" y1="0" x2="400" y2="1000"/>
    <line x1="600" y1="0" x2="600" y2="1000"/>
    <line x1="800" y1="0" x2="800" y2="1000"/>
    <line x1="1000" y1="0" x2="1000" y2="1000"/>
    <line x1="1200" y1="0" x2="1200" y2="1000"/>
    <line x1="1400" y1="0" x2="1400" y2="1000"/>
  </g>

  <!-- Browser Chrome Top Bar -->
  <rect x="60" y="60" width="1480" height="64" rx="16" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1"/>
  <circle cx="104" cy="92" r="6" fill="#ff5f56"/>
  <circle cx="128" cy="92" r="6" fill="#ffbd2e"/>
  <circle cx="152" cy="92" r="6" fill="#27c93f"/>

  <!-- URL Address Capsule -->
  <rect x="480" y="74" width="640" height="36" rx="18" fill="rgba(0, 0, 0, 0.4)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
  <text x="800" y="97" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="rgba(255, 255, 255, 0.5)" text-anchor="middle" letter-spacing="1">https://${p.filename.replace('.svg', '')}.network/app</text>

  <!-- Status Tag Right -->
  <rect x="1360" y="76" width="140" height="32" rx="16" fill="${p.accent}" fill-opacity="0.15" stroke="${p.accent}" stroke-width="1" stroke-opacity="0.3"/>
  <circle cx="1380" cy="92" r="4" fill="${p.accent}"/>
  <text x="1440" y="97" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="${p.accent}" text-anchor="middle" letter-spacing="1.5">${p.status}</text>

  <!-- Main Hero Card inside Web App -->
  <rect x="60" y="150" width="940" height="480" rx="20" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
  
  <!-- Category Tag -->
  <text x="120" y="220" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="${p.accent}" letter-spacing="3">${p.type}</text>

  <!-- Big Hero Title -->
  <text x="120" y="310" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="900" fill="#ffffff" letter-spacing="-1">${p.title}</text>
  
  <!-- Subtitle -->
  <text x="120" y="365" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="400" fill="rgba(255, 255, 255, 0.6)" letter-spacing="0.5">${p.subtitle}</text>

  <!-- Waveform / Data Vector Art -->
  <path d="M 120,490 Q 240,430 360,470 T 600,410 T 840,460 T 940,430" fill="none" stroke="url(#accentGrad)" stroke-width="4" stroke-linecap="round"/>
  <path d="M 120,530 Q 280,560 440,510 T 720,540 T 940,490" fill="none" stroke="${p.accent2}" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round"/>

  <!-- Right Side Interactive Telemetry Card -->
  <rect x="1030" y="150" width="510" height="480" rx="20" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
  <text x="1080" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="rgba(255, 255, 255, 0.4)" letter-spacing="2">REALTIME METRICS</text>

  <!-- Mini Chart in Right Card -->
  <rect x="1080" y="240" width="410" height="160" rx="12" fill="rgba(0, 0, 0, 0.4)" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>
  
  <!-- Sparkline bars -->
  <g fill="${p.accent}" opacity="0.6">
    <rect x="1110" y="340" width="12" height="40" rx="3"/>
    <rect x="1135" y="320" width="12" height="60" rx="3"/>
    <rect x="1160" y="300" width="12" height="80" rx="3"/>
    <rect x="1185" y="330" width="12" height="50" rx="3"/>
    <rect x="1210" y="290" width="12" height="90" rx="3"/>
    <rect x="1235" y="270" width="12" height="110" rx="3"/>
    <rect x="1260" y="280" width="12" height="100" rx="3"/>
    <rect x="1285" y="255" width="12" height="125" rx="3"/>
    <rect x="1310" y="260" width="12" height="120" rx="3"/>
    <rect x="1335" y="245" width="12" height="135" rx="3" fill="${p.accent}" opacity="1"/>
    <rect x="1360" y="270" width="12" height="110" rx="3"/>
    <rect x="1385" y="260" width="12" height="120" rx="3"/>
    <rect x="1410" y="250" width="12" height="130" rx="3" fill="${p.accent}" opacity="1"/>
    <rect x="1435" y="240" width="12" height="140" rx="3" fill="${p.accent}" opacity="1"/>
  </g>

  <!-- Bottom Metric Pods (3 Columns) -->
  <!-- Pod 1 -->
  <rect x="60" y="660" width="470" height="260" rx="20" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
  <text x="110" y="725" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="rgba(255, 255, 255, 0.4)" letter-spacing="2">${p.metric1.label}</text>
  <text x="110" y="810" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-1">${p.metric1.val}</text>
  <text x="110" y="865" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="${p.accent}">+18.4% vs last epoch</text>

  <!-- Pod 2 -->
  <rect x="565" y="660" width="470" height="260" rx="20" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
  <text x="615" y="725" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="rgba(255, 255, 255, 0.4)" letter-spacing="2">${p.metric2.label}</text>
  <text x="615" y="810" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-1">${p.metric2.val}</text>
  <text x="615" y="865" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="rgba(255, 255, 255, 0.5)">Optimized zero-copy IPC</text>

  <!-- Pod 3 -->
  <rect x="1070" y="660" width="470" height="260" rx="20" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
  <text x="1120" y="725" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="rgba(255, 255, 255, 0.4)" letter-spacing="2">${p.metric3.label}</text>
  <text x="1120" y="810" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-1">${p.metric3.val}</text>
  <text x="1120" y="865" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="${p.accent2}">Global edge distribution</text>
</svg>`;

  fs.writeFileSync(path.join(outDir, p.filename), svg);
}

console.log('Successfully generated 6 project showcase mockups in public/projects!');
