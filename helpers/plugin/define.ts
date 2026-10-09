import type { ContentScriptContext } from "wxt/utils/content-script-context";
import type { InvalidateFunction } from "@/helpers/dom/types.ts";
import {
	createPowerUpsPluginContext,
	type PowerUpsPluginContext,
} from "@/helpers/plugin/context.ts";
import type { PluginStates } from "@/helpers/plugin-manager/storage.ts";
import type { PluginGroupId } from "./types";

export type DefinePowerUpsPluginDefinition = {
	group: PluginGroupId;
	allFrames?: boolean;
	defaultEnabled?: boolean;
	/**
	 * Development builds turn every plugin on so they all get exercised. Set
	 * this for a plugin that would get in the way of working on the others.
	 */
	devEnabled?: boolean;
	matches: string[];
	excludeMatches?: string[];
	main: (context: PowerUpsPluginContext) => void | Promise<void>;
};

export type DefinePowerUpsReturn = ReturnType<typeof definePowerUpsPlugin>;

export const definePowerUpsPlugin = (
	definition: DefinePowerUpsPluginDefinition,
) => {
	const initialize = (
		ctx: ContentScriptContext,
		pluginStates: PluginStates,
	): InvalidateFunction => {
		const { context, invalidate } = createPowerUpsPluginContext(
			ctx,
			pluginStates,
			definition,
		);

		definition.main(context);

		return invalidate;
	};

	return { initialize, ...definition };
};
