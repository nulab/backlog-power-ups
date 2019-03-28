(() => {
    const main = () => {
        if (!location.pathname === "/dashboard" && !location.pathname.match(/[/]projects[/][A-Z0-9_]+/)) {
          return;
        }
      
        const convert = () => {
            var list = $(".stream-update__meta:not(.converted)").addClass("converted");
            list.each(function() {
              var $elem = $(this);
              var dateString = $elem.find("abbr").attr("data-tooltip");
              var parts = dateString.match(/([0-9]+)[-]([0-9]+)[-]([0-9]+)[ ]([0-9]+)[:]([0-9]+)[:]([0-9]+)/)
              if (parts == null || parts.length < 6) { return; }
              var converted = parts[4] + ":" + parts[5];
              $elem.text(converted);
            });
        }
      
		const observer = new MutationObserver((records, observer) => {
			convert();
		});
		observer.observe($('#timeline, #timeline-section').get(0), {
            childList: true,
            subtree: true
        });

        convert();
    }

    PowerUps.isEnabled("absolute-date", (enabled) => {
		if (enabled) {
            main();
		}
    });

})();
