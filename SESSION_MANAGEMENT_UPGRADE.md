# Session Management Upgrade - PumpSpeak

## Contexte
Intégrer un système de gestion de sessions utilisateur amélioré pour Pumpspeak, basé sur les fix implémentés dans fourspeak. L'objectif est d'avoir un `userId` persistant et partagé entre tous les onglets du navigateur pour une meilleure identification des utilisateurs dans les rooms vocales.

## Changements à implémenter

### 1. **Mise à jour de `background.js`**

Dans le gestionnaire `chrome.runtime.onInstalled`, ajouter la génération et le stockage d'un `userId` unique lors de l'installation :

```javascript
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('PumpSpeak: Extension installed');
    
    // Set default settings and generate unique userId
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    
    chrome.storage.sync.set({
      volume: 100,
      autoConnect: true
    });
    
    // Store persistent userId in local storage
    chrome.storage.local.set({ userId });
    
    console.log('PumpSpeak: Generated userId:', userId);
  } else if (details.reason === 'update') {
    console.log('PumpSpeak: Extension updated to', chrome.runtime.getManifest().version);
  }
});
```

**Points clés** :
- Génération d'un `userId` unique au format `'user_' + [random_string]`
- Stockage dans `chrome.storage.local` (partagé entre tous les onglets)
- Fait lors de l'installation initiale uniquement

### 2. **Mise à jour de la classe `VoiceClient` dans `content.js`**

Ajouter une méthode `getOrCreateUserId()` dans la classe `VoiceClient` :

```javascript
class VoiceClient {
  constructor(roomId, widget) {
    this.roomId = roomId;
    this.widget = widget;
    this.ws = null;
    this.peers = new Map();
    this.peerSpeakingState = new Map();
    this.localStream = null;
    this.isMicEnabled = false;
    this.isTalking = false;
    this.volume = 1.0;
    this.userId = null; // Will be loaded from storage
    
    // Auto-update users list every 500ms
    this.updateInterval = setInterval(() => {
      this.updateWidgetUsers();
    }, 500);
  }

  async getOrCreateUserId() {
    // Get persistent userId from chrome.storage (shared across all tabs)
    const result = await chrome.storage.local.get(['userId']);
    
    if (result.userId) {
      this.userId = result.userId;
      console.log('PumpSpeak: Using existing userId:', this.userId);
    } else {
      // Create new userId and save it
      this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
      await chrome.storage.local.set({ userId: this.userId });
      console.log('PumpSpeak: Created new userId:', this.userId);
    }
    
    return this.userId;
  }
}
```

**Points clés** :
- Ajout d'une propriété `userId` initialisée à `null` dans le constructeur
- Méthode asynchrone qui récupère le `userId` depuis `chrome.storage.local`
- Si aucun `userId` n'existe (cas d'upgrade depuis une ancienne version), en crée un nouveau et le sauvegarde

### 3. **Mise à jour de la méthode `connect()`**

Modifier la méthode `connect()` pour charger le `userId` avant la connexion WebSocket :

```javascript
async connect() {
  // Ensure we have a userId first
  await this.getOrCreateUserId();
  
  const WS_URL = PUMPSPEAK_CONFIG.WS_URL;
  
  return new Promise((resolve, reject) => {
    try {
      this.ws = new WebSocket(WS_URL);
      
      this.ws.onopen = () => {
        console.log('PumpSpeak: Connected to signaling server');
        this.send({ type: 'join', roomId: this.roomId, userId: this.userId });
        resolve();
      };

      this.ws.onmessage = (event) => {
        this.handleSignalingMessage(JSON.parse(event.data));
      };

      this.ws.onerror = (error) => {
        console.error('PumpSpeak: WebSocket error:', error);
        reject(new Error('Unable to connect to server'));
      };

      this.ws.onclose = () => {
        console.log('PumpSpeak: Disconnected from server');
        this.cleanup();
      };

      setTimeout(() => {
        if (this.ws.readyState !== WebSocket.OPEN) {
          reject(new Error('Connection timeout'));
        }
      }, 5000);
    } catch (error) {
      reject(error);
    }
  });
}
```

**Points clés** :
- Appel de `await this.getOrCreateUserId()` au début de la méthode
- Envoi du `userId` dans le message `join` : `{ type: 'join', roomId: this.roomId, userId: this.userId }`

### 4. **Mise à jour de la méthode `switchRoom()`**

S'assurer que le `userId` est inclus dans tous les messages de changement de room :

```javascript
async switchRoom(newRoomId) {
  console.log('PumpSpeak: Switching to room:', newRoomId);
  this.leaveRoom();
  this.roomId = newRoomId;
  this.send({ type: 'join', roomId: this.roomId, userId: this.userId });
}
```

**Points clés** :
- Inclusion du `userId` dans le message de rejoin

### 5. **Mise à jour de la méthode `leaveRoom()`**

S'assurer que le `userId` est inclus dans le message de départ :

```javascript
leaveRoom() {
  this.peers.forEach(peer => peer.close());
  this.peers.clear();
  this.peerSpeakingState.clear();
  this.send({ type: 'leave', roomId: this.roomId, userId: this.userId });
  this.updateWidgetUsers();
}
```

**Points clés** :
- Inclusion du `userId` dans le message de leave

### 6. **Mise à jour des autres méthodes utilisant `userId`**

Vérifier et mettre à jour toutes les méthodes qui envoient des messages au serveur pour inclure le `userId` :

```javascript
async handleUserJoined(message) {
  const { userId } = message;
  if (userId === this.userId) return; // Ignore self

  console.log('PumpSpeak: New user:', userId);
  const peer = await this.createPeerConnection(userId, true);
  this.peers.set(userId, peer);
  this.updateWidgetUsers();
}
```

**Points clés** :
- Comparaison avec `this.userId` pour éviter de traiter ses propres événements

## Avantages de cette approche

1. **Persistance** : Le userId reste le même même si l'utilisateur ferme et rouvre le navigateur
2. **Cohérence multi-onglets** : Tous les onglets utilisent le même userId
3. **Meilleure gestion des reconnexions** : Le serveur peut reconnaître un utilisateur qui se reconnecte
4. **Debugging amélioré** : Identification cohérente des utilisateurs dans les logs
5. **Base pour futures fonctionnalités** : Permettra d'ajouter des pseudonymes personnalisés, historique, etc.

## Tests à effectuer

1. **Installation fraîche** : Vérifier qu'un userId est généré à l'installation
2. **Multi-onglets** : Ouvrir plusieurs onglets pump.fun et vérifier que le même userId est utilisé
3. **Persistance** : Fermer et rouvrir le navigateur, vérifier que le userId reste le même
4. **Upgrade** : Tester avec une ancienne version puis upgrader pour vérifier la création automatique du userId
5. **Changement de room** : Vérifier que le changement de token fonctionne correctement avec le userId
6. **Déconnexion/reconnexion** : Tester les scénarios de perte de connexion

## Notes importantes

- Remplacer tous les préfixes `FourSpeak` par `PumpSpeak` dans les logs
- Adapter les sélecteurs CSS (`fs-` → `ps-` ou autre préfixe approprié)
- Vérifier que la configuration WebSocket (`PUMPSPEAK_CONFIG.WS_URL`) pointe vers le bon serveur
- S'assurer que le serveur WebSocket backend est également compatible avec ce système de userId

---

**Status**: ✅ Implémenté  
**Version**: 1.0.2  
**Date**: 2025-11-03

