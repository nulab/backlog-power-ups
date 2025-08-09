export const getBacklogProjectKey = async () => {
	const headerKey = await asyncQuerySelector(".header-icon-set__key", {
		timeout: 0,
	});
	const [, keyInHeader] =
		/\(([^)]+)\)/g.exec(headerKey?.textContent || "") || [];

	if (keyInHeader) {
		return keyInHeader;
	}

	const menuLink = await asyncQuerySelector(
		'#projectNavList a[href^="/projects/"]',
		{ timeout: 0 },
	);
	const [, keyInMenu] =
		/\/([^/]+)\/?$/.exec(menuLink?.getAttribute("href") || "") || [];

	if (keyInMenu) {
		return keyInMenu;
	}

	return keyInMenu;
};
