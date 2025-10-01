# 🚀 Quick Start - PumpSpeak

Get PumpSpeak running locally in 5 minutes!

## 1️⃣ Start the Server (Terminal)

```bash
cd server
npm install
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   PumpSpeak Signaling Server           ║
║   Port: 8080                           ║
║   Status: Running                      ║
╚════════════════════════════════════════╝
```

## 2️⃣ Load Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the folder `/Users/bassamchaouki/pumpspeak`

PumpSpeak extension should appear! 🎉

## 3️⃣ Create Icons (if needed)

If icons are missing, open in browser:
```bash
open create-icons.html
```

Click "Download all icons" and save them to `icons/` folder.

Or use ImageMagick:
```bash
brew install imagemagick
convert -size 16x16 xc:#6366F1 icons/icon16.png
convert -size 48x48 xc:#6366F1 icons/icon48.png
convert -size 128x128 xc:#6366F1 icons/icon128.png
```

## 4️⃣ Test the Extension

1. Open https://pump.fun in a new tab
2. Navigate to any coin page
3. PumpSpeak widget appears bottom-right! 🎙️

## 5️⃣ Test with Multiple Users

**Option A: Two Chrome windows**
- Normal window + Incognito window (Cmd+Shift+N)
- Same coin page in both

**Option B: Two different browsers**
- Chrome + Firefox/Edge
- Same coin page in both

**In each window:**
- Widget auto-connects
- Hold SPACE to talk
- See each other in user list! 🔊

## 🐛 Troubleshooting

### Widget doesn't appear
```bash
# Check URL format (must be a coin page)
# Expected: https://pump.fun/coin/[ADDRESS]
# or: https://pump.fun/[path]/[ADDRESS]
```

### Connection error
```bash
# Verify server is running
# Terminal should show: "Status: Running"

# Check server URL in settings
# Click extension icon → should be "ws://localhost:8080"
```

### No audio
```bash
# Check mic permissions
# Chrome > Settings > Privacy > Microphone
# Allow pump.fun

# Test your mic
# chrome://settings/content/microphone
```

### Console errors
```bash
# Open developer console
# F12 or Cmd+Option+I (Mac)
# Console tab
# Look for PumpSpeak messages
```

## 📝 Useful Commands

```bash
# Server logs in real-time
cd server
npm start

# Auto-reload server on changes
npm run dev

# Check if server is running
lsof -i :8080

# Stop server
lsof -ti:8080 | xargs kill
```

## 🎨 Quick Customization

### Change Colors

Edit `widget.css`:
```css
/* Line ~39 - Gradient */
background: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
```

### Change Server Port

Edit `server/server.js`:
```javascript
const PORT = 3000; // instead of 8080
```

Don't forget to update in extension settings too!

## ✅ Test Checklist

- [ ] Server starts without errors
- [ ] Extension loads in Chrome
- [ ] Widget appears on pump.fun
- [ ] Auto-connects to server
- [ ] Mic access granted
- [ ] Audio between 2 users works
- [ ] Changing coin changes room
- [ ] Push-to-talk (SPACE) works
- [ ] Volume adjustable
- [ ] User list shows all users

## 🎯 Next Steps

Once everything works locally:

1. Read the full [README.md](README.md)
2. Check [DEPLOYMENT.md](DEPLOYMENT.md) for production
3. Customize UI and icons
4. Add your own features!

## 💬 Need Help?

- Check server logs in terminal
- Check browser console (F12)
- Open an issue on GitHub
- Re-read this guide step by step

Happy coding! 🚀