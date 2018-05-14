$(() => {
    const keys = ["copy-issue", "auto-resolution"];
    const defaultSettings = {
        "copy-issue": true,
         "auto-resolution": true
    }
    chrome.storage.local.get(keys, (storedSettings) => {
        const initialSettings = Object.assign(defaultSettings, storedSettings)
        const settings = Object.assign({}, initialSettings);
        const items = [
            {
                id: "copy-issue",
                text: chrome.i18n.getMessage("popup_copy_issue"),
                enabled: settings["copy-issue"]
            },
            {
                id: "auto-resolution",
                text: chrome.i18n.getMessage("popup_auto_resolution"),
                enabled: settings["auto-resolution"]
            }
        ];
        const app = new Vue({
            el: '#app',
            methods: {
                change: (item) => {
                    settings[item.id] = item.enabled;
                },
                isChanged: (item) => {
                    return JSON.stringify(settings) !== JSON.stringify(initialSettings);
                },
                apply: () => {
                    chrome.storage.local.set(settings);
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
                    });
                    close()
                }
            },
            data: {
              items: items,
              i18n: chrome.i18n
            }
        });
    });
});