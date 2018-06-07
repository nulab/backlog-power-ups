(() => {

	const clearNotifiedUsers = (selector) => {
		PowerUps.injectScript(`ko.contextFor($("${selector}")[0]).$data.chosen.multiValue([])`);
	}

	const setupClearButton = (containerSelector, notifiedUsersSelector) => {
		$("<a>")
			.text("✕")
			.css({
				"font-size": "18px",
				"position": "absolute",
				"top": "8px",
				"right": "20px",
				"z-index": "1",
				"cursor": "pointer",
				"text-decoration": "none"
			})
			.attr("src", "javascript:void(0)")
			.on("click", () => {
				clearNotifiedUsers(notifiedUsersSelector);
				return false;
			})
			.prependTo($(containerSelector));
	}

	const issueView = () => {
		setupClearButton("#notifiedUsersLeft .chosen-wrapper", "select[name=notifiedUserIds");
	}

	const addIssueView = () => {
		setupClearButton("#notifiedUsers .chosen-wrapper", "select[name=notifiedUserIds");
	}

	const editIssueView = () => {
		setupClearButton("#NotifiedUsers .chosen-wrapper", "select[name=notifiedUserIds");
	}

    PowerUps.isEnabled("clear-notified-users", (enabled) => {
		if (enabled) {
			setTimeout(() => {
				if (location.pathname.match(/[/]view[/][A-Z]+[-][0-9]+[/]edit/)) {
					editIssueView();
				} else if (location.pathname.startsWith("/view/")) {
					issueView();
				} else if (location.pathname.startsWith("/add/")) {
					addIssueView();
				}
			}, 2000)
		}
    });
})();
