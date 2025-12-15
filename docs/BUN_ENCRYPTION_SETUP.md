# Bun AES-256-GCM API Key Encryption Setup

This guide walks you through implementing **native Bun AES-256-GCM encryption** for your Google Maps API key.

## Why This Approach?

✅ **Strongest encryption** - AES-256-GCM with 310,000 PBKDF2 iterations (OWASP 2025 standard)
✅ **No external dependencies** - Uses Bun's native Web Crypto API
✅ **Split secrets** - Encrypted file in repo + password in GitHub Secrets (two secrets = safer)
✅ **Works locally and in CI/CD** - Automatic fallback from plaintext to encrypted

---

## Quick Start (5 minutes)

### Step 1: Run Encryption Script

```bash
cd frontend/scripts
bun encrypt-key.ts
```

Follow the prompts:
- Paste your Google Maps API key
- Enter a strong password (min 12 characters)
- Confirm password

This creates `.env.encrypted` file.

### Step 2: Commit Encrypted File

```bash
cd ../..
git add frontend/.env.encrypted
git commit -m "Add AES-256-GCM encrypted API key"
git push
```

### Step 3: Add Password to GitHub Secrets

1. Go to: https://github.com/jag18729/GoogleMapsAPI/settings/secrets/actions
2. Click "New repository secret"
3. **Name:** `ENCRYPTION_PASSWORD`
4. **Value:** The password you entered in Step 1
5. Click "Add secret"

### Step 4: Verify It Works

```bash
# Build locally (uses plaintext .env)
cd frontend
bun run build.js
# Should show: "📝 Loading API key from .env (local development)..."

# Next GitHub push will decrypt with ENCRYPTION_PASSWORD
git push
```

Done! 🎉

---

## How It Works

### Local Development
```
.env (plaintext)
  ↓
build.js detects no ENCRYPTION_PASSWORD
  ↓
Reads from .env (local file)
  ↓
Builds with plaintext API key
```

### GitHub Actions (CI/CD)
```
ENCRYPTION_PASSWORD from GitHub Secrets
  ↓
build.js detects ENCRYPTION_PASSWORD env var
  ↓
Reads .env.encrypted
  ↓
Decrypts with AES-256-GCM + password
  ↓
Builds with decrypted API key
  ↓
Deploys to GitHub Pages
```

---

## Technical Details

### Encryption Algorithm
- **Cipher:** AES-256-GCM (Galois/Counter Mode)
- **Key Derivation:** PBKDF2 with SHA-256
- **Iterations:** 310,000 (OWASP 2025 recommendation)
- **Key Size:** 256 bits
- **IV Size:** 12 bytes (96 bits)
- **Salt Size:** 16 bytes (128 bits)

### File Format
```
.env.encrypted contains (base64 encoded):
[salt (16 bytes)][iv (12 bytes)][ciphertext]
```

Each time you encrypt, new random salt and IV are generated → same password produces different output (good for security)

### Decryption Process
1. Decode from base64
2. Extract salt (first 16 bytes)
3. Extract IV (next 12 bytes)
4. Extract ciphertext (remaining bytes)
5. Derive AES key from password using same salt & iterations
6. Decrypt ciphertext using AES-256-GCM

---

## Files Added/Modified

### New Files
- `frontend/scripts/encrypt-key.ts` - Interactive encryption script
- `frontend/scripts/decrypt-key.ts` - Decryption helper (not actively used, reference only)
- `frontend/.env.encrypted` - Your encrypted API key (safe to commit!)

### Modified Files
- `frontend/build.js` - Added decryption logic
- `.github/workflows/deploy.yml` - Passes ENCRYPTION_PASSWORD to build

---

## Security Considerations

### ✅ What's Protected
- **At rest in repository** - Encrypted file is useless without password
- **In GitHub Actions logs** - Password is masked, encrypted file doesn't decrypt without it
- **From accidental commits** - Even if someone gets the encrypted file, password is in Secrets

