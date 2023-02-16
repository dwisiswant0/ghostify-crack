try {
    importScripts("utils.js");
} catch (e) {
    console.error(e);
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "toggleIcon") {
        if (msg.active) {
            chrome.action.setIcon({path: "icon128.png"});
        } else {
            chrome.action.setIcon({path: "icon-gray128.png"});
        }
    }
    return true;
});
