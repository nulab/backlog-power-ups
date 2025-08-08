// @ts-nocheck

class QueueWorker {
	queues: any[] = [];
	tabId: number | null = null;
	loaded = false;

	push(details: any) {
		this.queues.push(details);
		this.notify();
	}

	notify() {
		if (this.tabId === null || !this.loaded) {
			return;
		}
		while (this.queues.length !== 0) {
			const details = this.queues.shift();
			browser.tabs.sendMessage(this.tabId, details).catch((error) => {
				if (
					error.message.includes(
						"Could not establish connection. Receiving end does not exist.",
					)
				) {
					// This can happen if the content script is not ready yet.
					// We can requeue the message or handle it as needed.
					console.log("Content script not ready, requeuing message.");
					this.queues.unshift(details);
				} else {
					console.error(`chrome.runtime.lastError${error.message}`);
				}
			});
		}
	}
}

const worker = new QueueWorker();

export default defineBackground(() => {
	browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (
			tab.url &&
			(tab.url.includes("backlog.jp") ||
				tab.url.includes("backlogtool.com") ||
				tab.url.includes("backlog.com"))
		) {
			browser.action.show(tabId);
			if (tab.status === "complete") {
				worker.tabId = tabId;
				worker.notify();
			}
		}
	});

	browser.runtime.onMessage.addListener((request) => {
		if (request.message === "unload") {
			worker.tabId = null;
			worker.loaded = false;
		} else if (request.message === "loaded") {
			worker.loaded = true;
			worker.notify();
		}
	});

	browser.webRequest.onHeadersReceived.addListener(
		(details) => {
			if (details.statusCode !== 302) {
				worker.push(details);
			}
		},
		{
			urls: [
				"https://*.backlog.jp/*",
				"https://*.backlog.com/*",
				"https://*.backlogtool.com/*",
			],
			types: ["main_frame", "xmlhttprequest"],
		},
		["responseHeaders"],
	);
});
