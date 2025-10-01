# 🚀 PumpSpeak Deployment Guide

This guide explains how to deploy PumpSpeak on Railway and publish the extension on the Chrome Web Store.

---

## 📦 Part 1: Deploy the Server on Railway

### Step 1: Create a Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with GitHub

### Step 2: Prepare the GitHub Repository

1. **Create a new GitHub repository** (public or private)
   ```bash
   cd /Users/bassamchaouki/pumpspeak
   git init
   git add .
   git commit -m "Initial commit - PumpSpeak"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/pumpspeak.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Railway

1. On Railway, click **"Deploy from GitHub repo"**
2. Select your `pumpspeak` repository
3. Railway will automatically detect Node.js

4. **Configure the project**:
   - Click on the deployed service
   - Go to **Settings** → **Root Directory**
   - Enter: `server` (because your server is in the server/ folder)
   - Click **Save**

5. **Get your URL**:
   - Go to **Settings** → **Networking**
   - Click **Generate Domain**
   - You'll get a URL like: `pumpspeak-production.up.railway.app`
   - **COPY THIS URL** ⚠️

### Step 4: Verify Deployment

1. Open your Railway URL in the browser
2. You should see: **"PumpSpeak Signaling Server"**
3. ✅ The server is online!

---

## 🔧 Part 2: Update the Extension

### Step 1: Configure the Server URL

1. Open `config.js`
2. Replace the URL:
   ```javascript
   const PUMPSPEAK_CONFIG = {
     // Change this to your Railway URL (with wss:// not ws://)
     WS_URL: 'wss://pumpspeak-production.up.railway.app',
   };
   ```
   ⚠️ **Important**: Use `wss://` (with SSL) not `ws://`

### Step 2: Test Locally

1. Reload the extension in Chrome:
   - `chrome://extensions/`
   - Click 🔄 for PumpSpeak

2. Go to `pump.fun` and test a coin
3. The widget should connect to the Railway server!

---

## 🏪 Part 3: Publish on Chrome Web Store

### Prerequisites

1. **Google Developer Account** ($5 one-time fee)
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay the $5 registration fee

2. **Required Assets**:
   - ✅ Icons (already created: 16x16, 48x48, 128x128)
   - ⬜ Screenshots (1280x800 or 640x400) - minimum 1, maximum 5
   - ⬜ Small promotional tile (440x280) - optional
   - ⬜ Extension description
   - ⬜ Privacy policy

### Step 1: Create the .zip Package

```bash
cd /Users/bassamchaouki/pumpspeak

# Create a zip with only the extension files
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

### Step 2: Upload the Extension

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **"New Item"**
3. Upload the `pumpspeak-extension.zip` file
4. Fill in the information:

#### Basic Information

**Name**: PumpSpeak

**Summary** (132 characters max):
```
Voice chat for pump.fun traders. Talk with other holders directly on token pages with push-to-talk functionality.
```

**Detailed Description**:
```
PumpSpeak brings real-time voice communication to pump.fun token pages.

✨ Features:
• Automatic room creation for each token
• Push-to-talk (Space bar or click)
• Glassmorphism Apple-style UI
• See who's in the room in real-time
• Volume controls
• Minimal and elegant design

🎯 How it works:
1. Install the extension
2. Visit any token page on pump.fun
3. The voice chat widget appears automatically
4. Hold SPACE or click the button to talk
5. Connect with other holders instantly

Perfect for traders who want to discuss tokens in real-time without leaving the chart.

Privacy: All voice data is peer-to-peer (WebRTC). No voice is recorded or stored.
```

**Category**: Social & Communication

**Language**: English

#### Screenshots

You need to create **at least 1 screenshot** (1280x800 or 640x400):
- Capture the widget on a pump.fun page
- Show the interface with connected users
- Show push-to-talk in action

#### Privacy Policy

Create a simple page (can be a GitHub Gist or HTML page):

```markdown
# Privacy Policy - PumpSpeak

Last updated: [Date]

## Data Collection
PumpSpeak does NOT collect, store, or transmit any personal data.

## Voice Communication
- All voice communication uses peer-to-peer WebRTC technology
- No audio is recorded or stored on our servers
- The signaling server only coordinates connections between users

## Permissions
The extension requires:
- Access to pump.fun: To inject the voice chat widget
- Microphone access: For voice communication (only when you choose to speak)

## Contact
For questions: [your-email@example.com]
```

Upload this URL in the "Privacy Policy" field

### Step 3: Submit for Review

1. Fill in all required fields
2. Click **"Submit for Review"**
3. Review typically takes **1-3 days**

---

## ✅ Final Checklist

Before publishing:

- [ ] Server deployed on Railway and functional
- [ ] `config.js` updated with Railway URL (wss://)
- [ ] Extension tested with production server
- [ ] Chrome Developer account created ($5 paid)
- [ ] At least 1 quality screenshot
- [ ] Complete description
- [ ] Privacy policy published
- [ ] .zip package created
- [ ] Extension uploaded to Chrome Web Store

---

## 🆘 Troubleshooting

### Widget doesn't connect to Railway server

1. Check that the URL in `config.js` uses `wss://` (not `ws://`)
2. Verify that the Railway domain is correct
3. Open Chrome console (F12) to see errors

### Railway shows "Application Error"

1. Go to Railway logs
2. Verify that `Root Directory` is set to `server`
3. Check that `package.json` and `server.js` are in the `server/` folder

### Chrome Web Store rejects the extension

Common reasons:
- Missing privacy policy
- Poor quality screenshots
- Unclear description
- Unjustified permissions

---

## 🎉 You're Done!

Once approved, your extension will be available at:
`https://chrome.google.com/webstore/detail/[your-extension-id]`

You can share this link for people to install PumpSpeak! 🚀
