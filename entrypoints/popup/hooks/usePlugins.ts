import type { PluginId } from "@/utils/plugins.ts";
import { enabledPlugins } from "@/utils/storage.ts";

let enabledPluginIds: PluginId[] | undefined;

export const usePlugins = () => {
	if (!enabledPluginIds) {
		throw enabledPlugins.getValue().then((plugins) => {
			enabledPluginIds = plugins;
		});
	}

	const setEnabledPluginIds = async (plugins: PluginId[]) => {
		await enabledPlugins.setValue(plugins);
	};

	return [enabledPluginIds, setEnabledPluginIds] as const;
};
