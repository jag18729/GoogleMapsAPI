# ⚾ CSUN Baseball Hitting Game

Interactive baseball game on Google Maps. **Double-click outside the Matador Baseball Field = Homerun.** Inside = Strikeout. Foul zones = Foul ball.

**🎮 Play Now:** https://jag18729.github.io/GoogleMapsAPI/

---

## ⚡ Quick Start (3 minutes)

```bash
cd frontend
bun install
echo "GOOGLE_MAPS_API_KEY=AIza..." > .env
bun run dev-server.js
# Open http://localhost:3000
```

**Deploy:** `git push origin main` (GitHub Actions auto-deploys)

---

## 🎯 How to Play

| Action | Result |
|--------|--------|
| **Double-click OUTSIDE field** | ✅ Homerun (+1 point) |
| **Double-click INSIDE field** | ❌ Strikeout (0 points) |
| **Double-click foul zones** | ⚾ Foul Ball (0 points) |
| **10 challenges** to beat your score |
| **High scores** saved automatically |

---

## 📦 What's Included

✅ Full baseball game with 10 CSUN locations
✅ Real-time scoring & timer
✅ Sound effects (bat crack, homerun, strikeout, foul, game over)
✅ Custom bat cursor
✅ 8+ CSS animations
✅ Responsive mobile design
✅ High score leaderboard (LocalStorage)
✅ Secure API key handling
✅ GitHub Pages deployment
✅ GitHub Actions CI/CD automation

---

## 🛠 Build & Deploy

### Local Development
```bash
cd frontend
bun run dev-server.js
# http://localhost:3000
```

### Build for Production
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
# ✅ Automatically deployed!
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── index.html          # Game interface
│   ├── css/                # Styling + animations
│   └── js/
│       ├── main.js         # Game orchestrator
│       ├── game.js         # Game state
│       ├── map.js          # Google Maps
│       ├── ui.js           # UI updates
│       ├── audio.js        # Sound effects
│       ├── timer.js        # Game timer
│       ├── highscores.js   # Score storage
│       └── locations.js    # CSUN building coords
├── scripts/
│   ├── encrypt-key.ts      # Optional encryption
│   └── decrypt-key.ts      # Decryption helper
└── build.js                # Bun build script

docs/
├── API_SECURITY.md         # How API key is protected
├── BUN_ENCRYPTION_SETUP.md # Optional encryption guide
└── ENCRYPTED_SECRETS.md    # Other encryption approaches
```

---

## 🔐 API Key Security

Your Google Maps key is protected by:

1. **GitHub Secrets** - Not in repository
2. **Domain Restrictions** - Only works on jag18729.github.io
3. **API Restrictions** - Maps JavaScript API only
4. **Build-Time Injection** - Not hardcoded
5. **Optional Encryption** - AES-256-GCM available

**Details:** See `docs/API_SECURITY.md`

---

## 🔒 Optional: Encrypt API Key

For extra security, encrypt your key at rest:

```bash
cd frontend/scripts
bun encrypt-key.ts
# Follow prompts, then:
git add ../.env.encrypted
git push
# Add ENCRYPTION_PASSWORD to GitHub Secrets
```

GitHub Actions automatically decrypts during deployment.

**Full guide:** See `docs/BUN_ENCRYPTION_SETUP.md`

---

## 🚀 Deployment Status

| Feature | Status |
|---------|--------|
| Live Game | ✅ https://jag18729.github.io/GoogleMapsAPI/ |
| CI/CD | ✅ GitHub Actions auto-deploy |
| API Key | ✅ Secure (restricted) |
| High Scores | ✅ Working |
| Sound Effects | ✅ Working |
| Encryption | ✅ Optional (ready) |

---

## 🔧 Tech Stack

- **Bun 1.3** - JavaScript runtime + bundler
- **Google Maps API** - Interactive map
- **Web Audio API** - Browser-native sounds
- **HTML5/CSS3/JS** - Frontend
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD

---

## ❓ Troubleshooting

**Game won't load?**
- Check API key in `.env` (local) or GitHub Secrets
- Verify Google Cloud domain restrictions are set
- Check browser console for errors

**Sound not working?**
- Click map first (browsers need user interaction)
- Check ad blockers aren't blocking Web Audio

**High scores not saving?**
- Enable LocalStorage in browser
- Scores are device-specific (not synced)

**Build fails?**
- Run `bun install`
- Ensure `.env` has valid API key

---

## 📚 Documentation

| Document | What It Covers |
|----------|----------------|
| `docs/API_SECURITY.md` | Security layers, risks, best practices |
| `docs/BUN_ENCRYPTION_SETUP.md` | How to encrypt API key with AES-256-GCM |
| `docs/ENCRYPTED_SECRETS.md` | 5 encryption approaches compared |

---

## ✨ Features

**Game Mechanics**
- Double-click hitting on live map
- Real-time scoring
- Visual feedback (green/red overlays)
- Foul zone detection
- Play-by-play results

**Audio & Visual**
- 5 different sound effects
- Custom bat cursor
- 8+ CSS animations
- CSUN branding
- Professional theming

**Developer**
- Bun 1.3 build system
- Local dev server
- GitHub Actions CI/CD
- Clean modular code
- Comprehensive docs

---

## 🎯 Next Steps

**Want to customize?**
- Edit `frontend/src/js/locations.js` for custom spots
- Modify `frontend/src/js/game.js` for game logic
- Update `frontend/src/css/styles.css` for design

**Want to encrypt?**
- Follow `docs/BUN_ENCRYPTION_SETUP.md`

**Want to deploy?**
- `git push origin main` (automatic!)

---

## 📊 Performance

- Page Load: < 2 seconds
- Build Time: < 5 seconds
- Game Loop: 60 FPS
- High Scores: ~2KB (LocalStorage)

---

## 🌐 Browser Support

✅ Chrome/Edge (recommended)
✅ Firefox, Safari, Opera
⚠️ Requires: ES2020+, Web Crypto API, Google Maps access

---

## 📜 License

Educational project for CSUN COMP 484

---

**Built with Bun 1.3 | Google Maps API | GitHub Pages**

Ready to play? 🚀 Go to https://jag18729.github.io/GoogleMapsAPI/
