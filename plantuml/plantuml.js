(() => {
    const PATTERN = /^[/]wiki[/]([A-Z]+)[/]([^\\/]+)$/;

    // from https://github.com/dai0304/pegmatite
    const encode64 = (data) => {
        for (var r = "", i = 0, n = data.length; i < n; i += 3) {
            r += append3bytes(
                data.charCodeAt(i),
                i + 1 !== n ? data.charCodeAt(i + 1) : 0,
                i + 2 !== n ? data.charCodeAt(i + 2) : 0);
        }
        return r;
    }
    
    const append3bytes = (b1, b2, b3) => {
        var c1 = b1 >> 2;
        var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
        var c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
        var c4 = b3 & 0x3F;
        return encode6bit(c1 & 0x3F) +
            encode6bit(c2 & 0x3F) +
            encode6bit(c3 & 0x3F) +
            encode6bit(c4 & 0x3F);
    }
    
    const encode6bit = (b) => {
        if (b < 10) return String.fromCharCode(48 + b);
        b -= 10;
        if (b < 26) return String.fromCharCode(65 + b);
        b -= 26;
        if (b < 26) return String.fromCharCode(97 + b);
        b -= 26;
        if (b === 0) return "-";
        if (b === 1) return "_";
        return "?";
    }
    
    const compress = (s) => {
        s = unescape(encodeURIComponent(s));
        return encode64(deflate(s));
    }

    const showPageView = () => {        
        $(".lang-plantuml > code").each((index, event) => {
            const $elem = $(event);
            const text = $elem.text();
            const data = compress(text);
            const url = `https://www.plantuml.com/plantuml/png/${data}`;
            $elem.replaceWith($("<img>").attr("src", url));
        });
    }

    const main = () => {
        if (location.pathname.match(PATTERN)) {
            setTimeout(() => {
                showPageView();
            }, 0);
        }
    }

    chrome.storage.local.get(["plantuml"], function(settings) {
        if (settings["plantuml"]) {
            main();
        }
    });
})();
