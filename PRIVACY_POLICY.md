# Privacy Policy - PumpSpeak

**Last updated: October 1, 2024**

## Introduction

PumpSpeak is a Chrome extension that enables real-time voice communication between users on pump.fun token pages. This privacy policy explains how we handle your data.

## Data Collection

**PumpSpeak does NOT collect, store, or transmit any personal data to our servers.**

### What We Access

- **Microphone Access**: Only when you choose to speak (push-to-talk)
- **Current Page URL**: To detect which pump.fun coin page you're on
- **Extension Settings**: Stored locally in your browser (volume preferences)

### What We DON'T Collect

- ❌ No personal information
- ❌ No browsing history
- ❌ No audio recordings
- ❌ No user tracking
- ❌ No analytics or cookies

## Voice Communication

### Peer-to-Peer Technology

All voice communication uses **WebRTC peer-to-peer** technology:
- Audio is transmitted **directly between users**
- No audio is recorded or stored on our servers
- Our signaling server only coordinates connections (does not receive audio)

### Server Role

Our WebSocket signaling server only:
- Coordinates WebRTC connections between users
- Maintains a temporary list of users in each room
- Does NOT record, store, or have access to voice data

## Permissions

The extension requires the following permissions:

### `activeTab`
- **Purpose**: Detect when you're on a pump.fun page
- **Scope**: Only active on pump.fun domain

### `storage`
- **Purpose**: Save your volume preferences locally
- **Scope**: Stored in your browser only

### `host_permissions` for pump.fun
- **Purpose**: Inject the voice chat widget on pump.fun pages
- **Scope**: Limited to pump.fun domain only

### Microphone Permission
- **When requested**: Only when you click the push-to-talk button
- **How to revoke**: Chrome settings → Site settings → Microphone

## Data Storage

### Local Storage Only

All extension settings are stored **locally in your browser** using Chrome's `storage.sync` API:
- Volume level
- Widget state (minimized/expanded)

This data:
- Never leaves your device
- Is NOT transmitted to our servers
- Can be cleared by uninstalling the extension

### No Server-Side Storage

Our signaling server:
- Does NOT store user data
- Does NOT log conversations
- Only maintains temporary connection states
- All data is deleted when you disconnect

## Third-Party Services

### WebRTC STUN Servers

We use Google's public STUN servers for NAT traversal:
- `stun:stun.l.google.com:19302`
- `stun:stun1.l.google.com:19302`

These servers:
- Help establish peer-to-peer connections
- Do NOT receive or store audio data
- Are used by millions of WebRTC applications

**Google's STUN Privacy**: https://policies.google.com/privacy

## Security

### Secure WebSocket Connection

All signaling communication uses **WSS (WebSocket Secure)** with TLS encryption.

### No Central Audio Storage

Since audio is peer-to-peer:
- We cannot access your conversations
- No "man in the middle" recording
- No server-side audio storage

## Children's Privacy

PumpSpeak is not intended for users under 13 years old. We do not knowingly collect data from children.

## Open Source

PumpSpeak is open source:
- **GitHub**: https://github.com/pumpspeak/pumpspeak
- Anyone can audit the code
- Transparency is our priority

## Changes to This Policy

We may update this privacy policy. Changes will be posted:
- On this page
- In the extension's Chrome Web Store listing
- On our GitHub repository

## Your Rights

You have the right to:
- **Access**: Review what data is stored (locally in your browser)
- **Delete**: Uninstall the extension to remove all local data
- **Opt-out**: Simply don't use the voice chat feature

## Contact

For privacy questions or concerns:
- **Email**: yeyeLFG@gmail.com
- **GitHub Issues**: https://github.com/pumpspeak/pumpspeak/issues

## Legal Compliance

PumpSpeak complies with:
- Chrome Web Store Developer Program Policies
- WebRTC security best practices
- GDPR principles (minimal data collection)

---

**Summary**: PumpSpeak is privacy-first. We don't collect, store, or transmit your personal data. All voice is peer-to-peer. You're in control.

