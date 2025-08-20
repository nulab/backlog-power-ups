import { minimatch } from "minimatch";
import { nodeMatcher } from "./node-matcher.ts";
import type { InvalidateFunction } from "./types.ts";

export type Listener = (
	el: HTMLElement,
) => InvalidateFunction | void | Promise<void>;

const handlersMap: Map<
	Listener,
	{
		selector: string;
		onInvalidate: InvalidateFunction;
		elementsMap: Map<HTMLElement, InvalidateFunction>;
		matches: string[] | undefined;
	}
> = new Map();

const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (mutation.type === "childList") {
			for (const [
				handler,
				{ selector, elementsMap, matches = [] },
			] of handlersMap) {
				const isMatched = matches.some((match) =>
					minimatch(location.pathname, match),
				);

				if (isMatched) {
					for (const node of mutation.addedNodes) {
						for (const el of nodeMatcher(selector, node)) {
							const invalidate = handler(el);

							if (typeof invalidate === "function") {
								elementsMap.set(el, invalidate);
							}
						}
					}
				}

				if (mutation.removedNodes.length > 0) {
					for (const [el, invalidate] of elementsMap) {
						if (!el.isConnected) {
							invalidate?.();
							elementsMap.delete(el);
						}
					}
				}
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
