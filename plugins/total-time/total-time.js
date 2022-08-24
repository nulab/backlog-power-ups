(() => {
    const RES = PowerUps.getLang() == "ja" ? {
        "totalEstimatedHours": "予定時間計",
        "totalActualHours": "実績時間計"
    } : {
        "totalEstimatedHours": "Total estimated",
        "totalActualHours": "Total actual"
    };

    const totalByColumnName = (columnName) => {
        let total = 0;
        const targetTable = $('.result-set table.find-issue-table')
        const targetColumn = targetTable.find(`thead tr th[data-column-key='${columnName}']`)
        const targetIndex = targetTable.find('thead tr th').index(targetColumn)
        targetTable.find(`tbody tr td:nth-child(${targetIndex + 1})`).each((index, elem) => {
            const text = $(elem).text();
            if (text) {
                total = total + parseFloat(text);
            }
        });
        return total;
    }

    const update = () => {
        const estimated = totalByColumnName("estimatedHours");
        const actual = totalByColumnName("actualHours");
        $("#total-time-container .estimatedTotal").text(estimated);
        $("#total-time-container .actualTotal").text(actual);
    }

    const observer = new MutationObserver((records, observer) => {
        observer.disconnect();
        update();
        observeIssueTable();
    });

    const observeIssueTable = () => {
        observer.observe($('.result-set').get(0), {
            childList: true,
            subtree: true
        });
    }

    const setupUI = () => {
        $(`
        <div id="total-time-container">
            <span>${RES["totalEstimatedHours"]}:</span>
            <span class="estimatedTotal"></span>
            <span>&nbsp;</span>
            <span>${RES["totalActualHours"]}:</span>
            <span class="actualTotal"></span>
        </div>
        `).appendTo("body");
    }

    const setup = () => {
        setupUI();
        update();
        observeIssueTable();
    }

    const main = () => {
        setup();
    }

    PowerUps.isEnabled("total-time", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
