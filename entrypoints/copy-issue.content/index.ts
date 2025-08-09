export default defineContentScript({
	matches: defineMatches(["/view/*", "/add/*"]),
	async main() {
		if (await isPluginDisabled("copy-issue")) {
			return;
		}

		const SESSION_STORAGE_KEY = "__powerUps_copy-issue";

		observeQuerySelector('a[href$="/create"]', async (el) => {
			if (!(el instanceof HTMLAnchorElement)) {
				return;
			}

			const start = async () => {
				const projectKey = window
					.prompt(i18n.t("copy_issue.prompt"))
					?.toUpperCase();

				if (!projectKey) {
					return;
				}

				const issueKey = document.querySelector(
					".ticket__key-number",
				)?.textContent;
				const summary = document.getElementById("summary")?.textContent;

				document.getElementById("editIssueButton")?.click();

				const descriptionTextArea = await asyncQuerySelector(
					"#descriptionTextArea",
				);
				const description = Array.from(descriptionTextArea?.children || []).map(
					({ textContent }) => textContent,
				);

				sessionStorage.setItem(
					SESSION_STORAGE_KEY,
					JSON.stringify({
						issueKey,
						summary,
						description,
					}),
				);

				location.replace(`/add/${projectKey}`);
			};

			observeQuerySelector(
				".title-group__edit-actions ul.dropdown-menu",
				(el) => {
					const li = document.createElement("li");
					li.classList.add("dropdown-menu__item");

					const button = createButton(
						html`<button class="dropdown-menu__link is_active">${i18n.t("copy_issue.copy_to")}</button>`,
						{
							click: start,
						},
					);

					li.appendChild(button);

					el.appendChild(li);
				},
			);

			observeQuerySelector("#AddIssueForm", async () => {
				try {
					const {
						issueKey = "",
						summary = "",
						description,
						// @ts-expect-error
					} = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));

					const summaryInput = await asyncQuerySelector("#summaryInput");
					const descriptionTextArea = await asyncQuerySelector(
						"#descriptionTextArea",
					);

					if (summaryInput instanceof HTMLInputElement) {
						summaryInput.value = summary;
						summaryInput.dispatchEvent(new Event("change", { bubbles: true }));
					}

					if (
						descriptionTextArea instanceof HTMLDivElement &&
						Array.isArray(description)
					) {
						for (const child of descriptionTextArea.children) {
							child.remove();
						}

						const heading = document.querySelector(".markdown-body")
							? "##"
							: "**";
						const refs = [
							"",
							"",
							`${heading} ${i18n.t("copy_issue.refs")}`,
							`${issueKey} ${summary}`,
						];

						for (const line of description.concat(...refs)) {
							const paragraph = document.createElement("p");
							paragraph.textContent = line;

							descriptionTextArea.append(paragraph);
						}
					}
				} catch {
					// do nothing
				} finally {
					sessionStorage.removeItem(SESSION_STORAGE_KEY);
				}
			});
		});
	},
});
