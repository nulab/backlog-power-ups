(() => {
	const PATTERN_SHOW_WIKI = /^[/]wiki[/]([A-Z_0-9]+)[/]([^\\/]+)$/;
	const PATTERN_HR = /([-]{3,}|[_]{3,})([<]br[>])?$/gm;

	const main = () => {
		const isMarkdown = document.querySelector(".markdown-body") ? true : false;
		if (location.pathname.match(PATTERN_SHOW_WIKI) === false || isMarkdown) {
			return;
		}
		document.querySelectorAll("#loom p").forEach(elem => {
			const innerHTML = elem.innerHTML;
			if (innerHTML.match(PATTERN_HR)) {
				elem.innerHTML = "<hr>";
			}
		})
	}

    PowerUps.isEnabled("hr", (enabled) => {
		if (enabled) {
			main();
		}
	});
})();
