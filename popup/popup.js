$(() => {
    const keys = ["copy-issue", "auto-resolution", "extend-desc", "clear-notified-users", "paste-file-from-clipboard", "copy-wiki", "child-page", "plantuml", "hr", "filter-notification", "user-switcher"];
    const defaultSettings = {};
    for(const key of keys) {
        defaultSettings[key] = false;
    }
    chrome.storage.local.get(keys, (storedSettings) => {
        const initialSettings = Object.assign(defaultSettings, storedSettings)
        const settings = Object.assign({}, initialSettings);
        const groups = [
            {
                text:  chrome.i18n.getMessage("popup_issue"),
                items: [
                    {
                        id: "copy-issue",
                        text: chrome.i18n.getMessage("popup_copy_issue"),
                        enabled: settings["copy-issue"]
                    },
                    {
                        id: "auto-resolution",
                        text: chrome.i18n.getMessage("popup_auto_resolution"),
                        enabled: settings["auto-resolution"]
                    },
                    {
                        id: "extend-desc",
                        text: chrome.i18n.getMessage("popup_extend_desc"),
                        enabled: settings["extend-desc"]
                    },
                    {
                        id: "clear-notified-users",
                        text: chrome.i18n.getMessage("popup_clear_notified_users"),
                        enabled: settings["clear-notified-users"]
                    },
                    {
                        id: "paste-file-from-clipboard",
                        text: chrome.i18n.getMessage("popup_paste_file_from_clipboard"),
                        enabled: settings["paste-file-from-clipboard"]
                    }
                ]
            },
            {
                text:  chrome.i18n.getMessage("popup_wiki"),
                items: [
                    {
                        id: "copy-wiki",
                        text: chrome.i18n.getMessage("popup_copy_wiki"),
                        enabled: settings["copy-wiki"]
                    },
                    {
                        id: "child-page",
                        text: chrome.i18n.getMessage("popup_child_page"),
                        enabled: settings["child-page"]
                    },
                    {
                        id: "plantuml",
                        text: chrome.i18n.getMessage("popup_plantuml"),
                        enabled: settings["plantuml"]
                    },
                    {
                        id: "hr",
                        text: chrome.i18n.getMessage("popup_hr"),
                        enabled: settings["hr"]
                    }
                ]
            },
            {
                text:  chrome.i18n.getMessage("popup_general"),
                items: [
                    {
                        id: "filter-notification",
                        text: chrome.i18n.getMessage("popup_filter_notification"),
                        enabled: settings["filter-notification"]
                    },
                    {
                        id: "user-switcher",
                        text: chrome.i18n.getMessage("popup_user_switcher"),
                        enabled: settings["user-switcher"]
                    }
                ]
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
              groups: groups,
              i18n: chrome.i18n
            }
        });
    });
});