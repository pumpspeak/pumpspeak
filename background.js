// PumpSpeak - Background Service Worker

console.log('PumpSpeak: Background service worker started');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('PumpSpeak: Message received:', message);
  
  switch (message.type) {
    case 'get-settings':
      chrome.storage.sync.get(['serverUrl', 'volume', 'autoConnect'], (result) => {
        sendResponse({
          serverUrl: result.serverUrl || 'ws://localhost:8080',
          volume: result.volume || 100,
          autoConnect: result.autoConnect !== false
        });
      });
      return true;
      
    case 'save-settings':
      chrome.storage.sync.set(message.settings, () => {
        sendResponse({ success: true });
      });
      return true;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

// Monitor pump.fun tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('pump.fun')) {
    console.log('PumpSpeak: pump.fun page detected:', tab.url);
  }
});

// Badge to show connection status
function updateBadge(state) {
  switch (state) {
    case 'connected':
      chrome.action.setBadgeText({ text: '●' });
      chrome.action.setBadgeBackgroundColor({ color: '#34C759' });
      break;
    case 'disconnected':
      chrome.action.setBadgeText({ text: '' });
      break;
    case 'error':
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#FF3B30' });
      break;
  }
}

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('PumpSpeak: Extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      serverUrl: 'ws://localhost:8080',
      volume: 100,
      autoConnect: true
    });
  } else if (details.reason === 'update') {
    console.log('PumpSpeak: Extension updated to', chrome.runtime.getManifest().version);
  }
});