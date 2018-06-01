(() => {
    const main = () => {
        console.log("backlog-card");
        $(document).on({
            'mouseenter' : () => {
                console.log("mouseenter");
            },
            'mouseleave' : () => {
                console.log("mouseleave");
            }
         }, "a");
    }

    PowerUps.isEnabled("backlog-card", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
