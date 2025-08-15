import pDebounce from "p-debounce";

export const filePermalink = definePowerUpsPlugin({
	group: "git",
	matches: ["/git/**/blob/**"],
	main({ observeQuerySelector, asyncQuerySelector }) {
		const PREFIX_LENGTH = 5;

		const debounced = pDebounce(async (el: HTMLElement) => {
			if (!(el.parentElement instanceof HTMLSelectElement)) {
				return;
			}

			const commits = Array.from(el.parentElement.children)
				.filter((maybeOption) => maybeOption instanceof HTMLOptionElement)
				.map((option) => option.value);

			const breadcrumbs = await asyncQuerySelector(
				".git-path-bar__directory.breadcrumbs",
			);
			const fileNames = Array.from(breadcrumbs?.children || []).length - 1;

			const url = new URL(location.href);
			const pathNames = url.pathname
				.split("/")
				.flatMap((path) => decodeURIComponent(path).split("/"));
			const ref = pathNames
				.slice(PREFIX_LENGTH, pathNames.length - fileNames)
				.join("/");

			if (commits.includes(ref)) {
				return;
			}

			url.pathname = pathNames
				.toSpliced(PREFIX_LENGTH, pathNames.length - fileNames - 5, commits[0])
				.join("/");

			for (const buttons of document.querySelectorAll(
				".code-view-set__action-buttons",
			)) {
				buttons.insertAdjacentHTML(
					"beforeend",
					html`
                        <a
                            href=${url.href}
                            class="button button--default -h-small"
                        >
                            <span>${i18n.t("filePermalink.label")}</span>
                        </a>
                    ` as string,
				);
			}
		}, 100);

		observeQuerySelector("#selectFromRevision > option", debounced);
	},
});
