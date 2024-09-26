chrome.storage.sync.get('darkThemeEnabled', (data) => {
    if (data.darkThemeEnabled) {
      chrome.scripting.insertCSS({
        target: {tabId: chrome.tabs.getCurrent().id},
        files: ["style.css"]
      });
    }
  });
  