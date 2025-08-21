import styles from "./index.module.css";

export const hideDocumentToolbar = definePowerUpsPlugin({
	group: "document",
	matches: ["/document/**"],
	allFrames: true,
	main({ observeQuerySelector }) {
		observeQuerySelector(".topbar", (el) => {
			el.classList.add(styles.hideToolbar);
		});
	},
});
