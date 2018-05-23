(() => {
	const RES = PowerUps.getLang() == "ja" ? {
		"rearrangeColumns": "列の並び替え",
		"reset": "並び順をリセット"
	} : {
		"rearrangeColumns": "Rearrange columns",
		"reset": "Reset rearranged columns"
	};
    const PATTERN_URL = /^[/]find[/]([A-Z_0-9]+)$/;
    const projectKey = PATTERN_URL.exec(location.pathname)[1];
    const storeKey = `customized-issue-list:columnNames:${projectKey}`;
    let columnNames = [];

    const rearrangeColumns = ($tr) => {
        const row = [];
        for (const c of columnNames) {
            const $target = $tr.find(`td[data-column-name='${c}'],th[data-column-name='${c}']`);
            row.push($target);
        }
        $tr.prepend(row);
    }

    const update = () => {
        $("#issues-table tr").each((index, tr) => {
            rearrangeColumns($(tr));
        });
    }

    const store = () => {
        localStorage.setItem(storeKey, JSON.stringify(columnNames));
    }

    const moveColumn = (source, target) => {
        if (source === target) {
            return;
        }
        if (columnNames.indexOf(source) < columnNames.indexOf(target)) {
            columnNames.splice(columnNames.indexOf(source), 1);
            columnNames.splice(columnNames.indexOf(target) + 1, 0, source);
        } else {
            columnNames.splice(columnNames.indexOf(source), 1);
            columnNames.splice(columnNames.indexOf(target), 0, source);
        }
        update();
        store();
    }

    const setupColumnNames = () => {
        // collect column names from tbody > td
        const columnNamesFromTable = $("#issues-table tbody tr:first td").map((index, elem) => {
            return $(elem).attr("data-column-name");
        }).get();
        // set column names to thead > th
        $("#issues-table thead tr th").each((index, elem) => {
            $(elem).attr("data-column-name", columnNamesFromTable[index]).css("-webkit-user-select", "none");
        });
        // load column names from local storage
        const columnNamesFromLocal = JSON.parse(localStorage.getItem(storeKey));
        if (columnNamesFromLocal && columnNamesFromLocal.length === columnNamesFromTable.length) {
            columnNames = columnNamesFromLocal;
        }  else {
            columnNames = columnNamesFromTable;
        }
    }

    const setupResetSetting = () => {
        $("#propPopupDialogElement .modal__content ul.form-element").append(
            $(`<li class=form-element__item>`).append(
                $(`<label class="form-element__label">`).text(RES["rearrangeColumns"])
            ).append(
                $(`<a style="cursor: pointer">`).text(RES["reset"]).on("click", () => {
                    localStorage.removeItem(storeKey);
                    location.reload();
                })
            )
        )
    }

    const setupDragAndDrop = () => {
        class BaseState {
            constructor() {}
            mouseUp(event) {}
            mouseDown(event) {}
            mouseMove(event) {}
            mouseEnter(event) {}
            mouseLeave(event) {}
        }
        class NormalState extends BaseState {
            constructor() {
                super();
                $("#issues-table thead tr th").css("cursor", "");
            }
            mouseDown(event) {
                transitState(new MovingState(event.currentTarget));
            }
            toString() {
                return "NormalState";
            }
        }
        class MovingState extends BaseState {
            constructor(sourceTarget) {
                super();
                this.sourceTarget = sourceTarget;
                this.sourceColumnName = $(this.sourceTarget).attr("data-column-name");
                $("#issues-table thead tr th").css("cursor", "-webkit-grabbing");
            }
            mouseUp(event) {
                this.clearBorder(event.currentTarget);
                moveColumn($(this.sourceTarget).attr("data-column-name"), $(event.currentTarget).attr("data-column-name"));
                transitState(new NormalState());
            }
            mouseMove(event) {
                this.showBorder(event.currentTarget);
            }
            mouseLeave(event) {
                this.clearBorder(event.currentTarget);
            }
            showBorder(target) {
                if (target === this.sourceTarget) {
                    return;
                }
                const sourceIndex = columnNames.indexOf(this.sourceColumnName);
                const targetColumnName = $(target).attr("data-column-name");
                const targetIndex = columnNames.indexOf(targetColumnName);
                if (sourceIndex < targetIndex) {
                    $(target).css("border-right", "2px solid #4caf93");
                } else {
                    $(target).css("border-left", "2px solid #4caf93");
                }
            }
            clearBorder(target) {
                $(target).css("border-right", "none").css("border-left", "none");
            }
            toString() {
                return "MovingState";
            }
        }
        let state = new NormalState();

        const transitState = (newState) => {
            //console.log(`${state} -> ${newState}`);
            state = newState;
        }

        $("#issues-table thead tr th").on({
            'mousedown': (event) => {
                state.mouseDown(event);
            },
            'mouseup': (event) => {
                state.mouseUp(event);
            },
            'mousemove': (event) => {
                state.mouseMove(event);
            },
            'mouseenter': (event) => {
                state.mouseEnter(event);
            },
            'mouseleave': (event) => {
                state.mouseLeave(event);
            }
        });
    }

    const observer = new MutationObserver((records, observer) => {
        observer.disconnect();
        update();
        observeIssueTable();
    });

    const observeIssueTable = () => {
        observer.observe($('#issues-table').get(0), {
            childList: true,
            subtree: true
        });
    }

    const setup = () => {
        setupColumnNames();
        setupDragAndDrop();
        setupResetSetting();
    }

    const main = () => {
        setup();
        update();
        observeIssueTable();
    }

    PowerUps.isEnabled("customized-issue-list", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
