(() => {

    const getDomain = (url) => {
        if (!url) {
            return "";
        }
        const parts = /https?[:][/][/]([^/]+)[/].*/.exec(url);
        if (!parts || parts.length < 2) {
            return "";
        }
        return parts[1];
    }

    const getMeta = (url, callback) => {
        $.ajax(url, {
            timeout : 10000,
            datatype:'text'
        }).then(function(data){
            const h = $("<div>").append($.parseHTML(data));
            const title = h.find("meta[property='og:title']").attr("content");
            // if a page has not title, don't show preview
            if (!title) {
                return null;
            }
            const meta = {
                title: title,
                description: h.find("meta[property='og:description']").attr("content") || h.find("meta[name='description']").attr("content") || "",
                image: h.find("meta[property='og:image']").attr("content") 
                    || h.find("link[rel='apple-touch-icon']").attr("href")
                    || h.find("link[rel='shortcut icon']").attr("href"),
                url: url,
                domain: getDomain(h.find("meta[property='og:url']").attr("content")) || getDomain(url)
            }
            callback(meta)
        },function(jqXHR, textStatus) {
        });
    }

    const ESCAPE_CHARS = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;'
    };

    const h = (html) => {
        if (!html) return;
        return html.replace(/[<>&"'`]/g, (match) => {
          return ESCAPE_CHARS[match];
        });
    }

    const buildPreview = (meta) => {
        const $preview = $(`
            <a href="${h(meta.url)}" target="_blank" style="
                text-decoration: none;
            ">
                <div style="
                    max-width: 600px;
                    border: 1px solid #e7e0df; 
                    height: 70px; 
                    display: flex;
                    margin-top: 10px;
                ">
                    <div style="
                        border-bottom: 1px solid #e7e0df; 
                        border-right: 1px solid #e7e0df; 
                        background-position: 50%; 
                        background-size: cover; 
                        background-image: url(${h(meta.image)}); 
                        width: 69px; 
                        height: 69px;
                    " />
                    <div style="
                        display: flex; 
                        flex-direction: column; 
                        padding: 6px 12px; 
                        max-width: calc(100% - 70px); 
                        max-height: none;
                        overflow: hidden;
                    ">
                        <div style="
                            font-size: 1.3rem;
                            color: #4f4c4b;
                            display: block;
                            line-height: 22px;
                            height: auto;
                            white-space: nowrap;
                            margin-bottom: 3px;
                            font-weight: 600;
                        ">${h(meta.title)}</div>
                        <div style="
                            font-size: 1.2rem;
                            color: #b3aba9;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            max-height: 19px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            backface-visibility: hidden;
                            word-wrap: break-word;
                            overflow-wrap: break-word;
                            transform: translateZ(0);
                            position: relative;
                            margin-right: 5px;
                            line-height: 1.4;
                            margin-bottom: 3px;
                        ">${h(meta.description)}</div>
                        <div style="
                            line-height: 14px;
                            font-size: 1rem;
                            font-weight: 600;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            color: #b3aba9;
                        ">
                            ${h(meta.domain)}
                        </div>
                    </div>
                </div>
            </a>
        `);
        return $preview;
    }
    
    const insertPreview = (meta, selector) => {
        $(selector).append(buildPreview(meta));
    }

    const setupIssueDescription = () => {
        $("#issueDescription").after($(`<div class="url-preview" style="margin-bottom: 10px;"></div>`));
        const convert = () => {
            const $previewContainer = $(".url-preview").empty();
            $("#issueDescription a").each((index, elem) => {
                const url = $(elem).attr("href");
                const meta  = getMeta(url, (meta) => {
                    if (meta) {
                        insertPreview(meta, $previewContainer);
                    }
                });
            });
        }
		const observer = new MutationObserver((records, observer) => {
			convert();
		});
		observer.observe($('#issueDescription').get(0), {
            childList: true
        });

        convert();
    }

    const setupIssueComments = () => {
        const convert = () => {
            $(".js_comment-container .comment-content a").each((index, elem) => {
                const url = $(elem).attr("href");
                const meta  = getMeta(url, (meta) => {
                    if (meta) {
                        insertPreview(meta, $(elem).closest(".comment-item__inner"));
                    }
                });
            });
        }
		const observer = new MutationObserver((records, observer) => {
            convert();
        });
		observer.observe($('#comments .comment-list').get(0), {
            childList: true
        });
    }
    const main = () => {
        setupIssueDescription();
        setupIssueComments();
    }

    PowerUps.isEnabled("url-preview", (enabled) => {
		if (enabled) {
            main();
		}
    });

})();
