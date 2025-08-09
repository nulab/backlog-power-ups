export const defineMatches = (patterns: `/${string}`[]): string[] => {
	return patterns.flatMap((pattern) => [
		`https://*.backlog.jp${pattern}`,
		`https://*.backlogtool.com${pattern}`,
		`https://*.backlog.com${pattern}`,
	]);
};
