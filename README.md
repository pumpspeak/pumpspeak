# 🎙️ PumpSpeak

Chrome extension for real-time voice chat on pump.fun - Talk with other holders of your favorite tokens!

## ✨ Features

- **Auto-detect** : Widget appears automatically when you visit a coin page on pump.fun
- **Auto-switch rooms** : Change coin, change room instantly  
- **WebRTC voice** : High quality P2P audio
- **Push-to-talk** : Hold SPACE to speak (or click & hold)
- **Clean UI** : Apple-inspired glassmorphism design
- **Privacy-first** : No recording, P2P connections only

## 🚀 Quick Start

### 1. Install Extension

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `pumpspeak` folder

### 2. Start Signaling Server

```bash
cd server
npm install
npm start
```

Server runs on `ws://localhost:8080` by default.

### 3. Test It!

1. Open https://pump.fun
2. Navigate to any coin page
3. Widget appears bottom-right 🎙️
4. Hold SPACE to talk!

## 💡 How It Works

1. Extension detects pump.fun coin pages
2. Auto-connects to voice room for that coin
3. WebRTC establishes P2P connections
4. Push-to-talk with SPACE bar
5. Switch coins = switch rooms automatically

## 🎨 UI/UX Design Philosophy

**Apple-inspired principles:**
- **Minimal steps** : Auto-connect, no manual setup
- **Glassmorphism** : Frosted glass effect, subtle gradients
- **Micro-interactions** : Smooth animations, visual feedback
- **One action = one click** : Push-to-talk is instant
- **Clean hierarchy** : Essential controls first, settings hidden

**What we removed:**
- ❌ Manual connect button (auto-connects now)
- ❌ Separate mic enable (mic ready on load)
- ❌ Mode switching (push-to-talk by default)
- ❌ Verbose labels (icons + tooltips)
- ❌ Complex settings (moved to popup)

**What we improved:**
- ✅ Glassmorphism design (modern, clean)
- ✅ Central push-to-talk button (main action)
- ✅ Compact volume control (quick access)
- ✅ User avatars with initials
- ✅ Speaking indicators with animations
- ✅ Minimizable widget
- ✅ Auto-connection

## 🛠️ Tech Stack

**Extension**
- Vanilla JavaScript (no framework)
- WebRTC for P2P audio
- Chrome Extension API (Manifest V3)

**Server**
- Node.js + WebSocket (ws)
- Signaling server for WebRTC coordination

**Design**
- Glassmorphism CSS
- SF Pro Display font (system)
- Subtle gradients & blur effects

## 📁 Project Structure

```
pumpspeak/
├── manifest.json       # Extension config
├── content.js         # Main widget logic + WebRTC
├── background.js      # Service worker
├── widget.css         # Glassmorphism styles
├── popup.html/js      # Settings interface
└── server/
    ├── server.js      # WebSocket signaling server
    └── package.json   # Dependencies
```

## ⚙️ Configuration

Click the extension icon to access settings:
- **Signaling Server** : WebSocket server URL
- **Auto-connect** : Connect automatically on page load
- **Default Volume** : Output volume (0-100%)

## 🔒 Privacy & Security

- **P2P audio** : Direct connections between users
- **No recording** : Audio is not stored anywhere
- **Random IDs** : Anonymous user identification
- **Permissions** : Only pump.fun and microphone access

## 🚀 Deployment

### Deploy Server (Production)

**Railway** (recommended):
1. Create account on [Railway.app](https://railway.app/)
2. New project → Connect GitHub repo
3. Root directory: `/server`
4. Deploy!

**Heroku**:
```bash
cd server
heroku create pumpspeak-server
git push heroku main
```

**VPS** (DigitalOcean, AWS):
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone & run
git clone <repo>
cd pumpspeak/server
npm install
npm install -g pm2
pm2 start server.js --name pumpspeak
pm2 startup
pm2 save
```

Update `content.js` with your production URL:
```javascript
const WS_URL = 'wss://your-server.com';
```

### Publish Extension

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay $5 one-time fee
3. Upload ZIP of extension
4. Fill in details, screenshots
5. Submit for review

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide.

## 🎯 Roadmap

- [ ] Wallet authentication (Phantom, Solflare)
- [ ] Holder verification (prove token ownership)
- [ ] Text chat alongside voice
- [ ] Recording & sharing clips
- [ ] Spatial audio (3D positioning)
- [ ] Video chat option
- [ ] Mobile support (Firefox Android)

See [FEATURES.md](FEATURES.md) for complete roadmap.

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Credits

- pump.fun community
- WebRTC contributors
- Apple for design inspiration

---

**Made with ❤️ for the pump.fun community**

Need help? Open an issue or reach out on Discord/Twitter.