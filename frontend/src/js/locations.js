// Baseball Field Hitting Game - CSUN Matador Baseball Field
// Location: Matador Baseball Field, CSUN, Northridge, CA
// Coordinates: 34.2452183, -118.5270635
// The game simulates baseball hits landing in or out of the field
// Zone system: HOMERUN (outside), FOUL (soccer field & buildings), STRIKEOUT (field boundary)

export const QUIZ_LOCATIONS = [
  {
    id: 1,
    name: "Swing #1",
    code: "HIT1",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      // Main infield bounds (hitting inside = strikeout)
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - Soccer Field North",
        north: 34.2470,
        south: 34.2462,
        east: -118.5265,
        west: -118.5280
      }
    ],
    difficulty: "easy",
    hint: "⚾ Hit OUTSIDE the field for a HOMERUN!"
  },
  {
    id: 2,
    name: "Swing #2",
    code: "HIT2",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - Buildings North",
        north: 34.2468,
        south: 34.2462,
        east: -118.5260,
        west: -118.5278
      }
    ],
    difficulty: "easy",
    hint: "⚾ Aim for the fence - hit OUTSIDE!"
  },
  {
    id: 3,
    name: "Swing #3",
    code: "HIT3",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - West Side Buildings",
        north: 34.2465,
        south: 34.2440,
        east: -118.5283,
        west: -118.5295
      }
    ],
    difficulty: "medium",
    hint: "⚾ Clear the field! HOMERUN zone!"
  },
  {
    id: 4,
    name: "Swing #4",
    code: "HIT4",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - East Side",
        north: 34.2460,
        south: 34.2445,
        east: -118.5250,
        west: -118.5258
      }
    ],
    difficulty: "medium",
    hint: "⚾ Watch out for foul territory!"
  },
  {
    id: 5,
    name: "Swing #5",
    code: "HIT5",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - South Side",
        north: 34.2442,
        south: 34.2432,
        east: -118.5270,
        west: -118.5275
      }
    ],
    difficulty: "hard",
    hint: "⚾ Final swing - go for glory!"
  },
  {
    id: 6,
    name: "Swing #6",
    code: "HIT6",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - North Buildings",
        north: 34.2470,
        south: 34.2462,
        east: -118.5270,
        west: -118.5280
      }
    ],
    difficulty: "hard",
    hint: "⚾ Can you keep the streak going?"
  },
  {
    id: 7,
    name: "Swing #7",
    code: "HIT7",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - West Campus",
        north: 34.2465,
        south: 34.2440,
        east: -118.5285,
        west: -118.5295
      }
    ],
    difficulty: "hard",
    hint: "⚾ Swing 7 - dominate!"
  },
  {
    id: 8,
    name: "Swing #8",
    code: "HIT8",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - Complex Areas",
        north: 34.2468,
        south: 34.2438,
        east: -118.5250,
        west: -118.5295
      }
    ],
    difficulty: "hard",
    hint: "⚾ Challenge round - 8 hits!"
  },
  {
    id: 9,
    name: "Swing #9",
    code: "HIT9",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - All Around",
        north: 34.2470,
        south: 34.2435,
        east: -118.5245,
        west: -118.5300
      }
    ],
    difficulty: "hard",
    hint: "⚾ You're on fire! 9 swings!"
  },
  {
    id: 10,
    name: "Swing #10 - ULTIMATE",
    code: "HIT10",
    lat: 34.2452183,
    lng: -118.5270635,
    bounds: {
      north: 34.2462,
      south: 34.2442,
      east: -118.5258,
      west: -118.5283
    },
    foulZones: [
      {
        name: "Foul Ball - Grand Slam Zone",
        north: 34.2468,
        south: 34.2438,
        east: -118.5250,
        west: -118.5290
      }
    ],
    difficulty: "hard",
    hint: "⚾ GRAND SLAM! Go big or go home!"
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
