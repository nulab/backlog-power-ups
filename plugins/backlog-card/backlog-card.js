(() => {

    const main = () => {
        $(`<link rel="stylesheet" type="text/css" media="all" href="https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/css/tooltipster.min.css">`).appendTo("body")
        $(`<link rel="stylesheet" type="text/css" media="all" href="https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/css/themes/tooltipster-shadow.css">`).appendTo("body")        
        $(`<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/js/jquery.tooltipster.min.js">`).appendTo("body")

        PowerUps.injectScript(`
            setInterval(() => {
                const PATTERN = /[/]view[/]([A-Z_0-9]+[-][0-9]+)/;
                jQuery("#issueDescription a:not(.backlog-card-checked),.comment-content a:not(.backlog-card-checked), .wiki-content a:not(.backlog-card-checked)").each((index, elem) => {
                    const $elem = jQuery(elem).addClass("backlog-card-checked");
                    const url = $elem.attr("href");
                    console.log(url);
                    const parts = PATTERN.exec(url);
                    if (parts && parts[1]) {
                        const issueKey = parts[1];
                        const html = '<iframe src="/view/embed/' + issueKey + '">'
                        console.log(html);
                        $elem.tooltipster({
                            content: html,
                            interactive: true,
                            contentAsHTML: true,
                            speed: 0,
                            position: "right",
                            theme: "tooltipster-backlog"
                        }).addClass("backlog-card-anchor");
                    }
                });
            }, 1000);
        `);
    }

    PowerUps.isEnabled("backlog-card", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
