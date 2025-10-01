# 🚀 PumpSpeak Deployment Steps

## 📝 Pre-Start Checklist

- [ ] New GitHub account created OR organization created
- [ ] Empty GitHub repository created
- [ ] Git configured locally

---

## 1️⃣ Push Code to GitHub (3 min)

### If Git is not yet initialized:

```bash
cd /Users/bassamchaouki/pumpspeak

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "PumpSpeak v1.0 - Production ready"

# Add remote (replace YOUR_USERNAME with your new account/org)
git remote add origin https://github.com/YOUR_USERNAME/pumpspeak.git

# Create main branch and push
git branch -M main
git push -u origin main
```

### If you already have commits:

```bash
cd /Users/bassamchaouki/pumpspeak

# Just add the new remote
git remote add origin https://github.com/YOUR_USERNAME/pumpspeak.git

# Push
git push -u origin main
```

---

## 2️⃣ Deploy on Railway (5 min)

### A. Create the Project

1. **Go to** → https://railway.app
2. **Click** → "Login with GitHub"
3. **Sign in** with your new GitHub account (or account with the organization)
4. **Authorize Railway** to access the repo

### B. Deploy the Server

1. **Click** → "New Project"
2. **Select** → "Deploy from GitHub repo"
3. **Choose** → `pumpspeak` (your repo)
4. Railway will start deploying automatically

### C. Configure Root Directory

⚠️ **IMPORTANT**: Railway needs to know that the server is in the `server/` folder

1. Click on the deployed service
2. **Settings** → **General** → Scroll to "Root Directory"
3. Enter: `server`
4. **Save Changes**
5. Railway will automatically redeploy

### D. Generate Public Domain

1. In your project → **Settings**
2. **Networking** → **Public Networking**
3. **Generate Domain**
4. Railway generates a URL like: `pumpspeak-production-xxxx.up.railway.app`
5. ✅ **COPY THIS URL!**

### E. Verify Deployment

1. **Open the URL** in your browser
2. You should see: **"PumpSpeak Signaling Server"**
3. ✅ The server is online!

To view logs:
- Railway Dashboard → your project → **Deployments** → **View Logs**

---

## 3️⃣ Update the Extension (2 min)

### A. Modify config.js

Open `config.js` and replace the URL:

```javascript
// PumpSpeak Configuration
const PUMPSPEAK_CONFIG = {
  // Production URL from Railway (IMPORTANT: use wss:// not ws://)
  WS_URL: 'wss://pumpspeak-production-xxxx.up.railway.app',
};
```

⚠️ **Critical points**:
- ✅ Use `wss://` (WebSocket Secure) NOT `ws://`
- ✅ Don't forget to replace with your exact Railway URL
- ✅ No trailing `/` at the end of the URL

### B. Test Locally

1. **Reload the extension**:
   - Open Chrome → `chrome://extensions/`
   - Find PumpSpeak
   - Click 🔄 (reload)

2. **Test on pump.fun**:
   - Go to any coin
   - The widget should appear
   - Open console (F12):
     - You should see `PumpSpeak: Connected to signaling server`
   - ✅ It works!

### C. Commit the Changes

```bash
cd /Users/bassamchaouki/pumpspeak

git add config.js
git commit -m "Update production WebSocket URL"
git push
```

---

## 4️⃣ Prepare for Chrome Web Store (Optional - Later)

You can do this later, but here are the necessary assets:

### Required Assets:

1. **Icons** ✅ (already done)
   - 16x16, 48x48, 128x128

2. **Screenshots** (to do)
   - Size: 1280x800 or 640x400
   - Number: 1 minimum, 5 maximum
   - Content: Widget on pump.fun, interface, users

3. **Description** ✅ (already prepared in DEPLOYMENT_GUIDE.md)

4. **Privacy Policy** (to create)
   - Can be a GitHub page or simple site
   - Template available in DEPLOYMENT_GUIDE.md

5. **Package .zip**
   ```bash
   cd /Users/bassamchaouki/pumpspeak
   
   zip -r pumpspeak-extension.zip \
     manifest.json \
     content.js \
     config.js \
     background.js \
     popup.html \
     popup.js \
     widget.css \
     icons/
   ```

---

## ✅ Final Verification

Before publishing, check:

- [ ] Railway server working (URL accessible)
- [ ] Extension connected to production server
- [ ] Tested on multiple pump.fun coins
- [ ] Tested with multiple users (open multiple browsers)
- [ ] No errors in Chrome console
- [ ] WebRTC working (you hear other users)

---

## 🆘 Troubleshooting

### Widget doesn't connect

1. **Chrome Console** (F12):
   - Look for WebSocket errors
   - Verify the URL is correct

2. **Railway Logs**:
   - Dashboard → Deployments → View Logs
   - Look for "New WebSocket connection"

3. **Checks**:
   - [ ] URL in `config.js` uses `wss://` (not `ws://`)
   - [ ] Root Directory = `server` in Railway
   - [ ] Extension reloaded after modifying config.js

### Railway shows "Application Error"

1. **Check logs** → Railway Dashboard → View Logs
2. **Verify** that `server/package.json` exists
3. **Verify** that Root Directory = `server`
4. **Redeploy** manually if needed

---

## 🎉 You're Done!

Your extension is now connected to a production server!

**Next steps**:
1. Test with friends
2. Prepare screenshots
3. Publish on Chrome Web Store (when ready)

---

**Need help?** Consult:
- `RAILWAY_QUICKSTART.md` - Quick guide
- `DEPLOYMENT_GUIDE.md` - Complete Chrome Web Store guide
