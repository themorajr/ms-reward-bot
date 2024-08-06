// Constants
const INTERVAL_DURATION = 2000; // 2 seconds
const TAB_CLOSE_DELAY = 10000; // 10 seconds
const DESKTOP_SEARCH_LIMIT = 40;
const MOBILE_SEARCH_LIMIT = 25;
const BADGE_TEXT = {
  ON: "ON",
  OFF: "",
  EMERGENCY: "!"
};

// State
let intervalId;
let isRunning = false;

// Utility functions
const generateQuery = () => Math.random().toString(36).substring(2);

const createTab = async (url) => {
  return new Promise((resolve) => {
    chrome.tabs.create({ url, active: false }, resolve);
  });
};

const closeTabAfterDelay = (tabId, delay) => {
  setTimeout(() => chrome.tabs.remove(tabId), delay);
};

const updateBadge = (text, color = null) => {
  chrome.action.setBadgeText({ text });
  if (color) chrome.action.setBadgeBackgroundColor({ color });
};

// Search functions
const performSearch = async (searchUrl, limit) => {
  let counter = 0;
  intervalId = setInterval(async () => {
    const query = generateQuery();
    const url = searchUrl(query);
    
    if (searchUrl === desktopSearchUrl) {
      const tab = await createTab(url);
      closeTabAfterDelay(tab.id, TAB_CLOSE_DELAY);
    } else {
      await fetch(url);
    }
    
    counter++;
    if (counter >= limit) stopSearch();
  }, INTERVAL_DURATION);
};

const desktopSearchUrl = (query) => `https://www.bing.com/search?q=${query}`;
const mobileSearchUrl = (query) => `https://www.bing.com/search?q=${query}&PC=SANSAAND&form=LWS001&ssp=1&cc=XL&setlang=th&safesearch=moderate`;

const performDesktopSearch = () => performSearch(desktopSearchUrl, DESKTOP_SEARCH_LIMIT);
const performMobileSearch = () => performSearch(mobileSearchUrl, MOBILE_SEARCH_LIMIT);

// Control functions
const stopSearch = () => {
  clearInterval(intervalId);
  isRunning = false;
  updateBadge(BADGE_TEXT.OFF);
};

const startSearch = (searchFunction) => {
  searchFunction();
  isRunning = true;
  updateBadge(BADGE_TEXT.ON, "#008000");
};

const emergencyStop = () => {
  stopSearch();
  updateBadge(BADGE_TEXT.EMERGENCY, "#ff0000");
};

// Event listeners
chrome.action.onClicked.addListener(() => {
  isRunning ? stopSearch() : startSearch(performDesktopSearch);
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
