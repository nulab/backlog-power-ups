import styles from "./index.module.css";

export const copyPullSummary = definePowerUpsPlugin({
	group: "git",
	matches: ["/git/*/*/pullRequests/**"],
	defaultEnabled: true,
	allFrames: true,
	main({ observeQuerySelector, addEventListener }) {
		observeQuerySelector(".pull-req-status", (el) => {
			let shiftKey = false;

			const projectKey = getBacklogProjectKey();
			const repoName = document.querySelector(
				".breadcrumbs > .breadcrumbs__item:last-child > a",
			)?.textContent;
			const pullNumber =
				document.querySelector(".pull-req-number")?.textContent;
			const title = document.querySelector(
				".title-group__title-text",
			)?.textContent;

			const pullNumberText = `${projectKey}/${repoName}${pullNumber}`;

			const button = createButton(
				html`
          <button
            type="button"
            class="${styles.button} icon-button icon-button--default | simptip-position-right simptip-movable simptip-smooth simptip-multiline -copy-button-multiline"
            data-tooltip=${i18n.t("copyPullSummary.tooltip", [pullNumberText])}
          >
            <span class="copy-trigger">
              <svg class="icon -medium">
                <use xlink:href="/images/svg/sprite.symbol.svg#icon_copy"></use>
              </svg>
            </span>
          </button>
        `,
				{
					click: async () => {
						const href = `${location.origin}${location.pathname}`;
						const anchorHtml = html`<a href=${href}>${pullNumberText}</a>`;
						const htmlText = `${anchorHtml}${shiftKey ? "" : ` ${title}`}`;
						const plainText = shiftKey
							? pullNumberText
							: `${pullNumberText} ${title}`;

						const clipboardItem = new ClipboardItem({
							"text/html": new Blob([htmlText], { type: "text/html" }),
							"text/plain": new Blob([plainText], { type: "text/plain" }),
						});

						await navigator.clipboard.write([clipboardItem]);
					},
				},
			);

			el.appendChild(button);

			const handleKeyboard = (e: KeyboardEvent) => {
				shiftKey = e.shiftKey && !e.altKey && !e.metaKey && !e.ctrlKey;
			};

			addEventListener(window, "keydown", handleKeyboard);
			addEventListener(window, "keyup", handleKeyboard);

			return () => {
				window.removeEventListener("keydown", handleKeyboard);
				window.removeEventListener("keyup", handleKeyboard);
			};
		});
	},
});
