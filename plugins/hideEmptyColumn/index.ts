import pDebounce from "p-debounce";

export const hideEmptyColumn = definePowerUpsPlugin({
	group: "issue",
	matches: ["/find/*", "/FindIssueAllOver.action"],
	main({ observeQuerySelector }) {
		const hideEmptyColumn = pDebounce((table: HTMLTableElement) => {
			const thElements = nodeMatcher(
				"thead > tr > th",
				table,
				HTMLTableCellElement,
			);
			const trElements = nodeMatcher("tbody > tr", table).map((tr) =>
				nodeMatcher("td", tr, HTMLTableCellElement),
			);

			for (const el of [...thElements, ...trElements.flat()]) {
				el.style.removeProperty("display");
			}

			for (let col = 1; col < thElements.length; col += 1) {
				const isEmpty = trElements.every((tr) => !tr[col].textContent);

				if (isEmpty) {
					thElements[col].style.display = "none";

					for (const tr of trElements) {
						tr[col].style.display = "none";
					}
				}
			}
		}, 100);

		observeQuerySelector("#issues-table tr", (el) => {
			const table = el.closest("table");

			if (table) {
				hideEmptyColumn(table);

				return () => {
					hideEmptyColumn(table);
				};
			}
		});
	},
});
