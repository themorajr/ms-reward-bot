let intervalId;
let isRunning = false;

function searchBing() {
  let counter = 0;
  intervalId = setInterval(() => {
    const query = Math.random().toString(36).substring(2); // Generate random text
    chrome.tabs.create({ url: `https://www.bing.com/search?q=${query}`, active: false }, (tab) => {
      counter++;
      if (counter >= 30) {
        stopSearch(); // Stop the search when the counter reaches 30
      }
      setTimeout(() => {
        chrome.tabs.remove(tab.id); // Close the tab after 10 seconds
      }, 10000);
    });
  }, 2000); // Search every 2 seconds
}

function stopSearch() {
  clearInterval(intervalId);
  isRunning = false;
  chrome.action.setBadgeText({ text: "" });
}

function startSearch() {
  searchBing();
  isRunning = true;
  chrome.action.setBadgeText({ text: "ON" });
  chrome.action.setBadgeBackgroundColor({ color: "#008000" });
}

function emergencyStop() {
  stopSearch();
  chrome.action.setBadgeText({ text: "!" });
  chrome.action.setBadgeBackgroundColor({ color: "#ff0000" });
}

chrome.action.onClicked.addListener((tab) => {
  if (isRunning) {
    stopSearch();
  } else {
    startSearch();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "start") {
    startSearch();
  } else if (message.command === "stop") {
    stopSearch();
  } else if (message.command === "emergencyStop") {
    emergencyStop();
  }
});