import { getUntranslatedTexts } from "./translateUi/original-text";

// Backlog labels these in its own wording, so a translateUi plugin may have
// rewritten them by the time this runs.
const FIXED_LABELS = ["Fixed", "対応済み"];
const CLOSE_LABELS = ["完了に設定", 'Set to "Closed"'];

const labelMatches = (text: string | null, labels: string[]) =>
	[text ?? "", ...getUntranslatedTexts(text)].some((candidate) =>
		labels.includes(candidate),
	);

export const autoResolution = definePowerUpsPlugin({
	group: "issue",
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

					if (labelMatches(el.textContent, FIXED_LABELS)) {
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
					if (labelMatches(e.currentTarget.textContent, CLOSE_LABELS)) {
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
