import { minimatch } from "minimatch";
import { nodeMatcher } from "./node-matcher.ts";
import type { InvalidateFunction } from "./types.ts";

export type Listener = (
	el: HTMLElement,
) => InvalidateFunction | void | Promise<void>;

type HandlerEntry = {
	selector: string;
	onInvalidate: InvalidateFunction;
	elementsMap: Map<HTMLElement, InvalidateFunction>;
	matches: string[] | undefined;
};

const handlersMap: Map<Listener, HandlerEntry> = new Map();

let matchCache: Map<string, boolean> = new Map();
let cachedPathname: string | undefined;

const isMatchedPath = (matches: string[] | undefined): boolean => {
	if (!matches || matches.length === 0) return true;

	if (cachedPathname !== location.pathname) {
		cachedPathname = location.pathname;
		matchCache = new Map();
	}

	for (const match of matches) {
		let result = matchCache.get(match);
		if (result === undefined) {
			result = minimatch(location.pathname, match);
			matchCache.set(match, result);
		}
		if (result) return true;
	}
	return false;
};

const processAddedNode = (
	node: Node,
	handler: Listener,
	entry: HandlerEntry,
) => {
	for (const el of nodeMatcher(entry.selector, node)) {
		if (entry.elementsMap.has(el)) continue;

		const invalidate = handler(el);
		if (typeof invalidate === "function") {
			entry.elementsMap.set(el, invalidate);
		}
	}
};

const cleanupRemovedNodes = (entry: HandlerEntry, removedNode: Node) => {
	if (entry.elementsMap.size === 0) return;

	if (removedNode instanceof HTMLElement) {
		if (entry.elementsMap.has(removedNode)) {
			entry.elementsMap.get(removedNode)?.();
			entry.elementsMap.delete(removedNode);
		}

		for (const [el, invalidate] of entry.elementsMap) {
			if (removedNode.contains(el)) {
				invalidate?.();
				entry.elementsMap.delete(el);
			}
		}
	}
};

const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (mutation.type !== "childList") continue;

		for (const [handler, entry] of handlersMap) {
			if (!isMatchedPath(entry.matches)) continue;

			for (const node of mutation.addedNodes) {
				processAddedNode(node, handler, entry);
			}

			for (const node of mutation.removedNodes) {
				cleanupRemovedNodes(entry, node);
			}
		}
	}
});

observer.observe(document.documentElement, { childList: true, subtree: true });

export const observeQuerySelector = (
	selector: string,
	handler: Listener,
	matches: string[],
) => {
	const invalidateSet = new Set<InvalidateFunction>();

	const onInvalidate = () => {
		for (const invalidate of invalidateSet) {
			invalidate();
		}
		invalidateSet.clear();
	};

	handlersMap.set(handler, {
		selector,
		onInvalidate,
		matches,
		elementsMap: new Map(),
	});

	for (const el of nodeMatcher(selector, document.documentElement)) {
		const invalidate = handler(el);

		if (typeof invalidate === "function") {
			invalidateSet.add(invalidate);
		}
	}

	return () => {
		onInvalidate();
		handlersMap.delete(handler);
	};
};
