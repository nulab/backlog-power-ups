import type { PluginId } from "@/helpers/plugin/types";
import {
	getEnabledPlugins,
	setEnabledPlugins,
} from "@/helpers/plugin-manager/storage";

let enabledPluginIds: PluginId[] | undefined;

export const usePlugins = () => {
	if (!enabledPluginIds) {
		throw getEnabledPlugins().then((plugins) => {
			enabledPluginIds = plugins;
		});
	}

	const setEnabledPluginIds = async (plugins: PluginId[]) => {
		await setEnabledPlugins(plugins);
	};

	return [enabledPluginIds, setEnabledPluginIds] as const;
};
