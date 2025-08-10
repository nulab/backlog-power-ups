type Listener = (el: HTMLElement) => void;

const listenersMap: Map<
	Listener,
	{ selector: string; onRemove: Listener | undefined }
> = new Map();

const nodeMatcher = (selector: string, node: Node): HTMLElement[] => {
	if (!(node instanceof HTMLElement)) {
		return [];
	}

	if (node.matches(selector)) {
		return [node];
	}

	return Array.from(node.querySelectorAll(selector)).filter(
		(el) => el instanceof HTMLElement,
	);
};

const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (mutation.type === "childList") {
			for (const [onAdd, { selector, onRemove }] of Array.from(
				listenersMap.entries(),
			)) {
				for (const node of mutation.addedNodes) {
					for (const el of nodeMatcher(selector, node)) {
						onAdd(el);
					}
				}

				for (const node of mutation.removedNodes) {
					for (const el of nodeMatcher(selector, node)) {
						onRemove?.(el);
					}
				}
			}
		}
	}
});

observer.observe(document.documentElement, { childList: true, subtree: true });

export const observeQuerySelector = (
	selector: string,
	onAdd: Listener,
	onRemove?: Listener,
) => {
	listenersMap.set(onAdd, { selector, onRemove });

	for (const el of nodeMatcher(selector, document.documentElement)) {
		onAdd(el);
	}

	return () => listenersMap.delete(onAdd);
};

export const replaceTextNodes = (node: Node, text: string | string[]) => {
	if (!(node instanceof HTMLElement)) {
		return;
	}

	const newTexts = Array.isArray(text) ? text : [text];
	const textNodes = Array.from(node.childNodes).filter(
		(childNode) => childNode.nodeType === Node.TEXT_NODE,
	);

	for (const childNode of node.childNodes) {
		if (childNode.nodeType === Node.TEXT_NODE) {
			const newText = newTexts[textNodes.indexOf(childNode)] || "";
			childNode.textContent = newText;
		}
	}
};
