#!/usr/bin/env bun

// Import locations from frontend
const locationsPath = new URL('../../frontend/src/js/locations.js', import.meta.url);
const { QUIZ_LOCATIONS, CAMPUS_CENTER } = await import(locationsPath.href);

console.log('🔍 Validating CSUN building location data...\n');

let isValid = true;

// Validate CSUN campus center coordinates
const csunLat = 34.2410;
const csunLng = -118.527;

if (
  Math.abs(CAMPUS_CENTER.lat - csunLat) > 0.01 ||
  Math.abs(CAMPUS_CENTER.lng - csunLng) > 0.01
) {
  console.error('❌ Campus center coordinates appear incorrect');
  isValid = false;
} else {
  console.log('✓ Campus center coordinates valid');
}

// Validate each location
QUIZ_LOCATIONS.forEach((location, index) => {
  console.log(`\nValidating location ${index + 1}: ${location.name}`);

  // Check required fields
  const requiredFields = ['id', 'name', 'code', 'lat', 'lng', 'bounds'];
  for (const field of requiredFields) {
    if (!location[field]) {
      console.error(`  ❌ Missing field: ${field}`);
      isValid = false;
    }
  }

  // Validate coordinates are within CSUN campus area (roughly)
  if (
    Math.abs(location.lat - csunLat) > 0.01 ||
    Math.abs(location.lng - csunLng) > 0.01
  ) {
    console.warn(`  ⚠️  Coordinates may be outside CSUN campus`);
  }

  // Validate bounds
  if (location.bounds) {
    if (location.bounds.north <= location.bounds.south) {
      console.error(`  ❌ Invalid bounds: north <= south`);
      isValid = false;
    }
    if (location.bounds.east <= location.bounds.west) {
      console.error(`  ❌ Invalid bounds: east <= west`);
      isValid = false;
    }
    console.log(`  ✓ Bounds valid`);
  }

  console.log(`  ✓ Location data valid`);
});

console.log('\n' + '='.repeat(50));
if (isValid) {
  console.log('✅ All location data is valid!');
} else {
  console.error('❌ Validation failed - fix errors above');
  process.exit(1);
}
