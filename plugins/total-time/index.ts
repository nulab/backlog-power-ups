import styles from "./index.module.css";

export const totalTime = definePowerUpsPlugin({
	group: "issue",
	matches: ["/find/**"],
	async main({ observeQuerySelector }) {
		observeQuerySelector("#issues-table tbody tr", (el) => {
			const issueTable = el.closest("#issues-table");

			if (!(issueTable instanceof HTMLTableElement)) {
				return;
			}

			const headings = Array.from(
				issueTable.querySelectorAll("thead tr:first-child th"),
			);

			for (const columnKey of ["estimatedHours", "actualHours"]) {
				const columnIndex = headings.findIndex((column) => {
					return (
						column instanceof HTMLTableCellElement &&
						column.dataset.columnKey === columnKey
					);
				});

				const rows = Array.from(
					issueTable.querySelectorAll(
						`tbody tr td:nth-child(${columnIndex + 1})`,
					),
				);
				const total = rows.reduce(
					(total, row) => total + (Number(row.textContent) || 0),
					0,
				);

				const textEl = document.querySelector(
					`[data-powerups-column-key="${columnKey}"]`,
				);

				if (textEl instanceof HTMLElement) {
					textEl.textContent = `${total}`;
				}
			}
		});

		observeQuerySelector("#container", (el) => {
			if (document.getElementsByClassName(styles.totalTime).length > 0) {
				return;
			}

			el.insertAdjacentHTML(
				"beforeend",
				html`
                    <div class=${styles.totalTime}>
                        <span>
                            ${i18n.t("totalTime.estimated_hours")}${": "}
                            <span data-powerups-column-key="estimatedHours">-</span>
                            ${" hrs"}
                        </span>
                        <span>
                            ${i18n.t("totalTime.actual_hours")}${": "}
                            <span data-powerups-column-key="actualHours">-</span>
                            ${" hrs"}
                        </span>
                    </div>
                ` as string,
			);
		});
	},
});
