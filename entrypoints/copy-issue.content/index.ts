// @ts-nocheck

export default defineContentScript({
	matches: [
		"https://*.backlog.jp/view/*",
		"https://*.backlogtool.com/view/*",
		"https://*.backlog.com/view/*",
		"https://*.backlog.jp/add/*",
		"https://*.backlogtool.com/add/*",
		"https://*.backlog.com/add/*",
	],
	async main() {
		const { default: $ } = await import("jquery");
		const { PowerUps } = await import("@/utils/power-ups");
		const lang = PowerUps.getLang();

		const RES =
			lang == "ja"
				? {
						prompt: "複製先のプロジェクトキーを入力してください。",
						copyTo: "別のプロジェクトに複製",
						refs: "関連課題",
					}
				: {
						prompt: "Please input destination project key",
						copyTo: "Copy to another project",
						refs: "Refs",
					};

		const issueView = () => {
			const hideMenu = () => {
				PowerUps.injectScript(
					'$(".title-group__edit-actions dropdown-menu a.icon-button").click();',
				);
			};

			const clickHandler = () => {
				hideMenu();
				var projectKey = prompt(RES["prompt"]);
				if (projectKey) {
					const markdown = $(".markdown-body").length > 0;
					const h2 = markdown ? "##" : "**";
					const script = `
        var issue = ko.contextFor($("#issuecard")[0]).$data.store.issue();
        issue.description = issue.description + "\n\n${h2} ${RES["refs"]}\n-" + issue.issueKey + issue.summary;
        sessionStorage.setItem("copy-issue", JSON.stringify(issue));`;
					PowerUps.injectScript(script);
					const url = "/add/" + projectKey;
					location.href = url;
				}
			};

			setTimeout(() => {
				const $menuItem = $('<li class="dropdown-menu__item" />').append(
					$(
						'<a class="dropdown-menu__link is_active" href="javascript:void(0)"></a>',
					)
						.text(RES["copyTo"])
						.click(clickHandler),
				);
				$(".title-group__edit-actions ul.dropdown-menu").append($menuItem);
			}, 2000);
		};

		const addIssueView = () => {
			const restoreIssue = () => {
				const script = `
        var json = sessionStorage.getItem("copy-issue");
        if (json) {
            var issue = JSON.parse(json);
            $("#summaryInput").val(issue.summary);
            $("#descriptionTextArea").val(issue.description);
            sessionStorage.removeItem("copy-issue");
            var kodata = ko.contextFor($("#AddIssueForm")[0]).$data;
            kodata.summary.set(issue.summary);
            kodata.description.set(issue.description);
        }`;
				PowerUps.injectScript(script);
			};
			setTimeout(() => {
				restoreIssue();
			}, 1000);
		};

		PowerUps.isEnabled("copy-issue", (enabled) => {
			if (enabled) {
				if (location.pathname.startsWith("/view/")) {
					issueView();
				} else if (location.pathname.startsWith("/add/")) {
					addIssueView();
				}
			}
		});
	},
});
