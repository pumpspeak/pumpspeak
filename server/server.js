// Serveur signaling pour PumpSpeak
// Ce serveur coordonne les connexions WebRTC entre les utilisateurs

const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Structure pour stocker les rooms et les utilisateurs
const rooms = new Map(); // roomId -> Set de clients
const clients = new Map(); // ws -> { userId, roomId }

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('PumpSpeak Signaling Server\n');
});

// Créer le serveur WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Nouvelle connexion WebSocket');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(ws, message);
    } catch (error) {
      console.error('Erreur de parsing du message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Connexion fermée');
    handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    console.error('Erreur WebSocket:', error);
  });
});

function handleMessage(ws, message) {
  console.log('Message reçu:', message.type, 'de', message.userId || 'inconnu');

  switch (message.type) {
    case 'join':
      handleJoin(ws, message);
      break;
    case 'leave':
      handleLeave(ws, message);
      break;
    case 'offer':
    case 'answer':
    case 'ice-candidate':
      handleSignaling(ws, message);
      break;
    default:
      console.log('Type de message inconnu:', message.type);
  }
}

function handleJoin(ws, message) {
  const { roomId, userId } = message;
  
  console.log(`Utilisateur ${userId} rejoint la room ${roomId}`);

  // Si l'utilisateur était déjà dans une room, le retirer
  const existingClient = clients.get(ws);
  if (existingClient) {
    handleLeave(ws, { roomId: existingClient.roomId, userId: existingClient.userId });
  }

  // Ajouter l'utilisateur à la room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  
  const room = rooms.get(roomId);
  
  // Notifier les autres utilisateurs de la room
  const joinMessage = JSON.stringify({
    type: 'user-joined',
    userId: userId,
    roomId: roomId
  });

  room.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(joinMessage);
    }
  });

  // Ajouter le nouveau client à la room
  room.add(ws);
  clients.set(ws, { userId, roomId });

  // Envoyer la liste des utilisateurs au nouveau client
  const usersList = Array.from(room).map(client => {
    const clientData = clients.get(client);
    return clientData ? clientData.userId : null;
  }).filter(Boolean);

  ws.send(JSON.stringify({
    type: 'users-list',
    users: usersList,
    roomId: roomId
  }));

  console.log(`Room ${roomId} a maintenant ${room.size} utilisateur(s)`);
}

function handleLeave(ws, message) {
  const { roomId, userId } = message;
  
  console.log(`Utilisateur ${userId} quitte la room ${roomId}`);

  const room = rooms.get(roomId);
  if (room) {
    room.delete(ws);

    // Notifier les autres utilisateurs
    const leaveMessage = JSON.stringify({
      type: 'user-left',
      userId: userId,
      roomId: roomId
    });

    room.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(leaveMessage);
      }
    });

    // Supprimer la room si elle est vide
    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} supprimée (vide)`);
    } else {
      console.log(`Room ${roomId} a maintenant ${room.size} utilisateur(s)`);
    }
  }

  clients.delete(ws);
}

function handleSignaling(ws, message) {
  const { to, from, type } = message;
  
  // Trouver le destinataire
  let targetWs = null;
  for (const [client, data] of clients.entries()) {
    if (data.userId === to) {
      targetWs = client;
      break;
    }
  }

  if (targetWs && targetWs.readyState === WebSocket.OPEN) {
    // Transférer le message au destinataire
    targetWs.send(JSON.stringify(message));
    console.log(`Message ${type} transféré de ${from} à ${to}`);
  } else {
    console.log(`Destinataire ${to} non trouvé ou déconnecté`);
  }
}

function handleDisconnect(ws) {
  const clientData = clients.get(ws);
  
  if (clientData) {
    const { userId, roomId } = clientData;
    handleLeave(ws, { roomId, userId });
  }
}

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   PumpSpeak Signaling Server           ║
║   Port: ${PORT}                            ║
║   Status: Running                      ║
╚════════════════════════════════════════╝
  `);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\nArrêt du serveur...');
  
  // Fermer toutes les connexions
  wss.clients.forEach(client => {
    client.close();
  });
  
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});

// Log des statistiques toutes les 30 secondes
setInterval(() => {
  console.log(`Stats: ${clients.size} clients connectés, ${rooms.size} rooms actives`);
  
  // Afficher le détail des rooms
  if (rooms.size > 0) {
    rooms.forEach((room, roomId) => {
      const roomName = roomId.substring(0, 12) + '...';
      console.log(`  - Room ${roomName}: ${room.size} utilisateur(s)`);
    });
  }
}, 30000);
