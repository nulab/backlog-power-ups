$(() => {
    chrome.storage.local.get(["copy-issue", "auto-resolution"], (settings) => {
        const items = [
            {
                id: "copy-issue",
                text: "別のプロジェクトに課題を複製",
                enabled: settings["copy-issue"]
            },
            {
                id: "auto-resolution",
                text: "状態の完了時、自動的に完了理由を対応済みにする",
                enabled: settings["auto-resolution"]
            }
        ];
    
        const app = new Vue({
            el: '#app',
            methods: {
                change: (item) => {
                    const setting = {};
                    setting[item.id] = item.enabled;
                    chrome.storage.local.set(setting);
                }
            },
            data: {
              items: items
            }
        });
    });
});