(() => {

    const PATTERN = /[/]view[/]([A-Z_0-9]+[-][0-9]+)/;

    const show = (issueKey, target) => {
        console.log($(target).position());
        console.log($(target).offset());
        const offset = $(target).offset();
        offset.top = offset.top + 20;
        getContainer()
        .css(offset)
        .attr("src", `/view/embed/${issueKey}`).show();
    }

    const hide = () => {
        getContainer().attr("src", "").hide();
    }

    const build = () => {
        const $card = $(`<iframe id="backlog-card" style="
            width: 500px;
            height: 350px;
            z-index: 10000000000;
            position: absolute;
            border-color: #c7c0be;
            border: 1px solid transparent;
            filter: drop-shadow(0 0 5px rgba(0,0,0,.5));
            left: 0;
            top: 0;
        ">`).appendTo("body");
        return $card;
    }

    const getContainer = () => {
        const $card = $("#backlog-card");
        if ($card.length == 0) {
            return build();
        } 
        return $card;
    }

    const main = () => {
        $(document).on({
            'mouseenter' : (event) => {
                const url = $(event.target).attr("href");
                const parts = PATTERN.exec(url);
                if (parts && parts[1]) {
                    const issueKey = parts[1];
                    show(issueKey, event.target);
                }
            },
            'mouseleave' : () => {
                hide();
            }
         }, "a");
    }

    PowerUps.isEnabled("backlog-card", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
