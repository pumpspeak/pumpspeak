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
  console.log('🔌 New WebSocket connection');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(ws, message);
    } catch (error) {
      console.error('❌ Message parsing error:', error);
      console.error('   Raw data:', data.toString().substring(0, 100));
    }
  });

  ws.on('close', () => {
    const clientData = clients.get(ws);
    if (clientData) {
      console.log(`🔌 Connection closed: ${clientData.userId}`);
    } else {
      console.log('🔌 Connection closed (unidentified client)');
    }
    handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
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
  
  console.log(`✅ User ${userId} joining room ${roomId.substring(0, 12)}...`);

  // If the user was already in a room, remove them
  const existingClient = clients.get(ws);
  if (existingClient) {
    // Check if they're rejoining the same room
    if (existingClient.roomId === roomId && existingClient.userId === userId) {
      console.log(`⚠️  User ${userId} already in this room, ignoring duplicate join`);
      // Just resend the users list (maybe they missed it)
      const room = rooms.get(roomId);
      if (room) {
        const existingUsers = Array.from(room)
          .map(client => {
            const clientData = clients.get(client);
            return clientData ? clientData.userId : null;
          })
          .filter(Boolean)
          .filter(id => id !== userId); // Exclude self
        
        ws.send(JSON.stringify({
          type: 'users-list',
          users: existingUsers,
          roomId: roomId
        }));
        console.log(`📋 Resent user list to ${userId}: [${existingUsers.join(', ')}]`);
      }
      return; // Don't process further
    }
    
    console.log(`⚠️  User ${userId} switching from room ${existingClient.roomId.substring(0, 12)}... to ${roomId.substring(0, 12)}...`);
    handleLeave(ws, { roomId: existingClient.roomId, userId: existingClient.userId });
  }

  // Add the user to the room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
    console.log(`📦 Created new room ${roomId.substring(0, 12)}...`);
  }
  
  const room = rooms.get(roomId);
  
  // Get list of EXISTING users (before adding new user)
  const existingUsers = Array.from(room).map(client => {
    const clientData = clients.get(client);
    return clientData ? clientData.userId : null;
  }).filter(Boolean);
  
  console.log(`👥 Existing users in room: [${existingUsers.join(', ')}]`);
  
  // Notify other users in the room about the new user
  const joinMessage = JSON.stringify({
    type: 'user-joined',
    userId: userId,
    roomId: roomId
  });

  let notifiedCount = 0;
  room.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(joinMessage);
      notifiedCount++;
    }
  });
  
  console.log(`📢 Notified ${notifiedCount} user(s) about ${userId} joining`);

  // Add the new client to the room
  room.add(ws);
  clients.set(ws, { userId, roomId });

  // Send the list of OTHER users to the new client (excluding self)
  ws.send(JSON.stringify({
    type: 'users-list',
    users: existingUsers,
    roomId: roomId
  }));

  console.log(`📋 Sent user list to ${userId}: [${existingUsers.join(', ')}]`);
  console.log(`✨ Room ${roomId.substring(0, 12)}... now has ${room.size} user(s)`);
}

function handleLeave(ws, message) {
  const { roomId, userId } = message;
  
  console.log(`👋 User ${userId} leaving room ${roomId ? roomId.substring(0, 12) + '...' : 'unknown'}`);

  const room = rooms.get(roomId);
  if (room) {
    room.delete(ws);

    // Notify other users
    const leaveMessage = JSON.stringify({
      type: 'user-left',
      userId: userId,
      roomId: roomId
    });

    let notifiedCount = 0;
    room.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(leaveMessage);
        notifiedCount++;
      }
    });
    
    console.log(`📢 Notified ${notifiedCount} user(s) that ${userId} left`);

    // Remove the room if it's empty
    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`🗑️  Room ${roomId.substring(0, 12)}... deleted (empty)`);
    } else {
      console.log(`📊 Room ${roomId.substring(0, 12)}... now has ${room.size} user(s)`);
    }
  } else {
    console.log(`⚠️  Room ${roomId} not found for user ${userId}`);
  }

  clients.delete(ws);
}

function handleSignaling(ws, message) {
  const { to, from, type } = message;
  
  console.log(`🔄 Signaling ${type}: ${from} → ${to}`);
  
  // Verify sender is in a room
  const senderData = clients.get(ws);
  if (!senderData) {
    console.error(`❌ Sender ${from} not registered`);
    return;
  }
  
  // Find the recipient
  let targetWs = null;
  let targetData = null;
  for (const [client, data] of clients.entries()) {
    if (data.userId === to) {
      targetWs = client;
      targetData = data;
      break;
    }
  }

  if (!targetWs || !targetData) {
    console.error(`❌ Recipient ${to} not found (from: ${from})`);
    console.log(`   Available users: ${Array.from(clients.values()).map(c => c.userId).join(', ')}`);
    return;
  }

  // Verify both users are in the same room
  if (senderData.roomId !== targetData.roomId) {
    console.error(`❌ Users not in same room: ${from} (${senderData.roomId.substring(0, 8)}...) → ${to} (${targetData.roomId.substring(0, 8)}...)`);
    return;
  }

  // Verify WebSocket is open
  if (targetWs.readyState !== WebSocket.OPEN) {
    console.error(`❌ Recipient ${to} WebSocket not open (state: ${targetWs.readyState})`);
    return;
  }

  // Forward the message to the recipient
  try {
    targetWs.send(JSON.stringify(message));
    console.log(`✅ ${type} forwarded: ${from} → ${to}`);
    
    // Additional info for debugging
    if (type === 'offer') {
      console.log(`   📤 Offer contains SDP: ${message.offer ? 'yes' : 'no'}`);
    } else if (type === 'answer') {
      console.log(`   📥 Answer contains SDP: ${message.answer ? 'yes' : 'no'}`);
    } else if (type === 'ice-candidate') {
      console.log(`   🧊 ICE candidate: ${message.candidate ? message.candidate.candidate.substring(0, 30) + '...' : 'null'}`);
    }
  } catch (error) {
    console.error(`❌ Error sending ${type} from ${from} to ${to}:`, error.message);
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
