# ⚡ Railway Deployment - Quick Start

## 🚀 Deploy in 5 Minutes

### 1️⃣ Push Your Code to GitHub

```bash
cd /Users/bassamchaouki/pumpspeak
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/pumpspeak.git
git push -u origin main
```

### 2️⃣ Deploy on Railway

1. **Go to** → https://railway.app
2. **Login with GitHub**
3. **Click** → "New Project" → "Deploy from GitHub repo"
4. **Select** → your `pumpspeak` repo
5. **Settings** → Root Directory → Enter `server` → Save

### 3️⃣ Get Your URL

1. **Settings** → **Networking** → **Generate Domain**
2. **Copy the URL**: `https://your-app.railway.app`

### 4️⃣ Update the Extension

Open `config.js` and replace:

```javascript
const PUMPSPEAK_CONFIG = {
  WS_URL: 'wss://your-app.railway.app',  // ⚠️ Use wss:// (not ws://)
};
```

### 5️⃣ Test

1. Reload the extension: `chrome://extensions/` → 🔄
2. Go to pump.fun
3. The widget should connect! ✅

---

## 🔍 Verify It's Working

- **Server**: Open `https://your-app.railway.app` → you should see "PumpSpeak Signaling Server"
- **Logs**: Railway → your project → Deployments → View Logs
- **Chrome Console**: F12 → Console → look for "PumpSpeak: Connected"

---

## 💡 Tips

### View Real-Time Logs
```
Railway Dashboard → your project → Deployments → View Logs
```

### Redeploy After Changes
```bash
git add .
git commit -m "Update"
git push
```
Railway automatically redeploys!

### Environment Variables
Railway automatically adds `PORT`. You don't need to configure anything! 🎉

---

## ⚠️ Important Points

1. **Always use `wss://`** (WebSocket Secure) in production
2. **Root Directory must be `server`** in Railway Settings
3. **Test before publishing** on Chrome Web Store

---

Need help? Check `DEPLOYMENT_GUIDE.md` for the complete guide!
