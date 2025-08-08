// @ts-nocheck

export default defineContentScript({
	matches: [
		"https://*.backlog.jp/*",
		"https://*.backlogtool.com/*",
		"https://*.backlog.com/*",
	],
	async main() {
		const { PowerUps } = await import("@/utils/power-ups");
		const lang = PowerUps.getLang();

		const RES =
			lang == "ja"
				? {
						prompt: "移動先の課題キーまたは課題キーの番号を入力してください。",
						alert: "課題キーのフォーマットが無効です。",
						missing: "入力されたキーの課題が見つかりません。",
					}
				: {
						prompt:
							"Please enter the destination issue key or issue key number",
						alert: "Issue key format is invalid",
						missing: "Issue not found for the entered issue key",
					};

		function main(e) {
			if (!window.Backlog || !window.Backlog.resource) {
				return;
			}

			const projectKey = window.Backlog.resource["project.key"];

			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				let issueNum;
				while (true) {
					issueNum = prompt(RES.prompt);
					if (!issueNum) {
						return;
					}
					issueNum = issueNum.replace(`${projectKey}-`, "");
					if (!issueNum.match(/\d+/)) {
						alert(RES.alert);
						continue;
					}
					break;
				}

				const issueKey = `${projectKey}-${issueNum}`;
				const issueUrl = `https://${location.hostname}/view/${issueKey}`;

				fetch(issueUrl, {
					method: "HEAD",
					credentials: "include",
				}).then((res) => {
					if (!res.ok) {
						alert(RES.missing);
						return;
					}
					location.href = issueUrl;
				});
			}
		}

		function addHook() {
			window.addEventListener("keydown", async (e) => {
				main(e);
			});
		}

		PowerUps.isEnabled("jump-issue", (enabled) => {
			if (enabled) {
				PowerUps.injectScript(`
              const RES = ${JSON.stringify(RES)};
              ${main.toString()}
              ${addHook.toString()}
              addHook();
            `);
			}
		});
	},
});
