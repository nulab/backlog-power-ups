// @ts-nocheck

export default defineContentScript({
	matches: [
		"https://*.backlog.jp/wiki/*/*",
		"https://*.backlog.jp/alias/wiki/*",
		"https://*.backlogtool.com/wiki/*/*",
		"https://*.backlogtool.com/alias/wiki/*",
		"https://*.backlog.com/wiki/*/*",
		"https://*.backlog.com/alias/wiki/*",
	],
	async main() {
		const { default: $ } = await import("jquery");
		const { PowerUps } = await import("@/utils/power-ups");
		const PATTERN_SHOW_WIKI = /^[/]wiki[/]([A-Z_0-9]+)[/]([^\/]+)$/;
		const PATTERN_ALIAS = /^[/]alias[/]wiki[/](\d+)$/;
		const PATTERN_CREATE_WIKI = /^[/]wiki[/]([A-Z_0-9]+)[/]([^\/]+)[/]create$/;

		const RES =
			PowerUps.getLang() == "ja"
				? {
						prompt: "複製先のプロジェクトキーを入力してください。",
						copyTo: "別のプロジェクトにコピー",
					}
				: {
						prompt: "Please input destination project key",
						copyTo: "Copy to another project",
					};
		const createPageView = () => {
			const insertWikiContent = () => {
				var json = sessionStorage.getItem("copy-wiki");
				if (json) {
					var data = JSON.parse(json);
					$.ajax({
						url: "/ViewWikiJson.action",
						type: "GET",
						data: {
							projectKey: data.sourceProjectKey,
							wikiId: data.sourcePageId,
						},
						cache: false,
						timeout: 10000,
						statusCode: {
							"200": function (data) {
								$(".comment-editor__textarea").val(data.content);
							},
						},
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
						},
					});
				}
			};
			setTimeout(() => {
				insertWikiContent();
			}, 1000);
		};

		const getWikiPageNameFromTitle = () => {
			return document.title.match(/^(\[.*?\])(.*)\| Wiki \| Backlog/)[2].trim();
		};

		const showPageView = () => {
			const hideMenu = () => {
				PowerUps.injectScript(
					'jQuery(".wiki-page-tag-group--icon dropdown-menu a.icon-button").click();',
				);
			};

			const clickMenuItemHandler = () => {
				hideMenu();

				const pageName = getWikiPageNameFromTitle();
				const pageId = $('input[name="pageId"]').val();
				const destProjectKey = prompt(RES["prompt"]);
				if (destProjectKey) {
					const script = `
    var json = {sourceProjectKey: Backlog.resource['project.key'], sourcePageName: "${pageName}", sourcePageId: "${pageId}"};
    sessionStorage.setItem("copy-wiki", JSON.stringify(json));
    location.href = "/wiki/${destProjectKey}/${encodeURIComponent(pageName)}/create";
                    `;
					PowerUps.injectScript(script);
				}
			};

			const setupMenuItem = () => {
				const $menuItem = $('<li class="dropdown-menu__item" />').append(
					$(
						'<a class="dropdown-menu__link is_active" href="javascript:void(0)"></a>',
					)
						.text(RES["copyTo"])
						.click(clickMenuItemHandler),
				);
				$(".wiki-page-tag-group--icon dropdown-menu ul.dropdown-menu").append(
					$menuItem,
				);
			};
			setupMenuItem();
		};

		const main = () => {
			if (location.pathname.match(PATTERN_CREATE_WIKI)) {
				setTimeout(() => {
					createPageView();
				}, 0);
			} else if (
				location.pathname.match(PATTERN_SHOW_WIKI) ||
				location.pathname.match(PATTERN_ALIAS)
			) {
				setTimeout(() => {
					showPageView();
				}, 0);
			}
		};

		PowerUps.isEnabled("copy-wiki", (enabled) => {
			if (enabled) {
				main();
			}
		});
	},
});
