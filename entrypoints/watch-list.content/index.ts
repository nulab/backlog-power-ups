export default defineContentScript({
	matches: defineMatches(["/*"]),
	allFrames: true,
	async main() {
		if (await isPluginDisabled("watch-list")) {
			return;
		}
	},
});
