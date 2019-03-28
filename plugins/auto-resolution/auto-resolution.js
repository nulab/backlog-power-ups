(() => {
    const setup = () => {
        setTimeout(() => {
            const nodes = document.querySelectorAll(".comment-editor__radio-input");
            const last = nodes[nodes.length - 1];
            last.addEventListener("change", () => {
                const value = document.querySelector(".comment-editor__radio-input:checked").value;
                if (value === "4") {
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
