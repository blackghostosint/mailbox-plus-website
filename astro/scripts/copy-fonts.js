#!/usr/bin/env node
/**
 * Copy DM Sans fonts from @fontsource to Astro public folder
 * Run this before Astro build to ensure fonts are available
 */

import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Paths (hardcoded for reliability)
const PROJECT_ROOT = '/home/blackghost/mailbox-plus-website';
const FONT_SOURCE_DIR = `${PROJECT_ROOT}/node_modules/@fontsource/dm-sans/files`;
const PUBLIC_FONTS_DIR = `${PROJECT_ROOT}/astro/public/fonts`;

// Create public/fonts directory if it doesn't exist
if (!existsSync(PUBLIC_FONTS_DIR)) {
  mkdirSync(PUBLIC_FONTS_DIR, { recursive: true });
  console.log('✅ Created public/fonts directory');
}

// Copy variable font files (we'll use the 400 weight as the variable base)
// Note: @fontsource doesn't provide true variable fonts, so we use individual weights
// For true variable fonts, download from Google Fonts directly

const fontsToCopy = [
  // Regular weights
  { src: 'dm-sans-latin-400-normal.woff2', dest: 'dm-sans-latin-variable.woff2' },
  { src: 'dm-sans-latin-400-italic.woff2', dest: 'dm-sans-latin-variable-italic.woff2' },
];

let copied = 0;
for (const { src, dest } of fontsToCopy) {
  const srcPath = `${FONT_SOURCE_DIR}/${src}`;
  const destPath = `${PUBLIC_FONTS_DIR}/${dest}`;

  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${src} → ${dest}`);
    copied++;
  } else {
    console.error(`❌ Font file not found: ${src}`);
  }
}

console.log(`\n=== Summary ===`);
console.log(`Copied ${copied}/${fontsToCopy.length} font files to public/fonts/`);
console.log(`These will be served at /fonts/ during build`);
