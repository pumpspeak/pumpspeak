# 🤝 Contributing to PumpSpeak

Merci de votre intérêt pour contribuer à PumpSpeak ! Ce guide vous aidera à démarrer.

## 📋 Table des matières

- [Code of Conduct](#code-of-conduct)
- [Comment contribuer](#comment-contribuer)
- [Setup du projet](#setup-du-projet)
- [Architecture](#architecture)
- [Guidelines de code](#guidelines-de-code)
- [Process de Pull Request](#process-de-pull-request)

## Code of Conduct

Ce projet adhère à un code de conduite. En participant, vous vous engagez à respecter ce code.

## Comment contribuer

Il y a plusieurs façons de contribuer à PumpSpeak :

### 🐛 Rapporter des bugs

- Utilisez les GitHub Issues
- Vérifiez que le bug n'a pas déjà été reporté
- Incluez les étapes pour reproduire
- Ajoutez des screenshots si pertinent
- Mentionnez votre navigateur et OS

### 💡 Proposer des fonctionnalités

- Ouvrez une issue avec le tag `enhancement`
- Décrivez le cas d'usage
- Expliquez pourquoi cette feature serait utile

### 🔧 Soumettre des changements

1. Fork le repo
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Setup du projet

### Prérequis

- Node.js 14+
- Chrome/Chromium
- Git

### Installation

```bash
# Cloner le repo
git clone https://github.com/votre-user/pumpspeak.git
cd pumpspeak

# Installer les dépendances du serveur
cd server
npm install

# Retourner à la racine
cd ..
```

### Lancer en dev

```bash
# Terminal 1 : Serveur
cd server
npm run dev

# Charger l'extension dans Chrome
# chrome://extensions/ > Mode développeur > Charger l'extension non empaquetée
```

## Architecture

### Structure du projet

```
pumpspeak/
├── manifest.json          # Config Chrome Extension
├── content.js            # Script injecté dans pump.fun
│   ├── PumpSpeakWidget   # Classe du widget UI
│   └── VoiceClient       # Client WebRTC
├── background.js         # Service Worker
├── popup.html/js         # Interface paramètres
├── widget.css           # Styles
└── server/
    └── server.js        # Serveur signaling WebSocket
```

### Flow de données

1. **Detection** : `content.js` détecte l'URL pump.fun et extrait le coin ID
2. **UI** : Le widget s'affiche avec les contrôles
3. **Connection** : WebSocket vers le serveur signaling
4. **Signaling** : Échange d'offres/réponses SDP via le serveur
5. **WebRTC** : Connexions P2P directes pour l'audio

## Guidelines de code

### JavaScript

- Utilisez ES6+ (const/let, arrow functions, async/await)
- Commentez les fonctions complexes
- Nommage en camelCase
- Classes en PascalCase

```javascript
// ✅ Bon
const userName = 'Alice';
async function connectToRoom(roomId) { ... }
class VoiceClient { ... }

// ❌ Mauvais
var user_name = 'Alice';
function connect_to_room(room_id) { ... }
class voiceClient { ... }
```

### CSS

- BEM naming pour les classes
- Préfixe `ps-` pour éviter les conflits
- Variables CSS pour les couleurs

```css
/* ✅ Bon */
.ps-widget { }
.ps-widget__header { }
.ps-widget__header--collapsed { }

/* ❌ Mauvais */
.widget { }
.header { }
.collapsed { }
```

### Git

- Commits descriptifs en anglais
- Format : `type: description`
- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`

```bash
# ✅ Bon
git commit -m "feat: add push-to-talk mode"
git commit -m "fix: widget not showing on some pages"
git commit -m "docs: update README with deployment steps"

# ❌ Mauvais
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

## Process de Pull Request

### Checklist avant de soumettre

- [ ] Le code fonctionne localement
- [ ] Testé sur Chrome (dernière version)
- [ ] Aucune erreur dans la console
- [ ] Code commenté si complexe
- [ ] README mis à jour si nécessaire
- [ ] Pas de `console.log` inutiles

### Template de PR

```markdown
## Description
Décrivez vos changements

## Type de changement
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Comment tester
1. Étape 1
2. Étape 2
3. ...

## Screenshots (si applicable)
[Ajoutez des images]

## Checklist
- [ ] Code testé
- [ ] Documentation à jour
- [ ] Pas de warnings
```

### Review process

1. Un mainteneur reviewera votre PR
2. Des changements peuvent être demandés
3. Une fois approuvée, la PR sera merged
4. Votre contribution apparaîtra dans la prochaine release !

## Zones de contribution

### 🎨 Frontend / UI

- Améliorer le design du widget
- Animations et transitions
- Accessibilité (ARIA, keyboard navigation)
- Thèmes (dark mode, custom colors)

### 🔧 Backend / Infrastructure

- Optimisation du serveur signaling
- Support TURN servers
- Metrics et monitoring
- Rate limiting

### 🚀 Fonctionnalités

- Authentification wallet
- Vérification holder
- Chat texte
- Enregistrement audio
- Modération

### 📚 Documentation

- Tutoriels
- Vidéos
- Traductions
- API docs

### 🧪 Testing

- Tests unitaires
- Tests d'intégration
- Tests de charge
- Tests multi-navigateurs

## Questions ?

- Ouvrez une issue avec le tag `question`
- Rejoignez notre Discord (lien dans README)
- Contactez les mainteneurs

## Reconnaissance

Les contributeurs sont listés dans :
- [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Page About de l'extension
- Release notes

Merci de contribuer à PumpSpeak ! 🎙️
