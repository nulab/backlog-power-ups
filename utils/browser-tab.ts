export const reloadActiveTab = () => {
	browser.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
		const url = tab.url && new URL(tab.url);

		if (!url || tab.id == null) return;

		const isBacklog = /\.backlog(\.com|\.jp|tool\.com)$/.test(url.hostname);

		if (isBacklog) {
			browser.tabs.reload(tab.id);
		}
	});
};
