import { POWER_UP_PLUGIN_GROUPS } from "@/utils/plugins.ts";
import { usePlugins } from "../hooks/usePlugins.ts";
import { useTransition } from "react";

export const App: React.FC = () => {
	const [isPending, startTransition] = useTransition();
	const [enabledPluginIds, setEnabledPluginIds] = usePlugins();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const enabledPlugins = POWER_UP_PLUGIN_GROUPS.flatMap(({ plugins }) => [
			...plugins,
		]).filter(({ pluginId }) => formData.get(pluginId) === "enabled");

		startTransition(async () =>
			setEnabledPluginIds(enabledPlugins.map(({ pluginId }) => pluginId)),
		);
	};

	return (
		<form onSubmit={handleSubmit}>
			{POWER_UP_PLUGIN_GROUPS.map(({ groupId, name, plugins }) => (
				<section key={groupId}>
					<h2>{name}</h2>
					{plugins.map(({ pluginId, label }) => (
						<div key={pluginId}>
							<input
								type="checkbox"
								id={pluginId}
								name={pluginId}
								value="enabled"
								defaultChecked={enabledPluginIds.includes(pluginId)}
							/>
							<label htmlFor={pluginId}>{label}</label>
						</div>
					))}
				</section>
			))}
			<button disabled={isPending}>{i18n.t("popup.apply_button")}</button>
		</form>
	);
};
