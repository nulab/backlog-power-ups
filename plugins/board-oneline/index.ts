import styles from "./index.module.css";

export const boardOneline = definePowerUpsPlugin({
	name: "popup.board_oneline",
	group: "board",
	defaultEnabled: true,
	matches: ["/board/*"],
	async main({ observeQuerySelector }) {
		const buttonHtml = html`<button class=${styles.button}>⊟</button>`;

		observeQuerySelector(".title-group", (el) => {
			const headingEl = el.firstChild?.firstChild;

			const button = createButton(buttonHtml, {
				click() {
					const sections = document.querySelectorAll("#kanban section");
					const isEnabled = Array.from(sections).every((section) =>
						section.classList.contains(styles.onelined),
					);

					for (const section of sections) {
						section.classList.toggle(styles.onelined, !isEnabled);
					}
				},
			});

			headingEl?.appendChild(button);
		});

		observeQuerySelector("#kanban section", (el) => {
			const headingEl = el.firstChild?.firstChild?.firstChild;

			const button = createButton(buttonHtml, {
				click() {
					el.classList.toggle(styles.onelined);
				},
			});

			headingEl?.appendChild(button);
		});
	},
});
