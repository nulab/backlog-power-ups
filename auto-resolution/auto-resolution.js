(() => {

const lang = $("html").attr("lang") == "ja" ? "ja" : "en";

const injectScript = (content) => {
	const s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.innerText = content.toString();
	return document.body.appendChild(s);
};

const setup = () => {
    setTimeout(() => {
        $(".comment-editor__radio-input").on("change", () => {
            const value = $(".comment-editor__radio-input:checked").val();
            if (value == "4") {
                injectScript(`ko.contextFor($("#resolutionLeft")[0]).$data.resolutionChosen.value(0)`);
            }
        });
    }, 1000);
}

chrome.storage.local.get(["auto-resolution"], function(settings) {
	if (settings["auto-resolution"]) {
        setup();
	}
});

})();
