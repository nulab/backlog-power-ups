import styles from "./index.module.css";

export const zenMode = definePowerUpsPlugin({
	group: "document",
	matches: ["/document/**"],
	main({ observeQuerySelector }) {
		observeQuerySelector(".topbar-info", (el) => {
			const button = createButton(
				html`
                <button class="icon-button icon-button--default">
                    <svg class="icon -nu-ui -medium"><use xlink:href="/images/svg_nu-ui/sprite.svg#fire"></use></svg>
                    <span class="_assistive-text">Zen Mode</span>
                </button>
            `,
				{
					click(e) {
						if (e.currentTarget instanceof HTMLButtonElement) {
							e.currentTarget.classList.toggle("icon-button--default");

							const isZenMode = e.currentTarget.classList.toggle(
								"icon-button--primary",
							);

							document.body.classList.toggle(styles.zenMode, isZenMode);
						}
					},
				},
			);

			el.appendChild(button);

			return () => {
				document.body.classList.remove(styles.zenMode);
			};
		});
	},
});
