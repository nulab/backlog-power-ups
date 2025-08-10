export const getWikiTitle = (): string[] => {
	const mainTitle = document.querySelector("#mainTitle");

	return Array.from(mainTitle?.children || [])
		.filter((item) => item.classList.contains("breadcrumbs__item"))
		.map((item) => {
			const anchor = item.querySelector("a");
			return anchor ? anchor.textContent : item.textContent;
		});
};
