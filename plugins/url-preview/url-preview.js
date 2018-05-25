(() => {
    const getMeta = (url, callback) => {
        $.ajax(url, {
            timeout : 5000, // 1000 ms
            datatype:'text'
        }).then(function(data){
            var h = $("<div>").append($.parseHTML(data));
            const meta = {
                title: h.find("meta[property='og:title']").attr("content") || h.find("meta[name='title']").attr("content") || h.find("title").text() || "",
                description: h.find("meta[property='og:description']").attr("content") || h.find("meta[name='description']").attr("content") || "",
                image: h.find("meta[property='og:image']").attr("content") 
                    || h.find("link[rel='apple-touch-icon']").attr("href")
                    || h.find("link[rel='shortcut icon']").attr("href")
            }
            //<link rel="shortcut icon" href="//ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png">
            callback(meta)
        },function(jqXHR, textStatus) {
        });
    }

    const buildPreview = (meta) => {
        return `
            <div style="
                max-width: 300px;
                border: 1px solid #e7e0df; 
                height: 60px; display: flex;
            ">
                <div style="background-position: 50%; background-size: cover; background-image: url(${meta.image}); width: 60px; height: 60px" />
                <div style="
                    display: flex; 
                    flex-direction: column; 
                    padding: 6px 12px; 
                    max-width: calc(100% - 60px); 
                    max-height: none;
                    overflow: hidden;
                ">
                    <div style="
                        color: #4f4c4b;
                        display: block;
                        line-height: 22px;
                        height: auto;
                        white-space: nowrap;
                        margin-bottom: 3px;
                        font-weight: 600;
                    ">${meta.title}</div>
                    <div style="
                        color: #4f4c4b;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        max-height: 33px;
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
                    ">${meta.description}</div>
                </div>
            </divv>
        `
    }
    
    const insertPreview = (meta, selector) => {
        $(selector).after(buildPreview(meta));
    }

    const main = () => {
        console.log("url-preview");
        $("#issueDescription a").each((index, elem) => {
            const url = $(elem).attr("href");
            console.log(url);
            const meta  = getMeta(url, (meta) => {
                insertPreview(meta, "#issueDescription");
                console.log(meta.title);
            });
        });
    }

    PowerUps.isEnabled("url-preview", (enabled) => {
		if (enabled) {
            main();
		}
    });

})();
