import { createRoot } from "react-dom/client";

export const renderReactComponent = (
	children: React.ReactNode,
	parentElement = document.body,
	where: InsertPosition = "beforebegin",
) => {
	const rootEl = document.createElement("div");
	const root = createRoot(rootEl);
	root.render(children);

	parentElement.insertAdjacentElement(where, rootEl);

	return () => {
		root.unmount();
		rootEl.remove();
	};
};
