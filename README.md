
# Bing Search Extension for MS Rewards

This is a straightforward browser extension designed for Bing searches, streamlining the process of earning Microsoft Rewards points. The extension automates the search of random text on Bing, reaching the daily limit of 30 searches to maximize MS Rewards points.

## Compatibility
The extension is compatible with both Chrome and Edge browsers.

## Installation

1. Clone or download this repository to your local machine.
2. Open the "Extensions" page in your browser by typing chrome://extensions/ for Chrome or edge://extensions/ for Edge. Ensure that "Developer mode" is enabled.
3. Click on the "Load unpacked" button and select the directory where the downloaded extension is located.

## Usage

### PC Search

1. Open Bing.com in your browser and make sure you are signed in to your Microsoft account.
2. Click on the extension icon in your browser.
3. The extension will automatically search random text 30 times on Bing, earning you MS Rewards points.

### Mobile Search

1. To use Mobile Search, open Bing.com on your mobile device and sign in to your Microsoft account.
2. Copy the cookie value from your mobile browser. In Chrome, you can do this by going to the "Application" tab in the developer tools, expanding the "Cookies" section, and copying the value of the "MUID" cookie.
3. Paste the cookie value into the "cookie" variable in the `background.js` file.
4. Click on the extension icon in your browser.
5. The extension will automatically search random text 20 times on Bing, earning you MS Rewards points.

## Note

If utilizing the Mobile Search feature, ensure to insert your cookie in the code before running the extension.
