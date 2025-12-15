// Baseball Field Hitting Game - CSUN Matador Baseball Field
// Location: Matador Baseball Field, CSUN, Northridge, CA
// Coordinates: 34.2452183, -118.5270635
// The game simulates baseball hits landing in or out of the field

export const QUIZ_LOCATIONS = [
  {
    id: 1,
    name: "Matador Baseball Field - Hit #1",
    code: "HIT1",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      // Infield bounds (inside field = red/out, outside = green/homerun)
      north: 34.2465,
      south: 34.2440,
      east: -118.5255,
      west: -118.5285
    },
    difficulty: "easy",
    hint: "Hit the ball OUTSIDE the field for a HOMERUN!"
  },
  {
    id: 2,
    name: "Matador Baseball Field - Hit #2",
    code: "HIT2",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2465,
      south: 34.2440,
      east: -118.5255,
      west: -118.5285
    },
    difficulty: "medium",
    hint: "Another swing - aim for the fence!"
  },
  {
    id: 3,
    name: "Matador Baseball Field - Hit #3",
    code: "HIT3",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2465,
      south: 34.2440,
      east: -118.5255,
      west: -118.5285
    },
    difficulty: "medium",
    hint: "Three swings down - keep the momentum!"
  },
  {
    id: 4,
    name: "Matador Baseball Field - Hit #4",
    code: "HIT4",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2465,
      south: 34.2440,
      east: -118.5255,
      west: -118.5285
    },
    difficulty: "hard",
    hint: "Fourth hit - one more to go!"
  },
  {
    id: 5,
    name: "Matador Baseball Field - Final Hit",
    code: "HIT5",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2465,
      south: 34.2440,
      east: -118.5255,
      west: -118.5285
    },
    difficulty: "hard",
    hint: "Final swing - go for glory with a HOMERUN!"
  }
];

// Matador Baseball Field Center Point
export const CAMPUS_CENTER = {
  lat: 34.2452183,
  lng: -118.5270635
};

// Map configuration options
export const MAP_OPTIONS = {
  zoom: 16,
  disableDefaultUI: false,
  gestureHandling: 'none',
  zoomControl: false,
  scrollwheel: false,
  disableDoubleClickZoom: false,
  draggable: false
};
