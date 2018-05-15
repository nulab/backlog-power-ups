(() => {
    const extend = () => {
        $("#descriptionTextArea").css("height", "480px");
    }

    const addIssueView = () => {
        extend();
    }

    const editIssueView = () => {
        extend();
    }

    const main = () => {
        setTimeout(() => {
            if (location.pathname.startsWith("/add/")) {
                addIssueView();
            } else if (location.pathname.match(/[/]view[/][A-Z]+[-][0-9]+[/]edit/)) {
                editIssueView();
            }
        }, 0);
    }

    chrome.storage.local.get(["extend-desc"], function(settings) {
        if (settings["extend-desc"]) {
            main();
        }
    });
})();
