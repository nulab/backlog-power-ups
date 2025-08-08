import { defineConfig } from "wxt";

export default defineConfig({
    manifest: {
        default_locale: "ja",
        name: "__MSG_app_name__",
        description: "__MSG_app_description__",
        permissions: ['storage']
    },
    modules: ["@wxt-dev/i18n/module", "@wxt-dev/auto-icons"],
});
