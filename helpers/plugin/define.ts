import {
	createPowerUpsPluginContext,
	type PowerUpsPluginContext,
} from "@/helpers/plugin/context.ts";
import type { PluginStates } from "@/helpers/plugin-manager/storage.ts";
import type { PluginGroupId } from "./types";

type DefinePowerUpsPluginDefinition = {
	group: PluginGroupId;
	defaultEnabled?: boolean;
	matches: string[];
	excludeMatches?: string[];
	main: (context: PowerUpsPluginContext) => void | Promise<void>;
};

export type DefinePowerUpsReturn = ReturnType<typeof definePowerUpsPlugin>;

export const definePowerUpsPlugin = (
	definition: DefinePowerUpsPluginDefinition,
) => {
	const { context, invalidate } = createPowerUpsPluginContext();

	const initialize = (pluginStates: PluginStates) => {
		definition.main({ ...context, pluginStates });
	};

	return { initialize, invalidate, ...definition };
};
