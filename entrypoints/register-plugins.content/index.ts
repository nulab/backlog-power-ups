import pDebounce from "p-debounce";
import { createPluginManager } from "@/helpers/plugin-manager";

export default defineContentScript({
	matches: [
		"https://*.backlog.jp/*",
		"https://*.backlog.com/*",
		"https://*.backlogtool.com/*",
	],
	allFrames: true,
	async main(ctx) {
		const manager = await createPluginManager(ctx);

		if (isMainFrame) {
			const enabledPlugins = Object.entries(manager.pluginStates)
				.filter(([, enabled]) => enabled)
				.map(([id]) => id);
			logger.info(
				`enabled ${enabledPlugins.length} plugins: %c${enabledPlugins.join(
					", ",
				)}`,
				"color: #a1af2f",
			);
		}

		let { pathname: currentPathname } = location;

		const onRouteChange = pDebounce(manager.onRouteChange, 10);

		onRouteChange(currentPathname);

		const observer = new MutationObserver(() => {
			const { pathname } = location;

			if (currentPathname !== pathname) {
				currentPathname = pathname;

				onRouteChange(currentPathname);
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });
	},
});
