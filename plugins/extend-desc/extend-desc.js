(() => {
    const selector = "#descriptionTextArea";
    const heightExtended = "480px";
    const limit = 10;

    const extend = (elem) => {
        elem.style.height = heightExtended;
    }

    const checkElement = async (selector) => {
        for (let i = 0; i < limit && document.querySelector(selector) === null; i++) {
            await new Promise(resolve => setInterval(resolve, 100));
        }
        return document.querySelector(selector);
    }

    const main = () => {
        checkElement(selector).then((elem) => {
            if (elem) {
                if (location.pathname.startsWith("/add/") || location.pathname.match(/[/]view[/][A-Z_0-9]+[-][0-9]+[/]edit/)) {
                    extend(elem);
                }
            } else {
                console.log('failed to extend textarea');
            }
        });
    };

    PowerUps.isEnabled("extend-desc", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
