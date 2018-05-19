(() => {
    const setup = () => {
        setTimeout(() => {
            $(".comment-editor__radio-input").on("change", () => {
                const value = $(".comment-editor__radio-input:checked").val();
                if (value == "4") {
                    PowerUps.injectScript(`ko.contextFor($("#resolutionLeft")[0]).$data.resolutionChosen.value(0)`);
                }
            });
        }, 1000);
    }

    PowerUps.isEnabled("auto-resolution", (enabled) => {
        if (enabled) {
            setup();
        }
    });
})();
