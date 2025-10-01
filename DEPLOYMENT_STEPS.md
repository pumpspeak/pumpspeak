# 🚀 Étapes de Déploiement PumpSpeak

## 📝 Checklist Avant de Commencer

- [ ] Nouveau compte GitHub créé OU organisation créée
- [ ] Repository GitHub vide créé
- [ ] Git configuré localement

---

## 1️⃣ Push le Code sur GitHub (3 min)

### Si Git n'est pas encore initialisé :

```bash
cd /Users/bassamchaouki/pumpspeak

# Initialise git
git init

# Ajoute tous les fichiers
git add .

# Premier commit
git commit -m "PumpSpeak v1.0 - Production ready"

# Ajoute le remote (remplace TON_USERNAME par ton nouveau compte/org)
git remote add origin https://github.com/TON_USERNAME/pumpspeak.git

# Crée la branche main et push
git branch -M main
git push -u origin main
```

### Si tu as déjà des commits :

```bash
cd /Users/bassamchaouki/pumpspeak

# Ajoute juste le nouveau remote
git remote add origin https://github.com/TON_USERNAME/pumpspeak.git

# Push
git push -u origin main
```

---

## 2️⃣ Déployer sur Railway (5 min)

### A. Créer le projet

1. **Va sur** → https://railway.app
2. **Clique** → "Login with GitHub"
3. **Connecte-toi** avec ton nouveau compte GitHub (ou compte qui a l'organisation)
4. **Autorise Railway** à accéder au repo

### B. Déployer le serveur

1. **Clique** → "New Project"
2. **Sélectionne** → "Deploy from GitHub repo"
3. **Choisis** → `pumpspeak` (ton repo)
4. Railway va commencer le déploiement automatiquement

### C. Configurer le Root Directory

⚠️ **IMPORTANT** : Railway doit savoir que le serveur est dans le dossier `server/`

1. Clique sur le service déployé
2. **Settings** → **General** → Scroll vers "Root Directory"
3. Entre : `server`
4. **Save Changes**
5. Railway va redéployer automatiquement

### D. Générer le domaine public

1. Dans ton projet → **Settings**
2. **Networking** → **Public Networking**
3. **Generate Domain**
4. Railway génère une URL comme : `pumpspeak-production-xxxx.up.railway.app`
5. ✅ **COPIE CETTE URL !**

### E. Vérifier le déploiement

1. **Ouvre l'URL** dans ton navigateur
2. Tu devrais voir : **"PumpSpeak Signaling Server"**
3. ✅ Le serveur est en ligne !

Pour voir les logs :
- Railway Dashboard → ton projet → **Deployments** → **View Logs**

---

## 3️⃣ Mettre à jour l'Extension (2 min)

### A. Modifier config.js

Ouvre `config.js` et remplace l'URL :

```javascript
// PumpSpeak Configuration
const PUMPSPEAK_CONFIG = {
  // Production URL from Railway (IMPORTANT: use wss:// not ws://)
  WS_URL: 'wss://pumpspeak-production-xxxx.up.railway.app',
};
```

⚠️ **Points critiques** :
- ✅ Utilise `wss://` (WebSocket Secure) et NON `ws://`
- ✅ N'oublie pas de remplacer par ton URL Railway exacte
- ✅ Pas de `/` à la fin de l'URL

### B. Tester localement

1. **Recharge l'extension** :
   - Ouvre Chrome → `chrome://extensions/`
   - Trouve PumpSpeak
   - Clique sur 🔄 (reload)

2. **Teste sur pump.fun** :
   - Va sur n'importe quel coin
   - Le widget devrait apparaître
   - Ouvre la console (F12) :
     - Tu devrais voir `PumpSpeak: Connected to signaling server`
   - ✅ Ça marche !

### C. Commit les changements

```bash
cd /Users/bassamchaouki/pumpspeak

git add config.js
git commit -m "Update production WebSocket URL"
git push
```

---

## 4️⃣ Préparer pour Chrome Web Store (Optional - Plus tard)

Tu peux faire ça plus tard, mais voici les assets nécessaires :

### Assets requis :

1. **Icônes** ✅ (déjà fait)
   - 16x16, 48x48, 128x128

2. **Screenshots** (à faire)
   - Taille : 1280x800 ou 640x400
   - Nombre : 1 minimum, 5 maximum
   - Contenu : Widget sur pump.fun, interface, utilisateurs

3. **Description** ✅ (déjà préparée dans DEPLOYMENT_GUIDE.md)

4. **Politique de confidentialité** (à créer)
   - Peut être une page GitHub ou site simple
   - Template disponible dans DEPLOYMENT_GUIDE.md

5. **Package .zip**
   ```bash
   cd /Users/bassamchaouki/pumpspeak
   
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

---

## ✅ Vérification Finale

Avant de publier, vérifie :

- [ ] Serveur Railway fonctionne (URL accessible)
- [ ] Extension connectée au serveur production
- [ ] Testé sur plusieurs coins pump.fun
- [ ] Testé avec plusieurs utilisateurs (ouvre plusieurs navigateurs)
- [ ] Pas d'erreurs dans la console Chrome
- [ ] WebRTC fonctionne (tu entends les autres utilisateurs)

---

## 🆘 En cas de problème

### Le widget ne se connecte pas

1. **Console Chrome** (F12) :
   - Cherche les erreurs WebSocket
   - Vérifie que l'URL est correcte

2. **Railway Logs** :
   - Dashboard → Deployments → View Logs
   - Cherche "Nouvelle connexion WebSocket"

3. **Vérifications** :
   - [ ] URL dans `config.js` utilise `wss://` (pas `ws://`)
   - [ ] Root Directory = `server` dans Railway
   - [ ] Extension rechargée après modification de config.js

### Railway dit "Application Error"

1. **Check les logs** → Railway Dashboard → View Logs
2. **Vérifie** que `server/package.json` existe
3. **Vérifie** que Root Directory = `server`
4. **Redéploie** manuellement si besoin

---

## 🎉 C'est fait !

Ton extension est maintenant connectée à un serveur en production ! 

**Prochaines étapes** :
1. Teste avec des amis
2. Prépare les screenshots
3. Publie sur Chrome Web Store (quand prêt)

---

**Besoin d'aide ?** Consulte :
- `RAILWAY_QUICKSTART.md` - Guide rapide
- `DEPLOYMENT_GUIDE.md` - Guide complet Chrome Web Store

