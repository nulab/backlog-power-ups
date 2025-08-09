type PowerUpPlugin = {
	pluginId: string;
	label: string;
	defaultEnabled: boolean;
};

type PowerUpPluginGroup = {
	groupId: string;
	name: string;
	plugins: PowerUpPlugin[];
};

export type PluginId =
	(typeof POWER_UP_PLUGIN_GROUPS)[number]["plugins"][number]["pluginId"];

export const POWER_UP_PLUGIN_GROUPS = [
	{
		groupId: "issue",
		name: i18n.t("popup.issue"),
		plugins: [
			{
				pluginId: "copy-issue",
				label: i18n.t("popup.copy_issue"),
				defaultEnabled: true,
			},
			{
				pluginId: "auto-resolution",
				label: i18n.t("popup.auto_resolution"),
				defaultEnabled: true,
			},
			{
				pluginId: "extend-desc",
				label: i18n.t("popup.extend_desc"),
				defaultEnabled: false,
			},
			{
				pluginId: "total-time",
				label: i18n.t("popup.total_time"),
				defaultEnabled: false,
			},
			{
				pluginId: "copy-issue-keys-and-subjects",
				label: i18n.t("popup.copy_issue_keys_and_subjects"),
				defaultEnabled: true,
			},
			{
				pluginId: "jump-issue",
				label: i18n.t("popup.jump_issue"),
				defaultEnabled: true,
			},
		],
	},
	{
		groupId: "board",
		name: i18n.t("popup.board"),
		plugins: [
			{
				pluginId: "board-oneline",
				label: i18n.t("popup.board_oneline"),
				defaultEnabled: true,
			},
		],
	},
	{
		groupId: "wiki",
		name: i18n.t("popup.wiki"),
		plugins: [
			{
				pluginId: "copy-wiki",
				label: i18n.t("popup.copy_wiki"),
				defaultEnabled: true,
			},
			{
				pluginId: "child-page",
				label: i18n.t("popup.child_page"),
				defaultEnabled: true,
			},
			{
				pluginId: "plantuml",
				label: i18n.t("popup.plantuml"),
				defaultEnabled: false,
			},
			{
				pluginId: "hr",
				label: i18n.t("popup.hr"),
				defaultEnabled: true,
			},
			{
				pluginId: "old-post",
				label: i18n.t("popup.old_post"),
				defaultEnabled: false,
			},
		],
	},
	{
		groupId: "general",
		name: i18n.t("popup.general"),
		plugins: [
			{
				pluginId: "user-switcher",
				label: i18n.t("popup.user_switcher"),
				defaultEnabled: true,
			},
			{
				pluginId: "absolute-date",
				label: i18n.t("popup.absolute_date"),
				defaultEnabled: false,
			},
			{
				pluginId: "watch-list",
				label: i18n.t("popup.watch_list"),
				defaultEnabled: false,
			},
		],
	},
] as const satisfies PowerUpPluginGroup[];

export const DEFAULT_PLUGINS = POWER_UP_PLUGIN_GROUPS.flatMap(({ plugins }) =>
	plugins.filter(({ defaultEnabled }) => defaultEnabled),
).map(({ pluginId }) => pluginId);
