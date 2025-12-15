# Backend Utilities

This directory contains development scripts and utilities. These files are **NOT deployed to GitHub Pages**.

## Purpose

Since GitHub Pages only hosts static files, there's no backend server. This directory contains helper scripts for local development:

- Scripts to help with environment setup
- Data validation tools
- Location coordinate verification

## Scripts

### `setup-env.js`

Helps create and validate `.env` file for development.

**Usage:**
```bash
cd backend
bun install
bun run scripts/setup-env.js
```

**What it does:**
- Checks if `.env` file exists
- Creates `.env` from `.env.example` if missing
- Validates that API key is configured
- Provides guidance for getting API key

### `validate-locations.js`

Validates building coordinate data for accuracy.

**Usage:**
```bash
bun run scripts/validate-locations.js
```

**What it checks:**
- All 5 locations have required fields
- Coordinates are within CSUN campus area
- Location bounds are valid
- Campus center coordinates are accurate

## Note on Backend Architecture

The frontend is fully self-contained and doesn't require a backend server:

- **Game Logic**: Runs entirely in the browser
- **Data Storage**: Uses browser LocalStorage for high scores
- **Map Data**: Building locations hardcoded in `frontend/src/js/locations.js`
- **API**: No backend API needed for static GitHub Pages hosting

## Development Workflow

1. **First time setup:**
   ```bash
   bun run scripts/setup-env.js
   cd ../frontend
   bun install
   ```

2. **Development:**
   ```bash
   cd frontend
   bun run --watch dev-server.js
   # Visit http://localhost:3000
   ```

3. **Before deployment:**
   ```bash
   cd frontend
   bun run build.js
   ```

## Coordinate System

All coordinates use standard latitude/longitude (WGS84 projection).

CSUN Campus Center:
- Latitude: 34.2410
- Longitude: -118.5270

Building locations must have:
- `lat`: latitude coordinate
- `lng`: longitude coordinate
- `bounds`: { north, south, east, west } for quiz area

## Future Backend Capabilities

If backend functionality is needed in the future, this can be extended to:
- Store high scores in a database
- Provide additional location data
- Handle user authentication
- Generate analytics reports

But for the current GitHub Pages deployment, the frontend is fully independent.
