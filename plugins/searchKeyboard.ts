export const searchKeyboard = definePowerUpsPlugin({
	group: "general",
	matches: ["/**"],
	main({ observeQuerySelector, addEventListener }) {
		const clearHovers = () => {
			for (const el of document.querySelectorAll("#SearchResult .is_hover")) {
				if (el instanceof HTMLElement) {
					el.classList.remove("is_hover");
				}
			}
		};

		observeQuerySelector("#globalSearchContainer", (el) => {
			const handleKeydown = (e: KeyboardEvent) => {
				if (!document.querySelector("#globalSearchContainer.is_opened")) {
					return;
				}

				if (document.activeElement?.id !== "globalSearch") {
					if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
						e.preventDefault();
						e.stopPropagation();

						const button = el.querySelector(
							e.key === "ArrowRight"
								? "button.pager__next"
								: "button.pager__prev",
						);
						if (button instanceof HTMLButtonElement) {
							button.click();
						}

						return;
					}
				}

				if (e.key === "ArrowUp" || e.key === "ArrowDown") {
					e.preventDefault();
					e.stopPropagation();

					const list = el.querySelector("#SearchResult");
					const items = Array.from(list?.children || []).filter(
						(el) => el instanceof HTMLLIElement,
					);

					const currentIndex = items.findIndex((el) =>
						el.classList.contains("is_hover"),
					);

					const nextIndex =
						(currentIndex + (e.key === "ArrowDown" ? 1 : -1)) % items.length;

					for (const item of items) {
						item.classList.remove("is_hover");
					}

					items.at(nextIndex)?.classList.add("is_hover");

					return;
				}

				if (e.key === "Enter") {
					e.preventDefault();
					e.stopPropagation();

					const anchor = el.querySelector(
						"#SearchResult .data-list__item.is_hover a",
					);

					if (!(anchor instanceof HTMLAnchorElement)) {
						return;
					}

					if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
						anchor.target = "_blank";
						anchor.click();
						anchor.removeAttribute("target");
					} else {
						anchor.click();
					}
				}
			};

			const cleanup = () => {
				const isOutside = document.activeElement
					? !document.activeElement.closest("#globalSearchContainer")
					: false;

				if (isOutside) {
					clearHovers();
				}
			};

			addEventListener(window, "keydown", handleKeydown);
			addEventListener(document, "click", cleanup);

			return () => {
				window.removeEventListener("keydown", handleKeydown);
				document.removeEventListener("click", cleanup);
			};
		});

		observeQuerySelector("#SearchResult .data-list__item", (el) => {
			const handleMouseOver = () => {
				clearHovers();

				el.classList.add("is_hover");
			};

			const handleMouseLeave = () => {
				el.classList.remove("is_hover");
			};

			addEventListener(el, "mouseover", handleMouseOver);
			addEventListener(el, "mouseleave", handleMouseLeave);

			return () => {
				el.removeEventListener("mouseover", handleMouseOver);
				el.removeEventListener("mouseleave", handleMouseLeave);
			};
		});

		observeQuerySelector("#globalSearch", (el) => {
			const handleFocusOut = () => {
				const activeButton = document.querySelector(
					"#SearchResultSwitch .button-group__link.is_active",
				);

				if (activeButton instanceof HTMLButtonElement) {
					activeButton.focus();
				}
			};

			addEventListener(el, "focusout", handleFocusOut);

			return () => el.removeEventListener("focusout", handleFocusOut);
		});

		observeQuerySelector("#SearchResultSwitch .button-group__link", (el) => {
			const handleFocus = () => {
				el.click();
			};

			addEventListener(el, "focus", handleFocus);

			return () => {
				el.removeEventListener("focus", handleFocus);
			};
		});

		observeQuerySelector(
			":where(#globalSearchReset, #SearchResult a, #SearchResult button)",
			(el) => {
				el.tabIndex = -1;
			},
		);
	},
});
