(() => {
	const lang = PowerUps.getLang();

	const RES = lang == "ja" ? {
		"unreadOnly": "未読のみ",
		"placeholder": "お知らせを検索"
	} : {
		"unreadOnly": "Please input destination project key",
		"placeholder": "Search notifications"
	};

	const filter = () => {
		const hideReadItem = $("#hideReadNotifications").prop('checked');
		const keyword = $("#filterNotifications").val().toUpperCase();
		$("#globalNotificationsContainer .notification-list li").each((index, elem) => {
			const $item = $(elem);
			const content = $item.text().toUpperCase();
			const notMatch = keyword.length == 0 ? false : content.indexOf(keyword) == -1;
			if ((hideReadItem && $item.hasClass("is_read")) || notMatch) {
				$item.hide();
			} else {
				$item.show();
			}
		});
	};

	const main = () => {
		const $container = $("#globalNotificationsContainer .slide-in__header");
		$container.append(
			$(`<div class="search-box -dropdown-header" style="position: relative; right: 90px;"/>`).append(
				$(`<input id="filterNotifications" type="text" class="search-box__input -w-small -no-border -no-reset js-search-box" placeholder="${RES["placeholder"]}">`)
				.on("input", () => {
					filter();
				})
			)
		);
		$container.append(
			$('<div style="position: absolute; left: 360px;">')
			.append(
				$(`<input id="hideReadNotifications" type="checkbox">`)
				.on("change", (event) => {
					filter();
				})
			)
			.append(
				$(`<label for="hideReadNotifications" style="white-space: nowrap; color: #fff; vertical-align: middle; cursor: pointer;">`).text(RES["unreadOnly"])
			)
		);
		const observer = new MutationObserver((records, observer) => {
			filter();
		});
		observer.observe($('#globalNotificationsContainer .notification-list').get(0), {
			childList: true,
		});		  
	}

	chrome.storage.local.get(["filter-notification"], (settings) => {
		if (settings["filter-notification"]) {
			main();
		}
	});
})();
