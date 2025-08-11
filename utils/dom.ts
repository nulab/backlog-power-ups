import htm from "htm";
import vhtml from "vhtml";

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

export const raf = () =>
	new Promise((resolve) => requestAnimationFrame(resolve));

export const html = htm.bind(vhtml);

export const isMainFrame =
	typeof window !== "undefined" && window.self === window.top;

export const createButton = (
	html: string | string[],
	listeners: { [K in "click"]?: (ev: HTMLElementEventMap[K]) => void } = {},
): HTMLButtonElement => {
	const template = document.createElement("template");
	template.innerHTML = Array.isArray(html) ? html[0] : html;

	const buttonEl = template.content.querySelector("button");

	if (!(buttonEl instanceof HTMLButtonElement)) {
		throw new Error("invalid element");
	}

	Object.entries(listeners).forEach(([event, listener]) => {
		// @ts-expect-error
		buttonEl.addEventListener(event, listener);
	});

	return buttonEl;
};
