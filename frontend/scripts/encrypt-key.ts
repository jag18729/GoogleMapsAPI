#!/usr/bin/env bun

import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Encrypts an API key using AES-256-GCM
 * Returns base64 encoded: salt (16) + iv (12) + ciphertext
 */
async function encryptSecret(secret: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  
  // Derive encryption key from password using PBKDF2
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Derive AES key from password (OWASP 2025 recommendation: 310,000 iterations)
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
    ['encrypt']
  );
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the secret
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(secret)
  );
  
  // Combine: salt (16 bytes) + iv (12 bytes) + ciphertext
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  // Encode as base64 for storage
  return Buffer.from(result).toString('base64');
}

/**
 * Main encryption setup
 */
async function main() {
  console.log('🔐 Bun AES-256-GCM API Key Encryption Setup\n');
  
  const scriptDir = import.meta.dir;
  const envPath = resolve(scriptDir, '../.env');
  
  // Try to read API key from .env
  let apiKey = '';
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
    if (match) {
      apiKey = match[1].trim();
      console.log('✓ Found API key in .env\n');
    }
  } catch (e) {
    console.log('ℹ .env file not found, will use manual entry\n');
  }
  
  // Prompt for API key if not found
  if (!apiKey) {
    console.log('Enter your Google Maps API key:');
    apiKey = prompt('API Key: ') || '';
  }
  
  // Validate API key
  if (!apiKey || apiKey.length < 30) {
    console.error('❌ Invalid API key (must be at least 30 characters)');
    process.exit(1);
  }
  
  // Prompt for encryption password
  console.log('\nEnter a strong encryption password (min 12 characters):');
  const password = prompt('Password: ') || '';
  
  if (!password || password.length < 12) {
    console.error('❌ Password must be at least 12 characters');
    process.exit(1);
  }
  
  // Confirm password
  const passwordConfirm = prompt('Confirm password: ') || '';
  if (password !== passwordConfirm) {
    console.error('❌ Passwords do not match');
    process.exit(1);
  }
  
  // Encrypt the secret
  console.log('\n🔒 Encrypting with AES-256-GCM (310,000 PBKDF2 iterations)...');
  const encrypted = await encryptSecret(apiKey, password);
  
  // Save encrypted file
  const encryptedPath = resolve(scriptDir, '../.env.encrypted');
  writeFileSync(encryptedPath, encrypted);
  
  console.log('✓ Encryption complete!\n');
  console.log('📝 NEXT STEPS:\n');
  
  console.log('1️⃣  Commit encrypted file to git:');
  console.log('   git add frontend/.env.encrypted');
  console.log('   git commit -m "Add encrypted API key"');
  console.log('   git push\n');
  
  console.log('2️⃣  Add encryption password to GitHub Secrets:');
  console.log('   Go to: https://github.com/jag18729/GoogleMapsAPI/settings/secrets/actions');
  console.log('   Click: "New repository secret"');
  console.log('   Name: ENCRYPTION_PASSWORD');
  console.log(`   Value: ${password}\n`);
  
  console.log('3️⃣  Keep .env for local development:');
  console.log('   Your plaintext .env stays local (in .gitignore)');
  console.log('   Build script will use .env locally, .env.encrypted in CI/CD\n');
  
  console.log('✅ Setup complete!');
  console.log('⚠️  Keep the encryption password safe - only store it in GitHub Secrets');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
