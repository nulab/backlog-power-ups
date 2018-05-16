(() => {

	const injectScript = (content) => {
		const s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.innerText = content;
		return document.body.appendChild(s);
	};

	const clearNotifiedUsers = (selector) => {
		injectScript(`ko.contextFor($("${selector}")[0]).$data.chosen.multiValue([])`);
	}

	const setupClearButton = (containerSelector, notifiedUsersSelector) => {
		$("<a>")
			.text("✕")
			.css({
				"font-size": "18px",
				"position": "absolute",
				"top": "8px",
				"right": "10px",
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

	chrome.storage.local.get(["clear-notified-users"], (settings) => {
		if (settings["clear-notified-users"]) {
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