### ⚠️ What's NOT Protected
- **In the browser** - API key must be sent plaintext to Google (can't avoid this)
- **In GitHub Secrets** - GitHub employees could theoretically access them (standard risk)
- **On your local machine** - If developer machine is compromised, plaintext .env is exposed (standard risk)

### 🔒 Best Practices
1. **Use strong password** (min 12 chars, mix case, numbers, symbols)
2. **Don't share password** outside GitHub Secrets
3. **Rotate password yearly**
4. **Rotate API key quarterly**
5. **Monitor API usage** in Google Cloud Console
6. **Use domain restrictions** in Google Cloud (most important!)

---

## Troubleshooting

### "API key validation passed but build failed"
```bash
# Check if .env.encrypted exists
ls -la frontend/.env.encrypted

# Verify encryption password is set in GitHub Secrets
# Go to Settings → Secrets and check ENCRYPTION_PASSWORD exists
```

### "Decryption failed in GitHub Actions"
1. **Check password matches** - Re-run encrypt script if unsure
2. **Check .env.encrypted is committed** - Must exist in repo
3. **Check GitHub Secrets** - ENCRYPTION_PASSWORD must be exactly as set

### "Decryption works in Actions but local build fails"
1. **Check .env exists locally** - Build should use plaintext .env locally
2. **Verify ENCRYPTION_PASSWORD not set locally** - Should be empty for local dev
   ```bash
   echo $ENCRYPTION_PASSWORD  # Should be empty
   ```

### "Want to use a different password"
```bash
# Delete old encrypted file
rm frontend/.env.encrypted

# Re-run encryption with new password
cd frontend/scripts
bun encrypt-key.ts

# Update GitHub Secrets with new password
# Settings → Secrets → ENCRYPTION_PASSWORD (edit)
```

---

## Encryption vs. GitHub Secrets

You might wonder: "Why not just use GitHub Secrets instead of encryption?"

**GitHub Secrets (current):**
- ✅ Simple, no extra work
- ✅ Secure (GitHub encrypts them)
- ❌ Not visible in git history
- ❌ Can't audit changes
- ❌ Single point of failure (just a string)

**AES-256-GCM Encryption (new):**
- ✅ Two-factor defense (file + password)
- ✅ Can commit to git history
- ✅ Audit trail of encrypted values
- ✅ Password can be rotated independently
- ❌ Extra setup complexity
- ❌ Still need GitHub Secrets for password

**Recommendation:** Use encryption if:
- Working in a team with multiple developers
- Need audit trail of secret changes
- Want encryption at rest as extra layer

Keep plaintext secrets if:
- Solo project
- Quick turnaround
- GitHub Secrets sufficient for your threat model

---

## Advanced: Rotating API Key

When you need to rotate your Google Maps API key:

1. **Generate new key** in Google Cloud Console
2. **Re-encrypt with new key:**
   ```bash
   cd frontend/scripts
   bun encrypt-key.ts
   # Enter new API key and same password
   ```
3. **Commit updated file:**
   ```bash
   git add frontend/.env.encrypted
   git commit -m "Rotate Google Maps API key"
   git push
   ```
4. **Disable old key** in Google Cloud Console
5. **Update local .env** with new API key

---

## Advanced: Changing Password

If you want to change the encryption password:

1. **Note current password** (from GitHub Secrets)
2. **Decrypt with old password:**
   ```bash
   # Manually decrypt (for reference):
   ENCRYPTION_PASSWORD=oldpassword bun frontend/scripts/decrypt-key.ts
   ```
3. **Run encryption with new password:**
   ```bash
   cd frontend/scripts
   bun encrypt-key.ts
   # Enter same API key but new password
   ```
4. **Update GitHub Secrets** with new password
5. **Test deployment** by pushing to main

---

## File Structure

```
frontend/
├── .env                          # Plaintext (local only, gitignored)
├── .env.encrypted                # Encrypted (committed to repo)
├── build.js                      # Updated with decryption logic
├── scripts/
│   ├── encrypt-key.ts            # Run this to encrypt
│   └── decrypt-key.ts            # Reference implementation
└── src/
    ├── index.html
    ├── css/
    ├── js/
    └── ...

.github/workflows/
└── deploy.yml                    # Updated to pass ENCRYPTION_PASSWORD
```

---

## Verification Checklist

- [ ] `frontend/.env.encrypted` created and committed
- [ ] `ENCRYPTION_PASSWORD` added to GitHub Secrets
- [ ] `build.js` updated with decryption function
- [ ] `.github/workflows/deploy.yml` passes ENCRYPTION_PASSWORD
- [ ] Local build works with plaintext `.env`
- [ ] GitHub Actions build succeeds (check logs)
- [ ] Deployed site loads correctly
- [ ] API key works on live site

---

## Questions?

**Can I see the decryption code?**
Yes, it's in `build.js` - uses standard Web Crypto API, fully transparent.

**Is password ever leaked?**
No - password is masked in GitHub Actions logs, only used to derive key.

**Can someone use the encrypted file without password?**
No - AES-256-GCM provides authenticated encryption, attempts to decrypt without correct password fail.

**Do I need to re-encrypt if I change the password?**
No - same encrypted file works with different passwords... actually no, you'd need to re-encrypt with new password.

**Should I commit `.env`?**
No - keep `.env` in `.gitignore`, only commit `.env.encrypted`

---

## Resources

- [Bun Web Crypto API](https://bun.com/docs/runtime/web-crypto)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [AES-GCM Best Practices](https://crypto.stackexchange.com/questions/26783/how-to-choose-an-aes-encryption-mode-cbc-ebc-ctr-ocb-cfb)
- [PBKDF2 RFC 2898](https://tools.ietf.org/html/rfc2898)

