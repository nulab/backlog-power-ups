(() => {
    let hideOtherColumns = false;

    const addOnelineButton = (column) => {
        const button = document.createElement('a');
        button.className = 'board-oneline-button'
        button.textContent = '⊟';
        button.onclick = (ev) => {
            const otherColumns = Array.from(document.querySelectorAll('#kanban section')).filter(e => e !== column);

            hideOtherColumns = !hideOtherColumns;
            if (hideOtherColumns) {
                otherColumns.forEach(e => e.style.opacity = 0);
                setTimeout(() => {
                    otherColumns.forEach(e => e.style.display = 'none');
                    column.classList.add('board-oneline');
                }, 250);
            } else {
                otherColumns.forEach(e => e.style.display = '');
                column.classList.remove('board-oneline');
                setTimeout(() => {
                    otherColumns.forEach(e => e.style.opacity = 1);
                }, 250);
            }
        }

        column.firstChild.firstChild.appendChild(button);
    }

    const addAllOnelinesButton = (node) => {
        const button = document.createElement('a');
        button.className = 'board-oneline-button'
        button.textContent = '⊟';
        button.onclick = (ev) => {
            const allColumns = Array.from(document.querySelectorAll('#kanban section'));

            hideOtherColumns = !hideOtherColumns;
            if (hideOtherColumns) {
                allColumns.forEach(e => e.classList.add('board-oneline-compact'));
            } else {
                allColumns.forEach(e => e.classList.remove('board-oneline-compact'));
            }
        }

        let title = node.querySelector('.title-group');
        title.appendChild(button);
    }

    const addOnelineButtonsForAllColumns = (node) => {
        const allColumns = Array.from(node.querySelectorAll('#kanban section'));
        allColumns.forEach(e => addOnelineButton(e));
    }

    const main = () => {
        const observer = new MutationObserver((records, observer) => {
            records.forEach((r) => {
                if (r.addedNodes.length > 0) {
                    for (let i = 0; i < r.addedNodes.length; ++i) {
                        const n = r.addedNodes[i];
                        if (n.classList.contains('content-main')) {
                            if (n.querySelector('.title-group')) {
                                addOnelineButtonsForAllColumns(n);
                                addAllOnelinesButton(n);
                            }
                        }
                    }
                }
            });
        });

        observer.observe(document.querySelector('#kanban'), { childList: true, subtree: false });
    };

    PowerUps.isEnabled("board-oneline", (enabled) => {
        if (enabled)
            main();
    })
})();
