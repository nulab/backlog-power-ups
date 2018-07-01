(() => {

    const addJumpActionButton = (node) => {
        const actions = node.querySelector('.js_line-comment-actions');

        const span = document.createElement('span');
        span.className = "icon-button icon-button--default -floating";
        span.onclick = (ev) => {
            const fileContainer = ev.target.parentNode.parentNode;
            const href = fileContainer.parentNode.parentNode.querySelector('.code-view__header-action').href;
            const lines = fileContainer.querySelectorAll('tr');

            const targetRect = ev.target.getBoundingClientRect();
            const y = Math.floor((targetRect.top + targetRect.bottom) / 2);

            let ourLineNumber;
            for (let i = 0; i < lines.length; ++i) {
                const line = lines[i];
                const rect = line.getBoundingClientRect();

                const nums = line.querySelectorAll('.Line-number span');
                if (nums.length > 1) {
                    if (nums[1].hasAttribute('data-line-number')) {
                        ourLineNumber = nums[1].getAttribute('data-line-number');
                    }
                }

                if (rect.top < y && y < rect.bottom) {
                    for (let j = nums.length - 1; j >= 0; --j) {
                        if (ourLineNumber) {
                            window.open(href + '#' + ourLineNumber, '_blank');
                            return;
                        }
                    }
                    return;
                }
            }
        }

        actions.appendChild(span);
    }

    const main = () => {
        const observer = new MutationObserver((records, observer) => {
            records.forEach((r) => {
                if (r.addedNodes.length > 0) {
                    for (let i = 0; i < r.addedNodes.length; ++i) {
                        const n = r.addedNodes[i];
                        if (n.className == 'line-comment-warapper') {
                            addJumpActionButton(n);
                        }
                    }
                }

            });
        });

        observer.observe(document.querySelector('div.content-main'), { childList: true, subtree: true });
    };

    PowerUps.isEnabled("pr-diff-jump", (enabled) => {
        if (enabled)
            main();
    })
})();
