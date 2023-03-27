let intervalId;
let isRunning = false;

function searchBing() {
  let counter = 0;
  intervalId = setInterval(() => {
    const query = Math.random().toString(36).substring(2); // Generate random text
    chrome.tabs.create({ url: `https://www.bing.com/search?q=${query}`, active: false }, (tab) => {
      counter++;
      if (counter >= 40) {
        stopSearch(); // Stop the search when the counter reaches 30
      }
      setTimeout(() => {
        chrome.tabs.remove(tab.id); // Close the tab after 10 seconds
      }, 10000);
    });
  }, 2000); // Search every 2 seconds
}

function searchBingMobile() {
  let counter = 0;
  intervalId = setInterval(() => {
    const query = Math.random().toString(36).substring(2); // Generate random text
    const url = `https://www.bing.com/search?q=${query}&PC=SANSAAND&form=LWS001&ssp=1&cc=XL&setlang=th&safesearch=moderate`;
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 7.1.2; SM-G955N Build/N2G48H; ) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.131 Mobile Safari/537.36 BingSapphire/24.1.410310303",
        "Cookie": //insert your cookie here
      },
    };
    fetch(url, options);
    counter++;
    if (counter >= 25) {
      stopSearch(); // Stop the search when the counter reaches 20
    }
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

function startMobileSearch() {
  searchBingMobile();
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
  } else if (message.command === "mobileSearch") {
    searchBingMobile();
  }
});
