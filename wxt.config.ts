import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		default_locale: "en",
		name: "__MSG_app_name__",
		description: "__MSG_app_description__",
		permissions: ["storage", "tabs"],
		// Injected into the page's world by the boardBulkStatus plugin. Backlog's
		// CSP refuses inline scripts but allows chrome-extension://<id>/, so the
		// bridge has to be loaded as a web-accessible file.
		web_accessible_resources: [
			{
				resources: ["board-bulk-status-bridge.js"],
				matches: [
					"https://*.backlog.jp/*",
					"https://*.backlog.com/*",
					"https://*.backlogtool.com/*",
				],
			},
		],
	},
	modules: [
		"@wxt-dev/module-react",
		"@wxt-dev/i18n/module",
		"@wxt-dev/auto-icons",
	],
});
