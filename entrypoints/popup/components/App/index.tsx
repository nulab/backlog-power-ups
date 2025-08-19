import { Suspense } from "react";
import icon from "@/assets/icon.png";
import { Form } from "../Form";
import styles from "./index.module.css";

export const App: React.FC = () => {
	return (
		<>
			<header className={styles.header}>
				<h1 className={styles.title}>{i18n.t("app.name")}</h1>
				<img src={icon} alt="" width={24} height={24} />
			</header>
			<div className={styles.container}>
				<Suspense fallback={<div className={styles.fallback} />}>
					<Form />
				</Suspense>
			</div>
		</>
	);
};
