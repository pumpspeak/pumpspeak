// PumpSpeak - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // Load saved settings
  const settings = await loadSettings();
  
  document.getElementById('volume').value = settings.volume || 100;
  document.getElementById('volume-value').textContent = settings.volume || 100;

  // Volume slider with auto-save
  document.getElementById('volume').addEventListener('input', async (e) => {
    const volume = parseInt(e.target.value);
    document.getElementById('volume-value').textContent = volume;
    
    // Auto-save volume
    try {
      await saveSettings({ volume });
      
      // Apply to all pump.fun tabs
      const tabs = await chrome.tabs.query({ url: 'https://pump.fun/*' });
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { type: 'updateVolume', volume }).catch(() => {});
      }
    } catch (error) {
      console.error('Error saving volume:', error);
    }
  });
});

function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['volume'], (result) => {
      resolve(result);
    });
  });
}

function saveSettings(settings) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}