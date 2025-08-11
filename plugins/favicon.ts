export const favicon = definePowerUpsPlugin({
	group: "general",
	matches: ["/**"],
	main({ observeQuerySelector }) {
		const replaceIcon = (el?: HTMLElement) => {
			for (const icon of document.querySelectorAll('link[rel="icon"]')) {
				if (el !== icon) {
					icon.remove();
				}
			}

			const projectIcon = document.querySelector(
				".project-header .header-icon-set__image",
			);
			const iconUrl =
				projectIcon instanceof HTMLImageElement
					? projectIcon.src
					: "/SpaceImage.action";

			if (el instanceof HTMLLinkElement) {
				el.href = iconUrl;
			} else {
				const link = html` <link rel="icon" href=${iconUrl} /> ` as string;

				document.head.insertAdjacentHTML("afterbegin", link);
			}
		};

		replaceIcon();
		observeQuerySelector('link[rel="icon"]', (el) => {
			replaceIcon(el);
		});
	},
});
