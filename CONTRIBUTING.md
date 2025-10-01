# 🤝 Contributing to PumpSpeak

Thank you for your interest in contributing to PumpSpeak! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Project Setup](#project-setup)
- [Architecture](#architecture)
- [Code Guidelines](#code-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a code of conduct. By participating, you agree to uphold this code.

## How to Contribute

There are several ways to contribute to PumpSpeak:

### 🐛 Report Bugs

- Use GitHub Issues
- Check that the bug hasn't already been reported
- Include steps to reproduce
- Add screenshots if relevant
- Mention your browser and OS

### 💡 Suggest Features

- Open an issue with the `enhancement` tag
- Describe the use case
- Explain why this feature would be useful

### 🔧 Submit Changes

1. Fork the repo
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Project Setup

### Prerequisites

- Node.js 14+
- Chrome/Chromium
- Git

### Installation

```bash
# Clone the repo
git clone https://github.com/pumpspeak/pumpspeak.git
cd pumpspeak

# Install server dependencies
cd server
npm install

# Return to root
cd ..
```

### Running in Development

```bash
# Terminal 1: Server
cd server
npm run dev

# Load the extension in Chrome
# chrome://extensions/ > Developer mode > Load unpacked extension
```

## Architecture

### Project Structure

```
pumpspeak/
├── manifest.json          # Chrome Extension config
├── content.js            # Script injected into pump.fun
│   ├── PumpSpeakWidget   # Widget UI class
│   └── VoiceClient       # WebRTC client
├── background.js         # Service Worker
├── popup.html/js         # Settings interface
├── widget.css           # Styles
└── server/
    └── server.js        # WebSocket signaling server
```

### Data Flow

1. **Detection**: `content.js` detects pump.fun URL and extracts coin ID
2. **UI**: Widget displays with controls
3. **Connection**: WebSocket to signaling server
4. **Signaling**: Exchange of SDP offers/answers via server
5. **WebRTC**: Direct P2P connections for audio

## Code Guidelines

### JavaScript

- Use ES6+ (const/let, arrow functions, async/await)
- Comment complex functions
- camelCase naming
- PascalCase for classes

```javascript
// ✅ Good
const userName = 'Alice';
async function connectToRoom(roomId) { ... }
class VoiceClient { ... }

// ❌ Bad
var user_name = 'Alice';
function connect_to_room(room_id) { ... }
class voiceClient { ... }
```

### CSS

- BEM naming for classes
- `ps-` prefix to avoid conflicts
- CSS variables for colors

```css
/* ✅ Good */
.ps-widget { }
.ps-widget__header { }
.ps-widget__header--collapsed { }

/* ❌ Bad */
.widget { }
.header { }
.collapsed { }
```

### Git

- Descriptive commits in English
- Format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`

```bash
# ✅ Good
git commit -m "feat: add push-to-talk mode"
git commit -m "fix: widget not showing on some pages"
git commit -m "docs: update README with deployment steps"

# ❌ Bad
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

## Pull Request Process

### Checklist Before Submitting

- [ ] Code works locally
- [ ] Tested on Chrome (latest version)
- [ ] No errors in console
- [ ] Code commented if complex
- [ ] README updated if necessary
- [ ] No unnecessary `console.log` statements

### PR Template

```markdown
## Description
Describe your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
1. Step 1
2. Step 2
3. ...

## Screenshots (if applicable)
[Add images]

## Checklist
- [ ] Code tested
- [ ] Documentation up to date
- [ ] No warnings
```

### Review Process

1. A maintainer will review your PR
2. Changes may be requested
3. Once approved, the PR will be merged
4. Your contribution will appear in the next release!

## Areas of Contribution

### 🎨 Frontend / UI

- Improve widget design
- Animations and transitions
- Accessibility (ARIA, keyboard navigation)
- Themes (dark mode, custom colors)

### 🔧 Backend / Infrastructure

- Optimize signaling server
- Support TURN servers
- Metrics and monitoring
- Rate limiting

### 🚀 Features

- Wallet authentication
- Holder verification
- Text chat
- Audio recording
- Moderation

### 📚 Documentation

- Tutorials
- Videos
- Translations
- API docs

### 🧪 Testing

- Unit tests
- Integration tests
- Load tests
- Multi-browser tests

## Questions?

- Open an issue with the `question` tag
- Join our Discord (link in README)
- Contact the maintainers

## Recognition

Contributors are listed in:
- [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Extension About page
- Release notes

Thank you for contributing to PumpSpeak! 🎙️
