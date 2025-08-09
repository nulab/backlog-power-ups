export default defineContentScript({
	matches: defineMatches(["/view/*", "/gantt/*"]),
	allFrames: true,
	async main() {
		console.log("running...");

		if (await isPluginDisabled("auto-resolution")) {
			return;
		}

		const handleClick: EventListenerOrEventListenerObject = async (e) => {
			await raf();

			const resolution = document.querySelector(
				"#resolutionLabel ~ * button[role='combobox']",
			);

			if (!(resolution instanceof HTMLElement)) {
				return;
			}

			resolution.click();

			await raf();

			if (
				document.querySelector(
					"#resolutionLabel ~ * li[role='option'][aria-selected='true']",
				)
			) {
				resolution.click();
			} else {
				for (const el of document.querySelectorAll(
					"#resolutionLabel ~ * li[role='option']",
				)) {
					if (!(el instanceof HTMLLIElement)) {
						continue;
					}

					if (["Fixed", "処理済み"].includes(el.textContent)) {
						el.click();
						break;
					}
				}
			}

			await raf();

			const status = document.querySelector(
				"#statusLabel ~ * button[role='combobox']",
			);

			if (!(status instanceof HTMLElement)) {
				return;
			}

			status.focus();
		};

		observeQuerySelector(
			"li.status-chosen__item--4",
			(el) => {
				el.addEventListener("click", handleClick);
			},
			(el) => {
				el.removeEventListener("click", handleClick);
			},
		);
	},
});
