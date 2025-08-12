export const childPage = definePowerUpsPlugin({
	group: "wiki",
	defaultEnabled: true,
	matches: ["/wiki/**", "/alias/wiki/*"],
	async main({ observeQuerySelector }) {
		observeQuerySelector('a[href$="/create"]', async (el) => {
			if (!(el instanceof HTMLAnchorElement)) {
				return;
			}

			const title = getWikiTitle();
			const projectKey = getBacklogProjectKey();

			el.href = `/wiki/${projectKey}/${encodeURIComponent(
				title.concat("").join("/"),
			)}/create`;
		});
	},
});
