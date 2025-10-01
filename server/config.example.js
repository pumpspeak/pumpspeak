// PumpSpeak Server Configuration
// Copy this file to config.js and adjust the values

module.exports = {
  // WebSocket server port
  port: process.env.PORT || 8080,

  // Environment
  env: process.env.NODE_ENV || 'development',

  // CORS - Allowed origins
  corsOrigins: [
    'https://pump.fun',
    'https://www.pump.fun',
    // Add other domains if needed
  ],

  // Logs
  logLevel: 'info', // 'debug', 'info', 'warn', 'error'

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // max per IP
  },

  // WebRTC Configuration
  webrtc: {
    // Public STUN servers (free)
    stunServers: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
    ],
    
    // TURN servers (optional, for NAT traversal)
    // Uncomment and configure if needed
    // turnServers: [
    //   {
    //     urls: 'turn:your-turn-server.com:3478',
    //     username: 'your-username',
    //     credential: 'your-password',
    //   }
    // ],
  },

  // Limits
  limits: {
    maxUsersPerRoom: 50,
    maxRooms: 1000,
    messageSize: 10000, // bytes
  },

  // Security
  security: {
    // Enable origin verification
    checkOrigin: true,
    
    // Connection timeout
    connectionTimeout: 30000, // 30 seconds
    
    // Heartbeat to keep connections alive
    heartbeatInterval: 30000,
  },
};
