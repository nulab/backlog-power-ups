import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		default_locale: "en",
		name: "__MSG_app_name__",
		description: "__MSG_app_description__",
		permissions: ["storage", "tabs"],
	},
	modules: [
		"@wxt-dev/module-react",
		"@wxt-dev/i18n/module",
		"@wxt-dev/auto-icons",
	],
});
