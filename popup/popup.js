$(() => {
    PowerUpSettings.load((settings) => {
        const app = new Vue({
            el: '#app',
            methods: {
                change: (plugin) => {
                    // nothing
                },
                isChanged: (plugin) => {
                    return settings.isChanged();
                },
                apply: () => {
                    settings.store();
                    PowerUps.reloadCurrentTab();
                    close()
                }
            },
            data: {
              groups: settings.groups,
              i18n: chrome.i18n
            }
        });
    });
});