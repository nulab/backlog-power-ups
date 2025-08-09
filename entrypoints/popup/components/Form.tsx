import { POWER_UP_PLUGIN_GROUPS } from "@/utils/plugins.ts";
import { usePlugins } from "../hooks/usePlugins.ts";
import { useTransition } from "react";
import { reloadActiveTab } from "@/utils/browser-tab.ts";

export const Form: React.FC = () => {
	const [isTouched, setIsTouched] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [enabledPluginIds, setEnabledPluginIds] = usePlugins();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const enabledPlugins = POWER_UP_PLUGIN_GROUPS.flatMap(({ plugins }) => [
			...plugins,
		]).filter(({ pluginId }) => formData.get(pluginId) === "enabled");

		startTransition(async () => {
			await setEnabledPluginIds(enabledPlugins.map(({ pluginId }) => pluginId));

			reloadActiveTab();
			window.close();

			await new Promise(() => {});
		});
	};

	useEffect(() => {
		const onChange: EventListener = (e) => {
			if (
				e.target instanceof HTMLInputElement &&
				e.target.type === "checkbox"
			) {
				setIsTouched(true);
			}
		};
		document.addEventListener("change", onChange);

		return () => {
			document.removeEventListener("change", onChange);
		};
	}, []);

	return (
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
				<button className="form__submit" disabled={isPending || !isTouched}>
					{i18n.t("popup.apply_button")}
				</button>
			</div>
		</form>
	);
};
