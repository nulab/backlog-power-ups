import debounce from "p-debounce";
import { createSelectField } from "@/components/SelectField";
import styles from "./index.module.css";

export const ganttFilterParentAndChild = definePowerUpsPlugin({
	group: "gantt",
	matches: ["/gantt/**"],
	main({ observeQuerySelector, addEventListener }) {
		const { element, select } = createSelectField({
			label: i18n.t("ganttFilterParentAndChild.label"),
			defaultValue: "all",
			options: html`
        <option value="all">${i18n.t("ganttFilterParentAndChild.all")}</option>
        <option value="parent">
          ${i18n.t("ganttFilterParentAndChild.parent")}
        </option>
        <option value="child">
          ${i18n.t("ganttFilterParentAndChild.child")}
        </option>
      `,
		});

		const handleChange = debounce(() => {
			const { value } = select;

			switch (value) {
				case "all":
				case "parent":
				case "child":
					break;
				default:
					return;
			}

			// Uncheck every cells checkbox
			for (const el of document.querySelectorAll(
				'[id^="ganttIssue-"] .-checked[class^="_checkbox_"]',
			)) {
				if (el instanceof HTMLElement) {
					el.click();
				}
			}

			for (const table of document.querySelectorAll(".gantt-table")) {
				if (table instanceof HTMLElement) {
					table.classList.toggle(styles.Filtered, value !== "all");
				}

				const elements = [
					".gantt-table__left-inner > .gantt-left-cell",
					":where(.gantt-right-cell, .gantt-right-cell-borderless)",
					"[id^='ganttIssue-']",
				].map((selector) =>
					Array.from(table.querySelectorAll(selector)).filter(
						(el) => el instanceof HTMLElement,
					),
				);
				const [leftCellElements, rightCellElements, ganttIssueElements] =
					elements;

				for (const el of elements.flat()) {
					el.ariaHidden = "false";
				}

				// Filtering elements that make up a row
				if (value === "parent" || value === "child") {
					for (const leftCell of leftCellElements) {
						const index = leftCellElements.indexOf(leftCell);
						const ganttIssue = ganttIssueElements.find((el) =>
							el.id.endsWith(`-${index}`),
						);
						const rightCell = rightCellElements[index];
						const isChildIssue =
							ganttIssue?.classList.contains("-child-issue") || false;

						if (value === "child" ? !isChildIssue : isChildIssue) {
							for (const el of [ganttIssue, leftCell, rightCell]) {
								if (el) {
									el.ariaHidden = "true";
								}
							}
						}
					}
				}

				// Adjust the position of the displayed cells
				const visibleCells = ganttIssueElements.filter(
					(el) => el.ariaHidden === "false",
				);

				for (const el of visibleCells) {
					const index = visibleCells.indexOf(el);

					el.style.top = `${73 + index * 40}px`;
				}
			}
		}, 100);

		observeQuerySelector(".result-set__controller .form-element", (el) => {
			addEventListener(select, "change", handleChange);
			el.appendChild(element);

			return () => {
				select.removeEventListener("change", handleChange);
			};
		});

		observeQuerySelector(
			".gantt-table__left-inner > .gantt-left-cell",
			async () => {
				await handleChange();
			},
		);

		observeQuerySelector(".gantt-table", (el) => {
			el.classList.add(styles.table);

			const observer = new MutationObserver(() => {
				el.classList.toggle(styles.table, true);
			});

			return observer.observe(el, {
				attributes: true,
				attributeFilter: ["class"],
			});
		});
	},
});
