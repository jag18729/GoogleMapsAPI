#!/usr/bin/env bun

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔧 CSUN Maps Quiz - Environment Setup\n');

const envPath = join(process.cwd(), '.env');
const examplePath = join(process.cwd(), '.env.example');

if (existsSync(envPath)) {
  console.log('✓ .env file already exists');

  // Validate it has the required key
  const content = readFileSync(envPath, 'utf-8');
  if (
    content.includes('GOOGLE_MAPS_API_KEY=') &&
    !content.includes('AIzaSyCVzfl4RjTtr1k6A3wiASsrvQEyCtApERs')
  ) {
    console.log('✓ .env file appears to be configured');
  } else {
    console.log('⚠️  .env file exists but may not be configured properly');
    console.log('   Make sure to add your Google Maps API key');
  }
} else {
  console.log('Creating .env file from template...');

  if (existsSync(examplePath)) {
    const exampleContent = readFileSync(examplePath, 'utf-8');
    writeFileSync(envPath, exampleContent);
    console.log('✓ Created .env file');
    console.log(
      '\n⚠️  IMPORTANT: Add your Google Maps API key to .env file'
    );
  } else {
    console.error('❌ .env.example file not found');
    process.exit(1);
  }
}

console.log('\n📝 Next steps:');
console.log(
  '   1. Get API key: https://console.cloud.google.com/google/maps-apis'
);
console.log('   2. Edit .env and add your key');
console.log('   3. Run: cd frontend && bun run --watch dev-server.js');
