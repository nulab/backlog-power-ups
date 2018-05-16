class PowerUps {
    static injectScript(content) {
		const s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.innerText = content;
		return document.body.appendChild(s);
    }
    
    static getLang() {
        return $("html").attr("lang") == "ja" ? "ja" : "en"
    }
}