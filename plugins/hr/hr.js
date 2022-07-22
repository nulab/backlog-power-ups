(() => {
	const PATTERN_SHOW_WIKI = /^[/]wiki[/]([A-Z_0-9]+)[/]([^\\/]+)$/;
	const PATTERN_ALIAS = /^[/]alias[/]wiki[/](\d+)$/;
	const PATTERN_HR = /([-]{3,}|[_]{3,})([<]br[>])?$/gm;

	const replace = () => {
		document.querySelectorAll("#loom p").forEach(elem => {
			const innerHTML = elem.innerHTML;
			if (innerHTML.match(PATTERN_HR)) {
				elem.innerHTML = "<hr>";
			}
		})
	}

	const main = () => {
		const isMarkdown = document.querySelector(".markdown-body") ? true : false;
		if (isMarkdown) {
			return;
		} else if (location.pathname.match(PATTERN_SHOW_WIKI) || location.pathname.match(PATTERN_ALIAS)) {
			replace();
		}
	}

    PowerUps.isEnabled("hr", (enabled) => {
		if (enabled) {
			main();
		}
	});
})();
