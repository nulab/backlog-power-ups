export const autoResolution = definePowerUpsPlugin({
	group: "issue",
	defaultEnabled: true,
	allFrames: true,
	matches: ["/view/**", "/gantt/**", "/user/**"],
	main({ observeQuerySelector, addEventListener }) {
		const setResolution = async () => {
			await raf();

			const resolution = document.querySelector(
				":where(#resolutionLabel ~ * button[role='combobox'], button[role='combobox'][aria-labelledby='resolutionLabel'])",
			);

			if (!(resolution instanceof HTMLElement)) {
				return;
			}

			resolution.click();

			await raf();

			if (
				document.querySelector(
					":where(#resolutionLabel, button[role='combobox'][aria-labelledby='resolutionLabel']) ~ * li[role='option'][aria-selected='true']",
				)
			) {
				resolution.click();
			} else {
				for (const el of document.querySelectorAll(
					":where(#resolutionLabel, button[role='combobox'][aria-labelledby='resolutionLabel']) ~ * li[role='option']",
				)) {
					if (!(el instanceof HTMLLIElement)) {
						continue;
					}

					if (["Fixed", "対応済み"].includes(el.textContent)) {
						el.click();
						break;
					}
				}
			}

			await raf();

			const status =
				document.querySelector("#statusLabel ~ * button[role='combobox']") ||
				document.querySelector(
					".status-chosen-wrapper button[role='combobox']",
				);

			if (!(status instanceof HTMLElement)) {
				return;
			}

			status.focus();
		};

		observeQuerySelector("li.status-chosen__item--4", (el) => {
			addEventListener(el, "click", setResolution);

			return () => {
				el.removeEventListener("click", setResolution);
			};
		});

		observeQuerySelector("#changeToNextStatus", (el) => {
			const handleClick = (e: Event) => {
				if (e.currentTarget instanceof HTMLButtonElement) {
					const { textContent } = e.currentTarget;

					if (
						textContent === "完了に設定" ||
						textContent === 'Set to "Closed"'
					) {
						setResolution();
					}
				}
			};

			addEventListener(el, "click", handleClick);

			return () => {
				el.removeEventListener("click", handleClick);
			};
		});
	},
});
