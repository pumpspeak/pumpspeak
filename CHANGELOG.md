# Changelog - PumpSpeak

All notable changes to this project will be documented in this file.

## [1.0.2] - 2025-11-03

### 🔧 Fixed
- **Session Management**: Implemented persistent userId system across browser tabs and sessions
  - userId is now generated once during installation and persists across browser restarts
  - All tabs share the same userId for consistent user identification
  - Better handling of reconnections and room switches
  - Backward compatibility: existing installations will auto-generate userId on update

### 🔄 Changed
- `background.js`: Added userId generation in `onInstalled` handler
- `content.js`: 
  - Added `getOrCreateUserId()` method to VoiceClient class
  - Updated `connect()` to load userId from storage before connecting
  - Enhanced `switchRoom()` and `leaveRoom()` with better cleanup
  - userId is now loaded from `chrome.storage.local` instead of random generation per tab

### 📝 Technical Details
- userId format: `user_[random_9_chars]`
- Storage: `chrome.storage.local` (persistent across sessions, shared across tabs)
- Upgrade path: Existing users will get a userId generated on first launch after update

---

## [1.0.1] - 2025-11-02

### 🚀 Initial Chrome Web Store Release
- Deployed production server on Railway
- Updated WebSocket URL to production endpoint
- Fixed widget visibility on pump.fun pages

---

## [1.0.0] - 2025-11-01

### 🎉 Initial Release

### ✨ Features
- **Auto-detection**: Automatically detects pump.fun token pages
- **Push-to-talk**: Hold SPACE bar or click & hold to speak
- **WebRTC Voice**: High-quality peer-to-peer audio
- **Auto-room switching**: Changes room when you navigate to different tokens
- **Glassmorphism UI**: Beautiful Apple-inspired design
- **Volume control**: Adjustable audio volume
- **Minimizable widget**: Clean, non-intrusive interface
- **Privacy-first**: No recording, no data collection

### 🛠️ Technical
- Manifest V3 Chrome Extension
- WebSocket signaling server for WebRTC coordination
- Real-time speaking detection
- Multi-peer support with automatic connection management

