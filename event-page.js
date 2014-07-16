var activationList = {};

var states = {
	active: {
		icons: {
			'19': 'icon-color-19.png',
			'38': 'icon-color-38.png'
		},
		title: 'Turn black and white mode off',
		code: 'document.documentElement.classList.add("black-and-white-mode")'
	},
	inactive: {
		icons: {
			'19': 'icon-bw-19.png',
			'38': 'icon-bw-38.png'
		},
		title: 'Turn black and white mode on',
		code: 'document.documentElement.classList.remove("black-and-white-mode")'
	}
};

function setActive(activate, tabId) {
	if (!activationList[tabId].possibleToInject) {
		return;
	}

	activationList[tabId].activated = activate;

	var props = activate ? states.active : states.inactive;
	chrome.browserAction.setIcon({ path: props.icons, tabId: tabId });
	chrome.browserAction.setTitle({ title: props.title, tabId: tabId });
	chrome.tabs.executeScript({ code: props.code, allFrames: true });
}

chrome.browserAction.onClicked.addListener(function(tab) {
	var tabId = tab.id;
	if (!activationList[tabId]) {
		activationList[tabId] = { possibleToInject: true, activated: false };

		chrome.tabs.insertCSS({ file: 'black-and-white.css', allFrames: true }, function() {
			if (chrome.runtime.lastError) {
				activationList[tabId].possibleToInject = false;
			} else {
				setActive(true, tabId);
			}
		});
	} else {
		setActive(!activationList[tabId].activated, tabId);
	}
});

// TODO: this is not compatible with history.pushState() yet
// css needs to be re-injected after a reload
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	if (changeInfo.status === 'loading') {
		delete activationList[tabId];
	}
});