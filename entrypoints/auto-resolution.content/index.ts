export default defineContentScript({
	matches: defineMatches(["/view/*"]),
	async main() {
		if (await isPluginDisabled("auto-resolution")) {
			return;
		}

		const handleClick: EventListenerOrEventListenerObject = async (e) => {
			const resolution = document.querySelector(
				"#resolutionLabel ~ * button[role='combobox']",
			);

			if (!(resolution instanceof HTMLElement)) {
				return;
			}

			resolution.click();

			await raf();

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
