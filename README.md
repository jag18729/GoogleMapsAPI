# CSUN Campus Maps Quiz Game

An interactive quiz game that tests your knowledge of CSUN campus building locations using Google Maps API.

## Features

- Interactive map-based quiz with 5 CSUN building locations
- Real-time timer tracking
- Visual feedback with colored overlays (green for correct, red for incorrect)
- High score system using LocalStorage
- Responsive design for mobile and desktop
- Smooth animations and transitions

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), jQuery
- **Maps**: Google Maps JavaScript API
- **Build Tool**: Bun 1.3
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## Local Development Setup

### Prerequisites

- Bun 1.3+ installed ([Installation Guide](https://bun.sh/docs/installation))
- Google Maps API key ([Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key))
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd GoogleMapsAPI
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your Google Maps API key to .env:**
   ```
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

4. **Install dependencies:**
   ```bash
   cd frontend
   bun install
   ```

5. **Run development server:**
   ```bash
   bun run --watch dev-server.js
   ```

6. **Open browser:**
   Navigate to `http://localhost:3000`

## Building for Production

```bash
cd frontend
bun run build.js
```

The built files will be in `frontend/dist/` directory.

## Deployment

### GitHub Pages Setup

1. **Add API key to GitHub Secrets:**
   - Go to repository Settings > Secrets and variables > Actions
   - Add new secret: `GOOGLE_MAPS_API_KEY` with your API key

2. **Enable GitHub Pages:**
   - Go to Settings > Pages
   - Source: GitHub Actions

3. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **GitHub Actions will automatically:**
   - Build the project with Bun
   - Inject the API key from secrets
   - Deploy to GitHub Pages

### Secure API Key

In Google Cloud Console:
1. Go to APIs & Services > Credentials
2. Select your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add: `https://your-username.github.io/*`
5. Under "API restrictions", select "Restrict key"
6. Enable only: "Maps JavaScript API"

## Project Structure

```
GoogleMapsAPI/
├── .github/workflows/    # GitHub Actions CI/CD
├── frontend/
│   ├── src/              # Source files
│   │   ├── index.html    # Main HTML
│   │   ├── css/          # Stylesheets
│   │   ├── js/           # JavaScript modules
│   │   └── assets/       # Images, icons
│   ├── dist/             # Build output (generated)
│   ├── build.js          # Bun build script
│   ├── dev-server.js     # Dev server
│   └── package.json      # Bun dependencies
├── backend/              # Development utilities
├── .env.example          # Environment template
└── README.md             # This file
```

## Game Instructions

1. Read the prompt asking for a specific building location
2. Double-click on the map where you think the building is located
3. Green overlay = Correct answer
4. Red overlay = Incorrect answer
5. Complete all 5 locations to see your final score
6. Try to beat your high score!

## CSUN Buildings in Quiz

1. Oviatt Library
2. Student Recreation Center
3. University Student Union
4. Jacaranda Hall
5. Sierra Hall

## Browser Compatibility

- Google Chrome (required)
- Modern browsers with ES6+ support

## License

MIT License - See LICENSE file for details

## Credits

COMP 484 Project - California State University, Northridge

## Development Commands

```bash
# Start development server
cd frontend
bun run --watch dev-server.js

# Build for production
bun run build.js

# Install dependencies
bun install
```

## Tips for Development

- The dev server serves files from `frontend/src/`
- Changes to HTML, CSS, and JS files are reflected immediately
- API key is loaded from `.env` file
- For production, use `bun run build.js` to bundle and minify

## Troubleshooting

**API Key Not Working?**
- Check `.env` file exists and has correct key
- Verify key in Google Cloud Console
- Check domain restrictions match GitHub Pages URL

**Build Fails?**
- Ensure Bun 1.3+ is installed
- Check `.env` file exists
- Verify all dependencies installed: `bun install`

**Map Not Loading?**
- Check browser console for errors
- Verify API key is valid
- Check Google Cloud Console for API restrictions

**High Scores Not Saving?**
- Check browser LocalStorage is enabled
- Clear browser cache if needed

## Future Enhancements

- Additional building locations
- Difficulty levels
- Leaderboard synchronization
- Mobile app version
- Sound effects and notifications
