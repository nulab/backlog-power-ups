export default defineContentScript({
	matches: defineMatches(["/add/*", "/view/*", "/user/*", "/gantt/*"]),
	allFrames: true,
	async main() {
		if (await isPluginDisabled("extend-desc")) {
			return;
		}

		const EXTENDED_HEIGHT = "480px";

		observeQuerySelector("#descriptionTextArea", (el) => {
			el.style.height = EXTENDED_HEIGHT;
		});

		observeQuerySelector(".comment-editor__textarea", (el) => {
			el.style.height = EXTENDED_HEIGHT;
		});
	},
});
