import { PLUGINS } from "@/helpers/plugin/list";
import type { PluginId } from "@/helpers/plugin/types";

export type PluginStates = Record<PluginId, boolean>;

const defaultPlugins = PLUGINS.filter(
	({ defaultEnabled }) => defaultEnabled,
).map(({ pluginId }) => pluginId);

const enabledPlugins = storage.defineItem<PluginId[]>("local:enabledPlugins", {
	fallback: defaultPlugins,
});

export const getEnabledPlugins = () => enabledPlugins.getValue();

export const setEnabledPlugins = (plugins: PluginId[]) =>
	enabledPlugins.setValue(plugins);

export const getPluginStates = async () => {
	const pluginsStates = await getEnabledPlugins();
	const pluginIds = PLUGINS.map(({ pluginId }) => pluginId);

	return Object.fromEntries(
		pluginIds.map((id) => [id, pluginsStates.includes(id)]),
	) as PluginStates;
};
