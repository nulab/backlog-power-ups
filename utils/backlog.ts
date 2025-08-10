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
