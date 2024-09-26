let isEnabled = false;

chrome.action.onClicked.addListener((tab) => {
  isEnabled = !isEnabled;
  chrome.storage.sync.set({darkThemeEnabled: isEnabled}, () => {
    if (isEnabled) {
      // Insert CSS to enable dark theme
      chrome.scripting.insertCSS({
        target: {tabId: tab.id},
        files: ["style.css"]
      }, () => {
        console.log('Dark theme enabled');
      });
    } else {
      // Remove CSS to disable dark theme
      chrome.scripting.removeCSS({
        target: {tabId: tab.id},
        files: ["style.css"]
      }, () => {
        console.log('Dark theme disabled');
      });
    }
  });
});
