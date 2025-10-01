#!/bin/bash

# Script de setup automatique pour PumpSpeak
# Ce script configure tout ce qui est nécessaire pour démarrer

echo "╔════════════════════════════════════════╗"
echo "║     🎙️  PumpSpeak Setup Script        ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier Node.js
echo -e "${BLUE}[1/5]${NC} Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "Installez Node.js depuis https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) détecté${NC}"
echo ""

# Vérifier npm
echo -e "${BLUE}[2/5]${NC} Vérification de npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) détecté${NC}"
echo ""

# Installer les dépendances du serveur
echo -e "${BLUE}[3/5]${NC} Installation des dépendances du serveur..."
cd server
if npm install; then
    echo -e "${GREEN}✅ Dépendances installées${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'installation${NC}"
    exit 1
fi
cd ..
echo ""

# Créer le dossier icons si nécessaire
echo -e "${BLUE}[4/5]${NC} Vérification des icônes..."
mkdir -p icons

if [ ! -f "icons/icon16.png" ] || [ ! -f "icons/icon48.png" ] || [ ! -f "icons/icon128.png" ]; then
    echo -e "${BLUE}⚠️  Icônes manquantes${NC}"
    echo "Ouvrez create-icons.html dans votre navigateur pour les générer :"
    echo "  open create-icons.html"
    echo ""
    
    # Créer des icônes placeholder simples avec ImageMagick si disponible
    if command -v convert &> /dev/null; then
        echo "Génération d'icônes placeholder avec ImageMagick..."
        convert -size 16x16 xc:#667eea icons/icon16.png 2>/dev/null
        convert -size 48x48 xc:#667eea icons/icon48.png 2>/dev/null
        convert -size 128x128 xc:#667eea icons/icon128.png 2>/dev/null
        echo -e "${GREEN}✅ Icônes placeholder créées${NC}"
    else
        echo -e "${BLUE}ℹ️  ImageMagick n'est pas installé. Utilisez create-icons.html${NC}"
    fi
else
    echo -e "${GREEN}✅ Icônes présentes${NC}"
fi
echo ""

# Créer fichier de config
echo -e "${BLUE}[5/5]${NC} Configuration..."
if [ ! -f "server/config.js" ]; then
    if [ -f "server/config.example.js" ]; then
        cp server/config.example.js server/config.js
        echo -e "${GREEN}✅ Fichier config.js créé${NC}"
    fi
fi
echo ""

# Récapitulatif
echo "╔════════════════════════════════════════╗"
echo "║         ✅ Setup terminé !             ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1️⃣  Démarrer le serveur :"
echo "   ${GREEN}cd server && npm start${NC}"
echo ""
echo "2️⃣  Charger l'extension dans Chrome :"
echo "   • Ouvrez ${BLUE}chrome://extensions/${NC}"
echo "   • Activez le 'Mode développeur'"
echo "   • Cliquez 'Charger l'extension non empaquetée'"
echo "   • Sélectionnez le dossier ${BLUE}$(pwd)${NC}"
echo ""
echo "3️⃣  Testez sur pump.fun :"
echo "   ${BLUE}https://pump.fun${NC}"
echo ""
echo "📚 Documentation :"
echo "   • Guide rapide : ${BLUE}QUICK_START.md${NC}"
echo "   • Documentation : ${BLUE}README.md${NC}"
echo "   • Déploiement : ${BLUE}DEPLOYMENT.md${NC}"
echo ""
echo "Bonne utilisation ! 🎉"
