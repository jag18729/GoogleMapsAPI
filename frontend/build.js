#!/usr/bin/env bun

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '../.env');
let GOOGLE_MAPS_API_KEY = '';

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const match = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
  if (match) {
    GOOGLE_MAPS_API_KEY = match[1].trim();
  } else {
    console.error('GOOGLE_MAPS_API_KEY not found in .env file');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading .env file:', error.message);
  console.error('Make sure .env file exists with GOOGLE_MAPS_API_KEY');
  process.exit(1);
}

console.log('🚀 Starting build process...');

// Create dist directory
const distDir = join(__dirname, 'dist');
try {
  mkdirSync(distDir, { recursive: true });
  console.log('✓ Created dist directory');
} catch (error) {
  console.error('Error creating dist directory:', error);
  process.exit(1);
}

// Copy and process HTML
console.log('📄 Processing HTML...');
let html = readFileSync(join(__dirname, 'src/index.html'), 'utf-8');
html = html.replace(/__GOOGLE_MAPS_API_KEY__/g, GOOGLE_MAPS_API_KEY);
writeFileSync(join(distDir, 'index.html'), html);
console.log('✓ HTML processed and copied');

// Copy CSS
console.log('🎨 Copying CSS files...');
const cssDir = join(distDir, 'css');
mkdirSync(cssDir, { recursive: true });
copyFileSync(join(__dirname, 'src/css/styles.css'), join(cssDir, 'styles.css'));
copyFileSync(join(__dirname, 'src/css/animations.css'), join(cssDir, 'animations.css'));
console.log('✓ CSS files copied');

// Bundle JavaScript with Bun
console.log('📦 Bundling JavaScript...');
const jsDir = join(distDir, 'js');
mkdirSync(jsDir, { recursive: true });

// Process config.js with API key
let configJs = readFileSync(join(__dirname, 'src/js/config.js'), 'utf-8');
configJs = configJs.replace(/__GOOGLE_MAPS_API_KEY__/g, GOOGLE_MAPS_API_KEY);
writeFileSync(join(__dirname, 'src/js/config.processed.js'), configJs);

// Bundle main.js using Bun
try {
  await Bun.build({
    entrypoints: [join(__dirname, 'src/js/main.js')],
    outdir: jsDir,
    target: 'browser',
    minify: true,
    sourcemap: 'external'
  });
  console.log('✓ JavaScript bundled and minified');
} catch (error) {
  console.error('Error bundling JavaScript:', error);
  process.exit(1);
}

// Copy assets if they exist
const assetsDir = join(__dirname, 'src/assets');
try {
  if (statSync(assetsDir).isDirectory()) {
    console.log('📁 Copying assets...');
    const distAssetsDir = join(distDir, 'assets');
    mkdirSync(distAssetsDir, { recursive: true });

    function copyRecursive(src, dest) {
      const entries = readdirSync(src);
      for (const entry of entries) {
        const srcPath = join(src, entry);
        const destPath = join(dest, entry);
        if (statSync(srcPath).isDirectory()) {
          mkdirSync(destPath, { recursive: true });
          copyRecursive(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      }
    }

    copyRecursive(assetsDir, distAssetsDir);
    console.log('✓ Assets copied');
  }
} catch (error) {
  console.log('ℹ No assets directory found, skipping...');
}

// Create .nojekyll file for GitHub Pages
writeFileSync(join(distDir, '.nojekyll'), '');
console.log('✓ Created .nojekyll file for GitHub Pages');

console.log('✅ Build complete! Output in dist/ directory');
console.log(`📊 Build stats:
  - HTML: 1 file
  - CSS: 2 files
  - JS: Bundled and minified
  - API Key: Injected ✓
`);
