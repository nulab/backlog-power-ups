export const copyRawFile = definePowerUpsPlugin({
	group: "git",
	matches: ["/git/**/blob/**", "/ViewRepositoryFile.action"],
	defaultEnabled: true,
	allFrames: true,
	main({ observeQuerySelector, asyncQuerySelector }) {
		const handleClick = async () => {
			const codeTable = await asyncQuerySelector(".Code-table");

			if (!(codeTable instanceof HTMLTableElement)) {
				return;
			}

			const source = Array.from(codeTable.querySelectorAll(".Line-src"))
				.map((el) => el.textContent.replace(/\n/g, ""))
				.join("\n");

			await navigator.clipboard.writeText(source);
		};

		const callback = (el: HTMLElement) => {
			if (!document.querySelector(".Code-table")) {
				return;
			}

			const button = createButton(
				html`
          <button type="button" class="button button--default -h-small">
            ${i18n.t("copyRawFile.label")}
          </button>
        `,
				{
					click: handleClick,
				},
			);

			el.insertAdjacentElement("beforeend", button);
		};

		if (location.pathname === "/ViewRepositoryFile.action") {
			observeQuerySelector(
				'form[action="/DownloadRepositoryFile.action"]',
				callback,
			);
		} else {
			observeQuerySelector(".code-view-set__action-buttons", callback);
		}
	},
});
