#!/usr/bin/env bun

/**
 * Decrypts an API key encrypted with AES-256-GCM
 * Input: base64 encoded string containing salt (16) + iv (12) + ciphertext
 */
async function decryptSecret(encryptedBase64: string, password: string): Promise<string> {
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
      iterations: 310000, // Must match encryption
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
 * Export for use in build.js
 */
export { decryptSecret };
