export const jumpIssue = definePowerUpsPlugin({
	group: "issue",
	defaultEnabled: true,
	matches: ["/**"],
	async main({ addEventListener }) {
		const jumpIssue = async () => {
			const projectKey = await getBacklogProjectKey();

			const input = window.prompt(i18n.t("jumpIssue.prompt")) || "";

			if (!input) {
				return;
			}

			const [number] = /[0-9]+$/.exec(input) || [];
			const [numberWithKey] =
				/[A-Z0-9_]+-[0-9]+/.exec(input.toUpperCase()) || [];
			const issueKey = numberWithKey || `${projectKey}-${number}`;

			if (typeof issueKey !== "string") {
				alert(i18n.t("jumpIssue.alert"));
				return;
			}

			const issueUrl = `${location.origin}/view/${issueKey}`;

			const res = await fetch(issueUrl, {
				method: "HEAD",
				credentials: "include",
			});

			await res.text();

			if (res.ok) {
				location.href = issueUrl;
			} else {
				alert(i18n.t("jumpIssue.missing"));
			}
		};

		addEventListener(window, "keydown", (e) => {
			if (
				(e.ctrlKey || e.metaKey) &&
				!e.shiftKey &&
				!e.altKey &&
				e.key === "k"
			) {
				jumpIssue();
			}
		});
	},
});
