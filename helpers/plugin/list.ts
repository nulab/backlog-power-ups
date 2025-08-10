import type { DefinePowerUpsReturn } from "@/helpers/plugin/define.ts";
import type { PluginGroupId, PluginId } from "@/helpers/plugin/types.ts";
import * as pluginModules from "@/plugins";

type Plugin = DefinePowerUpsReturn & {
	pluginId: PluginId;
	name: string;
};

type PluginCategory = {
	group: PluginGroupId;
	title: string;
	plugins: Plugin[];
};

const plugins = Object.entries(pluginModules).map(
	// @ts-expect-error
	([pluginId, plugin]: [PluginId, DefinePowerUpsReturn]) =>
		({
			...plugin,
			pluginId: pluginId as PluginId,
			name: i18n.t(`${pluginId as PluginId}.name`),
		}) as Plugin,
);
const groups: PluginGroupId[] = [
	"issue",
	"board",
	"wiki",
	"document",
	"general",
];

export const PLUGINS_BY_GROUP: PluginCategory[] = groups.map((group) => ({
	group,
	title: i18n.t(`group.${group}`),
	plugins: plugins.filter((plugin) => plugin.group === group),
}));

export const PLUGINS = PLUGINS_BY_GROUP.flatMap(({ plugins }) => plugins);
