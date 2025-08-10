import type { ContentScriptContext } from "wxt/utils/content-script-context";
import { asyncQuerySelector } from "@/helpers/dom/async-query-selector";
import { observeQuerySelector } from "@/helpers/dom/observe-query-selector";
import type { PluginStates } from "@/helpers/plugin-manager/storage.ts";

export type PowerUpsPluginContext = Pick<
	ContentScriptContext,
	"addEventListener" | "setTimeout" | "setInterval"
> & {
	pluginStates: PluginStates;
	observeQuerySelector: typeof observeQuerySelector;
	asyncQuerySelector: typeof asyncQuerySelector;
};

export const createPowerUpsPluginContext = () => {
	const invalidatorSet = new Set<() => void>();

	const context: Omit<PowerUpsPluginContext, "pluginStates"> = {
		observeQuerySelector: (selector, handler) => {
			const invalidate = observeQuerySelector(selector, handler);

			invalidatorSet.add(invalidate);

			return invalidate;
		},
		asyncQuerySelector: (selector, options) => {
			const controller = new AbortController();
			invalidatorSet.add(() => controller.abort());

			return asyncQuerySelector(selector, {
				...options,
				signal: controller.signal,
			});
		},
		// @ts-expect-error
		addEventListener: (target, type, handler, options) => {
			target.addEventListener(type, handler, options);

			invalidatorSet.add(() =>
				target.removeEventListener(type, handler, options),
			);
		},
		// @ts-expect-error
		setTimeout: (...args) => {
			const timer = setTimeout(...args);

			invalidatorSet.add(() => clearTimeout(timer));

			return timer;
		},
		// @ts-expect-error
		setInterval: (...args) => {
			const timer = setInterval(...args);

			invalidatorSet.add(() => clearInterval(timer));

			return timer;
		},
	};

	const invalidate = () => {
		for (const invalidate of invalidatorSet) {
			invalidate();
		}

		invalidatorSet.clear();
	};

	return { context, invalidate };
};
