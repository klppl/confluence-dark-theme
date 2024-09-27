// background.js

// Set default state when installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ darkModeEnabled: true });
  chrome.action.setIcon({ path: "icons/icon-enabled.png" });
});

// Function to update CSS in a tab
function updateTabCSS(tabId, enable) {
  if (enable) {
    chrome.scripting.insertCSS(
      {
        target: { tabId: tabId },
        files: ["darkmode.css"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Insert CSS Error:", chrome.runtime.lastError);
        } else {
          console.log(`CSS injected into tab ${tabId}`);
        }
      }
    );
  } else {
    chrome.scripting.removeCSS(
      {
        target: { tabId: tabId },
        files: ["darkmode.css"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Remove CSS Error:", chrome.runtime.lastError);
        } else {
          console.log(`CSS removed from tab ${tabId}`);
        }
      }
    );
  }
}

// Handle toolbar button clicks
chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.url.startsWith("https://docs.advania.se")) {
    chrome.storage.local.get("darkModeEnabled", (data) => {
      const newValue = !data.darkModeEnabled;
      chrome.storage.local.set({ darkModeEnabled: newValue }, () => {
        updateIcon(newValue);
        updateTabCSS(tab.id, newValue);
      });
    });
  }
});

// Update the icon based on the dark mode state
function updateIcon(enabled) {
  const iconPath = enabled ? "icons/icon-enabled.png" : "icons/icon-disabled.png";
  chrome.action.setIcon({ path: iconPath });
}

// Inject or remove CSS when the tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.startsWith("https://docs.advania.se")
  ) {
    chrome.storage.local.get("darkModeEnabled", (data) => {
      updateTabCSS(tabId, data.darkModeEnabled !== false);
    });
  }
});

// Inject or remove CSS when the tab is activated
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && tab.url.startsWith("https://docs.advania.se")) {
      chrome.storage.local.get("darkModeEnabled", (data) => {
        updateTabCSS(tab.id, data.darkModeEnabled !== false);
      });
    }
  });
});

// Update CSS when darkModeEnabled changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.darkModeEnabled) {
    chrome.tabs.query({ url: "https://docs.advania.se/*" }, (tabs) => {
      tabs.forEach((tab) => {
        updateTabCSS(tab.id, changes.darkModeEnabled.newValue !== false);
      });
    });
  }
});
