// PumpSpeak - Voice chat for pump.fun
class PumpSpeakWidget {
  constructor() {
    this.currentCoin = null;
    this.widget = null;
    this.voiceClient = null;
    this.isMinimized = false;
    this.host = null;
    this.shadow = null;
    this.pageLoadTime = Date.now();
    this.init();
  }

  init() {
    console.log('PumpSpeak: Initializing...');
    this.createWidget();
    this.startDomWatchdog();
    
    // Detect immediately
    this.detectCoin();
    
    // Retry a few times for SPA loading
    setTimeout(() => this.detectCoin(), 500);
    setTimeout(() => this.detectCoin(), 1000);
    setTimeout(() => this.detectCoin(), 2000);
    
    // Setup watcher after initial detection
    setTimeout(() => this.setupCoinWatcher(), 3000);
  }

  // Detect current coin from URL (URL is source of truth)
  detectCoin() {
    const url = window.location.href;
    
    // Extract coin ID from URL using multiple patterns
    let coinId = null;
    
    // Pattern 1: pump.fun/[anything]/[coin_address]
    let match = url.match(/pump\.fun\/[^\/]+\/([a-zA-Z0-9]{30,50}pump)/);
    if (match && match[1]) {
      coinId = match[1];
    }
    
    // Pattern 2: pump.fun/coin/[address] or pump.fun/[address]
    if (!coinId) {
      match = url.match(/pump\.fun\/(?:coin\/)?([a-zA-Z0-9]{30,50}pump)/);
      if (match && match[1]) {
        coinId = match[1];
      }
    }
    
    // Pattern 3: Any path ending with 'pump'
    if (!coinId) {
      match = url.match(/\/([a-zA-Z0-9]{30,50}pump)(?:\/|\?|#|$)/);
      if (match && match[1]) {
        coinId = match[1];
      }
    }
    
    // URL is source of truth - if coin in URL, show widget
    if (coinId) {
      if (coinId !== this.currentCoin) {
        console.log('PumpSpeak: ✅ Coin in URL:', coinId);
        this.currentCoin = coinId;
        this.onCoinChange(coinId);
      }
      // Coin exists in URL, widget should stay visible
      return;
    }
    
    // No coin in URL - hide widget
    if (!coinId && this.currentCoin !== null) {
      // PROTECTION: Never hide during initial page load (first 5 seconds)
      const timeSincePageLoad = Date.now() - this.pageLoadTime;
      if (timeSincePageLoad < 5000) {
        console.log('PumpSpeak: ⏳ Page still loading, ignoring null detection');
        return;
      }
      
      console.log('PumpSpeak: ❌ No coin in URL, hiding widget');
      this.currentCoin = null;
      this.onCoinChange(null);
    }
  }

  // Watch for page changes
  setupCoinWatcher() {
    let lastUrl = location.href;
    
    // Simple URL polling - URL is source of truth
    setInterval(() => {
      const url = location.href;
      if (url !== lastUrl) {
        console.log('PumpSpeak: URL changed');
        lastUrl = url;
        this.pageLoadTime = Date.now(); // Reset protection on URL change
        this.detectCoin();
      }
    }, 500);
    
    // Popstate for back/forward navigation
    window.addEventListener('popstate', () => {
      this.pageLoadTime = Date.now(); // Reset protection on navigation
      this.detectCoin();
    });
  }

  // Called when coin changes
  onCoinChange(coinId) {
    if (coinId) {
      console.log('PumpSpeak: ✅ Switching to room:', coinId);
      this.showWidget();
      this.updateWidgetCoin(coinId);
      
      // Auto-connect to voice (prevent multiple calls)
      if (!this.voiceClient) {
        clearTimeout(this.connectTimeout);
        this.connectTimeout = setTimeout(() => {
          if (!this.voiceClient) { // Double check
            this.autoConnect();
          }
        }, 500);
      } else {
        this.voiceClient.switchRoom(coinId);
      }
    } else {
      console.log('PumpSpeak: ❌ No coin detected, hiding widget');
      this.hideWidget();
      
      // Clear any pending connection
      clearTimeout(this.connectTimeout);
      
      if (this.voiceClient) {
        this.voiceClient.disconnect();
        this.voiceClient = null;
      }
    }
  }

  // Create widget UI
  createWidget() {
    // Ensure host exists and is attached
    if (!this.host) {
      this.host = document.createElement('div');
      this.host.id = 'pumpspeak-host';
      document.body.appendChild(this.host);
      this.shadow = this.host.attachShadow({ mode: 'open' });
    } else if (!document.body.contains(this.host)) {
      document.body.appendChild(this.host);
    }

    // If widget already exists inside shadow, nothing to do
    if (this.shadow && this.shadow.getElementById('pumpspeak-widget')) {
      this.widget = this.shadow.getElementById('pumpspeak-widget');
      return;
    }

    const cssUrl = chrome.runtime.getURL('widget.css');
    fetch(cssUrl)
      .then(resp => resp.text())
      .then(cssText => {
        const html = `
          <style>${cssText}</style>
          <div id="pumpspeak-widget">
            <div class="ps-container">
              <div class="ps-header">
                <div class="ps-title">
                  <svg class="ps-icon-mic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                  <span id="ps-user-count">0</span>
                </div>
                <button class="ps-minimize" id="ps-minimize">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>
              </div>

              <div class="ps-content" id="ps-content">
                <div class="ps-users" id="ps-users"></div>
                
                <div class="ps-controls">
                  <div class="ps-ptt-zone" id="ps-ptt-zone">
                    <div class="ps-ptt-ring" id="ps-ptt-ring"></div>
                    <button class="ps-ptt-btn" id="ps-ptt-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                    </button>
                    <div class="ps-ptt-label">Hold SPACE to talk</div>
                  </div>

                  <div class="ps-secondary">
                    <button class="ps-btn-icon" id="ps-settings-btn" title="Settings">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
                      </svg>
                    </button>
                    <div class="ps-volume-compact">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                      <input type="range" id="ps-volume" min="0" max="100" value="100">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

        this.shadow.innerHTML = html;
        this.widget = this.shadow.getElementById('pumpspeak-widget');
        this.attachEventListeners(this.shadow);
        this.hideWidget();
      })
      .catch(() => {
        // Fallback: minimal widget without CSS if fetch fails
        const fallback = document.createElement('div');
        fallback.id = 'pumpspeak-widget';
        fallback.textContent = 'PumpSpeak';
        this.shadow.innerHTML = '';
        this.shadow.appendChild(fallback);
        this.widget = fallback;
      });
  }

  // Watchdog to ensure the widget stays mounted even if the page re-renders
  startDomWatchdog() {
    if (this._domWatchdogInterval) return;
    this._domWatchdogInterval = setInterval(() => {
      // If we have a coin in URL, ensure widget exists and is attached
      const hasCoinInUrl = /([a-zA-Z0-9]{30,50}pump)(?:\/|\?|#|$)/.test(location.href);
      if (hasCoinInUrl) {
        if (!this.widget || !document.body.contains(this.widget)) {
          this.createWidget();
          if (this.currentCoin) {
            this.showWidget();
          }
        }
      }
    }, 800);
  }

  attachEventListeners(root) {
    // Minimize toggle
    root.getElementById('ps-minimize').addEventListener('click', () => {
      this.isMinimized = !this.isMinimized;
      const content = root.getElementById('ps-content');
      const btn = root.getElementById('ps-minimize');
      
      if (this.isMinimized) {
        content.classList.add('minimized');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>`;
      } else {
        content.classList.remove('minimized');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>`;
      }
    });

    // Push-to-talk button
    const pttBtn = root.getElementById('ps-ptt-btn');
    const pttRing = root.getElementById('ps-ptt-ring');
    
    pttBtn.addEventListener('mousedown', () => {
      if (this.voiceClient) {
        this.voiceClient.startTalking();
        pttRing.classList.add('active');
      }
    });

    pttBtn.addEventListener('mouseup', () => {
      if (this.voiceClient) {
        this.voiceClient.stopTalking();
        pttRing.classList.remove('active');
      }
    });

    pttBtn.addEventListener('mouseleave', () => {
      if (this.voiceClient) {
        this.voiceClient.stopTalking();
        pttRing.classList.remove('active');
      }
    });

    // Space bar push-to-talk
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.repeat && this.voiceClient) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.voiceClient.startTalking();
          pttRing.classList.add('active');
        }
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space' && this.voiceClient) {
        e.preventDefault();
        this.voiceClient.stopTalking();
        pttRing.classList.remove('active');
      }
    });

    // Volume control
    root.getElementById('ps-volume').addEventListener('input', (e) => {
      if (this.voiceClient) {
        this.voiceClient.setVolume(e.target.value / 100);
      }
    });

    // Settings button
    root.getElementById('ps-settings-btn').addEventListener('click', () => {
      // Open extension popup or settings
      chrome.runtime.openOptionsPage?.() || alert('Open chrome://extensions/ to access settings');
    });
  }

  showWidget() {
    if (!this.widget && this.shadow) this.widget = this.shadow.getElementById('pumpspeak-widget');
    if (this.widget) {
      this.widget.style.display = 'block';
      setTimeout(() => this.widget.classList.add('visible'), 10);
    }
  }

  hideWidget() {
    if (!this.widget && this.shadow) this.widget = this.shadow.getElementById('pumpspeak-widget');
    if (this.widget) {
      this.widget.classList.remove('visible');
      setTimeout(() => this.widget.style.display = 'none', 300);
    }
  }

  updateWidgetCoin(coinId) {
    // Coin info shown in title when minimized
  }

  async autoConnect() {
    if (this.voiceClient) return;
    
    try {
      this.voiceClient = new VoiceClient(this.currentCoin, this);
      await this.voiceClient.connect();
      await this.voiceClient.enableMic();
    } catch (error) {
      console.error('PumpSpeak: Auto-connect failed:', error);
    }
  }

  updateUsersList(users) {
    const root = this.shadow || document;
    const usersEl = root.getElementById('ps-users');
    const countEl = root.getElementById('ps-user-count');
    
    countEl.textContent = users.length;
    
    usersEl.innerHTML = users.map(user => `
      <div class="ps-user ${user.isSpeaking ? 'speaking' : ''}">
        <div class="ps-user-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div class="ps-user-name">${user.name}</div>
        ${user.isSpeaking ? '<div class="ps-user-wave"></div>' : ''}
      </div>
    `).join('');
  }
}

// Voice Client with WebRTC
class VoiceClient {
  constructor(roomId, widget) {
    this.roomId = roomId;
    this.widget = widget;
    this.ws = null;
    this.peers = new Map();
    this.peerSpeakingState = new Map(); // Track speaking state for each peer
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
      // Create new userId and save it (for backward compatibility)
      this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
      await chrome.storage.local.set({ userId: this.userId });
      console.log('PumpSpeak: Created new userId:', this.userId);
    }
    
    return this.userId;
  }

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

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  async handleSignalingMessage(message) {
    switch (message.type) {
      case 'user-joined':
        await this.handleUserJoined(message);
        break;
      case 'user-left':
        this.handleUserLeft(message);
        break;
      case 'offer':
        await this.handleOffer(message);
        break;
      case 'answer':
        await this.handleAnswer(message);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(message);
        break;
      case 'users-list':
        await this.handleUsersList(message);
        break;
    }
  }

  async handleUserJoined(message) {
    const { userId } = message;
    if (userId === this.userId) return;

    console.log('PumpSpeak: New user:', userId);
    const peer = await this.createPeerConnection(userId, true);
    this.peers.set(userId, peer);
    this.updateWidgetUsers();
  }

  handleUserLeft(message) {
    const { userId } = message;
    console.log('PumpSpeak: User left:', userId);
    
    const peer = this.peers.get(userId);
    if (peer) {
      peer.close();
      this.peers.delete(userId);
    }
    
    // Clean up speaking state
    this.peerSpeakingState.delete(userId);
    
    this.updateWidgetUsers();
  }

  async createPeerConnection(userId, isInitiator) {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(configuration);

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }

    pc.ontrack = (event) => {
      console.log('PumpSpeak: Remote track received from', userId);
      this.playRemoteStream(userId, event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.send({
          type: 'ice-candidate',
          candidate: event.candidate,
          to: userId,
          from: this.userId
        });
      }
    };

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      this.send({
        type: 'offer',
        offer: offer,
        to: userId,
        from: this.userId
      });
    }

    return pc;
  }

  async handleOffer(message) {
    const { from, offer } = message;
    
    let peer = this.peers.get(from);
    if (!peer) {
      peer = await this.createPeerConnection(from, false);
      this.peers.set(from, peer);
    }

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    this.send({
      type: 'answer',
      answer: answer,
      to: from,
      from: this.userId
    });
  }

  async handleAnswer(message) {
    const { from, answer } = message;
    const peer = this.peers.get(from);
    
    if (peer) {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
      this.updateWidgetUsers();
    }
  }

  async handleIceCandidate(message) {
    const { from, candidate } = message;
    const peer = this.peers.get(from);
    
    if (peer) {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  async handleUsersList(message) {
    const { users } = message;
    
    for (const userId of users) {
      if (userId !== this.userId && !this.peers.has(userId)) {
        console.log('PumpSpeak: Connecting to existing user:', userId);
        const peer = await this.createPeerConnection(userId, true);
        this.peers.set(userId, peer);
      }
    }
    
    this.updateWidgetUsers();
  }

  playRemoteStream(userId, stream) {
    let audio = document.getElementById(`ps-audio-${userId}`);
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = `ps-audio-${userId}`;
      audio.autoplay = true;
      document.body.appendChild(audio);
    }
    
    audio.srcObject = stream;
    audio.volume = this.volume;
    
    // Detect when remote user is speaking
    this.detectSpeaking(userId, stream);
  }
  
  detectSpeaking(userId, stream) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      microphone.connect(analyser);
      
      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        // Threshold for speaking detection
        const isSpeaking = average > 10;
        
        // Update speaking state
        if (this.peerSpeakingState.get(userId) !== isSpeaking) {
          this.peerSpeakingState.set(userId, isSpeaking);
        }
        
        // Continue checking
        if (this.peers.has(userId)) {
          requestAnimationFrame(checkAudio);
        }
      };
      
      checkAudio();
    } catch (error) {
      console.error('PumpSpeak: Speaking detection error:', error);
      this.peerSpeakingState.set(userId, false);
    }
  }

  async enableMic() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      // Muted by default (push-to-talk)
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });

      this.peers.forEach(peer => {
        this.localStream.getTracks().forEach(track => {
          peer.addTrack(track, this.localStream);
        });
      });

      this.isMicEnabled = true;
      this.updateWidgetUsers();
    } catch (error) {
      console.error('PumpSpeak: Mic access error:', error);
      throw error;
    }
  }

  startTalking() {
    if (this.localStream && this.isMicEnabled) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = true;
      });
      this.isTalking = true;
      this.updateWidgetUsers();
    }
  }

  stopTalking() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      this.isTalking = false;
      this.updateWidgetUsers();
    }
  }

  setVolume(volume) {
    this.volume = volume;
    document.querySelectorAll('[id^="ps-audio-"]').forEach(audio => {
      audio.volume = volume;
    });
  }

  async switchRoom(newRoomId) {
    console.log('PumpSpeak: Switching to room:', newRoomId);
    
    // Leave current room and clean up
    this.leaveRoom();
    
    // Update room ID
    this.roomId = newRoomId;
    
    // Rejoin with new room
    this.send({ type: 'join', roomId: this.roomId, userId: this.userId });
    
    // Important: Update UI to show we're now alone in new room
    this.updateWidgetUsers();
  }

  leaveRoom() {
    // Close all peer connections
    this.peers.forEach(peer => {
      peer.close();
    });
    this.peers.clear();
    this.peerSpeakingState.clear();
    
    // Notify server we're leaving
    if (this.roomId) {
      this.send({ type: 'leave', roomId: this.roomId, userId: this.userId });
    }
    
    // Clean up remote audio elements
    document.querySelectorAll('[id^="ps-audio-"]').forEach(el => el.remove());
    
    this.updateWidgetUsers();
  }

  disconnect() {
    this.leaveRoom();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.ws) {
      this.ws.close();
    }
    
    // Clear auto-update interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    this.cleanup();
  }

  cleanup() {
    document.querySelectorAll('[id^="ps-audio-"]').forEach(el => el.remove());
  }

  updateWidgetUsers() {
    const users = [
      { 
        name: 'You', 
        isMicEnabled: this.isMicEnabled, 
        isSpeaking: this.isTalking 
      }
    ];
    
    this.peers.forEach((peer, userId) => {
      users.push({
        name: userId.substring(5, 10),
        isMicEnabled: true,
        isSpeaking: this.peerSpeakingState.get(userId) || false
      });
    });
    
    this.widget.updateUsersList(users);
  }
}

// Initialize widget when page loads
function initPumpSpeak() {
  if (window.pumpSpeakWidget) return; // Prevent duplicate initialization
  window.pumpSpeakWidget = new PumpSpeakWidget();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPumpSpeak);
} else {
  initPumpSpeak();
}

// Additional check when page fully loads (for direct URL navigation)
window.addEventListener('load', () => {
  if (window.pumpSpeakWidget) {
    window.pumpSpeakWidget.detectCoin();
  }
});