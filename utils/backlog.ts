export const getBacklogProjectKey = async () => {
	const [, keyInTitle] = /\[([^\]]+)\]/.exec(document.title) || [];

	if (keyInTitle) {
		return keyInTitle;
	}

	const headerKey = await asyncQuerySelector(".header-icon-set__key");
	const [, keyInHeader] =
		/\(([^)]+)\)/g.exec(headerKey?.textContent || "") || [];

	if (keyInHeader) {
		return keyInHeader;
	}

	const menuLink = await asyncQuerySelector(
		'#projectNavList a[href^="/projects/"]',
	);
	const [, keyInMenu] =
		/\/([^/]+)\/?$/.exec(menuLink?.getAttribute("href") || "") || [];

	if (keyInMenu) {
		return keyInMenu;
	}

	return keyInTitle;
};
