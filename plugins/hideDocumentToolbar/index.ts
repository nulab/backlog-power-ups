import styles from "./index.module.css";

export const hideDocumentToolbar = definePowerUpsPlugin({
	group: "document",
	matches: ["/document/**"],
	main({ observeQuerySelector }) {
		observeQuerySelector(".topbar", (el) => {
			el.classList.add(styles.hideToolbar);
		});
	},
});
