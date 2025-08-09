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
		<>
			<header className="header">
				<h1 className="header__title">{i18n.t("app.name")}</h1>
			</header>
			<form className="form" onSubmit={handleSubmit}>
				{POWER_UP_PLUGIN_GROUPS.map(({ groupId, name, plugins }) => (
					<section key={groupId} className="form__section">
						<h2 className="form__heading">{name}</h2>
						{plugins.map(({ pluginId, label }) => (
							<div key={pluginId} className="field">
								<label htmlFor={pluginId} className="field__label">
									{label}
								</label>
								<input
									type="checkbox"
									id={pluginId}
									className="field__checkbox"
									name={pluginId}
									value="enabled"
									defaultChecked={enabledPluginIds.includes(pluginId)}
								/>
							</div>
						))}
					</section>
				))}
				<div className="form__footer">
					<button className="form__submit" disabled={isPending}>
						{i18n.t("popup.apply_button")}
					</button>
				</div>
			</form>
		</>
	);
};
