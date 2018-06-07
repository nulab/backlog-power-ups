(() => {
    const TOOLTIPSTER_CSS = "https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/css/tooltipster.min.css";
    const TOOLTIPSTER_JS = "https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/js/jquery.tooltipster.min.js";

    const main = () => {
        $(`<link rel="stylesheet" type="text/css" media="all" href="${TOOLTIPSTER_CSS}">`)
            .appendTo("body")
        $(`<script type="text/javascript" src="${TOOLTIPSTER_JS}">`)
            .appendTo("body")

        PowerUps.injectScript(`
            (() => {
                const PATTERN = /[/]view[/]([A-Z_0-9]+[-][0-9]+)/;
                const TARGET_SELECTOR = [
                    "#issueDescription a:not(.backlog-card-checked)",
                    ".comment-content a:not(.backlog-card-checked)",
                    ".wiki-content a:not(.backlog-card-checked)"
                ].join(",");
                
                const watch = () => {
                    jQuery(TARGET_SELECTOR).each((index, elem) => {
                        const $elem = jQuery(elem);
                        const url = $elem.attr("href");
                        const [, issueKey] = PATTERN.exec(url) || [];
                        if (issueKey) {
                            const html = \`<iframe src="/view/embed/\${issueKey}">\`
                            $elem.tooltipster({
                                content: html,
                                contentAsHTML: true,
                                interactive: true,
                                speed: 0,
                                position: "right",
                                theme: "tooltipster-backlog"
                            });
                            $elem.addClass("backlog-card-anchor");
                        }
                        $elem.addClass("backlog-card-checked");
                    });
                }

                setInterval(watch, 1000);
            })();
        `);
    }

    PowerUps.isEnabled("backlog-card", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
