class PowerUps {
    static injectScript(content) {
		const s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.textContent = content;
		return document.body.appendChild(s);
    }
    
    static getLang() {
        return $("html").attr("lang") == "ja" ? "ja" : "en"
    }
}
