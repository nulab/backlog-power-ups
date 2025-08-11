import type * as pluginModules from "@/plugins";

export type PluginId = keyof typeof pluginModules;

export type PluginGroupId =
	| "general"
	| "issue"
	| "board"
	| "gantt"
	| "document"
	| "wiki"
	| "file"
	| "git";
