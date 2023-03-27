
# Bing Search Extension for MS Rewards

This is a simple extension for Bing search that automates the process of earning MS Rewards by searching random text on Bing. It runs the search 30 times in a row, which is the daily limit for earning MS Rewards points.

This extension works on Chrome and Edge browsers.

## Installation

1. Clone or download this repository to your local machine.
2. Open the "Extensions" page in your browser by typing `chrome://extensions/` in Chrome or `edge://extensions/` in Edge. Make sure the "Developer mode" is turned on.
3. Click on the "Load unpacked" button and select the directory where the downloaded extension is placed.

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

If you are using the MobileSearch feature, you need to insert your cookie in the code before running the extension.
