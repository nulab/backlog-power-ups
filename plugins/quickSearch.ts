export const quickSearch = definePowerUpsPlugin({
	group: "general",
	matches: ["/**"],
	defaultEnabled: true,
	main({ addEventListener }) {
		const focusSearchInSpace = () => {
			const globalSearch = document.getElementById("globalSearch");

			if (!(globalSearch instanceof HTMLInputElement)) {
				return;
			}

			const selectedText = window.getSelection()?.toString() || "";

			if (selectedText.length > 0 && selectedText.length < 320) {
				globalSearch.value = selectedText;
				globalSearch.dispatchEvent(new Event("change", { bubbles: true }));
			}

			globalSearch.focus();
		};

		addEventListener(window, "keydown", (e) => {
			if (
				(e.ctrlKey || e.metaKey) &&
				e.shiftKey &&
				!e.altKey &&
				e.key === "f"
			) {
				focusSearchInSpace();
			}
		});
	},
});
