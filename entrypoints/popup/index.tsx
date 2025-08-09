import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import { App } from "./components/App.tsx";

const rootEl = document.getElementById("root");

if (rootEl instanceof HTMLElement) {
	const root = createRoot(rootEl);
	root.render(
		<Suspense>
			<App />
		</Suspense>,
	);
}
