import { DEFAULT_PLUGINS } from "@/helpers/plugin/list";
import type { PluginId } from "@/helpers/plugin/types";

const enabledPlugins = storage.defineItem<PluginId[]>("local:enabledPlugins", {
	fallback: DEFAULT_PLUGINS,
});

export const getEnabledPlugins = () => enabledPlugins.getValue();

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
