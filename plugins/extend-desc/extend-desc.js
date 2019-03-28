(() => {
    const extend = () => {
        document.querySelector("#descriptionTextArea").style.height = "480px"
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

    PowerUps.isEnabled("extend-desc", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
