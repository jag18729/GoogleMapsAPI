# Documentation Index

Complete documentation for the CSUN Baseball Hitting Game project.

---

## Quick Links

### For New Users
1. **[Getting Started](./GETTING_STARTED.md)** - Setup and running the project locally
2. **[Game Features](./GAME_FEATURES.md)** - How to play, features, and mechanics

### For Developers
1. **[Architecture](./ARCHITECTURE.md)** - Project structure and module overview
2. **[Build System](./BUILD_SYSTEM.md)** - Bun build process and configuration
3. **[API Key Management](./API_SECURITY.md)** - Security implementation and best practices

### For Advanced Users
1. **[Encryption Setup](./BUN_ENCRYPTION_SETUP.md)** - AES-256-GCM encryption for API keys
2. **[Encryption Options](./ENCRYPTED_SECRETS.md)** - Alternative encryption approaches
3. **[Deployment](./DEPLOYMENT.md)** - GitHub Pages deployment and CI/CD

---

## Documents

### 1. API_SECURITY.md
**What:** How Google Maps API keys are secured in this project
**Why:** Essential understanding for security-conscious developers
**Contents:**
- Security layers (GitHub Secrets, Domain Restrictions, Build-Time Injection)
- Risk assessment and mitigations
- Google Cloud Console configuration
- .gitignore protection
- Key rotation procedures

**Read this if:** You want to understand the security model

---

### 2. BUN_ENCRYPTION_SETUP.md
**What:** Complete guide to implementing AES-256-GCM encryption
**Why:** Add another layer of security by encrypting API keys at rest
**Contents:**
- Quick start (5 minutes)
- Technical details (encryption algorithm, key derivation)
- Step-by-step setup
- Troubleshooting
- Password rotation
- Advanced operations

**Read this if:** You want to encrypt your API key in the repository

---

### 3. ENCRYPTED_SECRETS.md
**What:** Comparison of 5 different encryption approaches
**Why:** Different projects have different security needs
**Contents:**
- GPG Encryption (recommended for teams)
- Bun Native Crypto (AES-256-GCM)
- dotenv-encryption (library-based)
- HashiCorp Vault (enterprise)
- Sealed Secrets (Kubernetes-style)
- Comparison tables
- Threat models

**Read this if:** You want to evaluate different encryption options

---

## File Organization

```
CSUN-Baseball-Game/
├── docs/
│   ├── README.md                    ← You are here
│   ├── API_SECURITY.md              # Security architecture
│   ├── BUN_ENCRYPTION_SETUP.md     # AES-256-GCM setup
│   └── ENCRYPTED_SECRETS.md        # Encryption options
│
├── frontend/
│   ├── src/
│   │   ├── index.html              # Main HTML
│   │   ├── css/
│   │   │   ├── styles.css          # Main styling
│   │   │   └── animations.css      # Game animations
│   │   └── js/
│   │       ├── main.js             # Game orchestrator
│   │       ├── game.js             # Game state logic
│   │       ├── map.js              # Google Maps integration
│   │       ├── ui.js               # UI controller
│   │       ├── timer.js            # Timer feature
│   │       ├── audio.js            # Sound effects
│   │       ├── highscores.js       # Local score storage
│   │       └── locations.js        # 10 CSUN building coordinates
│   ├── scripts/
│   │   ├── encrypt-key.ts          # Encryption script
│   │   └── decrypt-key.ts          # Decryption helper
│   ├── build.js                    # Bun build script
│   ├── dev-server.js               # Local dev server
│   ├── .env                        # Local API key (gitignored)
│   └── .env.encrypted              # Encrypted API key (committed)
│
├── .github/workflows/
│   └── deploy.yml                  # GitHub Actions CI/CD
│
├── .gitignore
├── README.md                       # Project overview
└── package.json
```

---

## Security Comparison

| Aspect | Current Setup | + Encryption |
|--------|---------------|--------------|
| **API Key Storage** | GitHub Secrets | .env.encrypted + password in Secrets |
| **Encryption** | None | AES-256-GCM with PBKDF2 |
| **At Rest Security** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Complexity** | Low | Medium |
| **Cost** | Free | Free |
| **Team Friendly** | ✅ | ✅ |

---

## Common Tasks

### Local Development
```bash
# 1. Create .env with API key
echo "GOOGLE_MAPS_API_KEY=AIza..." > frontend/.env

# 2. Install dependencies
cd frontend && bun install

# 3. Start dev server
bun run dev-server.js

# 4. Open http://localhost:3000
```

### Build for Deployment
```bash
cd frontend
bun run build.js

# Output in: dist/ directory
```

### Deploy to GitHub Pages
```bash
git add .
git commit -m "Update game features"
git push origin main

# GitHub Actions automatically deploys
# Check: https://github.com/jag18729/GoogleMapsAPI/actions
```

### Encrypt API Key
```bash
cd frontend/scripts
bun encrypt-key.ts

# Follow prompts:
# - Enter API key
# - Enter strong password
# - Confirm password

# Commit encrypted file
git add ../env.encrypted
git push
```

---

## Getting Help

### Troubleshooting Guides
- **API Key Issues**: See [API_SECURITY.md](./API_SECURITY.md#troubleshooting)
- **Encryption Issues**: See [BUN_ENCRYPTION_SETUP.md](./BUN_ENCRYPTION_SETUP.md#troubleshooting)
- **Build Errors**: Check build output for specific error messages

### Resources
- [Bun Documentation](https://bun.com/docs)
- [Google Maps API Guide](https://developers.google.com/maps/documentation/javascript)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Web Crypto API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

### Questions?
Check the Q&A section in each document for common questions.

---

## Document Maintenance

**Last Updated:** December 15, 2025
**Version:** 1.0
**Status:** Complete

If you find outdated information or have suggestions:
1. Edit the relevant document
2. Include brief explanation of change
3. Commit with clear message
4. Push to repository

---

## For Your Discord

**Encryption Summary:**
```
"We implemented Bun native AES-256-GCM encryption for the API key:
- 256-bit AES with GCM mode (authenticated encryption)
- PBKDF2 with 310,000 iterations for key derivation (OWASP 2025)
- Encrypted file committed to repo (.env.encrypted)
- Password stored in GitHub Secrets (ENCRYPTION_PASSWORD)
- Automatic decryption in GitHub Actions during build
- Falls back to plaintext .env for local development

No external dependencies - uses Bun's native Web Crypto API."
```

