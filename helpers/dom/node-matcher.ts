export const nodeMatcher = (selector: string, node: Node): HTMLElement[] => {
	if (!(node instanceof HTMLElement)) {
		return [];
	}

	if (node.matches(selector)) {
		return [node];
	}

	return Array.from(node.querySelectorAll(selector)).filter(
		(el) => el instanceof HTMLElement,
	);
};
