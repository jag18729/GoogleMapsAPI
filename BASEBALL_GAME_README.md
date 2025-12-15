# ⚾ CSUN Baseball Hitting Game

## Game Overview

A fun, interactive baseball hitting game where you try to hit baseballs outside the field for HOMERUNS!

### How to Play

1. **Double-click on the map** to swing at the baseball
2. **Click OUTSIDE the field box** = ✅ **HOMERUN** (Green overlay - you scored!)
3. **Click INSIDE the field box** = ⚠️ **OUT** (Red overlay - try again!)
4. **Complete 5 swings** and see your final score

### Scoring

- **Homeruns**: Balls hit outside the field = CORRECT
- **Outs**: Balls landing inside the field = INCORRECT
- **Hit Success Rate**: Percentage of homeruns achieved
- **Timer**: Tracks how fast you complete the game

### Features

✅ **Baseball Field Location**: CSUN Recreation Area (6FWF+35 Northridge, CA)
✅ **5 Hitting Rounds**: Progressive difficulty
✅ **Real-time Timer**: Track your speed (MM:SS format)
✅ **Animations**: Visual feedback with smooth transitions
✅ **High Score System**: LocalStorage keeps your best scores
✅ **Responsive Design**: Works on desktop and mobile
✅ **Google Maps Integration**: Real map of the baseball field area

---

## Development Setup

### Prerequisites

- Bun 1.3+ ([Install Bun](https://bun.sh/docs/installation))
- Google Maps API key ([Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key))
- Git

### Quick Start

1. **Clone/download the repository**

2. **Create .env file with your API key:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Google Maps API key
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Install dependencies:**
   ```bash
   cd frontend
   bun install
   ```

4. **Start development server:**
   ```bash
   bun run --watch dev-server.js
   ```

5. **Open in browser:**
   ```
   http://localhost:5150
   ```

---

## Building for Production

```bash
cd frontend
bun run build.js
```

This creates `frontend/dist/` with optimized files ready for GitHub Pages.

---

## Deployment to GitHub Pages

### Step 1: Add API Key to GitHub Secrets

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `GOOGLE_MAPS_API_KEY`
5. Value: Your Google Maps API key

### Step 2: Enable GitHub Pages

1. Settings → Pages
2. Source: **GitHub Actions**

### Step 3: Deploy

```bash
git add .
git commit -m "Deploy baseball hitting game"
git push origin main
```

GitHub Actions will automatically:
- ✅ Build with Bun
- ✅ Inject API key from secrets
- ✅ Deploy to GitHub Pages

Your live site: `https://[your-username].github.io/GoogleMapsAPI`

---

## API Key Security

### Google Cloud Console Configuration

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Select your Maps API key
3. **Application restrictions**: HTTP referrers
   - Add: `https://[your-username].github.io/*`
4. **API restrictions**: Enable only "Maps JavaScript API"
5. Save

This ensures your API key is only used on your GitHub Pages domain.

---

## Project Structure

```
GoogleMapsAPI/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions automation
├── frontend/
│   ├── src/
│   │   ├── index.html          # Game UI
│   │   ├── css/
│   │   │   ├── styles.css      # Game styling
│   │   │   └── animations.css  # Animations
│   │   └── js/
│   │       ├── main.js         # App orchestrator
│   │       ├── game.js         # Game logic
│   │       ├── locations.js    # Baseball field data
│   │       ├── map.js          # Google Maps
│   │       ├── ui.js           # UI updates
│   │       ├── timer.js        # Timer feature
│   │       ├── highscores.js   # High scores
│   │       └── config.js       # Configuration
│   ├── dist/                   # Build output (generated)
│   ├── build.js                # Build script
│   ├── dev-server.js           # Dev server
│   └── package.json            # Dependencies
├── backend/                    # Development utilities
├── .env                        # API key (gitignored)
├── .env.example                # API key template
└── README.md                   # Documentation
```

---

## Game Mechanics

### Baseball Field Coordinates

- **Center**: 34.2330, -118.5385
- **Infield (Safe Zone)**: Rectangle defining the field boundaries
- **Outfield (Success Zone)**: Everything outside the infield

### Scoring Logic

```javascript
// For each swing:
if (clickLocation OUTSIDE infield bounds) {
  // HOMERUN! ✅
  score++
} else {
  // OUT! ⚠️
}
```

### Each Round

1. Prompt tells you which hit you're on (1-5)
2. You double-click somewhere on the map
3. Green overlay = HOMERUN (outside field)
4. Red overlay = OUT (inside field)
5. 2-second delay, then next round

---

## Commands

```bash
# Development
cd frontend
bun run --watch dev-server.js          # Start dev server

# Build
bun run build.js                        # Create dist/

# Environment
bun run scripts/setup-env.js            # Setup .env
bun run scripts/validate-locations.js   # Validate coordinates
```

---

## Troubleshooting

### Map Not Loading?
- Check `.env` has valid Google Maps API key
- Verify API key in Google Cloud Console
- Check browser console for errors

### Build Failing?
- Ensure Bun 1.3+ installed: `bun --version`
- Check `.env` file exists with API key
- Run: `cd frontend && bun install`

### GitHub Pages Not Working?
- Verify repository secret `GOOGLE_MAPS_API_KEY` is set
- Check Actions tab for build logs
- Ensure GitHub Pages is enabled (Settings → Pages)

### High Scores Not Saving?
- Check browser LocalStorage is enabled
- Clear browser cache if needed
- Check browser console for errors

---

## Extra Features Included

✅ **Timer** - Tracks game duration (MM:SS format)
✅ **Animations** - Pulse, bounce, shake, fade effects
✅ **High Scores** - Top 10 scores stored in LocalStorage
✅ **Responsive Design** - Works on mobile and desktop
✅ **Real Baseball Field** - Actual CSUN field coordinates

---

## Technology Stack

- **Frontend**: HTML5, CSS3, ES6+ JavaScript
- **UI Library**: jQuery 3.7.1
- **Maps**: Google Maps JavaScript API
- **Build Tool**: Bun 1.3
- **Hosting**: GitHub Pages (static)
- **Storage**: Browser LocalStorage (high scores)
- **Deployment**: GitHub Actions

---

## Tips for Best Experience

- Play on **Google Chrome** (recommended)
- Use **fullscreen** for better visibility
- Try to get all 5 **HOMERUNS** for perfect score!
- Beat your personal **high score** using the timer
- Share your **fastest time** with friends

---

## Future Enhancements

- Additional baseball stadiums
- Difficulty levels (Little League, Major League, Professional)
- Leaderboard synchronization
- Sound effects (bat crack, crowd cheers)
- Mobile app version
- Multi-player mode

---

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review browser console for errors
3. Check GitHub Actions logs for deployment issues
4. Verify Google Maps API key configuration

---

**Enjoy the game! ⚾🏏**
