#!/usr/bin/env bun

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Decrypts an API key encrypted with AES-256-GCM
 * Input: base64 encoded string containing salt (16) + iv (12) + ciphertext
 */
async function decryptSecret(encryptedBase64, password) {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  
  // Decode from base64
  const encryptedData = Buffer.from(encryptedBase64, 'base64');
  
  // Extract components
  const salt = encryptedData.slice(0, 16);
  const iv = encryptedData.slice(16, 28);
  const ciphertext = encryptedData.slice(28);
  
  // Derive key from password
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 310000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  
  return dec.decode(decrypted);
}

// Load environment variables
let GOOGLE_MAPS_API_KEY = '';

if (process.env.ENCRYPTION_PASSWORD) {
  // GitHub Actions: decrypt from encrypted file
  console.log('🔐 Loading encrypted API key from .env.encrypted...');
  try {
    const encrypted = readFileSync(join(__dirname, '.env.encrypted'), 'utf-8').trim();
    GOOGLE_MAPS_API_KEY = await decryptSecret(encrypted, process.env.ENCRYPTION_PASSWORD);
    console.log('✓ API key decrypted successfully');
  } catch (error) {
    console.error('❌ Failed to decrypt API key:', error.message);
    process.exit(1);
  }
} else {
  // Local development: use plaintext .env
  console.log('📝 Loading API key from .env (local development)...');
  const envPath = join(__dirname, '../.env');
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
    if (match) {
      GOOGLE_MAPS_API_KEY = match[1].trim();
      console.log('✓ API key loaded from .env');
    } else {
      console.error('GOOGLE_MAPS_API_KEY not found in .env file');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    console.error('Make sure .env file exists with GOOGLE_MAPS_API_KEY or set ENCRYPTION_PASSWORD env var');
    process.exit(1);
  }
}

// Validate API key
if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.length < 30) {
  console.error('❌ Invalid API key (must be at least 30 characters)');
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
  - Encryption: ${process.env.ENCRYPTION_PASSWORD ? '🔐 AES-256-GCM' : '📝 Plaintext'}
`);
