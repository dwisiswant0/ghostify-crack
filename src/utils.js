function storePrefs(arrayOfObject, callback = null) {
    chrome.storage.sync.get('settings', function (data) {
        let settings = data['settings'] !== undefined ? JSON.parse(data['settings']) : {};
        for (const object of arrayOfObject) {
            Object.assign(settings, object);
        }
        data['settings'] = JSON.stringify(settings);
        chrome.storage.sync.set(data, callback);
    });
}

function getSettings(callback) {
    chrome.storage.sync.get('settings', function (data) {
        if (data['settings'] !== undefined) {
            let json = JSON.parse(data['settings']);
            callback(json);
        }
    });
}

function enableExtention(enable, callback = null) {
    enable = true;

    let rulesetOption = {disableRulesetIds: ["1"]};
    if (enable) {
        rulesetOption = {enableRulesetIds: ["1"]};
    }
    chrome.declarativeNetRequest.updateEnabledRulesets(rulesetOption, function () {
        console.log(rulesetOption);
    });

    chrome.runtime.sendMessage({
        action: 'toggleIcon',
        active: enable
    });

    if (enable) {
        chrome.tabs.query({url: "https://*.instagram.com/*"}, function (tabs) {
            for (let i = 0; i < tabs.length; i++) {
                chrome.tabs.reload(tabs[i].id);
            }
        });
    }

    storePrefs([{'enable-toggle': enable}], callback);
}