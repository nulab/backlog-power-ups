import { buildCacooJson } from "./build-cacoo-json";
import { copyToClipboard } from "./copy-to-clipboard";
import {
	extractIssueData,
	extractIssueDataFromRow,
} from "./extract-issue-data";
import styles from "./index.module.css";

function showSuccess(): void {
	showStatusMessage(i18n.t("copyIssueCacooFormat.success"));
}

const LIST_BUTTON_ATTR = "data-cacoo-injected";

export const copyIssueCacooFormat = definePowerUpsPlugin({
	group: "issue",
	defaultEnabled: true,
	allFrames: true,
	matches: ["/view/**", "/find/*"],
	main({ observeQuerySelector }) {
		// 課題詳細ページ: #copyKey-help の横にボタンを挿入
		observeQuerySelector("#copyKey-help", (anchor) => {
			const button = createButton(
				html`
					<button
						type="button"
						class="icon-button icon-button--default | simptip-position-right simptip-movable simptip-smooth"
						data-tooltip=${i18n.t("copyIssueCacooFormat.tooltip")}
					>
						<span class="copy-trigger">
							<svg width="18" height="23" viewBox="-4.5 -6.9 27.9 36.8" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M16.01 22.8995C13.8387 22.8995 12.4668 22.804 10.0092 22.1775C6.50191 21.2945 3.62081 19.421 1.87901 16.8853C-0.67999 13.1503 -0.620291 8.944 2.02811 5.3343C3.79971 2.9119 6.72261 1.18759 10.2419 0.465695C12.6159 -0.0236051 13.9461 -0.0117044 15.9503 0.00619558C16.3142 0.00619558 16.7079 0.0181957 17.1374 0.0181957V5.44169C16.684 5.44169 16.2844 5.4417 15.9145 5.4297C14.0594 5.4178 13.1349 5.4118 11.3215 5.7877C9.11451 6.2412 7.36681 7.2256 6.38851 8.5621C5.11201 10.2924 5.10601 12.0167 6.35271 13.8305C7.34291 15.2684 9.10261 16.3662 11.3335 16.9211C13.6359 17.4998 14.5665 17.4879 17.0479 17.47L17.0896 22.8935C16.6959 22.8935 16.3321 22.8995 16.01 22.8995Z" fill="currentColor"/>
							</svg>
						</span>
					</button>
				`,
				{
					click: () => {
						try {
							const issue = extractIssueData();
							const cacooJson = buildCacooJson(issue);
							const plainText = `${issue.key} ${issue.summary}`;

							copyToClipboard(cacooJson, plainText);
							showSuccess();
						} catch (error) {
							console.error("Failed to copy issue to Cacoo:", error);
						}
					},
				},
			);

			injectIssueKeyButton(anchor, "cacoo-copy", button);
		});

		// 課題一覧ページ: 各行の cell-hover-actions にボタンを挿入
		observeQuerySelector(".cell-hover-actions", (hoverActions) => {
			if (hoverActions.hasAttribute(LIST_BUTTON_ATTR)) return;

			const row = hoverActions.closest<HTMLTableRowElement>("tr");
			if (!row) return;

			hoverActions.setAttribute(LIST_BUTTON_ATTR, "true");

			const button = createButton(
				html`
					<button
						type="button"
						class="${styles.button} | simptip-position-top simptip-movable simptip-smooth"
						data-tooltip=${i18n.t("copyIssueCacooFormat.tooltip")}
					>
						<svg role="image" viewBox="-4.5 -6.9 27.9 36.8" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M16.01 22.8995C13.8387 22.8995 12.4668 22.804 10.0092 22.1775C6.50191 21.2945 3.62081 19.421 1.87901 16.8853C-0.67999 13.1503 -0.620291 8.944 2.02811 5.3343C3.79971 2.9119 6.72261 1.18759 10.2419 0.465695C12.6159 -0.0236051 13.9461 -0.0117044 15.9503 0.00619558C16.3142 0.00619558 16.7079 0.0181957 17.1374 0.0181957V5.44169C16.684 5.44169 16.2844 5.4417 15.9145 5.4297C14.0594 5.4178 13.1349 5.4118 11.3215 5.7877C9.11451 6.2412 7.36681 7.2256 6.38851 8.5621C5.11201 10.2924 5.10601 12.0167 6.35271 13.8305C7.34291 15.2684 9.10261 16.3662 11.3335 16.9211C13.6359 17.4998 14.5665 17.4879 17.0479 17.47L17.0896 22.8935C16.6959 22.8935 16.3321 22.8995 16.01 22.8995Z" fill="currentColor"/>
						</svg>
					</button>
				`,
				{
					click: (e) => {
						e.preventDefault();
						e.stopPropagation();

						try {
							const issue = extractIssueDataFromRow(row);
							const cacooJson = buildCacooJson(issue);
							const plainText = `${issue.key} ${issue.summary}`;

							copyToClipboard(cacooJson, plainText);
							showSuccess();
						} catch (error) {
							console.error("Failed to copy issue to Cacoo:", error);
						}
					},
				},
			);

			button.addEventListener("mousedown", (e) => {
				e.preventDefault();
				e.stopPropagation();
			});

			hoverActions.appendChild(button);
		});
	},
});
