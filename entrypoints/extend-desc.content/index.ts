export default defineContentScript({
	matches: defineMatches(["/add/*", "/view/*", "/user/*", "/gantt/*"]),
	allFrames: true,
	async main() {
		if (await isPluginDisabled("extend-desc")) {
			return;
		}

		const EXTENDED_HEIGHT = "480px";

		observeQuerySelector("#descriptionTextArea", (el) => {
			console.log("FIND...!");
			el.style.height = EXTENDED_HEIGHT;
		});

		observeQuerySelector(".comment-editor__textarea", (el) => {
			if (el.closest(".comment-editor.-fixed-footer")) {
				return;
			}

			el.style.height = EXTENDED_HEIGHT;
		});

		// in issue footer
		observeQuerySelector(".comment-editor.-fixed-footer", (el) => {
			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (
						mutation.attributeName !== "class" ||
						!(mutation.target instanceof HTMLElement)
					) {
						console.log(
							mutation.attributeName !== "class",
							"style" in mutation.target,
						);

						return;
					}

					const textArea = mutation.target.querySelector(
						".comment-editor__textarea",
					);

					if (!(textArea instanceof HTMLElement)) {
						return;
					}

					if (mutation.target.classList.contains("is_comment-all-collapsed")) {
						textArea.style.removeProperty("height");
					} else {
						textArea.style.height = EXTENDED_HEIGHT;
					}
				}
			});

			observer.observe(el, { attributes: true });
		});
	},
});
