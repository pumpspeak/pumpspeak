# 🚀 Guide de Déploiement PumpSpeak

Ce guide t'explique comment déployer PumpSpeak sur Railway et publier l'extension sur le Chrome Web Store.

---

## 📦 Partie 1 : Déployer le Serveur sur Railway

### Étape 1 : Créer un compte Railway

1. Va sur [railway.app](https://railway.app)
2. Clique sur **"Start a New Project"**
3. Connecte-toi avec GitHub

### Étape 2 : Préparer le repository GitHub

1. **Crée un nouveau repository GitHub** (public ou privé)
   ```bash
   cd /Users/bassamchaouki/pumpspeak
   git init
   git add .
   git commit -m "Initial commit - PumpSpeak"
   ```

2. **Push vers GitHub** :
   ```bash
   git remote add origin https://github.com/TON_USERNAME/pumpspeak.git
   git branch -M main
   git push -u origin main
   ```

### Étape 3 : Déployer sur Railway

1. Sur Railway, clique **"Deploy from GitHub repo"**
2. Sélectionne ton repository `pumpspeak`
3. Railway va détecter automatiquement Node.js

4. **Configure le projet** :
   - Clique sur le service déployé
   - Va dans **Settings** → **Root Directory**
   - Entre : `server` (car ton serveur est dans le dossier server/)
   - Clique **Save**

5. **Obtiens ton URL** :
   - Va dans **Settings** → **Networking**
   - Clique **Generate Domain**
   - Tu vas avoir une URL comme : `pumpspeak-production.up.railway.app`
   - **COPIE CETTE URL** ⚠️

### Étape 4 : Vérifier le déploiement

1. Ouvre ton URL Railway dans le navigateur
2. Tu devrais voir : **"PumpSpeak Signaling Server"**
3. ✅ Le serveur est en ligne !

---

## 🔧 Partie 2 : Mettre à jour l'Extension

### Étape 1 : Configurer l'URL du serveur

1. Ouvre `config.js`
2. Remplace l'URL :
   ```javascript
   const PUMPSPEAK_CONFIG = {
     // Change this to your Railway URL (with wss:// not ws://)
     WS_URL: 'wss://pumpspeak-production.up.railway.app',
   };
   ```
   ⚠️ **Important** : Utilise `wss://` (avec SSL) et non `ws://`

### Étape 2 : Tester localement

1. Recharge l'extension dans Chrome :
   - `chrome://extensions/`
   - Clique sur 🔄 pour PumpSpeak

2. Va sur `pump.fun` et teste un coin
3. Le widget devrait se connecter au serveur Railway !

---

## 🏪 Partie 3 : Publier sur Chrome Web Store

### Prérequis

1. **Compte Google Developer** ($5 one-time fee)
   - Va sur [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Paye les $5 de frais d'inscription

2. **Assets requis** :
   - ✅ Icônes (déjà créées : 16x16, 48x48, 128x128)
   - ⬜ Screenshots (1280x800 ou 640x400) - minimum 1, maximum 5
   - ⬜ Petite tuile promotionnelle (440x280) - optionnelle
   - ⬜ Description de l'extension
   - ⬜ Politique de confidentialité

### Étape 1 : Créer le package .zip

```bash
cd /Users/bassamchaouki/pumpspeak

# Crée un zip avec uniquement les fichiers de l'extension
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

### Étape 2 : Uploader l'extension

1. Va sur le [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Clique **"New Item"**
3. Upload le fichier `pumpspeak-extension.zip`
4. Remplis les informations :

#### Informations de base

**Nom** : PumpSpeak

**Résumé** (132 caractères max) :
```
Voice chat for pump.fun traders. Talk with other holders directly on token pages with push-to-talk functionality.
```

**Description détaillée** :
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

**Catégorie** : Social & Communication

**Langue** : English

#### Screenshots

Tu dois créer **au moins 1 screenshot** (1280x800 ou 640x400) :
- Capture le widget sur une page pump.fun
- Montre l'interface avec des utilisateurs connectés
- Montre le push-to-talk en action

#### Politique de confidentialité

Crée une page simple (peut être un GitHub Gist ou page HTML) :

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

Upload cette URL dans le champ "Privacy Policy"

### Étape 3 : Soumettre pour review

1. Remplis tous les champs requis
2. Clique **"Submit for Review"**
3. La review prend généralement **1-3 jours**

---

## ✅ Checklist Finale

Avant de publier :

- [ ] Serveur déployé sur Railway et fonctionnel
- [ ] `config.js` mis à jour avec l'URL Railway (wss://)
- [ ] Extension testée avec le serveur en production
- [ ] Compte Chrome Developer créé ($5 payés)
- [ ] Au moins 1 screenshot de qualité
- [ ] Description complète
- [ ] Politique de confidentialité publiée
- [ ] Package .zip créé
- [ ] Extension uploadée sur Chrome Web Store

---

## 🆘 Troubleshooting

### Le widget ne se connecte pas au serveur Railway

1. Vérifie que l'URL dans `config.js` utilise `wss://` (pas `ws://`)
2. Vérifie que le domaine Railway est correct
3. Ouvre la console Chrome (F12) pour voir les erreurs

### Railway dit "Application Error"

1. Va dans les logs Railway
2. Vérifie que le `Root Directory` est bien `server`
3. Vérifie que `package.json` et `server.js` sont bien dans le dossier `server/`

### Chrome Web Store rejette l'extension

Les raisons courantes :
- Politique de confidentialité manquante
- Screenshots de mauvaise qualité
- Description pas assez claire
- Permissions non justifiées

---

## 🎉 C'est fait !

Une fois approuvé, ton extension sera disponible sur :
`https://chrome.google.com/webstore/detail/[ton-extension-id]`

Tu pourras partager ce lien pour que les gens installent PumpSpeak ! 🚀

