// Configuration du serveur PumpSpeak
// Copiez ce fichier en config.js et ajustez les valeurs

module.exports = {
  // Port du serveur WebSocket
  port: process.env.PORT || 8080,

  // Environnement
  env: process.env.NODE_ENV || 'development',

  // CORS - Origins autorisés
  corsOrigins: [
    'https://pump.fun',
    'https://www.pump.fun',
    // Ajoutez d'autres domaines si nécessaire
  ],

  // Logs
  logLevel: 'info', // 'debug', 'info', 'warn', 'error'

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // max par IP
  },

  // WebRTC Configuration
  webrtc: {
    // Serveurs STUN publics (gratuits)
    stunServers: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
    ],
    
    // Serveurs TURN (optionnel, pour NAT traversal)
    // Décommenter et configurer si nécessaire
    // turnServers: [
    //   {
    //     urls: 'turn:your-turn-server.com:3478',
    //     username: 'your-username',
    //     credential: 'your-password',
    //   }
    // ],
  },

  // Limites
  limits: {
    maxUsersPerRoom: 50,
    maxRooms: 1000,
    messageSize: 10000, // bytes
  },

  // Sécurité
  security: {
    // Activer la vérification d'origine
    checkOrigin: true,
    
    // Timeout de connexion
    connectionTimeout: 30000, // 30 secondes
    
    // Heartbeat pour garder les connexions vivantes
    heartbeatInterval: 30000,
  },
};
