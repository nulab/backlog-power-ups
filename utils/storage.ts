import { DEFAULT_PLUGINS, type PluginId } from "@/utils/plugins.ts";

export const enabledPlugins = storage.defineItem<PluginId[]>(
	"local:enabledPlugins",
	{
		fallback: DEFAULT_PLUGINS,
	},
);

export const isPluginEnabled = async (pluginId: PluginId): Promise<boolean> => {
	const enabledPluginIds = await enabledPlugins.getValue();

	return enabledPluginIds.includes(pluginId);
};

export const isPluginDisabled = async (
	pluginId: PluginId,
): Promise<boolean> => {
	const enabled = await isPluginEnabled(pluginId);

	return !enabled;
};
