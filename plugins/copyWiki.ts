export const copyWiki = definePowerUpsPlugin({
	group: "wiki",
	defaultEnabled: true,
	matches: ["/wiki/**", "/alias/wiki/*"],
	async main({ observeQuerySelector }) {
		const SESSION_STORAGE_KEY = "__powerUps_copy-wiki";

		const start = async () => {
			const projectKey = window
				.prompt(i18n.t("copyWiki.prompt"))
				?.toUpperCase();

			if (!projectKey) {
				return;
			}

			const pageIdInput = document.querySelector('input[name="pageId"]');
			const pageId =
				pageIdInput instanceof HTMLInputElement ? pageIdInput.value : null;
			const title = getWikiTitle().join("/");
			const currentProjectKey = getBacklogProjectKey();

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
				const li = document.createElement("li");
				li.classList.add("dropdown-menu__item");

				const button = createButton(
					html`<button class="dropdown-menu__link is_active">
            ${i18n.t("copyWiki.copy_to")}
          </button>`,
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
						`/ViewWikiJson.action?projectKey=${encodeURIComponent(
							projectKey,
						)}&wikiId=${encodeURIComponent(pageId)}`,
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
