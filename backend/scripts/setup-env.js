#!/usr/bin/env bun

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔧 CSUN Maps Quiz - Environment Setup\n');

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

/**
 * Load API key from environment
 * Priority: 1) Encrypted .env.encrypted + password, 2) Plaintext .env
 */
async function loadApiKey() {
  const frontendDir = join(process.cwd(), 'frontend');
  const encryptedPath = join(frontendDir, '.env.encrypted');
  const envPath = join(process.cwd(), '.env');

  // Check if encryption password is provided (CI/CD or secure mode)
  if (process.env.ENCRYPTION_PASSWORD) {
    console.log('🔐 Loading encrypted API key from .env.encrypted...');

    if (!existsSync(encryptedPath)) {
      console.error('❌ .env.encrypted not found');
      console.error('   Run: bun run frontend/scripts/encrypt-key.ts');
      process.exit(1);
    }

    try {
      const encrypted = readFileSync(encryptedPath, 'utf-8').trim();
      const apiKey = await decryptSecret(encrypted, process.env.ENCRYPTION_PASSWORD);
      console.log('✓ API key decrypted and loaded into memory\n');
      return apiKey;
    } catch (error) {
      console.error('❌ Failed to decrypt API key:', error.message);
      process.exit(1);
    }
  }

  // Fall back to plaintext .env for local development
  console.log('📝 Loading API key from .env (local development)...');

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    const hasApiKey = content.match(/GOOGLE_MAPS_API_KEY=(.+)/);

    if (hasApiKey) {
      const apiKey = hasApiKey[1].trim();
      console.log('✓ .env file appears to be configured');
      console.log('✓ API key loaded into memory\n');
      return apiKey;
    } else {
      console.log('⚠️  .env file exists but GOOGLE_MAPS_API_KEY not found');
      console.log('   Make sure to add your Google Maps API key');
      return null;
    }
  } else {
    console.log('Creating .env file from template...');

    const examplePath = join(process.cwd(), '.env.example');
    if (existsSync(examplePath)) {
      const exampleContent = readFileSync(examplePath, 'utf-8');
      writeFileSync(envPath, exampleContent);
      console.log('✓ Created .env file');
      console.log('\n⚠️  IMPORTANT: Add your Google Maps API key to .env file');
      return null;
    } else {
      console.error('❌ .env.example file not found');
      process.exit(1);
    }
  }
}

// Load API key into memory
const apiKey = await loadApiKey();

// Validate API key if loaded
if (apiKey) {
  if (apiKey.length < 30) {
    console.error('❌ Invalid API key (must be at least 30 characters)');
    process.exit(1);
  }

  console.log('📝 Next steps:');
  console.log('   1. API key is loaded in memory ✓');
  console.log('   2. Run: cd frontend && bun run --watch dev-server.js');

  // Export to process.env for child processes
  process.env.GOOGLE_MAPS_API_KEY = apiKey;
} else {
  console.log('\n📝 Next steps:');
  console.log('   1. Get API key: https://console.cloud.google.com/google/maps-apis');
  console.log('   2. Edit .env and add your key');
  console.log('   3. Or encrypt your key: bun run frontend/scripts/encrypt-key.ts');
  console.log('   4. Run: cd frontend && bun run --watch dev-server.js');
}
