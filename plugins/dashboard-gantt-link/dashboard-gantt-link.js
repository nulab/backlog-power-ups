(() => {
    const main = () => {
        if (!location.pathname === "/dashboard") {
          return;
        }

        const $ganttAnchor = $("#userProfileLinkContainer > li:eq(2) a");
        const $linkGantt = $("#my_issues .title-group__edit-actions .title-group__edit-actions-item:first").clone();
        $linkGantt.find("._assistive-text").text($ganttAnchor.text());
        $linkGantt.find("use").attr("xlink:href", "/images/svg/sprite.symbol.svg#icon_gantt");
        $linkGantt.find("a").on("click", () => {
            const link = $ganttAnchor.attr("href");
            location.href = link;
            return false;
        });
        $("#my_issues .title-group__edit-actions").prepend($linkGantt);
    }

    PowerUps.isEnabled("dashboard-gantt-link", (enabled) => {
		if (enabled) {
            main();
		}
    });

})();
