(() => {
    const PATTERN_SHOW_WIKI = /^[/]wiki[/]([A-Z]+)[/]([^\\/]+)$/;
    const PATTERN_CREATE_WIKI = /^[/]wiki[/]([A-Z]+)[/]([^\\/]+)[/]create$/;

	const RES = PowerUps.getLang() == "ja" ? {
		"prompt": "複製先のプロジェクトキーを入力してください。",
		"copyTo": "別のプロジェクトにコピー"
	} : {
		"prompt": "Please input destination project key",
		"copyTo": "Copy to another project"
	};
	const createPageView = () => {
		const insertWikiContent = () => {
			const script = `
var json = sessionStorage.getItem("copy-wiki");
if (json) {
	var data = JSON.parse(json);
	var jsonrpc = Backlog.getJsonrpc();
	jsonrpc.rpcService.getPage(callbackGetPage, data.sourceProjectId, data.sourcePageName);
	sessionStorage.removeItem("copy-wiki");
}
			`;
			PowerUps.injectScript(script);
		}
		setTimeout(() => {
			insertWikiContent();
		}, 1000);
	}

    const showPageView = () => {
		const hideMenu = () => {
			PowerUps.injectScript('jQuery(".wiki-page-tag-group--icon dropdown-menu a.icon-button").click();');
		};
	
		const clickMenuItemHandler = () => {
			hideMenu();

			const parts = PATTERN_SHOW_WIKI.exec(location.pathname);
			const pageName = decodeURIComponent(parts[2]).replace("+", " "); // decode x-www-form-urlencoded
			const destProjectKey = prompt(RES["prompt"]);
			if (destProjectKey) {
				const script = `
var json = {sourceProjectId: Backlog.resource['project.id'], sourcePageName: "${pageName}"};
sessionStorage.setItem("copy-wiki", JSON.stringify(json));
location.href = "/wiki/${destProjectKey}/${encodeURIComponent(pageName)}/create";
				`;
				PowerUps.injectScript(script);
			}
		}
	
		const setupMenuItem = () => {
			const $menuItem = $('<li class="dropdown-menu__item" />').append(
				$('<a class="dropdown-menu__link is_active" href="javascript:void(0)"></a>').text(RES["copyTo"])
				.click(clickMenuItemHandler)
			);
			$(".wiki-page-tag-group--icon dropdown-menu ul.dropdown-menu").append($menuItem);
		}
		setupMenuItem();
    }

	const main = () => {
        if (location.pathname.match(PATTERN_CREATE_WIKI)) {
            setTimeout(() => {
                createPageView();
            }, 0);
		} else if (location.pathname.match(PATTERN_SHOW_WIKI)) {
            setTimeout(() => {
                showPageView();
            }, 0);
        }
	}

    PowerUps.isEnabled("copy-wiki", (enabled) => {
		if (enabled) {
			main();
		}
	});
})();
