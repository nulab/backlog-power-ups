// @ts-nocheck

export default defineContentScript({
	matches: [
		"https://*.backlog.jp/add/*",
		"https://*.backlogtool.com/add/*",
		"https://*.backlog.com/add/*",
		"https://*.backlog.jp/view/*/edit",
		"https://*.backlogtool.com/view/*/edit",
		"https://*.backlog.com/view/*/edit",
		"https://*.backlog.jp/find/*",
		"https://*.backlogtool.com/find/*",
		"https://*.backlog.com/find/*",
	],
	async main() {
		const { PowerUps } = await import("@/utils/power-ups");
		const selector = "#descriptionTextArea";
		const heightExtended = "480px";
		const limit = 10;

		const updateHeight = (elem) => {
			elem.style.height = heightExtended;
		};

		const checkElement = async (selector) => {
			for (
				let i = 0;
				i < limit && document.querySelector(selector) === null;
				i++
			) {
				await new Promise((resolve) => setInterval(resolve, 100));
			}
			return document.querySelector(selector);
		};

		const extend = () => {
			if (
				location.pathname.startsWith("/add/") ||
				location.pathname.match(/[/]view[/][A-Z_0-9]+[-][0-9]+[/]edit/)
			) {
				checkElement(selector).then((elem) => {
					if (elem) {
						updateHeight(elem);
					} else {
						console.log("failed to extend textarea");
					}
				});
			}
		};

		const main = () => {
			extend();
			const observer = new MutationObserver(() => {
				extend();
			});
			observer.observe(document.getElementsByTagName("title")[0], {
				childList: true,
			});
		};

		PowerUps.isEnabled("extend-desc", (enabled) => {
			if (enabled) {
				main();
			}
		});
	},
});
