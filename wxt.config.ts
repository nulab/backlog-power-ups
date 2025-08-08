import { defineConfig } from "wxt";

export default defineConfig({
    manifest: {
        default_locale: "ja",
        name: "__MSG_ext_name__",
        description: "__MSG_ext_description__",
    },
    modules: ["@wxt-dev/i18n/module", "@wxt-dev/auto-icons"],
});