import { useTransition } from "react";
import { usePlugins } from "@/entrypoints/popup/hooks/usePlugins";
import { PLUGINS_BY_GROUP } from "@/helpers/plugin/list";
import { reloadActiveTab } from "@/utils/browser-tab.ts";
import { Disclosure } from "../Disclosure";
import styles from "./index.module.css";

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
		<form className={styles.form} onSubmit={handleSubmit}>
			{PLUGINS_BY_GROUP.map(
				({ group, title, plugins }) =>
					plugins.length > 0 && (
						<section key={group} className={styles.form__section}>
							<Disclosure
								label={title}
								enabledBadge={
									plugins.filter(({ pluginId }) =>
										enabledPluginIds.includes(pluginId),
									).length
								}
								disabledBadge={
									plugins.filter(
										({ pluginId }) => !enabledPluginIds.includes(pluginId),
									).length
								}
							>
								<div className={styles.form__fields}>
									{plugins.map(({ pluginId, name }) => (
										<div key={pluginId} className={styles.field}>
											<label htmlFor={pluginId} className={styles.field__label}>
												{name}
											</label>
											<input
												type="checkbox"
												id={pluginId}
												className={styles.field__checkbox}
												name={pluginId}
												value="enabled"
												defaultChecked={enabledPluginIds.includes(pluginId)}
											/>
										</div>
									))}
								</div>
							</Disclosure>
						</section>
					),
			)}
			<div className={styles.form__footer}>
				<button
					type="submit"
					className={styles.form__submit}
					disabled={isPending || !isTouched}
				>
					{i18n.t("popup.apply_button")}
				</button>
			</div>
		</form>
	);
};
