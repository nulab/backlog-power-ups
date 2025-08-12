import { createSelectField } from "@/components/SelectField";
import styles from "./index.module.css";

export const projectIssueFilter = definePowerUpsPlugin({
	group: "issue",
	matches: ["/find/*", "/FindIssueAllOver.action"],
	main({ observeQuerySelector, addEventListener }) {
		observeQuerySelector(".condition-actions", (el) => {
			const currentProjectKey = getBacklogProjectKey();
			const { element, select } = createSelectField({
				options: html`
          <option value="">${i18n.t("projectIssueFilter.placeholder")}</option>
          <optgroup
            label=${i18n.t("projectIssueFilter.loading")}
            data-state="idle"
          />
        `,
			});

			el.classList.add(styles.actions);
			select.classList.add(styles.select);
			el.appendChild(element);

			const handleFocus = async () => {
				const optgroup = select.querySelector("optgroup");

				if (!optgroup || optgroup.dataset.state === "completed") {
					return;
				}

				const res = await fetch("/globalbar/issuefilters.json");
				const issueFilters = (await res.json()) as {
					id: number;
					name: string;
					projectKey: string;
				}[];
				const filters = issueFilters.filter(
					({ projectKey }) => projectKey === currentProjectKey,
				);

				optgroup.label = currentProjectKey
					? i18n.t("projectIssueFilter.projectLabel", [currentProjectKey])
					: i18n.t("projectIssueFilter.spaceLabel");
				optgroup.dataset.state = "complete";

				if (filters.length === 0) {
					optgroup.innerHTML = html`
            <option disabled>${i18n.t("projectIssueFilter.empty")}</option>
          ` as string;
					return;
				}

				const optgroupHtml = html`
          ${filters.map(
						({ id, name }) => html`<option value=${id}>${name}</option>`,
					)}
        `;
				optgroup.innerHTML = Array.isArray(optgroupHtml)
					? optgroupHtml.join("")
					: optgroupHtml;
			};

			const handleChange = (e: Event) => {
				if (e.currentTarget instanceof HTMLSelectElement) {
					location.href = `/alias/find/${e.currentTarget.value}`;
				}
			};

			addEventListener(select, "focus", handleFocus);
			addEventListener(select, "change", handleChange);

			return () => {
				select.removeEventListener("focus", handleFocus);
				select.removeEventListener("change", handleChange);
				element.remove();
			};
		});
	},
});
