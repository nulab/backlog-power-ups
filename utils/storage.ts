import { DEFAULT_PLUGINS, type PluginId } from "@/utils/plugins.ts";

export const enabledPlugins = storage.defineItem<PluginId[]>(
	"local:enabledPlugins",
	{
		fallback: DEFAULT_PLUGINS,
	},
);
