import { nodeMatcher } from "./node-matcher.ts";

export const asyncQuerySelector = (
	selector: string,
	options: {
		target?: HTMLElement;
		timeout?: number;
		signal?: AbortSignal;
	} = {},
) =>
	new Promise<HTMLElement | null>((resolve) => {
		const target = options.target || document.documentElement;
		const timeout = options.timeout ?? 5000;

		const elements = nodeMatcher(selector, target);

		for (const el of elements) {
			resolve(el);
			return;
		}

		const timer = setTimeout(() => {
			observer.disconnect();
			resolve(null);
		}, timeout);

		options.signal?.addEventListener("abort", () => {
			observer.disconnect();
			clearTimeout(timer);
			resolve(null);
		});

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === "childList") {
					for (const node of mutation.addedNodes) {
						for (const el of nodeMatcher(selector, node)) {
							clearTimeout(timer);
							resolve(el);
							return;
						}
					}

					for (const node of mutation.removedNodes) {
						for (const el of nodeMatcher(selector, node)) {
							clearTimeout(timer);
							resolve(el);
							return;
						}
					}
				}
			}
		});

		observer.observe(target, { childList: true, subtree: true });
	});
