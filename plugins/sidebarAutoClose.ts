export const sidebarAutoClose = definePowerUpsPlugin({
	group: "general",
	defaultEnabled: true,
	matches: ["/**"],
	main({ observeQuerySelector, addEventListener }) {
		const mql = matchMedia("(min-width: 1024px)");

		observeQuerySelector("#container", (el) => {
			const isUserTouched = () => {
				if (el.dataset.powerUpsSidebarOpen == null) {
					return false;
				}
				return (
					(el.classList.contains("is_project-nav-expanded") &&
						el.dataset.powerUpsSidebarOpen !== "true") ||
					(el.classList.contains("is_project-nav-collapsed") &&
						el.dataset.powerUpsSidebarOpen !== "false")
				);
			};

			const toggleClass = () => {
				if (isUserTouched()) {
					return;
				}

				el.classList.toggle("is_project-nav-expanded", mql.matches);
				el.classList.toggle("is_project-nav-collapsed", !mql.matches);
				el.dataset.powerUpsSidebarOpen = mql.matches.toString();
			};

			const observer = new MutationObserver(() => {
				if (isUserTouched()) {
					el.dataset.powerUpsSidebarOpen = "";
				}
			});
			observer.observe(el, { attributes: true, attributeFilter: ["class"] });

			toggleClass();
			addEventListener(mql, "change", toggleClass);

			return () => {
				observer.disconnect();
			};
		});
	},
});
