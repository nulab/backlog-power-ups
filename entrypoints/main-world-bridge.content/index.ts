const EVENT_PREFIX = "backlog-power-ups:main-world";

export default defineContentScript({
	matches: [
		"https://*.backlog.jp/*",
		"https://*.backlog.com/*",
		"https://*.backlogtool.com/*",
	],
	world: "MAIN",
	main() {
		window.addEventListener(`${EVENT_PREFIX}:show-status-message`, ((
			e: CustomEvent<string>,
		) => {
			// @ts-expect-error — Backlog global
			window.Backlog?.StatusBar?.init();
			// @ts-expect-error — Backlog global
			window.Backlog?.StatusBar?.showTextAndHide(e.detail);
		}) as EventListener);
	},
});
