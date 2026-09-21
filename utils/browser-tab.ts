export const reloadActiveTab = () => {
	browser.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
		if (!tab?.url || tab.id == null) return;

		const url = new URL(tab.url);

		const isBacklog = /\.backlog(\.com|\.jp|tool\.com)$/.test(url.hostname);

		if (isBacklog) {
			browser.tabs.reload(tab.id);
		}
	});
};
