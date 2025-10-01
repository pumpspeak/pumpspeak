# ⚡ Railway Déploiement - Quick Start

## 🚀 Déploiement en 5 minutes

### 1️⃣ Push ton code sur GitHub

```bash
cd /Users/bassamchaouki/pumpspeak
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/TON_USERNAME/pumpspeak.git
git push -u origin main
```

### 2️⃣ Déployer sur Railway

1. **Va sur** → https://railway.app
2. **Login avec GitHub**
3. **Clique** → "New Project" → "Deploy from GitHub repo"
4. **Sélectionne** → ton repo `pumpspeak`
5. **Settings** → Root Directory → Entre `server` → Save

### 3️⃣ Obtenir ton URL

1. **Settings** → **Networking** → **Generate Domain**
2. **Copie l'URL** : `https://ton-app.railway.app`

### 4️⃣ Mettre à jour l'extension

Ouvre `config.js` et remplace :

```javascript
const PUMPSPEAK_CONFIG = {
  WS_URL: 'wss://ton-app.railway.app',  // ⚠️ Utilise wss:// (pas ws://)
};
```

### 5️⃣ Tester

1. Recharge l'extension : `chrome://extensions/` → 🔄
2. Va sur pump.fun
3. Le widget devrait se connecter ! ✅

---

## 🔍 Vérifier que ça marche

- **Serveur** : Ouvre `https://ton-app.railway.app` → tu dois voir "PumpSpeak Signaling Server"
- **Logs** : Railway → ton projet → Deployments → View Logs
- **Console Chrome** : F12 → Console → cherche "PumpSpeak: Connected"

---

## 💡 Astuces

### Voir les logs en temps réel
```
Railway Dashboard → ton projet → Deployments → View Logs
```

### Redéployer après un changement
```bash
git add .
git commit -m "Update"
git push
```
Railway redéploie automatiquement !

### Variables d'environnement
Railway ajoute automatiquement `PORT`. Tu n'as rien à configurer ! 🎉

---

## ⚠️ Points importants

1. **Toujours utiliser `wss://`** (WebSocket Secure) en production
2. **Root Directory doit être `server`** dans Railway Settings
3. **Teste avant de publier** sur Chrome Web Store

---

Besoin d'aide ? Regarde `DEPLOYMENT_GUIDE.md` pour le guide complet !

