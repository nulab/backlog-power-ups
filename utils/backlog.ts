export const getBacklogProjectKey = (): string => {
	const headerKey = document.querySelector(".header-icon-set__key");
	const [, keyInHeader] =
		/\(([^)]+)\)/g.exec(headerKey?.textContent || "") || [];

	if (keyInHeader) {
		return keyInHeader;
	}

	const menuLink = document.querySelector(
		'#projectNavList a[href^="/projects/"]',
	);
	const [, keyInMenu] =
		/\/([^/]+)\/?$/.exec(menuLink?.getAttribute("href") || "") || [];

	if (keyInMenu) {
		return keyInMenu;
	}

	return keyInMenu;
};

export const getWikiTitle = (): string[] => {
	const mainTitle = document.querySelector("#mainTitle");

	return Array.from(mainTitle?.children || [])
		.filter((item) => item.classList.contains("breadcrumbs__item"))
		.map((item) => {
			const anchor = item.querySelector("a");
			return anchor ? anchor.textContent : item.textContent;
		});
};
