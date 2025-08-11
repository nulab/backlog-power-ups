import styles from "./index.module.css";

export const expandDiffFileLink = definePowerUpsPlugin({
	group: "git",
	matches: ["/git/**", "/subversion/**", "/rev/**"],
	main({ observeQuerySelector, addEventListener }) {
		observeQuerySelector(".updated-list > .updated-list__item", (el) => {
			el.classList.add(styles.item);

			const fileLink = el.querySelector(
				".updated-list__path",
			)?.firstElementChild;
			const fileUrl =
				fileLink instanceof HTMLAnchorElement ? fileLink.href : null;

			if (!fileUrl) {
				return;
			}

			const handleClick = (e: Event) => {
				if (!(e.target instanceof HTMLElement)) {
					return;
				}

				if (!e.target.closest("a")) {
					location.href = fileUrl;
				}
			};

			addEventListener(el, "click", handleClick);

			return () => {
				el.removeEventListener("click", handleClick);
			};
		});
	},
});
