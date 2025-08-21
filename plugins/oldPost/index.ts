import styles from "./index.module.css";

export const oldPost = definePowerUpsPlugin({
	group: "wiki",
	matches: ["/wiki/**", "/alias/wiki/*"],
	defaultEnabled: true,
	allFrames: true,
	async main({ observeQuerySelector }) {
		observeQuerySelector(".user-history", (el) => {
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
        <p class=${styles.message}>${i18n.t("oldPost.alert")}</p>
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
