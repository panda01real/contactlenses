import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp, modern SVG icon representing a contact lens on an eye with fresh water drops / iris
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#e0f2fe" stop-opacity="0.75" />
    </linearGradient>
    <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0369a1" />
      <stop offset="70%" stop-color="#075985" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background rounded squircle (Samsung One UI style) -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)" />

  <!-- Outer lens rim / water ring glow -->
  <circle cx="256" cy="256" r="170" fill="none" stroke="#ffffff" stroke-width="14" stroke-opacity="0.35" />

  <!-- Stylized Contact Lens Contour (Side/Front Angle) -->
  <path d="M120 256 C120 180, 180 120, 256 120 C332 120, 392 180, 392 256 C392 332, 332 392, 256 392 C180 392, 120 332, 120 256 Z" 
        fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" filter="url(#glow)" />

  <!-- Lens inner iris (eye) -->
  <circle cx="256" cy="256" r="88" fill="url(#irisGrad)" stroke="#ffffff" stroke-width="8" stroke-opacity="0.8" />
  
  <!-- Pupil -->
  <circle cx="256" cy="256" r="42" fill="#02131e" />

  <!-- Lens Hydro Reflection Highlights -->
  <ellipse cx="230" cy="226" rx="20" ry="14" fill="#ffffff" opacity="0.9" transform="rotate(-30 230 226)" />
  <circle cx="282" cy="280" r="8" fill="#ffffff" opacity="0.75" />

  <!-- Fresh droplet arc (signaling hydration & wear comfort) -->
  <path d="M190 170 Q256 142 322 170" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" opacity="0.85" />
</svg>`;

// Maskable icon with 15% safe zone padding
const maskableSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <radialGradient id="irisGrad2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0369a1" />
      <stop offset="70%" stop-color="#075985" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </radialGradient>
  </defs>

  <rect width="512" height="512" fill="url(#bgGrad2)" />

  <!-- Scaled down to safe zone (~75% size centered) -->
  <g transform="translate(64, 64) scale(0.75)">
    <circle cx="256" cy="256" r="170" fill="none" stroke="#ffffff" stroke-width="14" stroke-opacity="0.35" />
    <path d="M120 256 C120 180, 180 120, 256 120 C332 120, 392 180, 392 256 C392 332, 332 392, 256 392 C180 392, 120 332, 120 256 Z" 
          fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" />
    <circle cx="256" cy="256" r="88" fill="url(#irisGrad2)" stroke="#ffffff" stroke-width="8" stroke-opacity="0.8" />
    <circle cx="256" cy="256" r="42" fill="#02131e" />
    <ellipse cx="230" cy="226" rx="20" ry="14" fill="#ffffff" opacity="0.9" transform="rotate(-30 230 226)" />
    <circle cx="282" cy="280" r="8" fill="#ffffff" opacity="0.75" />
    <path d="M190 170 Q256 142 322 170" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" opacity="0.85" />
  </g>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
  console.log('Saved icon.svg');

  const svgBuffer = Buffer.from(svgContent);
  const maskableSvgBuffer = Buffer.from(maskableSvgContent);

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Saved pwa-192x192.png');

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Saved pwa-512x512.png');

  await sharp(maskableSvgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Saved pwa-maskable-512x512.png');

  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Saved apple-touch-icon.png');

  await sharp(svgBuffer).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Saved favicon.ico');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
