// @ts-nocheck

export default defineContentScript({
	matches: [
		"https://*.backlog.jp/view/*",
		"https://*.backlogtool.com/view/*",
		"https://*.backlog.com/view/*",
	],
	async main() {
		const { default: $ } = await import("jquery");
		const { PowerUps } = await import("@/utils/power-ups");

		const setup = () => {
			setTimeout(() => {
				$("li.status-chosen__item--4").on("click", () => {
					const script = document.createElement("script");
					script.textContent = `ko.contextFor($("#resolutionLeft")[0]).$data.resolutionChosen.value(0)`;
					document.body.appendChild(script);
					script.remove();
				});
			}, 1000);
		};

		PowerUps.isEnabled("auto-resolution", (enabled: any) => {
			if (enabled) {
				setup();
			}
		});
	},
});
