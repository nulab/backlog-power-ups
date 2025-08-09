export default defineContentScript({
	matches: defineMatches(["/wiki/*", "/alias/wiki/*"]),
	async main() {
		if (await isPluginDisabled("copy-wiki")) {
			return;
		}

		const SESSION_STORAGE_KEY = "__powerUps_copy-wiki";

		const start = async () => {
			const projectKey = window
				.prompt(i18n.t("copy_wiki.prompt"))
				?.toUpperCase();

			if (!projectKey) {
				return;
			}

			const pageIdInput = document.querySelector('input[name="pageId"]');
			const pageId =
				pageIdInput instanceof HTMLInputElement ? pageIdInput.value : null;
			const title = await getWikiTitle().then((title) => title.join("/"));
			const currentProjectKey = await getBacklogProjectKey();

			sessionStorage.setItem(
				SESSION_STORAGE_KEY,
				JSON.stringify({
					projectKey: currentProjectKey,
					pageId,
				}),
			);

			location.href = `/wiki/${projectKey}/${encodeURIComponent(title)}/create`;
		};

		observeQuerySelector(
			".wiki-page-tag-group--icon dropdown-menu ul.dropdown-menu",
			(el) => {
				console.log(el);

				const li = document.createElement("li");
				li.classList.add("dropdown-menu__item");

				const button = createButton(
					html`<button class="dropdown-menu__link is_active">${i18n.t("copy_wiki.copy_to")}</button>`,
					{
						click: start,
					},
				);

				li.appendChild(button);
				el.appendChild(li);
			},
		);

		observeQuerySelector("#page\\.content", async (el) => {
			try {
				const { projectKey, pageId } = JSON.parse(
					// @ts-expect-error
					sessionStorage.getItem(SESSION_STORAGE_KEY),
				);

				console.log(projectKey, pageId);

				if (
					typeof projectKey !== "string" ||
					typeof pageId !== "string" ||
					projectKey === "" ||
					pageId === ""
				) {
					return;
				}

				if (el instanceof HTMLTextAreaElement && el.value === "") {
					const res = await fetch(
						`/ViewWikiJson.action?projectKey=${encodeURIComponent(projectKey)}&wikiId=${encodeURIComponent(pageId)}`,
						{
							headers: {
								"x-requested-with": "XMLHttpRequest",
							},
						},
					);
					const { content } = await res.json();
					el.value = content;

					el.dispatchEvent(new Event("change", { bubbles: true }));
				}
			} catch (err) {
				console.warn(err);
				// do nothing
			} finally {
				sessionStorage.removeItem(SESSION_STORAGE_KEY);
			}
		});
	},
});
