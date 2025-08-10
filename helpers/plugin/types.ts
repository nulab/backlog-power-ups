import type * as pluginModules from "@/plugins";

export type PluginId = keyof typeof pluginModules;

export type PluginGroupId = "issue" | "board" | "wiki" | "general";
