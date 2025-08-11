import { IframeDialog } from "@/components/IframeDialog";
import styles from "./index.module.css";

export const openInDialog = definePowerUpsPlugin({
	group: "general",
	matches: ["/**"],
	allFrames: true,
	main({ addEventListener }) {
		let controller: AbortController | undefined;

		const handleMouseDown = async (e: Event) => {
			controller?.abort();

			if (!(e.target instanceof HTMLElement)) {
				return;
			}

			const anchor = e.target.closest("a");

			if (!anchor) {
				return;
			}

			const url = new URL(anchor.href, location.origin);

			if (url.origin !== location.origin) {
				return;
			}

			const abortController = new AbortController();
			controller = abortController;

			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (abortController.signal.aborted || !e.target.isConnected) {
				return;
			}

			e.preventDefault();

			url.searchParams.append("__powerUpsDialog", "true");

			const unmount = renderReactComponent(
				<IframeDialog open src={url} onClose={() => unmount()} />,
			);

			return () => {
				unmount();
			};
		};

		if (isMainFrame) {
			addEventListener(window, "mousedown", handleMouseDown);
			addEventListener(window, "mouseup", () => controller?.abort());

			return;
		}

		const url = new URL(location.href);
		if (url.searchParams.get("__powerUpsDialog") === "true") {
			sessionStorage.setItem("__powerUpsDialog", "true");

			url.searchParams.delete("__powerUpsDialog");
			history.replaceState(null, "", url.href);
		}

		if (sessionStorage.getItem("__powerUpsDialog") === "true") {
			document.body.classList.add(styles.dialogRoot);
		}
	},
});
