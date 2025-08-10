import { nodeMatcher } from "./node-matcher.ts";
import type { InvalidateFunction } from "./types.ts";

type Listener = (el: HTMLElement) => InvalidateFunction | undefined;

const handlersMap: Map<
	Listener,
	{
		selector: string;
		onInvalidate: InvalidateFunction;
		elementsMap: Map<HTMLElement, InvalidateFunction>;
	}
> = new Map();

const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (mutation.type === "childList") {
			for (const [handler, { selector, elementsMap }] of Array.from(
				handlersMap.entries(),
			)) {
				for (const node of mutation.addedNodes) {
					for (const el of nodeMatcher(selector, node)) {
						const invalidate = handler(el);

						if (typeof invalidate === "function") {
							elementsMap.set(el, invalidate);
						}
					}
				}

				for (const node of mutation.removedNodes) {
					for (const el of nodeMatcher(selector, node)) {
						const invalidate = elementsMap.get(el);
						invalidate?.();
						elementsMap.delete(el);
					}
				}
			}
		}
	}
});

observer.observe(document.documentElement, { childList: true, subtree: true });

export const observeQuerySelector = (selector: string, handler: Listener) => {
	const invalidateSet = new Set<InvalidateFunction>();

	const onInvalidate = () => {
		for (const invalidate of invalidateSet) {
			invalidate();
		}
		invalidateSet.clear();
	};

	handlersMap.set(handler, { selector, onInvalidate, elementsMap: new Map() });

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
