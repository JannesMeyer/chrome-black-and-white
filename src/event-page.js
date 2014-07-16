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
	var props = activate ? states.active : states.inactive;
	chrome.browserAction.setIcon({ path: props.icons, tabId: tabId });
	chrome.browserAction.setTitle({ title: props.title, tabId: tabId });
	chrome.tabs.executeScript({ code: props.code, allFrames: true });
}

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.browserAction.getTitle({ tabId: tab.id }, function(title) {
		if (title !== states.active.title) {
			chrome.tabs.insertCSS({ file: 'black-and-white.css', allFrames: true }, function() {
				if (chrome.runtime.lastError) {
					alert('It is impossible to modify this page');
					return;
				}
				setActive(true, tab.id);
			});
		} else {
			setActive(false, tab.id);
		}
	});
});