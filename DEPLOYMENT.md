# 🚀 Guide de Déploiement PumpSpeak

Ce guide vous explique comment déployer PumpSpeak en production.

## 📋 Pré-requis

- Compte Chrome Web Store (pour publier l'extension)
- Un serveur pour héberger le serveur signaling (VPS, Heroku, Railway, etc.)
- Nom de domaine (optionnel mais recommandé)
- Certificat SSL (obligatoire pour WebRTC en production)

## 🎯 Étape 1 : Préparer l'extension

### 1.1 Créer les icônes

Créez les icônes de l'extension (voir `icons/README.md`) :
- `icons/icon16.png`
- `icons/icon48.png`
- `icons/icon128.png`

### 1.2 Mettre à jour le manifest

Vérifiez et ajustez `manifest.json` :
- Version
- Description
- URL du site web

### 1.3 Créer le package

```bash
# Zipper l'extension (sans node_modules et fichiers inutiles)
zip -r pumpspeak-v1.0.0.zip . -x "*.git*" "*node_modules*" "*server/*" "*.md" "DEPLOYMENT.md"
```

## 🌐 Étape 2 : Déployer le serveur signaling

### Option A : Railway (Recommandé - Gratuit pour commencer)

1. Créez un compte sur [Railway.app](https://railway.app/)
2. Créez un nouveau projet
3. Connectez votre repository GitHub
4. Configurez le service :
   ```
   Root Directory: /server
   Build Command: npm install
   Start Command: npm start
   ```
5. Ajoutez une variable d'environnement :
   ```
   PORT=8080
   ```
6. Déployez !
7. Notez l'URL publique (ex: `wss://pumpspeak-production.up.railway.app`)

### Option B : Heroku

```bash
cd server

# Login Heroku
heroku login

# Créer l'app
heroku create pumpspeak-signaling

# Déployer
git push heroku main

# Vérifier les logs
heroku logs --tail
```

URL du serveur : `wss://pumpspeak-signaling.herokuapp.com`

### Option C : VPS (DigitalOcean, AWS, etc.)

```bash
# SSH sur votre serveur
ssh root@your-server-ip

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer Nginx (pour le reverse proxy SSL)
sudo apt install nginx certbot python3-certbot-nginx

# Cloner votre repo
git clone https://github.com/votre-user/pumpspeak.git
cd pumpspeak/server
npm install

# Installer PM2 pour gérer le process
npm install -g pm2
pm2 start server.js --name pumpspeak
pm2 startup
pm2 save

# Configurer Nginx
sudo nano /etc/nginx/sites-available/pumpspeak
```

Configuration Nginx pour WebSocket :
```nginx
server {
    server_name ws.pumpspeak.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/pumpspeak /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Installer le certificat SSL
sudo certbot --nginx -d ws.pumpspeak.com

# Le serveur est maintenant disponible sur wss://ws.pumpspeak.com
```

### Option D : Render

1. Allez sur [Render.com](https://render.com/)
2. Créez un nouveau "Web Service"
3. Connectez votre repository
4. Configurez :
   ```
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```
5. Déployez !

## 🔧 Étape 3 : Configurer l'extension pour la production

### 3.1 Mettre à jour l'URL du serveur

Dans `content.js`, ligne ~300 :
```javascript
// Remplacez
const WS_URL = 'ws://localhost:8080';

// Par votre URL de production
const WS_URL = 'wss://votre-serveur.com';
```

Ou mieux, utilisez les paramètres de l'extension (recommandé) :
```javascript
// Dans content.js, récupérer l'URL depuis les settings
const settings = await chrome.storage.sync.get(['serverUrl']);
const WS_URL = settings.serverUrl || 'wss://votre-serveur-par-defaut.com';
```

### 3.2 Re-zipper l'extension

```bash
zip -r pumpspeak-production-v1.0.0.zip . -x "*.git*" "*node_modules*" "*server/*" "*.md"
```

## 📱 Étape 4 : Publier sur le Chrome Web Store

1. Allez sur [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)

2. Payez les frais d'inscription (5$ one-time)

3. Créez un nouveau item

4. Uploadez le fichier ZIP

5. Remplissez les informations :
   - **Nom** : PumpSpeak
   - **Description** : Chat vocal en temps réel pour les holders de tokens sur pump.fun
   - **Catégorie** : Social & Communication
   - **Langue** : Français (ou English)
   
6. Screenshots (obligatoire, minimum 1, recommandé 3-5) :
   - Widget en action sur pump.fun
   - Interface des paramètres
   - Liste des utilisateurs connectés

7. Icônes :
   - Icon 128x128 (obligatoire)
   - Small tile 440x280
   - Large tile 920x680 (optionnel)

8. Politique de confidentialité :
   ```
   PumpSpeak collecte uniquement les données nécessaires au fonctionnement :
   - Accès au microphone pour le chat vocal
   - URL de la page courante pour détecter le coin
   - Aucune donnée n'est stockée ou partagée avec des tiers
   ```

9. Soumettez pour review (peut prendre 1-3 jours)

## 🔒 Étape 5 : Sécurité

### 5.1 HTTPS obligatoire

Chrome nécessite HTTPS pour :
- WebRTC (getUserMedia)
- WebSocket sécurisé (wss://)

Assurez-vous que votre serveur utilise SSL.

### 5.2 CORS

Si nécessaire, ajoutez les headers CORS dans `server.js` :
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://pump.fun'],
  credentials: true
}));
```

### 5.3 Rate limiting

Protégez votre serveur contre les abus :
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requêtes par IP
});

app.use(limiter);
```

## 📊 Étape 6 : Monitoring

### 6.1 Logs

Railway/Heroku : logs intégrés dans le dashboard

VPS avec PM2 :
```bash
pm2 logs pumpspeak
pm2 monit
```

### 6.2 Analytics

Ajoutez Google Analytics ou Plausible dans votre extension :
```javascript
// popup.js
const trackEvent = (category, action) => {
  // Votre code analytics
};
```

### 6.3 Alertes

Configurez des alertes pour :
- Serveur down
- Erreurs critiques
- Pic de trafic

Services recommandés :
- UptimeRobot (gratuit)
- BetterUptime
- Sentry pour les erreurs

## 🚀 Étape 7 : Promotion

1. **Tweet de lancement**
   - Vidéo démo
   - Lien Chrome Web Store
   - Hashtags : #Solana #PumpFun #Web3

2. **Post sur Reddit**
   - r/solana
   - r/cryptocurrency
   - r/cryptodevs

3. **Discord communities**
   - Serveur pump.fun
   - Communautés Solana

4. **Product Hunt**
   - Préparez une belle page
   - Lancez un mardi-jeudi

## 📈 Métriques de succès

Suivez :
- Nombre d'installations
- Utilisateurs actifs quotidiens
- Temps moyen d'utilisation
- Rooms créées
- Feedback utilisateurs

## 🐛 Support post-lancement

- Créez un serveur Discord pour le support
- GitHub Issues pour les bugs
- Email de contact : support@pumpspeak.com

## 🔄 Mises à jour

Pour publier une mise à jour :

1. Augmentez la version dans `manifest.json`
2. Créez un nouveau ZIP
3. Uploadez sur le Chrome Web Store
4. Les utilisateurs recevront la mise à jour automatiquement (sous 24-48h)

---

## ⚠️ Checklist finale avant lancement

- [ ] Serveur de production déployé et accessible
- [ ] SSL/TLS configuré (wss://)
- [ ] URL du serveur mise à jour dans l'extension
- [ ] Icônes créées et incluses
- [ ] Tests sur différentes pages pump.fun
- [ ] Tests avec plusieurs utilisateurs
- [ ] Screenshots et vidéos prêts
- [ ] Privacy policy rédigée
- [ ] Support mis en place (email/Discord)
- [ ] Monitoring configuré
- [ ] Backup du serveur configuré

Bon lancement ! 🎉
