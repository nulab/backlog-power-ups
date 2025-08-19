export const defineMatches = (patterns: `/${string}`[]): string[] => {
	return patterns.flatMap((pattern) =>
		["backlog.jp", "backlog.com", "backlogtool.com"].flatMap((domain) =>
			["", "?*"].map((suffix) => `https://*.${domain}${pattern}${suffix}`),
		),
	);
};
