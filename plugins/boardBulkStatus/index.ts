import styles from "./index.module.css";
import { buildDropResult, getDraggableId, getOnDragEnd } from "./react-dnd";

/**
 * The board renders with emotion, so every visual class name is hashed
 * (`css-o6r3xa-col`) and unusable as a selector. These are the stable hooks:
 *
 * - `ul[data-statusid]` is a status column, and carries the status id directly.
 * - `li.card` is a card, and is also the react-beautiful-dnd drag handle.
 * - `a.card-label[href="/view/KEY-1"]` carries the issue key.
 */
const COLUMN_SELECTOR = "#kanban ul[data-statusid]";
const CARD_SELECTOR = "li.card";
const CARD_LINK_SELECTOR = "a.card-label";

/** How long to wait for react-beautiful-dnd to settle the drop. */
const DROP_TIMEOUT_MS = 3000;
const DROP_POLL_MS = 100;

const getIssueKey = (card: Element): string | null => {
	const href = card.querySelector(CARD_LINK_SELECTOR)?.getAttribute("href");

	return href?.match(/\/view\/([A-Z0-9_]+-\d+)/)?.[1] ?? null;
};

/**
 * Cards are looked up by issue key rather than held as element references:
 * the board re-renders on every drop, so a reference captured before a drag is
 * not reliably the element on screen afterwards.
 */
const findCard = (issueKey: string): HTMLElement | null => {
	const link = document.querySelector(
		`#kanban ${CARD_SELECTOR} ${CARD_LINK_SELECTOR}[href$="/view/${issueKey}"]`,
	);
	const card = link?.closest(CARD_SELECTOR);

	return card instanceof HTMLElement ? card : null;
};

const getColumn = (card: Element): HTMLElement | null => {
	const column = card.closest(COLUMN_SELECTOR);

	return column instanceof HTMLElement ? column : null;
};

const getStatusId = (card: Element): string | null =>
	getColumn(card)?.dataset.statusid ?? null;

const getCards = (column: Element): HTMLElement[] =>
	Array.from(column.querySelectorAll(CARD_SELECTOR)).filter(
		(card) => card instanceof HTMLElement,
	);

