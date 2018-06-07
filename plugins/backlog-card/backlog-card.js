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
                const ISSUE_URL = /[/]view[/]([A-Z_0-9]+[-][0-9]+)([#]comment-([0-9]+))?/;
                const BACKLOG_URL = /^https?:[/][/].+[.](backlog[.]com|backlog[.]jp|backlogtool[.]com)$/;
                const TARGET_SELECTOR = [
                    "#issueDescription a:not(.backlog-card-checked)",
                    ".comment-content a:not(.backlog-card-checked)",
                    ".wiki-content a:not(.backlog-card-checked)"
                ].join(",");
                
                let $currentTooltip;

                const onMessage = (event) => {
                    if (!BACKLOG_URL.test(event.origin)) {
                        return;
                      }
                      if (event.data.type === "rendered") {
                        const $base = jQuery(".tooltipster-base");
                        $base.find(".js-loading").hide();
                        $base.find("iframe").css('height', event.data.height).show();
                        if ($currentTooltip) {
                            $currentTooltip.tooltipster("reposition");
                        }
                      }
                };

                const onOpened = ($tooltip, continueTooltip) => {
                    $currentTooltip = $tooltip;
                    continueTooltip();
                }

                const onClosed = ($tooltip) => {
                    $currentTooltip = null;
                }

                const watch = () => {
                    jQuery(TARGET_SELECTOR).each((index, elem) => {
                        const $elem = jQuery(elem);
                        const url = $elem.attr("href");
                        const [,issueKey,,commentId] = ISSUE_URL.exec(url) || [];
                        if (issueKey) {
                            const embedUrl = commentId ? 
                                \`/view/embed/\${issueKey}/comment/\${commentId}\` : 
                                \`/view/embed/\${issueKey}\`;
                            const html = \`
                                <span class="loading--circle -small _mg-t-15 js-loading"></span>
                                <iframe src="\${embedUrl}"></iframe>
                            \`
                            $elem.tooltipster({
                                content: html,
                                contentAsHTML: true,
                                interactive: true,
                                speed: 0,
                                position: "right",
                                theme: "tooltipster-backlog",
                                functionBefore: onOpened,
                                functionAfter: onClosed
                            });
                            $elem.addClass("backlog-card-anchor");
                        }
                        $elem.addClass("backlog-card-checked");
                    });
                }

                setInterval(watch, 1000);
                window.addEventListener("message", onMessage, false);
            })();
        `);
    }

    PowerUps.isEnabled("backlog-card", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
