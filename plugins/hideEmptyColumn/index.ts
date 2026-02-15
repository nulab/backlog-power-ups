import pDebounce from "p-debounce";

export const hideEmptyColumn = definePowerUpsPlugin({
	group: "issue",
	matches: ["/find/*", "/FindIssueAllOver.action"],
	allFrames: true,
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

			const isCellEmpty = (cell: HTMLTableCellElement) =>
				!cell.textContent?.trim() &&
				cell.querySelector("img, svg, input, canvas, video") === null;

			const emptyColumns = new Set<number>();

			for (let col = 1; col < thElements.length; col += 1) {
				if (trElements.every((tr) => isCellEmpty(tr[col]))) {
					emptyColumns.add(col);
				}
			}

			for (let col = 1; col < thElements.length; col += 1) {
				const display = emptyColumns.has(col) ? "none" : "";

				thElements[col].style.display = display;
				for (const tr of trElements) {
					tr[col].style.display = display;
				}
			}
		}, 100);

		observeQuerySelector("#issues-table", (table) => {
			if (!(table instanceof HTMLTableElement)) return;

			hideEmptyColumn(table);

			const tableObserver = new MutationObserver(() => {
				hideEmptyColumn(table);
			});

			tableObserver.observe(table, { childList: true, subtree: true });

			return () => {
				tableObserver.disconnect();
			};
		});
	},
});
