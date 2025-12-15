# Encrypted API Key Management Solutions

## Overview

Instead of storing plaintext API keys in `.env`, we can encrypt them. This document covers several practical approaches from simple to enterprise-grade.

---

## Solution 1: GPG Encryption (Recommended for Teams)

### Why GPG?
- ✅ Industry standard (used by Linux distributions, GitHub, etc.)
- ✅ No additional dependencies needed (GPG is universal)
- ✅ Works offline
- ✅ Easy key distribution to team members
- ✅ Audit trail possible

### Setup

#### 1. Generate GPG Key
```bash
# Generate a new GPG key (if you don't have one)
gpg --gen-key

# Or use quick generation
gpg --quick-gen-key "CSUN Team <team@csun.edu>" rsa2048 encr 0
```

#### 2. Encrypt API Key
```bash
# Create a file with your API key
echo "GOOGLE_MAPS_API_KEY=AIzaSyCVzfl4RjTtr1k6A3wiASsrvQEyCtApERs" > .env.secret

# Encrypt it with GPG
gpg --symmetric --armor --cipher-algo AES256 .env.secret

# This creates: .env.secret.asc (encrypted, safe to commit)
rm .env.secret  # Remove plaintext
```

#### 3. Decrypt Before Build
```bash
# In build.js or a separate decrypt script
gpg --decrypt --quiet .env.secret.asc > .env

# Or one-liner
cat .env.secret.asc | gpg --decrypt --quiet > .env
```

#### 4. GitHub Actions Integration
```yaml
# .github/workflows/deploy.yml
steps:
  - name: Decrypt API key
    env:
      GPG_PASSPHRASE: ${{ secrets.GPG_PASSPHRASE }}
    run: |
      echo "$GPG_PASSPHRASE" | gpg --batch --yes --passphrase-fd 0 \
        --decrypt .env.secret.asc > .env

  - name: Build
    run: bun run build.js
```

### Pros & Cons
| Pros | Cons |
|------|------|
| Standard, widely used | Requires passphrase in CI/CD |
| Works everywhere | Extra build step |
| Great for teams | Need to manage GPG keys |

---

## Solution 2: Bun's Native Encryption (Simplest)

Bun includes `crypto` module compatible with Web Crypto API.

### Setup

#### 1. Create Encryption Script
```javascript
// scripts/encrypt-key.js
import crypto from 'crypto';
import fs from 'fs';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || 
  'AIzaSyCVzfl4RjTtr1k6A3wiASsrvQEyCtApERs';

// Generate a random encryption key (store separately!)
const ENCRYPTION_KEY = crypto.randomBytes(32);

// Encrypt the API key
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);

let encrypted = cipher.update(API_KEY, 'utf8', 'hex');
encrypted += cipher.final('hex');
const authTag = cipher.getAuthTag();

// Save encrypted key
const result = {
  encrypted,
  iv: iv.toString('hex'),
  authTag: authTag.toString('hex'),
  encryptionKey: ENCRYPTION_KEY.toString('hex')
};

fs.writeFileSync('.env.encrypted', JSON.stringify(result, null, 2));
console.log('✓ API key encrypted');
console.log('⚠️  Save this key separately (in GitHub Secrets):');
console.log(`ENCRYPTION_KEY=${result.encryptionKey}`);
```

#### 2. Store in GitHub Secrets
```bash
# Copy the ENCRYPTION_KEY from output above
# Add to GitHub Secrets as: ENCRYPTION_KEY
```

#### 3. Decrypt in Build
```javascript
// scripts/decrypt-key.js
import crypto from 'crypto';
import fs from 'fs';

const encryptedData = JSON.parse(fs.readFileSync('.env.encrypted', 'utf8'));
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

const decipher = crypto.createDecipheriv(
  'aes-256-gcm',
  ENCRYPTION_KEY,
  Buffer.from(encryptedData.iv, 'hex')
);

decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log(`GOOGLE_MAPS_API_KEY=${decrypted}`);
```

