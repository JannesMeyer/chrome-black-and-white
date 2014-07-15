var activationList = {};

chrome.browserAction.onClicked.addListener(function(tab) {
	var entry = activationList[tab.id];
	if (!entry) {
		entry = { activated: false };
		chrome.tabs.insertCSS({ file: 'black-and-white.css', allFrames: true });
	}

	if (!entry.activated) {
		// activate
		entry.activated = true;
		chrome.browserAction.setIcon({
			path: {
				'19': 'icon-bw-19.png',
				'38': 'icon-bw-38.png'
			},
			tabId: tab.id
		});
		chrome.browserAction.setTitle({
			title: 'Turn color mode on',
			tabId: tab.id
		});
		chrome.tabs.executeScript({
			code: 'document.documentElement.classList.add("black-and-white-mode")',
			allFrames: true
		});
	} else {
		// deactivate
		entry.activated = false;
		chrome.browserAction.setIcon({
			path: {
				'19': 'icon-color-19.png',
				'38': 'icon-color-38.png'
			},
			tabId: tab.id
		});
		chrome.browserAction.setTitle({
			title: 'Turn black and white mode on',
			tabId: tab.id
		});
		chrome.tabs.executeScript({
			code: 'document.documentElement.classList.remove("black-and-white-mode")',
			allFrames: true
		});
	}

	// save entry changes
	activationList[tab.id] = entry;
});

// css needs to be re-injected after a reload
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	if (changeInfo.status === 'loading') {
		delete activationList[tabId];
	}
});