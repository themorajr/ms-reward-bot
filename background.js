// ===== Configuration =====
const SEARCH_INTERVAL_MS = 6000;  // base delay between searches
const SEARCH_JITTER_MS = 4000;    // random 0..N ms added on top of the base delay
const TAB_CLOSE_DELAY_MS = 10000; // how long each search tab stays open
const DESKTOP_SEARCH_LIMIT = 40;
const MOBILE_SEARCH_LIMIT = 25;

const BADGE = {
  OFF: "",
  EMERGENCY: "!"
};
const BADGE_RUNNING_COLOR = "#008000";
const BADGE_EMERGENCY_COLOR = "#d13438";

// Mobile searches are regular tabs whose main-frame request gets a mobile
// User-Agent via a declarativeNetRequest session rule. The rule only matches
// URLs containing this marker, so normal browsing on bing.com is unaffected.
const MOBILE_UA_RULE_ID = 1;
const MOBILE_URL_MARKER = "form=LWS001";
const MOBILE_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";

// Random real words make queries look like searches instead of base36 noise,
// which Microsoft Rewards is less likely to ignore.
const WORDS = [
  "weather", "recipe", "movie", "music", "football", "coffee", "travel",
  "hotel", "flight", "pizza", "restaurant", "news", "history", "science",
  "space", "ocean", "mountain", "camera", "phone", "laptop", "garden",
  "painting", "guitar", "chocolate", "bicycle", "marathon", "museum",
  "island", "sunset", "breakfast", "workout", "yoga", "puzzle", "chess",
  "novel", "poetry", "camping", "fishing", "robot", "planet", "galaxy",
  "volcano", "desert", "forest", "river", "bridge", "castle", "festival",
  "concert", "theater", "comedy", "drama", "fashion", "design",
  "architecture", "photography", "cooking", "baking", "salad", "smoothie",
  "vitamin", "running", "swimming", "tennis", "basketball", "cricket",
  "anime", "cartoon", "keyboard", "monitor", "headphones", "battery",
  "electric", "solar", "winter", "summer", "autumn", "spring", "holiday",
  "birthday", "wedding", "puppy", "kitten", "dolphin", "eagle", "tiger",
  "panda", "penguin"
];

// ===== State =====
// Lives only while the service worker is awake. Every search tick calls a
// chrome.* API, which resets the worker's 30s idle timer, so the worker
// stays alive for the whole run.
const state = {
  mode: null, // "desktop" | "mobile" | null when idle
  done: 0,
  total: 0,
  timeoutId: null,
  openedTabs: new Set()
};

// ===== Helpers =====
const randomInt = (max) => Math.floor(Math.random() * max);

const generateQuery = () => {
  const count = 2 + randomInt(2);
  const words = [];
  while (words.length < count) {
    const word = WORDS[randomInt(WORDS.length)];
    if (!words.includes(word)) words.push(word);
  }
  return words.join(" ");
};

const buildSearchUrl = (mode, query) => {
  const q = encodeURIComponent(query);
  return mode === "mobile"
    ? `https://www.bing.com/search?q=${q}&${MOBILE_URL_MARKER}`
    : `https://www.bing.com/search?q=${q}&form=QBLH`;
};

const updateBadge = (text, color = null) => {
  chrome.action.setBadgeText({ text });
  if (color) chrome.action.setBadgeBackgroundColor({ color });
};

const setMobileUaRule = () =>
  chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [MOBILE_UA_RULE_ID],
    addRules: [{
      id: MOBILE_UA_RULE_ID,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          { header: "User-Agent", operation: "set", value: MOBILE_USER_AGENT },
          { header: "sec-ch-ua-mobile", operation: "set", value: "?1" },
          { header: "sec-ch-ua-platform", operation: "set", value: "\"Android\"" }
        ]
      },
      condition: {
        urlFilter: MOBILE_URL_MARKER,
        resourceTypes: ["main_frame"]
      }
    }]
  });

const clearMobileUaRule = () =>
  chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [MOBILE_UA_RULE_ID]
  });

const closeTabLater = (tabId) => {
  state.openedTabs.add(tabId);
  setTimeout(() => {
    state.openedTabs.delete(tabId);
    chrome.tabs.remove(tabId).catch(() => {});
  }, TAB_CLOSE_DELAY_MS);
};

const closeOpenedTabs = () => {
  for (const tabId of state.openedTabs) {
    chrome.tabs.remove(tabId).catch(() => {});
  }
  state.openedTabs.clear();
};

// ===== Search loop =====
const scheduleNext = () => {
  state.timeoutId = setTimeout(runNextSearch, SEARCH_INTERVAL_MS + randomInt(SEARCH_JITTER_MS));
};

const runNextSearch = async () => {
  const mode = state.mode;
  if (!mode) return;

  let tab = null;
  try {
    tab = await chrome.tabs.create({ url: buildSearchUrl(mode, generateQuery()), active: false });
  } catch (error) {
    console.warn("Could not open search tab:", error);
  }
  if (tab) closeTabLater(tab.id);
  if (!state.mode) return; // stopped while the tab was being created

  state.done++;
  if (state.done >= state.total) {
    await stopSearch();
  } else {
    updateBadge(String(state.total - state.done));
    scheduleNext();
  }
};

// ===== Control =====
const startSearch = async (mode) => {
  if (state.mode) return; // already running; never start a second loop
  state.mode = mode;
  state.done = 0;
  state.total = mode === "mobile" ? MOBILE_SEARCH_LIMIT : DESKTOP_SEARCH_LIMIT;
  if (mode === "mobile") await setMobileUaRule();
  updateBadge(String(state.total), BADGE_RUNNING_COLOR);
  await runNextSearch();
};

const stopSearch = async ({ badgeText = BADGE.OFF, badgeColor = null, closeTabs = false } = {}) => {
  clearTimeout(state.timeoutId);
  state.timeoutId = null;
  state.mode = null;
  if (closeTabs) closeOpenedTabs();
  await clearMobileUaRule();
  updateBadge(badgeText, badgeColor);
};

const emergencyStop = () =>
  stopSearch({ badgeText: BADGE.EMERGENCY, badgeColor: BADGE_EMERGENCY_COLOR, closeTabs: true });

const getStatus = () => ({
  running: state.mode !== null,
  mode: state.mode,
  done: state.done,
  total: state.total
});

// ===== Messages from the popup =====
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const commands = {
    start: () => startSearch("desktop"),
    mobileSearch: () => startSearch("mobile"),
    stop: () => stopSearch(),
    emergencyStop: emergencyStop,
    getStatus: () => {}
  };
  const command = message && message.command;
  if (!command || !Object.hasOwn(commands, command)) return;
  const handler = commands[command];

  Promise.resolve(handler()).then(() => sendResponse(getStatus()));
  return true; // keep the channel open for the async response
});

// A fresh service worker start means no run is active (in-memory state is
// gone), so drop any badge or UA rule left over from a previous life.
clearMobileUaRule();
updateBadge(BADGE.OFF);
