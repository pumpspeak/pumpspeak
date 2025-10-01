#!/bin/bash

# Automatic setup script for PumpSpeak
# This script configures everything needed to get started

echo "╔════════════════════════════════════════╗"
echo "║     🎙️  PumpSpeak Setup Script        ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}[1/5]${NC} Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"
echo ""

# Check npm
echo -e "${BLUE}[2/5]${NC} Checking npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"
echo ""

# Install server dependencies
echo -e "${BLUE}[3/5]${NC} Installing server dependencies..."
cd server
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Installation error${NC}"
    exit 1
fi
cd ..
echo ""

# Create icons folder if needed
echo -e "${BLUE}[4/5]${NC} Checking icons..."
mkdir -p icons

if [ ! -f "icons/icon16.png" ] || [ ! -f "icons/icon48.png" ] || [ ! -f "icons/icon128.png" ]; then
    echo -e "${BLUE}⚠️  Missing icons${NC}"
    echo "Open create-icons.html in your browser to generate them:"
    echo "  open create-icons.html"
    echo ""
    
    # Create simple placeholder icons with ImageMagick if available
    if command -v convert &> /dev/null; then
        echo "Generating placeholder icons with ImageMagick..."
        convert -size 16x16 xc:#667eea icons/icon16.png 2>/dev/null
        convert -size 48x48 xc:#667eea icons/icon48.png 2>/dev/null
        convert -size 128x128 xc:#667eea icons/icon128.png 2>/dev/null
        echo -e "${GREEN}✅ Placeholder icons created${NC}"
    else
        echo -e "${BLUE}ℹ️  ImageMagick is not installed. Use create-icons.html${NC}"
    fi
else
    echo -e "${GREEN}✅ Icons present${NC}"
fi
echo ""

# Create config file
echo -e "${BLUE}[5/5]${NC} Configuration..."
if [ ! -f "server/config.js" ]; then
    if [ -f "server/config.example.js" ]; then
        cp server/config.example.js server/config.js
        echo -e "${GREEN}✅ config.js file created${NC}"
    fi
fi
echo ""

# Summary
echo "╔════════════════════════════════════════╗"
echo "║         ✅ Setup Complete!             ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📋 Next steps:"
echo ""
echo "1️⃣  Start the server:"
echo "   ${GREEN}cd server && npm start${NC}"
echo ""
echo "2️⃣  Load the extension in Chrome:"
echo "   • Open ${BLUE}chrome://extensions/${NC}"
echo "   • Enable 'Developer mode'"
echo "   • Click 'Load unpacked extension'"
echo "   • Select folder ${BLUE}$(pwd)${NC}"
echo ""
echo "3️⃣  Test on pump.fun:"
echo "   ${BLUE}https://pump.fun${NC}"
echo ""
echo "📚 Documentation:"
echo "   • Quick start: ${BLUE}QUICK_START.md${NC}"
echo "   • Documentation: ${BLUE}README.md${NC}"
echo "   • Deployment: ${BLUE}DEPLOYMENT_GUIDE.md${NC}"
echo ""
echo "Happy building! 🎉"
