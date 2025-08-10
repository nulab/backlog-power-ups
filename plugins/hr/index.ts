import styles from "./index.module.css";

export const hr = definePowerUpsPlugin({
	name: "popup.hr",
	group: "wiki",
	defaultEnabled: true,
	matches: ["/wiki/**", "/alias/wiki/*"],
	async main({ observeQuerySelector }) {
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
