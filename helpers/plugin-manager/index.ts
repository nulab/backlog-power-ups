import { minimatch } from "minimatch";
import type { ContentScriptContext } from "wxt/utils/content-script-context";
import type { InvalidateFunction } from "@/helpers/dom/types.ts";
import { PLUGINS } from "@/helpers/plugin/list.ts";
import { getPluginStates } from "@/helpers/plugin-manager/storage.ts";

const activePluginMap = new Map<
	string,
	{ plugin: (typeof PLUGINS)[number]; invalidate: InvalidateFunction }
>();

export const createPluginManager = async (ctx: ContentScriptContext) => {
	const pluginStates = await getPluginStates();

	const onRouteChange = (pathname: string) => {
		for (const [
			id,
			{
				plugin: { pluginId, matches },
				invalidate,
			},
		] of activePluginMap.entries()) {
			const isMatched = matches.some((match) => minimatch(pathname, match));

			if (!isMatched) {
				logger.info(
					`invalidating %c${pluginId}%c plugin${
						isMainFrame ? "" : " in subframe"
					}`,
					"font-weight: bold; color: #ed8077",
					"font-weight: normal",
				);

				invalidate();
				activePluginMap.delete(id);
			}
		}

		for (const plugin of PLUGINS) {
			if (
				!pluginStates[plugin.pluginId] ||
				(!isMainFrame && !plugin.allFrames)
			) {
				continue;
			}

			const matched = plugin.matches.find((match) =>
				minimatch(pathname, match),
			);

			if (plugin.pluginId === "ganttFilterParentAndChild") {
				console.log(plugin, matched, pathname);
			}

			if (matched && !activePluginMap.has(plugin.pluginId)) {
				logger.info(
					`initializing %c\`${plugin.pluginId}\`%c plugin${
						isMainFrame ? "" : " in subframe"
					} (matched %c\`${matched}\`%c)`,
					isMainFrame
						? "font-weight: bold; color: #5eb5a6"
						: "font-weight: bold; color: #ea733b",
					"font-weight: normal",
					"font-weight: bold; color: #666",
					"font-weight: normal",
				);

				const invalidate = plugin.initialize(ctx, pluginStates);
				activePluginMap.set(plugin.pluginId, { plugin, invalidate });
			}
		}
	};

	return { onRouteChange, pluginStates };
};
