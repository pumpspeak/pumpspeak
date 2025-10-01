// PumpSpeak - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // Load saved settings
  const settings = await loadSettings();
  
  document.getElementById('server-url').value = settings.serverUrl || 'ws://localhost:8080';
  document.getElementById('auto-connect').checked = settings.autoConnect !== false;
  document.getElementById('volume').value = settings.volume || 100;
  document.getElementById('volume-value').textContent = settings.volume || 100;

  // Volume slider
  document.getElementById('volume').addEventListener('input', (e) => {
    document.getElementById('volume-value').textContent = e.target.value;
  });

  // Save button
  document.getElementById('save-btn').addEventListener('click', async () => {
    const newSettings = {
      serverUrl: document.getElementById('server-url').value,
      autoConnect: document.getElementById('auto-connect').checked,
      volume: parseInt(document.getElementById('volume').value)
    };

    try {
      await saveSettings(newSettings);
      showStatus('Settings saved successfully!', 'success');
      
      // Reload pump.fun tabs to apply changes
      const tabs = await chrome.tabs.query({ url: 'https://pump.fun/*' });
      for (const tab of tabs) {
        chrome.tabs.reload(tab.id);
      }
    } catch (error) {
      showStatus('Error saving settings: ' + error.message, 'error');
    }
  });
});

function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['serverUrl', 'autoConnect', 'volume'], (result) => {
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

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type} show`;

  setTimeout(() => {
    statusEl.classList.remove('show');
  }, 3000);
}