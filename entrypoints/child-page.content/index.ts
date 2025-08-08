// @ts-nocheck

export default defineContentScript({
	matches: [
		"https://*.backlog.jp/wiki/*/*",
		"https://*.backlogtool.com/wiki/*/*",
		"https://*.backlog.com/wiki/*/*",
	],
	async main() {
		const { default: $ } = await import("jquery");
		const { PowerUps } = await import("@/utils/power-ups");
		const PATTERN = /^[/]wiki[/]([A-Z_0-9]+)[/]([^\/]+)$/;

		const showPageView = () => {
			$(".title-group .icon-button").on("click", () => {
				const parts = PATTERN.exec(location.pathname);
				const projectKey = parts[1];
				const pageName = decodeURIComponent(parts[2]);
				if (pageName.indexOf("/") === -1) {
					return true;
				}
				const paths = pageName.split("/");
				paths[paths.length - 1] = "New Child Page";
				const parent = paths.join("/");
				location.href = `/wiki/${projectKey}/${encodeURIComponent(parent)}/create`;
				return false;
			});
		};

		const main = () => {
			if (location.pathname.match(PATTERN)) {
				setTimeout(() => {
					showPageView();
				}, 0);
			}
		};

		PowerUps.isEnabled("child-page", (enabled) => {
			if (enabled) {
				main();
			}
		});
	},
});
