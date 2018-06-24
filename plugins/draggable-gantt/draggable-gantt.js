(() => {
    // TODO
    // - 開始時のsetTimeoutを除去
    // - パフォーマンス改善
    //   - 日付の変更がない場合、処理をしない(移動時、変更確定時)
    // - 保存時のリアクションとアニメーション改善
    // - 個人のガントに対応
    const setupDraggable = () => {
        const format = (date) => {
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        }

        const getDraggingMode = ($chart, x) => {
            const left = $chart.offset().left + 7;
            const right = left + $chart.width() - 1;
            const draggableSize = $chart.width() > 20 ? 10 : 2;
            //console.log(`x=${x},left=${left},right=${right},draggableSize=${draggableSize}`);
            if (x >= left && x < left + draggableSize) {
                return "start";
            } else if (x <= right && x > right - draggableSize) {
                return "limit";
            } else {
                return "both";
            }
        }

        class GanttIssue {
            constructor($chart, $row) {
                this.$chart = $chart;
                this.$row = $row;
                this.$assignee = $($row.find("select")[0]);
                this.$startDate = $($row.find("input.input-text")[0]);
                this.$limitDate = $($row.find("input.input-text")[1]);
                this.startDate = this.$startDate.val() ? new Date(this.$startDate.val()) : null;
                this.limitDate = this.$limitDate.val() ? new Date(this.$limitDate.val()) : null;
            }
            moveBoth(dx) {
                this.syncFromMilestone();
                if (!this.startDate && !this.limitDate) {
                    return;
                }

                if (this.startDate) {
                    const sd = new Date(this.startDate.getTime());
                    sd.setDate(sd.getDate() + dx);
                    this.$startDate.val(format(sd));
                }
                if (this.limitDate) {
                    const ld = new Date(this.limitDate.getTime());
                    ld.setDate(ld.getDate() + dx);
                    this.$limitDate.val(format(ld));
                }
                if (this.startDate && !this.limitDate) {
                    const name = this.$startDate.attr("name");
                    PowerUps.injectScript(`jQuery("input[name=${name}]").change()`);
                } else {
                    const name = this.$limitDate.attr("name");
                    PowerUps.injectScript(`jQuery("input[name=${name}]").change()`);
                }
            }
            moveStartDate(dx) {
                this.syncFromMilestone();
                this.syncStartAndLimit();
                if (!this.startDate && !this.limitDate) {
                    return;
                }

                const sd = new Date(this.startDate.getTime());
                sd.setDate(sd.getDate() + dx);
                this.$startDate.val(format(sd));
                const name = this.$limitDate.attr("name");
                PowerUps.injectScript(`jQuery("input[name=${name}]").change()`);
            }
            moveLimitDate(dx) {
                this.syncFromMilestone();
                this.syncStartAndLimit();
                if (!this.startDate && !this.limitDate) {
                    return;
                }

                const ld = new Date(this.limitDate.getTime());
                ld.setDate(ld.getDate() + dx);
                this.$limitDate.val(format(ld));
                const name = this.$limitDate.attr("name");
                PowerUps.injectScript(`jQuery("input[name=${name}]").change()`);
            }
            syncStartAndLimit() {
                if (!this.startDate || !this.limitDate) {
                    const d = new Date(this.startDate || this.limitDate);
                    const sd = new Date(d.getTime());
                    const ld = new Date(d.getTime());
                    this.startDate = sd;
                    this.limitDate = ld;
                    this.$startDate.val(format(sd));
                    this.$limitDate.val(format(ld));
                }
            }
            syncFromMilestone() {
                if (!this.startDate && !this.limitDate) {
                    const left = this.$chart.offset().left;
                    let yearMonth;
                    const $months = this.$chart.parent().find(".js_month-header");
                    $months.each((index, elem) => {
                        const $yearMonthCol = $(elem);
                        if (left === $yearMonthCol.offset().left) {
                            yearMonth = $yearMonthCol.text();
                            return false;
                        }
                    });
                    let day;
                    const $days = this.$chart.parent().find(".gantt-table__date-wrapper > ul > li");
                    $days.each((index, elem) => {
                        const $dayCol = $(elem);
                        if (left === $dayCol.offset().left) {
                            day = $dayCol.text();
                            return false;
                        }
                    });
                    if (yearMonth && day) {
                        const d = new Date(`${yearMonth}/${day}`);
                        this.startDate = new Date(d.getTime());
                        this.limitDate = new Date(d.getTime());
                        this.$startDate.val(format(d));
                        this.$limitDate.val(format(d));
                    }
                }
            }
            showIssueDialog() {
                const issueId = this.$startDate.attr("name").match(/startDate_([0-9]+)/)[1];
                const issueKey = this.$row.find("a.summary-link").attr("href").match(/[/]view[/]([A-Z_]+[-][0-9]+)/)[1];
                PowerUps.injectScript(`component.IssueDialog.show([{id: ${issueId}, link: Backlog.getBasePath() + "/view/${issueKey}"}], 0);`);
            }
            save() {
                const params = {};
                params["projectKey"] = $("input[name=projectKey]").val();
                params[this.$assignee.attr("name")] = this.$assignee.val();
                params[this.$limitDate.attr("name")] = this.$limitDate.val();
                params[this.$startDate.attr("name")] = this.$startDate.val();
                $.post("/UpdateProjectGantt.action", params, () => {
                    // console.log("saved!");
                });
            }
        }

        const createGanttIssue = ($chart) => {
            const chartSY = $chart.offset().top;
            const chartEY = chartSY + $chart.height();
            let ganttIssue;
            $(".js_gantt-left-cell").each((index, elem) => {
                const $row = $(elem);
                const targetSY = $row.offset().top;
                const targetEY = targetSY + $row.height();
                if (chartSY >= targetSY && chartEY <= targetEY) {
                    ganttIssue = new GanttIssue($chart, $row);
                    return false;
                }
            });
            return ganttIssue;
        };

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
            }
            mouseMove(event) {
                const $target = $(event.target);
                const $chart = $target.hasClass("chart") ? $target : $(event.target).closest(".chart");
                if ($chart.length === 1) {
                    const mode = getDraggingMode($chart, event.screenX);
                    if (mode === "start") {
                        $chart.css("cursor", "w-resize").find(".chart-info").css("cursor", "w-resize");
                    } else if (mode === "limit") {
                        $chart.css("cursor", "e-resize").find(".chart-info").css("cursor", "e-resize");
                    } else {
                        $chart.css("cursor", "-webkit-grab").find(".chart-info").css("cursor", "-webkit-grab");
                    }
                }
            }
            mouseDown(event) {
                const $target = $(event.target);
                const $chart = $target.hasClass("chart") ? $target : $(event.target).closest(".chart");
                if ($chart.length === 1) {
                    const mode = getDraggingMode($chart, event.screenX);
                    transitState(new MovingState(mode, event.screenX, event.screenY, $chart, $(event.sourceTarget)));
                }
            }
            toString() {
                return "NormalState";
            }
        }
        class MovingState extends BaseState {
            constructor(mode, startX, startY, $chart, $sourceTarget) {
                super();
                this.mode = mode;
                this.startX = startX;
                this.startY = startY;
                this.$chart = $chart;
                this.$sourceTarget = $sourceTarget;
                this.$chart.css("cursor", "-webkit-grabbing").find(".chart-info").css("cursor", "-webkit-grabbing");
                this.ganttIssue = createGanttIssue(this.$chart);
                if (!this.ganttIssue) {
                    transitState(new NormalState());
                }
            }
            mouseUp(event) {
                this.$chart.css("cursor", "-webkit-grab").find(".chart-info").css("cursor", "-webkit-grab");
                if (this.startX === event.screenX && this.startY == event.screenY) {
                    this.ganttIssue.showIssueDialog();
                    transitState(new NormalState());
                    return;
                }

                let counter = 0;
                const clearEffect = () => {
                    this.$chart.css("background-color", "");
                    if (counter < 100) {
                        counter++;
                        setTimeout(clearEffect, 10);
                    }
                }
                setTimeout(clearEffect, 100);
                this.ganttIssue.save();
                transitState(new NormalState());
            }
            mouseMove(event) {
                const dx = Math.floor((event.screenX - this.startX) / 20);
                if (this.mode === "start") {
                    this.ganttIssue.moveStartDate(dx);
                } else if (this.mode === "limit") {
                    this.ganttIssue.moveLimitDate(dx);
                } else {
                    this.ganttIssue.moveBoth(dx);
                }
            }
            mouseLeave(event) {
                transitState(new NormalState());
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
        $("body").on({
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
        }, ".gantt-table");
    };

    const stopOriginalEventHandlers = () => {
        PowerUps.injectScript(`
            jQuery(".chart,.chart-info").each((index, elem) => {
                $(elem).stopObserving("click");
            });
            jQuery(".gantt-table__right-inner").each((index, elem) => {
                $(elem).stopObserving("mouseup");
                $(elem).stopObserving("mousedown");
                $(elem).stopObserving("mousemove");
            });
        `);
    }

    const main = () => {
        setTimeout(() => {
            stopOriginalEventHandlers();
            setTimeout(() => {
                setupDraggable();
            }, 2000);
        }, 2000);
    }

    PowerUps.isEnabled("draggable-gantt", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
