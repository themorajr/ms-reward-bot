# Bing Search Extension for MS Rewards

A small browser extension that automates Bing searches to help collect Microsoft Rewards points. It opens background tabs with randomly generated, natural-looking queries, spaced out at a randomized interval, and closes them automatically.

> **Disclaimer:** Automating searches violates the Microsoft Rewards terms of use and can get an account suspended. Use at your own risk.

## Features

- **PC search** — runs 40 desktop searches in background tabs.
- **Mobile search** — runs 25 searches that Bing sees as coming from an Android phone. A [declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest) session rule rewrites the `User-Agent` (and mobile client hint headers) for the generated search requests only, so your normal browsing on bing.com is unaffected. No cookie copying needed.
- **Live progress** — the toolbar badge counts down the remaining searches, and the popup shows the current run status.
- **Stop / Emergency stop** — Stop ends the run; Emergency Stop also closes any search tabs that are still open.

## Compatibility

Works in Chrome and Edge (any Chromium browser with Manifest V3 support).

## Installation

1. Clone or download this repository.
2. Open the extensions page: `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge) and enable **Developer mode**.
3. Click **Load unpacked** and select the repository folder.

## Usage

1. Sign in to your Microsoft account on [bing.com](https://www.bing.com).
2. Click the extension icon to open the popup.
3. Pick **Start PC Search** or **Start Mobile Search**. Searches open as background tabs and close themselves after a few seconds.
4. Use **Stop Search** to end the run, or **Emergency Stop** to end it and immediately close all remaining search tabs.

## Configuration

Timing and limits are constants at the top of `background.js`:

| Constant | Default | Meaning |
|---|---|---|
| `SEARCH_INTERVAL_MS` | `6000` | Base delay between searches |
| `SEARCH_JITTER_MS` | `4000` | Random extra delay added to each search |
| `TAB_CLOSE_DELAY_MS` | `10000` | How long each search tab stays open |
| `DESKTOP_SEARCH_LIMIT` | `40` | Searches per PC run |
| `MOBILE_SEARCH_LIMIT` | `25` | Searches per mobile run |

## Project layout

| File | Purpose |
|---|---|
| `manifest.json` | MV3 manifest (permissions: bing.com host access + `declarativeNetRequestWithHostAccess`) |
| `background.js` | Service worker: search loop, badge, mobile UA rule |
| `popup.html` / `popup.js` / `custom.css` | Popup UI |

## License

See [LICENSE](LICENSE).
