# Google Maps API Security Implementation

## Overview

The CSUN Baseball Hitting Game uses the Google Maps JavaScript API with a **domain-restricted API key** and **GitHub Actions secrets management** to keep the API key secure while deploying to GitHub Pages.

---

## Architecture

### 1. **Local Development**
```
.env (local, gitignored) 
  ↓
build.js (reads API key)
  ↓
Injects into index.html <script> tag
  ↓
Dev server serves HTML with key
```

### 2. **Production (GitHub Pages)**
```
GitHub Secrets (GOOGLE_MAPS_API_KEY)
  ↓
GitHub Actions Workflow
  ↓
Creates .env from secret
  ↓
build.js (reads from .env)
  ↓
Injects into index.html
  ↓
Deployed to GitHub Pages
```

---

## Security Layers

### Layer 1: Repository Secrets
- **Storage**: GitHub Repository Settings → Secrets and variables → Actions
- **Key Name**: `GOOGLE_MAPS_API_KEY`
- **Visibility**: Only available to GitHub Actions workflows (not visible in logs or code)
- **Access Control**: Only runs on push to `main` branch

**Benefits:**
- API key never stored in repository
- Only Actions can access it during build
- No risk of accidental commit

### Layer 2: Google Cloud Console Restrictions

The API key in Google Cloud Console is restricted to:

#### **1. API Restrictions**
- ✅ Maps JavaScript API **only**
- ❌ Other APIs (Geocoding, Directions, etc.) disabled

#### **2. HTTP Referrer Restrictions** (Domain Whitelist)
```
https://jag18729.github.io/*
http://localhost:3000/*
http://localhost:5150/*
```

**Why this works:**
- Browser includes `Referer` header with each API request
- API key only works if request comes from these domains
- Even if someone steals the key from client-side code, it won't work from their domain

### Layer 3: Build-Time Injection

The `build.js` script:
1. Reads API key from `.env` file (local) or GitHub Secrets (CI/CD)
2. Finds placeholder: `__GOOGLE_MAPS_API_KEY__` in `index.html`
3. Injects actual key into the HTML before bundling
4. No API key is stored in JavaScript source code

**Example:**
```html
<!-- Before build -->
<script src="https://maps.googleapis.com/maps/api/js?key=__GOOGLE_MAPS_API_KEY__&callback=initMap"></script>

<!-- After build -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCVzfl4RjTtr1k6A3wiASsrvQEyCtApERs&callback=initMap"></script>
```

### Layer 4: .gitignore Protection

**Files never committed:**
```
.env              # Local API key
node_modules/     # Dependencies
dist/             # Build output (now in root for GitHub Pages)
frontend/dist/    # Build output
*.map             # Source maps
```

---

## Deployment Flow

### Local Development
```bash
# 1. Create .env with your API key
echo "GOOGLE_MAPS_API_KEY=AIzaSy..." > .env

# 2. Run build
cd frontend
bun run build.js

# 3. Dev server (reads from .env)
bun run dev-server.js
```

### GitHub Pages Deployment
```yaml
# .github/workflows/deploy.yml
jobs:
  build:
    - name: Create .env file with API key
      run: |
        echo "GOOGLE_MAPS_API_KEY=${{ secrets.GOOGLE_MAPS_API_KEY }}" > .env
    
    - name: Build project
      run: bun run build.js
    
    - name: Deploy to GitHub Pages
      uses: actions/deploy-pages@v4
```

---

## Risk Assessment & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| API key exposed in source code | **HIGH** | Build-time injection, .gitignore |
| API key exposed in GitHub history | **HIGH** | Never committed (key in Secrets, not repo) |
| API key stolen from frontend | **MEDIUM** | Domain restriction (only works on jag18729.github.io) |
| Quota exhaustion attack | **MEDIUM** | Google Cloud billing alerts + API quotas |
| Other APIs accessed with key | **LOW** | Google Cloud API restrictions enabled |
| Unauthorized GitHub Actions | **LOW** | Only workflow files can access Secrets |

---

## Comparison with Other Approaches

### ❌ **Hardcoded API Key** (NOT RECOMMENDED)
```javascript
const API_KEY = "AIzaSyCVzfl4RjTtr1k6A3wiASsrvQEyCtApERs";
```
**Problems:**
- Visible in source code
- Gets committed to git history
- Anyone can extract and use it
- Can't rotate without code change

### ✅ **Our Approach: Build-Time Injection + Domain Restriction**
```html
<!-- Placeholder in HTML -->
<script src="https://maps.googleapis.com/maps/api/js?key=__GOOGLE_MAPS_API_KEY__"></script>
```
**Advantages:**
- Key never in source code
- Domain-restricted at API level
- Rotatable via GitHub Secrets
- GitHub Actions audit trail
- Works for static GitHub Pages hosting

### ⚠️ **Backend Proxy** (Over-engineered for this project)
```
Client → Your Backend → Google Maps API
```
**Problems:**
- Requires server (GitHub Pages is static-only)
- Adds complexity
- Performance hit
- Unnecessary for this use case

---

## Setup Instructions for Collaboration

### For Contributors
1. **Get API Key** from project maintainer or Google Cloud Console
2. **Create `.env` locally:**
   ```bash
   echo "GOOGLE_MAPS_API_KEY=<your-key>" > .env
   ```
3. **Never commit `.env`** (already in .gitignore)
4. **Build and test:**
   ```bash
   cd frontend
   bun run build.js
   bun run dev-server.js
   ```

### For Repository Maintainer
1. **Generate API Key** in Google Cloud Console
2. **Add to GitHub Secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GOOGLE_MAPS_API_KEY`
   - Value: Your API key
3. **Restrict in Google Cloud Console:**
   - APIs: Maps JavaScript API only
   - Referrers: `https://jag18729.github.io/*`, `http://localhost:*`
4. **Test deployment** by pushing to main

---

## Monitoring & Maintenance

### Check API Usage
1. Google Cloud Console → APIs & Services → Quotas
2. Monitor daily request counts
3. Set up billing alerts

### Rotate API Key (if compromised)
1. Generate new key in Google Cloud Console
2. Update GitHub Secret: `GOOGLE_MAPS_API_KEY`
3. Next deployment automatically uses new key
4. Disable old key immediately

### Verify Domain Restrictions
```bash
# Test local key (should work)
curl "https://maps.googleapis.com/maps/api/js?key=YOUR_KEY"

# Test from other domain (should fail or be restricted)
```

---

## Key Takeaways

✅ **What Makes This Secure:**
- API key in GitHub Secrets (not in code)
- Domain-restricted (only jag18729.github.io)
- API-restricted (Maps JavaScript API only)
- Build-time injection (not hardcoded)
- .gitignore prevents accidental commits

🔐 **Defense in Depth:**
- Even if someone extracts key from HTML, it won't work on their domain
- GitHub Actions audit trail for deployment tracking
- Easy key rotation via Secrets
- No backend needed (static GitHub Pages)

📋 **For Your Discord Response:**
"We implemented API security with:
1. **GitHub Secrets** - API key stored securely, not in repository
2. **Domain Restriction** - Key only works on jag18729.github.io (configured in Google Cloud)
3. **Build-Time Injection** - Key injected during build, not hardcoded in source
4. **HTTP Referrer Whitelist** - Browser's referer header validates domain
5. **.gitignore Protection** - Local .env never committed

This prevents key exposure while using static GitHub Pages hosting."
