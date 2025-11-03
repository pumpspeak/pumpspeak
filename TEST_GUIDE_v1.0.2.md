# Guide de Test - PumpSpeak v1.0.2

## 🧪 Tests à effectuer pour valider la mise à jour

### ✅ Test 1: Installation fraîche (Nouveau utilisateur)

1. **Désinstaller** l'extension actuelle (si installée):
   - `chrome://extensions/` → Supprimer PumpSpeak

2. **Réinstaller** l'extension:
   - `chrome://extensions/` → Load unpacked → Sélectionner le dossier

3. **Vérifier la génération du userId**:
   - Ouvrir Chrome DevTools → Console
   - Cliquer sur l'icône de l'extension (background service worker)
   - **Attendu**: `PumpSpeak: Generated userId: user_xxxxxxxxx`

4. **Vérifier le stockage**:
   ```javascript
   // Dans la console du background service worker:
   chrome.storage.local.get(['userId'], (result) => {
     console.log('Stored userId:', result.userId);
   });
   ```
   - **Attendu**: Un userId au format `user_xxxxxxxxx`

---

### ✅ Test 2: Persistance du userId

1. **Aller sur pump.fun** (n'importe quel token)
2. **Ouvrir la console** (F12)
3. **Chercher le log**: `PumpSpeak: Using existing userId: user_xxxxxxxxx`
4. **Noter le userId** (ex: `user_abc123xyz`)
5. **Fermer complètement Chrome** (Cmd+Q sur Mac)
6. **Rouvrir Chrome** et aller sur pump.fun
7. **Vérifier dans la console**: Le même userId doit apparaître
   - **Attendu**: Même userId qu'à l'étape 4

---

### ✅ Test 3: Cohérence multi-onglets

1. **Ouvrir pump.fun** dans un premier onglet (token A)
2. **Ouvrir la console** (F12) et noter le userId
3. **Ouvrir un nouvel onglet** avec pump.fun (token B)
4. **Ouvrir la console** (F12) du deuxième onglet
5. **Comparer les userId** des deux onglets
   - **Attendu**: Les deux onglets utilisent le MÊME userId

---

### ✅ Test 4: Connexion WebSocket

1. **Aller sur pump.fun** (n'importe quel token)
2. **Ouvrir la console** (F12)
3. **Vérifier les logs de connexion**:
   ```
   ✅ PumpSpeak: Initializing...
   ✅ PumpSpeak: Using existing userId: user_xxxxxxxxx
   ✅ PumpSpeak: Connected to signaling server
   ✅ PumpSpeak: ✅ Coin in URL: [coin_address]
   ```

4. **Tester la connexion manuelle** (optionnel):
   ```javascript
   // Dans la console de la page pump.fun:
   const ws = new WebSocket('wss://pumpspeak-production.up.railway.app');
   
   ws.onopen = () => {
     console.log('✅ WebSocket connected!');
     ws.send(JSON.stringify({ 
       type: 'join', 
       roomId: 'test_room', 
       userId: 'test_user' 
     }));
   };
   
   ws.onmessage = (e) => {
     console.log('📨 Message:', e.data);
   };
   ```
   - **Attendu**: Connexion réussie + message de bienvenue du serveur

---

### ✅ Test 5: Changement de room

1. **Aller sur un token** (ex: token A)
2. **Attendre que le widget apparaisse**
3. **Ouvrir la console** (F12)
4. **Noter le roomId** dans les logs
5. **Naviguer vers un autre token** (token B)
6. **Vérifier dans la console**:
   ```
   ✅ PumpSpeak: URL changed
   ✅ PumpSpeak: ✅ Switching to room: [nouveau_coin_address]
   ```
7. **Vérifier qu'il n'y a pas d'erreurs**

---

### ✅ Test 6: Upgrade depuis v1.0.1

1. **Si tu as déjà v1.0.1 installée**, ne la désinstalle PAS
2. **Recharge simplement l'extension**:
   - `chrome://extensions/` → Cliquer sur 🔄 (Reload)
3. **Vérifier les logs du background**:
   - **Attendu**: `PumpSpeak: Extension updated to 1.0.2`
   - **Attendu**: `PumpSpeak: Generated userId for existing installation: user_xxxxxxxxx`
4. **Aller sur pump.fun** et vérifier que tout fonctionne

---

### ✅ Test 7: Microphone et Push-to-Talk

1. **Aller sur pump.fun** (n'importe quel token)
2. **Autoriser le microphone** quand demandé
3. **Appuyer sur ESPACE** (ou cliquer sur le bouton)
4. **Vérifier l'animation** du bouton (glow)
5. **Relâcher ESPACE**
6. **Vérifier** qu'il n'y a pas d'erreurs dans la console

---

### ✅ Test 8: Serveur Railway en ligne

1. **Ouvrir**: https://pumpspeak-production.up.railway.app
2. **Attendu**: "PumpSpeak Signaling Server"
3. **Vérifier les logs Railway**:
   - Aller sur Railway Dashboard
   - Cliquer sur ton projet PumpSpeak
   - View Logs
   - **Attendu**: 
     ```
     ✅ PumpSpeak Signaling Server
     ✅ Status: Running
     ✅ Stats: X clients connected, Y active rooms
     ```

---

## 🐛 Bugs à surveiller

### Erreurs critiques à chercher dans la console:

❌ **userId undefined ou null**
```
Error: userId is null when trying to join room
```
→ Vérifier que `getOrCreateUserId()` est bien appelé dans `connect()`

❌ **Storage error**
```
Error: chrome.storage.local is undefined
```
→ Vérifier les permissions dans `manifest.json`

❌ **WebSocket connection failed**
```
WebSocket connection to 'wss://...' failed
```
→ Vérifier que le serveur Railway est en ligne

❌ **Multiple connections from same user**
```
Warning: User user_xxxxxxxxx already connected
```
→ Vérifier que les anciens websockets sont bien fermés lors du changement de room

---

## 📊 Checklist finale

Avant de pousser cette version en production:

- [ ] Test 1: Installation fraîche ✅
- [ ] Test 2: Persistance du userId ✅
- [ ] Test 3: Cohérence multi-onglets ✅
- [ ] Test 4: Connexion WebSocket ✅
- [ ] Test 5: Changement de room ✅
- [ ] Test 6: Upgrade depuis v1.0.1 ✅
- [ ] Test 7: Microphone et Push-to-Talk ✅
- [ ] Test 8: Serveur Railway en ligne ✅
- [ ] Aucune erreur dans la console ✅
- [ ] Pas de memory leaks (onglets ouverts longtemps) ✅

---

## 🚀 Prochaines étapes si tous les tests passent

1. **Créer le package ZIP** pour Chrome Web Store:
   ```bash
   cd /Users/bassamchaouki/pumpspeak
   
   zip -r pumpspeak-extension-v1.0.2.zip \
     manifest.json \
     content.js \
     config.js \
     background.js \
     popup.html \
     popup.js \
     widget.css \
     icons/
   ```

2. **Commit et push sur GitHub**:
   ```bash
   git add .
   git commit -m "v1.0.2 - Persistent userId session management"
   git tag v1.0.2
   git push origin main --tags
   ```

3. **Upload sur Chrome Web Store**:
   - https://chrome.google.com/webstore/devconsole
   - Upload New Package
   - Submit for Review

---

**Bonne chance pour les tests! 🍀**

