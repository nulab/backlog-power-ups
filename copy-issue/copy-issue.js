(() => {

const lang = $("html").attr("lang") == "ja" ? "ja" : "en";

const RES = lang == "ja" ? {
	"prompt": "複製先のプロジェクトキーを入力してください。",
	"copyTo": "別のプロジェクトに複製",
	"refs": "関連課題",
} : {
	"prompt": "Please input destination project key",
	"copyTo": "Copy to another project",
	"refs": "Refs",
};

const injectScript = (content) => {
	const s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.innerText = content;
	return document.body.appendChild(s);
};

const issueView = () => {
	const hideMenu = () => {
		injectScript('$(".title-group__edit-actions dropdown-menu a.icon-button").click();');
	};

	const clickHandler = () => {
		hideMenu();
		var projectKey = prompt(RES["prompt"]);
		if (projectKey) {
			const markdown = $(".markdown-body").length > 0;
			const h2 = markdown ? "##" : "**";
			const script = `
var issue = ko.contextFor($("#issuecard")[0]).$data.issueDetail.store.issue();
issue.description = issue.description + "\\n\\n${h2} ${RES["refs"]}\\n-" + issue.issueKey + issue.summary;
sessionStorage.setItem("copy-issue", JSON.stringify(issue));`;
			injectScript(script);
			const url = "/add/" + projectKey;
			location.href = url;
		}
	};

	setTimeout(() => {
		const $menuItem = $('<li class="dropdown-menu__item" />').append(
			$('<a class="dropdown-menu__link is_active" href="javascript:void(0)"></a>').text(RES["copyTo"]).click(clickHandler)
		);
		$(".title-group__edit-actions ul.dropdown-menu").append($menuItem);
	}, 2000);
}

const addIssueView = () => {
	const restoreIssue = () => {
		const script = `
var json = sessionStorage.getItem("copy-issue");
if (json) {
	var issue = JSON.parse(json);
	$("#summaryInput").val(issue.summary);
	$("#descriptionTextArea").val(issue.description);
	sessionStorage.removeItem("copy-issue");
}`;
		injectScript(script);
	}
	setTimeout(() => {
		restoreIssue();
	}, 1000);
}

chrome.storage.local.get(["copy-issue"], function(settings) {
	if (settings["copy-issue"]) {
		if (location.pathname.startsWith("/view/")) {
			issueView();
		} else if (location.pathname.startsWith("/add/")) {
			addIssueView();
		}
	}
});
})();