#### 4. GitHub Actions
```yaml
steps:
  - name: Decrypt and set environment
    env:
      ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
    run: |
      bun scripts/decrypt-key.js > .env

  - name: Build
    run: bun run build.js
```

### Pros & Cons
| Pros | Cons |
|------|------|
| Native Bun support | Two secrets to manage |
| No extra tools | More complex setup |
| AES-256-GCM (very secure) | Need to regenerate keys |

---

## Solution 3: dotenv-encryption (Drop-in Replacement)

Use a library designed for this.

### Setup
```bash
cd frontend
bun add dotenv-enc
```

### Usage
```bash
# Encrypt your .env file
bun dotenv-enc encrypt

# Creates .env.enc (encrypted)
# Creates .env.key (key for decryption - DO NOT COMMIT)

# Decrypt for local development
bun dotenv-enc decrypt
```

### GitHub Actions
```yaml
steps:
  - name: Setup encryption key
    run: |
      echo "${{ secrets.DOTENV_KEY }}" > .env.key

  - name: Decrypt .env
    run: bun dotenv-enc decrypt

  - name: Build
    run: bun run build.js
```

### Pros & Cons
| Pros | Cons |
|------|------|
| Simple, purpose-built | New dependency |
| Drop-in replacement | Less control |
| Good defaults | Library maintenance |

---

## Solution 4: HashiCorp Vault (Enterprise)

For larger teams with multiple secrets.

### Setup
```bash
# Vault server (local or cloud)
vault server -dev

# Store secret
vault kv put secret/csun/maps API_KEY=AIzaSy...

# GitHub Actions access
vault login -path=github -method=github token=$GITHUB_TOKEN
```

### GitHub Actions
```yaml
steps:
  - name: Get secrets from Vault
    uses: hashicorp/vault-action@v3
    with:
      url: https://vault.example.com
      method: github
      githubToken: ${{ secrets.VAULT_TOKEN }}
      secrets: |
        secret/csun/maps API_KEY | GOOGLE_MAPS_API_KEY

  - name: Build
    run: bun run build.js
```

### Pros & Cons
| Pros | Cons |
|------|------|
| Centralized secrets management | Overkill for small projects |
| Audit logs | Extra infrastructure |
| Secret rotation | Complexity |
| Multiple secrets | Learning curve |

---

## Solution 5: Sealed Secrets (Kubernetes-style)

For version-controlled encrypted secrets.

### Setup
```bash
# Install sealed-secrets CLI
brew install sealed-secrets

# Generate sealing key
sealed-secrets-gen-key > sealing-key.key

# Seal your secret
echo -n "GOOGLE_MAPS_API_KEY=AIzaSy..." | \
  sealed-secrets encrypt --key sealing-key.key > .env.sealed
```

### Decrypt in Build
```bash
# Store sealing key in GitHub Secrets
# In CI/CD:
echo "${{ secrets.SEALING_KEY }}" > sealing-key.key
sealed-secrets decrypt --key sealing-key.key .env.sealed > .env
```

### Pros & Cons
| Pros | Cons |
|------|------|
| Version-control friendly | Non-standard |
| Reproducible | Kubernetes-oriented |
| Good for GitOps | More setup |

---

## Recommendation for Your Project

### Option A: Simple (Current Setup is Fine)
```
GitHub Secrets (current approach)
+ Domain restriction in Google Cloud
= Secure enough for most cases
```

### Option B: Better Security (Recommended)
```
GPG Encryption + GitHub Secrets for passphrase
Benefits:
- Encrypted at rest in repository
- Passphrase in GitHub Secrets (standard)
- Works with team members offline
- Industry standard tool
```

### Option C: Advanced (No Passphrase Needed)
```
Native Bun AES-256-GCM Encryption
Benefits:
- No new tools
- Stronger encryption
- Split secrets (less risky)
- Full control
```

---

