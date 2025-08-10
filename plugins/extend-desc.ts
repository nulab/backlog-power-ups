export const extendDesc = definePowerUpsPlugin({
	name: "popup.extend_desc",
	group: "issue",
	matches: ["/add/*", "/view/*", "/user/*", "/gantt/*"],
	async main({ observeQuerySelector }) {
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
