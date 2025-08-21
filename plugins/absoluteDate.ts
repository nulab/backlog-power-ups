export const absoluteDate = definePowerUpsPlugin({
	group: "general",
	matches: ["/dashboard", "/projects/**", "/user/**"],
	allFrames: true,
	main({ observeQuerySelector }) {
		observeQuerySelector(
			".stream-update__meta > abbr:not(.converted)",
			(el) => {
				el.classList.add("converted");

				const dateString = el.dataset.tooltip;
				const [, time] = dateString?.match(/ ([0-9]{2}:[0-9]{2})/) || [];

				if (time) {
					replaceTextNodes(el, time);
				}
			},
		);
	},
});
