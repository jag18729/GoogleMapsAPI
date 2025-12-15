#!/usr/bin/env bun

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
const envPath = join(__dirname, '../.env');
let GOOGLE_MAPS_API_KEY = '';

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const match = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
  if (match) {
    GOOGLE_MAPS_API_KEY = match[1].trim();
  }
} catch (error) {
  console.error('Error reading .env file. Make sure it exists with GOOGLE_MAPS_API_KEY');
  process.exit(1);
}

const server = Bun.serve({
  port: 5150,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = join(
      __dirname,
      'src',
      url.pathname === '/' ? 'index.html' : url.pathname
    );

    try {
      let file = Bun.file(filePath);

      // If file doesn't exist, try without extension
      if (!(await file.exists())) {
        return new Response('Not Found', { status: 404 });
      }

      let content = await file.text();

      // Replace API key placeholder in HTML
      if (filePath.endsWith('.html')) {
        content = content.replace(/__GOOGLE_MAPS_API_KEY__/g, GOOGLE_MAPS_API_KEY);
      }

      // Set correct content type
      const contentType = filePath.endsWith('.html')
        ? 'text/html'
        : filePath.endsWith('.css')
          ? 'text/css'
          : filePath.endsWith('.js')
            ? 'application/javascript'
            : 'application/octet-stream';

      return new Response(content, {
        headers: { 'Content-Type': contentType }
      });
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
});

console.log(`🚀 Development server running at http://localhost:${server.port}`);
console.log('📝 Edit files in src/ directory');
console.log('🔄 Server will auto-reload on changes');
