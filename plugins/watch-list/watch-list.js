(() => {
    const RES = PowerUps.getLang() === "ja" ? {
        "assignee": "担当者",
        "dueDate": "期限日",
    } : {
        "assignee": "Assignee",
        "dueDate": "Due date",
    };

    const $ = window.jQuery;
    const baseURL = new URL(location.href).origin;

    /**
     * 記事を取得する
     */
    const getIssue = (issueId) => new Promise(resolve => {
        $.ajax({
            url: `${baseURL}/ViewIssueJson.action?issueId=${issueId}`,
            type: "GET",
            cache: false,
            timeout: 3000,
            statusCode: {
                "200": function(data) {
                    resolve(data);
                },
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
        });
    });

    /**
     * プラグインが有効か調べる
     */
    const isPluginEnabled = () => new Promise(resolve =>
        PowerUps.isEnabled("watch-list", (enabled) => resolve(enabled)));

    // ウォッチリストに変更があれば追加情報を取得する
    new MutationObserver(async mutation => {
        const enabled = await isPluginEnabled();
        if (!enabled) {
            return;
        }

        $(".watch-list__item.js-list__item").map(async (index, parent) => { 
            try {
                const issueId = $($(parent).find("span[data-issue-id]")).attr('data-issue-id')
                const response = await getIssue(issueId);
                const issue = response.thisIssue;

                // テキストを作成する。
                let texts = [];
                // 担当者
                if (issue.assignee && issue.assignee.name) {
                    texts.push(`${RES.assignee}:${issue.assignee.name}`);
                }
                // 期限日
                if (issue.dueDate) {
                    texts.push(`${RES.dueDate}:${issue.dueDate}`)
                }

                // 挿入場所を探してテキストを更新する。
                const summary = $(parent).find(".watch-list__summary");
                if (summary.children().length === 0) {
                    summary.append("<div class='backlog-watch-list-append'></div>");
                }
                summary.children(".backlog-watch-list-append").text(texts.join(' '));
            } catch (e) {
                console.w(e);
            }
        });
    }).observe($("#globalWatchItemContainer > div > ul.watch-list.js-list")[0], {
        childList: true,
    })
})();