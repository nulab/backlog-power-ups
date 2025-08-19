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

			const title = await getWikiTitle();

			const projectKey = await getBacklogProjectKey();

			el.href = `/wiki/${projectKey}/${encodeURIComponent(title.concat("").join("/"))}/create`;
		});
	},
});
