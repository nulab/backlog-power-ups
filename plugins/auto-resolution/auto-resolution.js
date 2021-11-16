(() => {
    const setup = () => {
        setTimeout(() => {
            $('li.status-chosen__item--4').on('click', () => {
                PowerUps.injectScript(`ko.contextFor($("#resolutionLeft")[0]).$data.resolutionChosen.value(0)`);
            });
        }, 1000);
    }

    PowerUps.isEnabled("auto-resolution", (enabled) => {
        if (enabled) {
            setup();
        }
    });
})();
