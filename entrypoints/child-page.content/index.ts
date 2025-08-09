export default defineContentScript({
	matches: defineMatches(["/wiki/*", "/alias/wiki/*"]),
	async main() {
		if (await isPluginDisabled("child-page")) {
			return;
		}

		observeQuerySelector('a[href$="/create"]', async (el) => {
			if (!(el instanceof HTMLAnchorElement)) {
				return;
			}

			const mainTitle = await asyncQuerySelector("#mainTitle");
			const items = Array.from(mainTitle?.children || [])
				.filter((item) => item.classList.contains("breadcrumbs__item"))
				.map((item) => {
					const anchor = item.querySelector("a");
					return anchor ? anchor.textContent : item.textContent;
				});

			const projectKey = await getBacklogProjectKey();

			el.href = `/wiki/${projectKey}/${encodeURIComponent(items.concat("").join("/"))}/create`;
		});
	},
});
