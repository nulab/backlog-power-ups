import styles from "./index.module.css";

export default defineContentScript({
	matches: defineMatches(["/wiki/*", "/alias/wiki/*"]),
	async main() {
		if (await isPluginDisabled("old-post")) {
			return;
		}

		observeQuerySelector(".user-history", (el) => {
			console.log("find element", el);

			const text =
				el.querySelector(".user-icon-set:last-child .user-icon-set__text")
					?.textContent || "";
			const [dateInJapanese] =
				/[0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/.exec(text) ||
				[];
			const [dateInEnglish] =
				/[A-Za-z]{3}\. [0-9]{2}, [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}/.exec(
					text,
				) || [];
			const date = dateInJapanese || dateInEnglish;

			if (!date) {
				return;
			}

			const diffMs = Date.now() - new Date(date).getTime();
			const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

			if (diffDays < 365) {
				return;
			}

			const messageHtml = html`
                <p class=${styles.message}>
                    ${i18n.t("old_post.alert")}
                </p>
            `;

			document
				.getElementById("mainTitle")
				?.insertAdjacentHTML(
					"afterend",
					Array.isArray(messageHtml) ? messageHtml[0] : messageHtml,
				);
		});
	},
});
