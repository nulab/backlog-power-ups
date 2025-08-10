import { minimatch } from "minimatch";
import type { ContentScriptContext } from "wxt/utils/content-script-context";
import { PLUGINS } from "@/helpers/plugin/list.ts";
import { getPluginStates } from "@/helpers/plugin-manager/storage.ts";

const activePluginMap = new Map<string, (typeof PLUGINS)[number]>();

export const createPluginManager = async (_ctx: ContentScriptContext) => {
	const pluginStates = await getPluginStates();

	const onRouteChange = (pathname: string) => {
		for (const [id, { matches, invalidate }] of activePluginMap.entries()) {
			const isMatched = matches.some((match) => minimatch(pathname, match));

			if (!isMatched) {
				invalidate();
				activePluginMap.delete(id);
			}
		}

		for (const plugin of PLUGINS) {
			if (!pluginStates[plugin.pluginId]) {
				continue;
			}

			const isMatched = plugin.matches.some((match) =>
				minimatch(pathname, match),
			);

			if (isMatched && !activePluginMap.has(plugin.pluginId)) {
				plugin.initialize(pluginStates);
				activePluginMap.set(plugin.pluginId, plugin);
			}
		}
	};

	return { onRouteChange };
};
