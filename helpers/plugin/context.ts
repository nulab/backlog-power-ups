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

export const createPowerUpsPluginContext = (
	ctx: ContentScriptContext,
	pluginStates: PluginStates,
) => {
	const invalidatorSet = new Set<() => void>();

	const context: PowerUpsPluginContext = {
		pluginStates,
		observeQuerySelector: (selector, handler) => {
			logger.debug(
				`starting %c\`observeQuerySelector(${selector})\``,
				"color: #4488c5",
			);

			const invalidate = observeQuerySelector(selector, handler);

			invalidatorSet.add(invalidate);

			return invalidate;
		},
		asyncQuerySelector: (selector, options) => {
			logger.debug(
				`starting %c\`asyncQuerySelector(${selector})\``,
				"color: #4488c5",
			);

			const controller = new AbortController();
			invalidatorSet.add(() => controller.abort());

			return asyncQuerySelector(selector, {
				...options,
				signal: controller.signal,
			});
		},
		// @ts-expect-error
		addEventListener: (target, type, handler, options) => {
			const targetName = target instanceof Window ? "window" : target.nodeName;
			logger.debug(
				`starting %c\`${targetName}.addEventListener(${type})\``,
				"color: #4488c5",
			);

			ctx.addEventListener(target, type, handler, options);

			invalidatorSet.add(() =>
				target.removeEventListener(type, handler, options),
			);
		},
		setTimeout: (...args) => {
			logger.debug(`starting %c\`setTimeout(${args[1]})\``, "color: #4488c5");

			const timer = ctx.setTimeout(...args);

			invalidatorSet.add(() => clearTimeout(timer));

			return timer;
		},
		setInterval: (...args) => {
			logger.debug(`starting %c\`setInterval(${args[1]})\``, "color: #4488c5");

			const timer = ctx.setInterval(...args);

			invalidatorSet.add(() => clearInterval(timer));

			return timer;
		},
	};

	const invalidate = () => {
		logger.debug(
			`invalidating %c${invalidatorSet.size} listeners`,
			"color: #e07b9a",
		);

		for (const invalidate of invalidatorSet) {
			invalidate();
		}

		invalidatorSet.clear();
	};

	return { context, invalidate };
};
