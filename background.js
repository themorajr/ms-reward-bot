let intervalId;
let isRunning = false;

const INTERVAL_DURATION = 2000; // 2 seconds
const TAB_CLOSE_DELAY = 10000; // 10 seconds
const DESKTOP_SEARCH_LIMIT = 40;
const MOBILE_SEARCH_LIMIT = 25;
const BADGE_TEXT_ON = "ON";
const BADGE_TEXT_OFF = "";
const BADGE_TEXT_EMERGENCY = "!";

function generateQuery() {
  return Math.random().toString(36).substring(2);
}

function createTab(url, onTabCreated) {
  chrome.tabs.create({ url, active: false }, onTabCreated);
}

function closeTabAfterDelay(tabId, delay) {
  setTimeout(() => {
    chrome.tabs.remove(tabId);
  }, delay);
}

function performDesktopSearch() {
  let counter = 0;
  intervalId = setInterval(() => {
    const query = generateQuery();
    createTab(`https://www.bing.com/search?q=${query}`, (tab) => {
      counter++;
      if (counter >= DESKTOP_SEARCH_LIMIT) stopSearch();
      closeTabAfterDelay(tab.id, TAB_CLOSE_DELAY);
    });
  }, INTERVAL_DURATION);
}

function performMobileSearch() {
  let counter = 0;
  intervalId = setInterval(() => {
    const query = generateQuery();
    const url = `https://www.bing.com/search?q=${query}&PC=SANSAAND&form=LWS001&ssp=1&cc=XL&setlang=th&safesearch=moderate`;
    fetch(url);
    counter++;
    if (counter >= MOBILE_SEARCH_LIMIT) stopSearch();
  }, INTERVAL_DURATION);
}

function stopSearch() {
  clearInterval(intervalId);
  isRunning = false;
  updateBadge(BADGE_TEXT_OFF);
}

function startSearch(searchFunction) {
  searchFunction();
  isRunning = true;
  updateBadge(BADGE_TEXT_ON, "#008000");
}

function emergencyStop() {
  stopSearch();
  updateBadge(BADGE_TEXT_EMERGENCY, "#ff0000");
}

function updateBadge(text, color) {
  chrome.action.setBadgeText({ text });
  if (color) chrome.action.setBadgeBackgroundColor({ color });
}

chrome.action.onClicked.addListener(() => {
  if (isRunning) {
    stopSearch();
  } else {
    startSearch(performDesktopSearch);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  switch (message.command) {
    case "start":
      startSearch(performDesktopSearch);
      break;
    case "stop":
      stopSearch();
      break;
    case "emergencyStop":
      emergencyStop();
      break;
    case "mobileSearch":
      startSearch(performMobileSearch);
      break;
  }
});
