/**
 * Backlog renders its own UI from a server-side message catalog and does not
 * expose the message keys in the DOM, so the only thing a content script can
 * match on is the text itself. `dictionary` is therefore a flat
 * `rendered text -> translation` map, built by
 * `scripts/build-ui-dictionary.mjs`.
 */
export type Dictionary = Record<string, string>;

/** Subtrees whose text is not UI chrome, or would break if rewritten. */
const SKIPPED_SELECTOR =
	"script, style, textarea, pre, code, [contenteditable]";
const SKIPPED_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "PRE", "CODE"]);

const TRANSLATED_ATTRIBUTES = [
	"placeholder",
	"title",
	"alt",
	"aria-label",
	"data-tooltip",
];

const isSkipped = (el: Element) =>
	SKIPPED_TAGS.has(el.tagName) || el.hasAttribute("contenteditable");

const isInSkippedSubtree = (node: Node) =>
	node.parentElement?.closest(SKIPPED_SELECTOR) != null;

export const createDomTranslator = (dictionary: Dictionary) => {
	// A plain object carries Object.prototype, so a lookup of "constructor" or
	// "toString" would hand back a function and write it into the page. A Map
	// holds only what the dictionary actually declares.
	const entries = new Map(Object.entries(dictionary));

	// Remembers the text we wrote, so re-reading our own output is a no-op while
	// a genuine re-render (the node's text changed underneath us) is translated
	// again.
	const written = new WeakMap<Text, string>();

	const translateTextNode = (node: Text) => {
		const text = node.data;

		if (written.get(node) === text) {
			return;
		}

		const source = text.trim();

		if (!source) {
			return;
		}

		const translation = entries.get(source);

		if (!translation) {
			return;
		}

		// Only whole labels are translated, never substrings: that is what keeps
		// issue subjects and comment bodies that merely contain a label intact.
		const next = text.replace(source, () => translation);

		node.data = next;
		written.set(node, next);
	};

	const translateAttributes = (el: Element) => {
		for (const name of TRANSLATED_ATTRIBUTES) {
			const value = el.getAttribute(name)?.trim();
			const translation = value && entries.get(value);

			if (translation) {
				el.setAttribute(name, translation);
			}
		}

		// Button captions live in `value` rather than in a text node. A *named*
		// button submits its value as form data, so those are left alone: Backlog
		// still serves server-rendered forms that dispatch on it.
		if (
			el instanceof HTMLInputElement &&
			!el.name &&
			(el.type === "button" || el.type === "submit" || el.type === "reset")
		) {
			const translation = entries.get(el.value.trim());

			if (translation) {
				el.value = translation;
			}
		}
	};

	const translateSubtree = (root: Node) => {
		if (root.nodeType === Node.TEXT_NODE) {
			if (!isInSkippedSubtree(root)) {
				translateTextNode(root as Text);
			}
			return;
		}

		if (!(root instanceof Element) || root.closest(SKIPPED_SELECTOR)) {
			return;
		}

		const walker = document.createTreeWalker(
			root,
			NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
			{
				acceptNode: (node) =>
					node instanceof Element && isSkipped(node)
						? NodeFilter.FILTER_REJECT
						: NodeFilter.FILTER_ACCEPT,
			},
		);

		translateAttributes(root);

		for (
			let node = walker.nextNode();
			node !== null;
			node = walker.nextNode()
		) {
			if (node instanceof Element) {
				translateAttributes(node);
			} else {
				translateTextNode(node as Text);
			}
		}
	};

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "characterData") {
				const node = mutation.target;

				if (node.nodeType === Node.TEXT_NODE && !isInSkippedSubtree(node)) {
					translateTextNode(node as Text);
				}

				continue;
			}

			if (mutation.type === "attributes") {
				// Our own write lands here too, but translating a translation is a
				// miss, so it stops after one pass.
				const el = mutation.target;

				if (el instanceof Element && !el.closest(SKIPPED_SELECTOR)) {
					translateAttributes(el);
				}

				continue;
			}

			for (const node of mutation.addedNodes) {
				translateSubtree(node);
			}
		}
	});

	return {
		start: () => {
			translateSubtree(document.body);

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				characterData: true,
				attributes: true,
				attributeFilter: TRANSLATED_ATTRIBUTES,
			});
		},
		stop: () => observer.disconnect(),
	};
};
