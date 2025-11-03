// PumpSpeak Signaling Server
// This server coordinates WebRTC connections between users

const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Data structures for storing rooms and users
const rooms = new Map(); // roomId -> Set of clients
const clients = new Map(); // ws -> { userId, roomId }

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('PumpSpeak Signaling Server\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(ws, message);
    } catch (error) {
      console.error('Message parsing error:', error);
    }
  });

  ws.on('close', () => {
    console.log('Connection closed');
    handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function handleMessage(ws, message) {
  console.log('Message received:', message.type, 'from', message.userId || 'unknown');

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
      console.log('Unknown message type:', message.type);
  }
}

function handleJoin(ws, message) {
  const { roomId, userId } = message;
  
  console.log(`User ${userId} joining room ${roomId}`);

  // If the user was already in a room, remove them
  const existingClient = clients.get(ws);
  if (existingClient) {
    handleLeave(ws, { roomId: existingClient.roomId, userId: existingClient.userId });
  }

  // Add the user to the room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  
  const room = rooms.get(roomId);
  
  // Notify other users in the room
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

  // Add the new client to the room
  room.add(ws);
  clients.set(ws, { userId, roomId });

  // Send the list of users to the new client
  const usersList = Array.from(room).map(client => {
    const clientData = clients.get(client);
    return clientData ? clientData.userId : null;
  }).filter(Boolean);

  ws.send(JSON.stringify({
    type: 'users-list',
    users: usersList,
    roomId: roomId
  }));

  console.log(`Room ${roomId} now has ${room.size} user(s)`);
}

function handleLeave(ws, message) {
  const { roomId, userId } = message;
  
  console.log(`User ${userId} leaving room ${roomId}`);

  const room = rooms.get(roomId);
  if (room) {
    room.delete(ws);

    // Notify other users
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

    // Remove the room if it's empty
    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
    } else {
      console.log(`Room ${roomId} now has ${room.size} user(s)`);
    }
  }

  clients.delete(ws);
}

function handleSignaling(ws, message) {
  const { to, from, type } = message;
  
  // Find the recipient
  let targetWs = null;
  for (const [client, data] of clients.entries()) {
    if (data.userId === to) {
      targetWs = client;
      break;
    }
  }

  if (targetWs && targetWs.readyState === WebSocket.OPEN) {
    // Forward the message to the recipient
    targetWs.send(JSON.stringify(message));
    console.log(`Message ${type} forwarded from ${from} to ${to}`);
  } else {
    console.log(`Recipient ${to} not found or disconnected`);
  }
}

function handleDisconnect(ws) {
  const clientData = clients.get(ws);
  
  if (clientData) {
    const { userId, roomId } = clientData;
    handleLeave(ws, { roomId, userId });
  }
}

// Start the server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   PumpSpeak Signaling Server           ║
║   Port: ${PORT}                            ║
║   Status: Running                      ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  
  // Close all connections
  wss.clients.forEach(client => {
    client.close();
  });
  
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});

// Log statistics every 30 seconds
setInterval(() => {
  console.log(`Stats: ${clients.size} clients connected, ${rooms.size} active rooms`);
  
  // Display room details
  if (rooms.size > 0) {
    rooms.forEach((room, roomId) => {
      const roomName = roomId.substring(0, 12) + '...';
      console.log(`  - Room ${roomName}: ${room.size} user(s)`);
    });
  }
}, 30000);
# Force redeploy Mon Oct 27 02:43:52 CET 2025
