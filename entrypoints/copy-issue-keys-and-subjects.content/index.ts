export default defineContentScript({
	matches: defineMatches(["/find/*"]),
	async main() {
		if (await isPluginDisabled("copy-issue-keys-and-subjects")) {
			return;
		}

		observeQuerySelector("#my-issues-content", (el) => {
			const handleClick = async () => {
				const expand = document.querySelector(
					'#myIssueContent .see-all > .see-all__link[aria-expanded="false"]',
				);
				if (
					expand instanceof HTMLButtonElement &&
					expand.style.display !== "block"
				) {
					expand.click();
					await raf();
				}

				const issueList = await asyncQuerySelector(
					"#myIssueContent > #issueList",
				);
				const rows = issueList?.querySelectorAll("tbody > tr");

				const text =
					rows &&
					Array.from(rows).map((row) => {
						const key = row.children.item(0)?.textContent.trim();
						const subject = row.children.item(1)?.textContent.trim();

						return `${key} ${subject}`;
					});

				if (text) {
					await navigator.clipboard.writeText(text.join("\n"));
				}
			};

			const button = createButton(
				html`
                    <button 
                        class="icon-button icon-button--default -with-text -responsive-label | simptip-position-top simptip-movable simptip-smooth"
                        data-tooltip=${i18n.t("copy_issue_keys_and_subjects.tooltip")}
                    >
                        <span class="_assistive-text">Copy All</span>
                        <svg role="image" class="icon -medium">
                            <use xlink:href="/images/svg/sprite.symbol.svg#icon_copy"></use>
                        </svg>
                    </button>
                `,
				{
					click: handleClick,
				},
			);

			const span = document.createElement("span");
			span.classList.add("title-group__edit-actions-item");
			span.appendChild(button);

			el.appendChild(span);
		});
	},
});
