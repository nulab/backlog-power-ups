import { Suspense } from "react";
import { Form } from "./Form.tsx";

export const App: React.FC = () => {
	return (
		<>
			<header className="header">
				<h1 className="header__title">{i18n.t("app.name")}</h1>
			</header>
			<Suspense fallback={<div className="form__fallback" />}>
				<pre>{i18n.t("applyButton")}</pre>
				<Form />
			</Suspense>
		</>
	);
};
