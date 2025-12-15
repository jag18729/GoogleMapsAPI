# CSUN Baseball Hitting Game

Interactive baseball game using Google Maps JavaScript API. Double-click on the map to hit baseballs - click **outside** the Matador Baseball Field for homeruns, **inside** for strikeouts, and **foul zones** for foul balls.

**Live:** https://jag18729.github.io/GoogleMapsAPI/

---

## Quick Start (Local Development)

```bash
# 1. Clone and setup
cd frontend
bun install

# 2. Create .env with your Google Maps API key
echo "GOOGLE_MAPS_API_KEY=AIzaSy..." > .env

# 3. Start dev server
bun run dev-server.js
# Open http://localhost:3000
```

---

## Game Features

- **10 Hitting Challenges** - Test your accuracy at CSUN locations
- **Dynamic Feedback** - Visual overlays + sound effects for each hit
- **High Score Board** - Persistent leaderboard stored locally
- **Responsive Design** - Works on mobile and desktop
- **Professional Theming** - Baseball stadium atmosphere with CSUN branding

### Game Mechanics
- **Homerun (✓)** - Click outside field boundary = +1 point
- **Strikeout (❌)** - Click inside field = 0 points
- **Foul Ball (⚾)** - Click in foul zones (soccer field, buildings) = 0 points
- **Timer** - Real-time game duration tracking
- **Retry Button** - Play same locations with fresh attempts

---

## Tech Stack

- **Runtime:** Bun 1.3+ (JavaScript runtime with integrated bundler)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, jQuery
- **Maps:** Google Maps JavaScript API
- **Deployment:** GitHub Pages with GitHub Actions CI/CD
- **Audio:** Web Audio API (browser-native sound synthesis)
- **Encryption:** AES-256-GCM (optional, for API key security)

---

## Project Structure

```
frontend/
├── src/
│   ├── index.html           # Main game interface
│   ├── css/
│   │   ├── styles.css       # Game styling + custom bat cursor
│   │   └── animations.css   # 8+ CSS animations
│   └── js/
│       ├── main.js          # Game orchestrator
│       ├── game.js          # Game state logic
│       ├── map.js           # Google Maps integration
│       ├── ui.js            # UI updates
│       ├── timer.js         # Game timer
│       ├── audio.js         # Sound effects
│       ├── highscores.js    # LocalStorage scores
│       └── locations.js     # 10 CSUN building coordinates
├── scripts/
│   ├── encrypt-key.ts       # Optional API key encryption
│   └── decrypt-key.ts       # Decryption helper
├── build.js                 # Bun build script
├── dev-server.js            # Local development server
└── package.json

.github/workflows/
└── deploy.yml              # Automated GitHub Pages deployment

docs/
├── README.md               # Documentation index
├── API_SECURITY.md         # Security architecture
├── BUN_ENCRYPTION_SETUP.md # Encryption guide (optional)
└── ENCRYPTED_SECRETS.md    # Alternative encryption methods
```

---

## Build & Deploy

### Local Build
```bash
cd frontend
bun run build.js
# Output: dist/
```

### Deploy to GitHub Pages
```bash
git add .
git commit -m "Update game"
git push origin main
# GitHub Actions auto-deploys
```

---

## API Key Security

Your Google Maps API key is protected by:

1. **GitHub Secrets** - Key stored securely, not in repository
2. **Domain Restrictions** - Google Cloud: only works on `jag18729.github.io`
3. **API Restrictions** - Maps JavaScript API only
4. **Build-Time Injection** - Key injected during build, not hardcoded
5. **Optional Encryption** - AES-256-GCM at-rest encryption available

See `docs/API_SECURITY.md` for details.

---

## Optional: Encrypt API Key

For additional security, encrypt your API key:

```bash
cd frontend/scripts
bun encrypt-key.ts
# Follow prompts, then:
git add ../.env.encrypted
git push
```

Then add `ENCRYPTION_PASSWORD` to GitHub Secrets. Build automatically decrypts during deployment.

See `docs/BUN_ENCRYPTION_SETUP.md` for complete guide.

---

## Documentation

All technical documentation is in `docs/`:

| Document | Purpose |
|----------|---------|
| `docs/README.md` | Complete documentation index |
| `docs/API_SECURITY.md` | Security implementation details |
| `docs/BUN_ENCRYPTION_SETUP.md` | API key encryption guide |
| `docs/ENCRYPTED_SECRETS.md` | Alternative encryption approaches |

---

## Features

✅ **Game Mechanics**
- Double-click to hit baseballs on interactive map
- Real-time scoring and timer
- Sound effects (bat crack, homerun, strikeout, foul, game over)
- Custom baseball bat cursor
- 8+ CSS animations

✅ **User Interface**
- CSUN official logo in header
- Responsive design (mobile + desktop)
- High score leaderboard with persistent storage
- Play-by-play result breakdown
- Direct link to Matador Baseball Field on Google Maps
- Retry button to play same locations again

✅ **Development**
- Bun 1.3 build system (bundling, minification, sourcemaps)
- Local development server with hot reload
- GitHub Actions CI/CD pipeline
- Automated GitHub Pages deployment
- Clean, modular JavaScript code

---

## Performance

- **Page Load:** < 2 seconds (optimized assets)
- **Build Time:** < 5 seconds (Bun bundler)
- **Game Loop:** 60 FPS (smooth animations)
- **Network:** Single API call per location load
- **Storage:** ~2KB for high scores (LocalStorage)

---

## Browser Support

- **Recommended:** Chrome/Edge (tested extensively)
- **Supported:** Firefox, Safari, Opera
- **Requirements:** ES2020+, Web Crypto API, Google Maps API access

---

## Troubleshooting

**Game won't load?**
- Check API key in .env (local) or GitHub Secrets (CI/CD)
- Verify domain restrictions in Google Cloud Console
- Check browser console for errors

**Sound not working?**
- Browsers require user interaction before playing audio
- Click anywhere on the map first
- Some ad blockers may disable Web Audio API

**High scores not saving?**
- Check browser LocalStorage is enabled
- Clear cache if scores aren't updating
- Scores are device-specific (not synced)

**Build fails?**
- Ensure `.env` exists with valid API key
- Run `bun install` to install dependencies
- Check `build.js` output for specific errors

See `docs/` for detailed troubleshooting guides.

---

## Deployment Status

- **Live Game:** ✅ https://jag18729.github.io/GoogleMapsAPI/
- **CI/CD:** ✅ GitHub Actions auto-deploy on push
- **API Key:** ✅ Secure (domain + API restricted)
- **High Scores:** ✅ Working (LocalStorage)
- **Sound Effects:** ✅ Working (Web Audio API)
- **Encryption:** ✅ Optional (AES-256-GCM ready)

---

## What's Next?

- **Encrypt API Key:** Follow `docs/BUN_ENCRYPTION_SETUP.md`
- **Customize Locations:** Edit `frontend/src/js/locations.js`
- **Add Features:** Modify game logic in `frontend/src/js/game.js`
- **Deploy Changes:** Push to main branch, GitHub Actions handles it

---

## License

Educational project for CSUN COMP 484 - Google Maps API

---

**Built with Bun 1.3 | Google Maps API | GitHub Pages**
