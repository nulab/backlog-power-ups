import styles from "./index.module.css";

export default defineContentScript({
	matches: defineMatches(["/wiki/*", "/alias/wiki/*"]),
	allFrames: true,
	async main() {
		if (await isPluginDisabled("hr")) {
			return;
		}

		observeQuerySelector(".wiki-content p", (el) => {
			if (document.querySelector(".markdown-body")) {
				return;
			}

			if (el.textContent.trim() === "---" || el.textContent.trim() === "___") {
				const hrHtml = html`<hr class=${styles.hr} />`;
				el.innerHTML = Array.isArray(hrHtml) ? hrHtml[0] : hrHtml;
			}
		});
	},
});
