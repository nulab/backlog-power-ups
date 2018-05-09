var lang = $("html").attr("lang") == "ja" ? "ja" : "en";

var RES = lang == "ja" ? {
	"prompt": "複製先のプロジェクトキーを入力してください。",
	"copyTo": "別のプロジェクトに複製",
	"refs": "関連課題",
} : {
	"prompt": "Please input destination project key",
	"copyTo": "Copy to another project",
	"refs": "Refs",
};

var injectScript = function(content) {
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.innerText = content;
	return document.body.appendChild(s);
};

if (location.pathname.startsWith("/view/")) {
	$(function() {
		var hideMenu = function() {
			injectScript('$(".title-group__edit-actions dropdown-menu a.icon-button").click();');
		};
	
		var clickHandler = function() {
			hideMenu();
			var projectKey = prompt(RES["prompt"]);
			if (projectKey) {
				var markdown = $(".markdown-body").length > 0;
				var h2 = markdown ? "##" : "**";
				var script = `
var issue = ko.contextFor($("#issuecard")[0]).$data.issueDetail.store.issue();
issue.description = issue.description + "\\n\\n${h2} ${RES["refs"]}\\n-" + issue.issueKey + issue.summary;
sessionStorage.setItem("copy-issue", JSON.stringify(issue));`;
				injectScript(script);
				var url = "https://nulab.backlog.jp/add/" + projectKey;
				location.href = url;
			}
		};
	
		setTimeout(function() {
			var $menuItem = $('<li class="dropdown-menu__item" />').append(
				$('<a class="dropdown-menu__link is_active" href="javascript:void(0)"></a>').text(RES["copyTo"]).click(clickHandler)
			);
			$(".title-group__edit-actions ul.dropdown-menu").append($menuItem);
		}, 2000);
	});
} else if (location.pathname.startsWith("/add/")) {
	$(function() {
		var restoreIssue = function() {
			var script = `
var json = sessionStorage.getItem("copy-issue");
if (json) {
	var issue = JSON.parse(json);
	$("#summaryInput").val(issue.summary);
	$("#descriptionTextArea").val(issue.description);
	sessionStorage.removeItem("copy-issue");
}`;
			injectScript(script);
		}
		setTimeout(function() {
			restoreIssue();
		}, 1000);
	});
}