export const boardBulkStatus = definePowerUpsPlugin({
	group: "board",
	allFrames: true,
	matches: ["/board/*"],
	main({ observeQuerySelector, addEventListener, setTimeout }) {
		const selection = new Set<string>();
		let anchorKey: string | null = null;
		let badge: HTMLElement | null = null;

		/**
		 * A drag is followed by a click on the card that was dropped. That click
		 * must not be read as "plain click, so clear the selection", or the
		 * selection is gone before the remaining cards have been moved.
		 */
		let suppressNextClick = false;

		const renderBadge = () => {
			if (selection.size === 0) {
				badge?.remove();
				badge = null;
				return;
			}

			if (!badge) {
				badge = document.createElement("div");
				badge.className = styles.badge!;
				document.body.appendChild(badge);
			}

			badge.textContent = i18n.t("boardBulkStatus.selected", [
				String(selection.size),
			]);
		};

		const render = () => {
			for (const card of document.querySelectorAll(CARD_SELECTOR)) {
				const issueKey = getIssueKey(card);

				card.classList.toggle(
					styles.selected!,
					issueKey !== null && selection.has(issueKey),
				);
			}

			renderBadge();
		};

		const clearSelection = () => {
			selection.clear();
			anchorKey = null;
			render();
		};

		const toggle = (issueKey: string) => {
			if (selection.has(issueKey)) {
				selection.delete(issueKey);
			} else {
				selection.add(issueKey);
			}

			anchorKey = issueKey;
		};

		const selectRange = (card: HTMLElement, issueKey: string) => {
			const column = getColumn(card);
			const anchorCard = anchorKey ? findCard(anchorKey) : null;

			if (!column || !anchorCard || !column.contains(anchorCard)) {
				toggle(issueKey);
				return;
			}

			const cards = getCards(column);
			const from = cards.indexOf(anchorCard);
			const to = cards.indexOf(card);

			if (from === -1 || to === -1) {
				toggle(issueKey);
				return;
			}

			for (const inRange of cards.slice(
				Math.min(from, to),
				Math.max(from, to) + 1,
			)) {
				const key = getIssueKey(inRange);

				if (key) {
					selection.add(key);
				}
			}
		};

		const handleClick = (event: MouseEvent) => {
			const target = event.target;

			if (!(target instanceof Element)) {
				return;
			}

			if (suppressNextClick) {
				suppressNextClick = false;
				event.preventDefault();
				event.stopPropagation();
				return;
			}

			const card = target.closest(CARD_SELECTOR);

			if (!(card instanceof HTMLElement)) {
				if (selection.size > 0) {
					clearSelection();
				}

				return;
			}

			const isRange = event.shiftKey;
			const isToggle = event.ctrlKey || event.metaKey;

			// A plain click is left alone so the card keeps opening its issue.
			// Selection only starts from a modifier.
			if (!isRange && !isToggle) {
				if (selection.size > 0) {
					clearSelection();
				}

				return;
			}

			const issueKey = getIssueKey(card);

			if (!issueKey) {
				return;
			}

			// Stop the card link opening a tab and stop Backlog treating this as
			// "open the issue".
			event.preventDefault();
			event.stopPropagation();

			if (isRange) {
				selectRange(card, issueKey);
			} else {
				toggle(issueKey);
			}

			render();
		};

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && selection.size > 0) {
				clearSelection();
			}
		};

		/**
		 * Moves `issueKeys` into `toStatusId` by replaying the board's own drag
		 * handler once per card, so Backlog performs the update itself.
		 */
		const moveRest = (
			issueKeys: string[],
			draggedKey: string,
			toStatusId: string,
		) => {
			const reference = issueKeys
				.map((issueKey) => findCard(issueKey))
				.find((card) => card !== null);
			const onDragEnd = reference ? getOnDragEnd(reference) : null;

			if (!onDragEnd) {
				logger.debug("boardBulkStatus: onDragEnd not reachable");
				return;
			}

			for (const issueKey of issueKeys) {
				if (issueKey === draggedKey) {
					continue;
				}

				const card = findCard(issueKey);
				const column = card && getColumn(card);
				const statusId = column?.dataset.statusid;
				const draggableId = card && getDraggableId(card);

				if (!card || !column || !statusId || !draggableId) {
					logger.debug(`boardBulkStatus: skipped ${issueKey}`);
					continue;
				}

				if (statusId === toStatusId) {
					continue;
				}

				logger.debug(
					`boardBulkStatus: moving ${issueKey} ${statusId} -> ${toStatusId}`,
				);

				onDragEnd(
					buildDropResult(
						draggableId,
						{ statusId, index: getCards(column).indexOf(card) },
						toStatusId,
					),
				);
			}
		};

		// The drag itself is left entirely to the board. We only note which card
		// was picked up, and once it has landed somewhere new, bring the rest of
		// the selection along. The selection is snapshotted here because the
		// board re-renders during the drop.
		let dragging: {
			issueKey: string;
			fromStatusId: string;
			snapshot: string[];
		} | null = null;

		const handleMouseDown = (event: MouseEvent) => {
			const target = event.target;
			const card =
				target instanceof Element ? target.closest(CARD_SELECTOR) : null;

			if (!(card instanceof HTMLElement)) {
				return;
			}

			const issueKey = getIssueKey(card);
			const fromStatusId = getStatusId(card);

			// Only group-drag when the card the user grabbed is part of the
			// selection; dragging an unselected card behaves normally.
			dragging =
				issueKey && fromStatusId && selection.has(issueKey)
					? { issueKey, fromStatusId, snapshot: Array.from(selection) }
					: null;
		};

		const handleMouseUp = () => {
			if (!dragging) {
				return;
			}

			const { issueKey, fromStatusId, snapshot } = dragging;
			dragging = null;
			suppressNextClick = true;

			// rbd settles the drop asynchronously and the board then re-renders,
			// so poll for the dragged card turning up in a different column
			// rather than guessing a single delay.
			let waited = 0;

			const poll = () => {
				const card = findCard(issueKey);
				const statusId = card && getStatusId(card);

				if (statusId && statusId !== fromStatusId) {
					moveRest(snapshot, issueKey, statusId);
					clearSelection();
					return;
				}

				waited += DROP_POLL_MS;

				if (waited >= DROP_TIMEOUT_MS) {
					// Dropped back where it started, or cancelled: keep the
					// selection so the user can try again.
					suppressNextClick = false;
					return;
				}

				setTimeout(poll, DROP_POLL_MS);
			};

			setTimeout(poll, DROP_POLL_MS);
		};

		observeQuerySelector("#kanban", (kanban) => {
			for (const card of kanban.querySelectorAll(CARD_SELECTOR)) {
				card.classList.add(styles.card!);
			}

			// The board replaces cards on every render, so re-apply the selected
			// styling to whatever is on screen now.
			const observer = new MutationObserver(() => {
				for (const card of document.querySelectorAll(CARD_SELECTOR)) {
					card.classList.add(styles.card!);
				}

				render();
			});

			observer.observe(kanban, { childList: true, subtree: true });

			return () => {
				observer.disconnect();

				for (const card of document.querySelectorAll(`.${styles.card}`)) {
					card.classList.remove(styles.card!, styles.selected!);
				}

				badge?.remove();
				badge = null;
				selection.clear();
			};
		});

		addEventListener(document, "click", handleClick, { capture: true });
		addEventListener(document, "mousedown", handleMouseDown, { capture: true });
		addEventListener(document, "mouseup", handleMouseUp, { capture: true });
		addEventListener(document, "keydown", handleKeydown);
	},
});
