# 🏪 Chrome Web Store Submission Guide

## 📋 Checklist Before Submitting

- [x] Extension package created: `pumpspeak-extension-v1.0.0.zip`
- [x] Privacy policy created: `PRIVACY_POLICY.md`
- [x] Production server deployed: `wss://pumpspeak-production.up.railway.app`
- [ ] Chrome Developer account ($5 one-time fee)
- [ ] Screenshots created (minimum 1)
- [ ] Extension tested and working

---

## 🔗 Step 1: Create Chrome Developer Account

1. Go to: https://chrome.google.com/webstore/devconsole
2. Sign in with your Google account (yeyeLFG@gmail.com)
3. Pay the **$5 one-time registration fee**
4. Accept the Developer Agreement

---

## 📦 Step 2: Submit Extension

### Upload Package

1. Click **"New Item"**
2. Upload: `pumpspeak-extension-v1.0.0.zip`
3. Wait for upload to complete

---

## ✍️ Step 3: Fill Extension Information

### 📝 Basic Information

#### Extension Name
```
PumpSpeak
```

#### Summary (132 characters max)
```
Voice chat for pump.fun traders. Talk with other holders directly on token pages with push-to-talk.
```

#### Description (Detailed)
```
🎙️ PumpSpeak - Voice Chat for pump.fun Token Holders

Connect and communicate with other holders in real-time while browsing pump.fun token pages.

✨ KEY FEATURES

• Automatic Room Creation
  Each token page has its own dedicated voice room. Join automatically when you visit a coin.

• Push-to-Talk
  Hold SPACE bar or click & hold to speak. Simple, clean, no setup required.

• Real-Time User List
  See who's in the room and who's speaking with visual indicators.

• Privacy First
  All voice data is peer-to-peer (WebRTC). No recording, no storage, no tracking.

• Instant Room Switching
  Navigate to a different coin? Room changes automatically.


🎯 HOW IT WORKS

1. Install PumpSpeak
2. Visit any token page on pump.fun
3. Voice chat widget appears automatically (bottom-right)
4. Hold SPACE to talk with other holders
5. Switch coins = switch rooms instantly


🔒 PRIVACY & SECURITY

• No data collection
• Peer-to-peer voice (WebRTC)
• No audio recording
• Open source on GitHub
• Secure WebSocket connections


💡 PERFECT FOR

• Traders discussing market moves in real-time
• Holders coordinating strategies
• Community building around tokens
• Quick voice chats without leaving the chart


📱 TECHNICAL DETAILS

• Built with modern WebRTC technology
• Manifest V3 Chrome Extension
• Minimal permissions (only pump.fun domain)
• Microphone access only when you choose to speak
• Settings: Adjustable volume, minimizable widget


🌐 OPEN SOURCE

PumpSpeak is fully open source:
GitHub: https://github.com/pumpspeak/pumpspeak

Audit the code, contribute features, report bugs!


📞 SUPPORT

• GitHub Issues: https://github.com/pumpspeak/pumpspeak/issues
• Email: yeyeLFG@gmail.com


Start talking with your fellow holders today! 🚀
```

#### Category
```
Social & Communication
```

#### Language
```
English
```

---

## 🖼️ Step 4: Visual Assets

### Screenshots (REQUIRED - Minimum 1, Maximum 5)

**Recommended sizes:**
- 1280x800 (16:10 ratio)
- 640x400 (alternative)

**What to capture:**
1. **Main screenshot**: Widget open on a pump.fun coin page
   - Show the glassmorphism UI
   - Show user list with 2-3 users
   - Show the push-to-talk button

2. **Settings screenshot**: Extension popup with volume control
   - Clean, simple settings interface

3. **In-action screenshot**: Push-to-talk button pressed (glowing)
   - Show speaking indicator active

4. **Minimized state**: Widget minimized showing user count badge

**Tips:**
- Use a popular coin page for screenshots
- Make sure UI looks clean
- No NSFW content or offensive language
- Good lighting and clarity