## Comparison Table

| Solution | Complexity | Security | Team-Friendly | GitHub Ready | No Extra Tools |
|----------|-----------|----------|---------------|--------------|------------------|
| Current (GitHub Secrets only) | ⭐ | ⭐⭐⭐ | ✅ | ✅ | ✅ |
| **GPG** | ⭐⭐ | ⭐⭐⭐⭐ | ✅ | ✅ | ✅ |
| Bun Native Crypto | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⚠️ | ✅ | ✅ |
| dotenv-enc | ⭐ | ⭐⭐⭐ | ✅ | ✅ | ❌ |
| HashiCorp Vault | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ❌ |
| Sealed Secrets | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ | ⚠️ | ❌ |

---

## Quick Implementation: GPG (Recommended)

### Step 1: Generate GPG Key
```bash
gpg --quick-gen-key "CSUN Baseball Team <team@csun.edu>" rsa2048 encr 0
```

### Step 2: Encrypt API Key
```bash
echo "AIzaSyCVzfl4RjTtr1k6A3wiASsrvQEyCtApERs" | gpg --armor --symmetric --output .env.secret.asc
# Enter passphrase when prompted
```

### Step 3: Commit Encrypted File
```bash
git add .env.secret.asc
git commit -m "Add encrypted API key"
git push
```

### Step 4: Add Passphrase to GitHub Secrets
```
Settings → Secrets and variables → Actions
Name: GPG_PASSPHRASE
Value: <your passphrase>
```

### Step 5: Update build.js
```javascript
// Add at start of build.js
import { execSync } from 'child_process';

const gpgPassphrase = process.env.GPG_PASSPHRASE || '';
if (gpgPassphrase) {
  try {
    execSync(`echo "${gpgPassphrase}" | gpg --batch --yes --passphrase-fd 0 --decrypt .env.secret.asc > .env`, {
      stdio: 'pipe'
    });
    console.log('✓ API key decrypted');
  } catch (error) {
    console.error('Failed to decrypt API key');
    process.exit(1);
  }
} else {
  console.warn('⚠️  GPG_PASSPHRASE not set, using plaintext .env');
}
```

### Step 6: Update GitHub Actions
```yaml
- name: Decrypt API key
  env:
    GPG_PASSPHRASE: ${{ secrets.GPG_PASSPHRASE }}
  run: |
    echo "$GPG_PASSPHRASE" | gpg --batch --yes --passphrase-fd 0 \
      --decrypt .env.secret.asc > .env
```

---

## Key Takeaways

🔒 **Current Setup**: GitHub Secrets + Domain Restriction = Good
- Already secure for most use cases
- No additional complexity

🔐 **Better**: Add GPG Encryption
- Encrypted at rest in repository
- Passphrase in GitHub Secrets
- Team-friendly

🛡️ **Best**: Native Bun AES-256-GCM
- Strongest encryption
- No external tools
- Split secrets strategy

---

## Threat Model Comparison

| Threat | Current | + GPG | + AES-256 | Vault |
|--------|---------|-------|-----------|-------|
| GitHub Secret exposure | ❌ | ⚠️ (encrypted) | ✅ | ✅ |
| Build log exposure | ❌ | ⚠️ | ✅ | ✅ |
| Repo secret exposure | N/A | ⚠️ | ✅ | ✅ |
| Developer machine compromise | ❌ | ⚠️ | ⚠️ | ✅ |
| GitHub Action abuse | ❌ | ✅ | ✅ | ✅ |

---

## Next Steps

1. **Evaluate threats**: How valuable is your API key? Can it be rotated easily?
2. **Choose solution**: 
   - Keep current setup if: Small project, easy key rotation
   - Add GPG if: Team collaboration, want encrypted storage
   - Use AES-256 if: Maximum security, okay with complexity
3. **Implement**: Follow the quick start above
4. **Test**: Verify decryption works locally and in GitHub Actions
5. **Document**: Add instructions for team members

