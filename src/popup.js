let settings = {};
getSettings(function (data) {
    settings = data;
});

let enableToggleButton = document.getElementById("enable-toggle");
let enableLabel = document.getElementById('enable-label');
let error = document.getElementById("error");
let subscriptionPlanLabel = document.getElementById("subscription-plan-label");
let openInstaSection = document.getElementById("open-insta-section");

let isEnable = true;
let needsSubscription = false;
let isPremium = true;

updateViewsVisibility()

window.onload = function () {
    getSettings(function (json) {
        settings = json;
        console.log(json);

        isEnable = settings["enable-toggle"] !== undefined && settings["enable-toggle"] === true;

        if (settings["subscribed"] !== undefined && settings["subscribed"] === true) {
            needsSubscription = false;
            isPremium = true;
            updateViewsVisibility()
        } else {
            needsSubscription = false;
            isPremium = true;
            updateViewsVisibility()
        }
    })
}

enableToggleButton.addEventListener('change', function () {
    console.log('enable toggle change')
    if (needsSubscription) {
        this.checked = !this.checked;
        return;
    }
    isEnable = this.checked;
    enableExtention(isEnable, function () {
        getSettings(function (json) {
            settings = json;
        })
    })
    updateViewsVisibility();
});

function updateViewsVisibility() {
    enableToggleButton.checked = isEnable
    if (isEnable) {
        enableLabel.textContent = "Ghostify is working"
        chrome.tabs.query({
            active: true,
            url: "https://*.instagram.com/*",
            lastFocusedWindow: true
        }, function (tabs) {
            if (tabs.length)
                openInstaSection.classList.add('is-hidden')
            else
                openInstaSection.classList.remove('is-hidden')
        });
    } else {
        enableLabel.textContent = "Ghostify is disabled"
        openInstaSection.classList.add('is-hidden')
    }

    subscriptionPlanLabel.classList.remove('is-hidden');
    subscriptionPlanLabel.textContent = "You are using the premium version";
}