### Icon (Already created ✅)
- 128x128px: `icons/icon128.png`

### Small Promotional Tile (Optional but recommended)
- 440x280px
- Can create with Canva/Figma
- Show: Logo + "Voice Chat for pump.fun"

---

## 🔐 Step 5: Privacy & Permissions

### Privacy Policy URL
```
https://raw.githubusercontent.com/pumpspeak/pumpspeak/main/PRIVACY_POLICY.md
```

Or host on GitHub Pages / your website.

### Permissions Justification

**When asked why you need each permission:**

#### `activeTab`
```
Required to detect when the user is on a pump.fun token page and to inject the voice chat widget.
```

#### `storage`
```
Used to save user preferences (volume level) locally in the browser.
```

#### `scripting`
```
Necessary to inject the voice chat widget into pump.fun pages.
```

#### `host_permissions` (pump.fun)
```
Required to access pump.fun domain to display the voice chat widget on token pages.
```

#### Microphone (via WebRTC)
```
Enables voice communication between users. Only activated when the user presses push-to-talk. No audio is recorded or stored.
```

---

## 🎯 Step 6: Single Purpose

### Single Purpose Description
```
Enable real-time voice communication between users on pump.fun token pages through a peer-to-peer voice chat widget.
```

---

## 🌐 Step 7: Optional Information

### Website
```
https://github.com/pumpspeak/pumpspeak
```

### Support Email
```
yeyeLFG@gmail.com
```

### YouTube Demo Video (Optional but recommended)
Create a 30-60 second demo showing:
1. Opening pump.fun
2. Widget appearing
3. Push-to-talk in action
4. Switching between coins

---

## ✅ Step 8: Review Checklist

Before submitting, verify:

- [ ] All required fields filled
- [ ] At least 1 screenshot uploaded
- [ ] Privacy policy URL provided
- [ ] Permissions justified
- [ ] Extension tested on a fresh Chrome profile
- [ ] No console errors
- [ ] Extension works with production server
- [ ] Description is clear and accurate

---

## 🚀 Step 9: Submit for Review

1. Click **"Submit for Review"**
2. Review typically takes **1-3 days**
3. You'll receive an email when reviewed

### Possible Review Outcomes

#### ✅ Approved
- Extension goes live immediately
- Available at: `https://chrome.google.com/webstore/detail/[your-extension-id]`

#### ⚠️ Needs Changes
Common requests:
- Better screenshots
- More detailed privacy policy
- Clearer permission justifications
- Remove unused permissions

#### ❌ Rejected
Common reasons:
- Missing privacy policy
- Misleading description
- Violates policies
- Doesn't work as described

---

## 📊 After Publication

### Promotion Checklist

- [ ] Tweet the launch with demo video
- [ ] Post on Reddit (r/solana, r/CryptoCurrency)
- [ ] Share on Discord communities
- [ ] Product Hunt launch
- [ ] Update GitHub README with store link

### Monitor Metrics

Track in Chrome Web Store Developer Dashboard:
- Installations
- Weekly users
- Reviews and ratings
- User feedback

---

## 🔄 Publishing Updates

To update the extension:

1. Update version in `manifest.json` (e.g., 1.0.0 → 1.1.0)
2. Create new ZIP package
3. Upload to Chrome Web Store
4. Users receive update automatically within 24-48h

---

## 📞 Support Resources

- **Chrome Web Store Policies**: https://developer.chrome.com/docs/webstore/program-policies/
- **Developer Dashboard**: https://chrome.google.com/webstore/devconsole
- **Extension Best Practices**: https://developer.chrome.com/docs/extensions/mv3/
- **Support**: chromewebstore-support@google.com

---

## 🎉 You're Ready!

You have everything you need:
- ✅ Package: `pumpspeak-extension-v1.0.0.zip`
- ✅ Privacy Policy: `PRIVACY_POLICY.md`
- ✅ Store Information: Above
- ✅ Production Server: Running on Railway

**Next:** Create screenshots and submit! 🚀

Good luck! 🍀

