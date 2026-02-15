import pDebounce from "p-debounce";

export const hideEmptyColumn = definePowerUpsPlugin({
	group: "issue",
	matches: ["/find/*", "/FindIssueAllOver.action"],
	allFrames: true,
	main({ observeQuerySelector }) {
		observeQuerySelector("#issues-table", (table) => {
			if (!(table instanceof HTMLTableElement)) return;

			const styleEl = document.createElement("style");
			document.head.appendChild(styleEl);

			const hideEmptyColumn = pDebounce(() => {
				const thElements = nodeMatcher(
					"thead > tr > th",
					table,
					HTMLTableCellElement,
				);
				const trElements = nodeMatcher("tbody > tr", table)
					.map((tr) => nodeMatcher("td", tr, HTMLTableCellElement))
					.filter((tds) => tds.length === thElements.length);

				const isCellEmpty = (cell: HTMLTableCellElement | undefined) =>
					cell != null &&
					!cell.textContent?.trim() &&
					cell.querySelector("img, svg, input, canvas, video") === null;

				const rules: string[] = [];

				for (let col = 1; col < thElements.length; col += 1) {
					if (trElements.every((tr) => isCellEmpty(tr[col]))) {
						const nth = col + 1;
						rules.push(
							`#issues-table tr > :nth-child(${nth}) { display: none; }`,
						);
					}
				}

				styleEl.textContent = rules.join("\n");
			}, 100);

			hideEmptyColumn();

			const tableObserver = new MutationObserver(() => {
				hideEmptyColumn();
			});

			tableObserver.observe(table, { childList: true, subtree: true });

			return () => {
				tableObserver.disconnect();
				styleEl.remove();
			};
		});
	},
});
