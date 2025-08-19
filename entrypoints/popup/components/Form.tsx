import { useTransition } from "react";
import { PLUGINS_BY_GROUP } from "@/helpers/plugin/list";
import { reloadActiveTab } from "@/utils/browser-tab.ts";
import { usePlugins } from "../hooks/usePlugins.ts";

export const Form: React.FC = () => {
	const [isTouched, setIsTouched] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [enabledPluginIds, setEnabledPluginIds] = usePlugins();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const enabledPlugins = PLUGINS_BY_GROUP.flatMap(({ plugins }) => [
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
			{PLUGINS_BY_GROUP.map(({ group, title, plugins }) => (
				<section key={group} className="form__section">
					<h2 className="form__heading">{title}</h2>
					{plugins.map(({ pluginId, name }) => (
						<div key={pluginId} className="field">
							<label htmlFor={pluginId} className="field__label">
								{name}
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
				<button
					type="submit"
					className="form__submit"
					disabled={isPending || !isTouched}
				>
					{i18n.t("popup.apply_button")}
				</button>
			</div>
		</form>
	);
};
