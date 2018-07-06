const POWER_UP_PLUGINS = [
    {
        groupId: "issue",
        pluginIds: [
            "copy-issue", 
            "auto-resolution",
            "extend-desc",
            "customized-issue-list",
            "total-time",
            "backlog-card",
            "draggable-gantt"
        ]
    },
    {
        groupId: "wiki",
        pluginIds: [
            "copy-wiki", 
            "child-page",
            "plantuml",
            "hr"
        ]
    },
    {
        groupId: "general",
        pluginIds: [
            "filter-notification", 
            "user-switcher",
            "relative-date"
        ]
    }
];

const DEFAULT_DISABLED_PLUGINS = [
    "extend-desc",
    "total-time",
    "plantuml",
    "relative-date"
];

class PowerUps {
    static reloadCurrentTab() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
    }

    static injectScript(content) {
		const s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.textContent = content;
		return document.body.appendChild(s);
    }
    
    static getLang() {
        return $("html").attr("lang") == "ja" ? "ja" : "en"
    }

    static toResouceKey(str) {
        return str.split("-").join("_");
    }

    static flatten(array) {
        return array.reduce((a, c) => {
            return Array.isArray(c) ? a.concat(PowerUps.flatten(c)) : a.concat(c);
        }, []);
    };

    static isEnabled(pluginId, callback) {
        PowerUpSettings.getPlugin(pluginId, (plugin) => {
            callback(plugin.enabled);
        });
    }
}

class PowerUpPlugin {
    constructor(pluginId, enabled) {
        this.pluginId = pluginId;
        this.enabled = enabled !== undefined ? enabled : DEFAULT_DISABLED_PLUGINS.includes(pluginId) == false;
        this.text = chrome.i18n.getMessage(`popup_${PowerUps.toResouceKey(pluginId)}`);
    }
}

class PowerUpPluginGroup {
    constructor(groupId, plugins) {
        this.groupId = groupId;
        this.plugins = plugins;
        const messageKey = `popup_${PowerUps.toResouceKey(groupId)}`;
        this.text = chrome.i18n.getMessage(messageKey);
    }

    static getPlugins(groups) {
        return PowerUps.flatten(groups.map((group) => group.plugins));
    }
}

class PowerUpSettings {
    constructor(groups) {
        this.groups = groups;
        this.initialPluginSettingsJson = JSON.stringify(PowerUpSettings.getSettingsFromStorage(this.groups));
    }

    isChanged() {
        return this.initialPluginSettingsJson !== JSON.stringify(PowerUpSettings.getSettingsFromStorage(this.groups));
    }

    store() {
        chrome.storage.local.set(PowerUpSettings.getSettingsFromStorage(this.groups));
    }

    static getSettingsFromStorage(groups) {
        const settings = {};
        for (const p of PowerUpPluginGroup.getPlugins(groups)) {
            settings[p.pluginId] = p.enabled;
        }
        return settings;
    }

    static getPluginIds() {
        return PowerUps.flatten(POWER_UP_PLUGINS.map((groupInfo) => { return groupInfo.pluginIds; }));
    }

    static getPlugins(pluginIds, callback) {
        chrome.storage.local.get(pluginIds, (settings) => {
            const plugins = [];
            for (const pluginId of pluginIds) {
                plugins[pluginId] = new PowerUpPlugin(pluginId, settings[pluginId]);
            }
            callback(plugins);
        });
    }

    static getPlugin(pluginId, callback) {
        PowerUpSettings.getPlugins([pluginId], (plugins) => {
            callback(plugins[pluginId]);
        });
    }

    static load(callback) {
        PowerUpSettings.getPlugins(PowerUpSettings.getPluginIds(), (plugins) => {
            const pluginGroups = [];
            for (const groupInfo of POWER_UP_PLUGINS) {
                const groupPlugins = groupInfo.pluginIds.map((pluginId) => plugins[pluginId]);
                pluginGroups.push(new PowerUpPluginGroup(groupInfo.groupId, groupPlugins));
            }
            callback(new PowerUpSettings(pluginGroups));
        });
    }
}