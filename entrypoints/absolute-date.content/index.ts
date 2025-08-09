import { isPluginDisabled } from "@/utils/storage";
import { observeQuerySelector, replaceTextNodes } from "@/utils/dom.ts";
import { defineMatches } from "@/utils/content-script.ts";

export default defineContentScript({
	matches: defineMatches(["/dashboard", "/projects/*", "/user/*"]),
	async main() {
		if (await isPluginDisabled("absolute-date")) {
			return;
		}

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
