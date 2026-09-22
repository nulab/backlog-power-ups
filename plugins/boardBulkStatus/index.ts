import styles from "./index.module.css";
import { buildDropResult, getDraggableId, getOnDragEnd } from "./react-dnd";

/**
 * The board renders with emotion, so every visual class name is hashed
 * (`css-o6r3xa-col`) and unusable as a selector. These are the stable hooks:
 *
 * - `#kanban ul[data-statusid]` is a status column, carrying the status id.
 * - `li.card` is a card, and is also the react-beautiful-dnd drag handle.
 * - `a.card-label[href="/view/KEY-1"]` carries the issue key.
 */
const COLUMN_SELECTOR = "#kanban ul[data-statusid]";
const CARD_SELECTOR = "li.card";
const CARD_LINK_SELECTOR = "a.card-label";

/** Pointer travel past which a gesture counts as a drag rather than a click. */
const DRAG_THRESHOLD_PX = 5;
/** Settling time after the board mutates, before reading the new layout. */
const SETTLE_MS = 150;

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
		/** Issue key -> the status it was in when it was selected. */
		const baseline = new Map<string, string>();
		let anchorKey: string | null = null;
		let badge: HTMLElement | null = null;
		/** Set while replaying, so our own moves do not re-trigger detection. */
		let applying = false;

		const snapshotStatuses = () => {
			baseline.clear();

			for (const issueKey of selection) {
				const card = findCard(issueKey);
				const statusId = card && getStatusId(card);

				if (statusId) {
					baseline.set(issueKey, statusId);
				}
			}
		};

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

		const paint = () => {
			for (const card of document.querySelectorAll(CARD_SELECTOR)) {
				const issueKey = getIssueKey(card);

				card.classList.add(styles.card!);
				card.classList.toggle(
					styles.selected!,
					issueKey !== null && selection.has(issueKey),
				);
			}

			renderBadge();
		};

		const render = () => {
			paint();
			snapshotStatuses();
		};

		const clearSelection = () => {
			selection.clear();
			baseline.clear();
			anchorKey = null;
			paint();
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

		/**
		 * Moves the rest of the selection into `toStatusId` by replaying the
		 * board's own drag handler once per card, so Backlog performs the update
		 * through the same path as a manual drag.
		 */
		const moveRest = (draggedKey: string, toStatusId: string) => {
			const reference = Array.from(selection)
				.map((issueKey) => findCard(issueKey))
				.find((card) => card !== null);
			const onDragEnd = reference ? getOnDragEnd(reference) : null;

			if (!onDragEnd) {
				logger.debug("boardBulkStatus: onDragEnd not reachable");
				return;
			}

			for (const issueKey of selection) {
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

		/**
		 * The drag is left entirely to the board. Rather than tracking rbd's
		 * mouse handling, we watch for a selected card turning up in a different
		 * column than it was selected in -- that is the user having dragged it --
		 * and bring the rest of the selection along.
		 */
		const detectMove = () => {
			if (applying || selection.size === 0) {
				return;
			}

			for (const issueKey of selection) {
				const card = findCard(issueKey);
				const now = card && getStatusId(card);
				const was = baseline.get(issueKey);

				if (!now || !was || now === was) {
					continue;
				}

				applying = true;

				try {
					moveRest(issueKey, now);
				} finally {
					applying = false;
					clearSelection();
				}

				return;
			}
		};

		// A drag ends with a click on the dropped card. That click must not be
		// read as "plain click, so clear the selection", or the selection is gone
		// before the move is detected.
		let pointerStart: { x: number; y: number } | null = null;
		let didDrag = false;

		const handlePointerDown = (event: PointerEvent) => {
			pointerStart = { x: event.clientX, y: event.clientY };
			didDrag = false;
		};

		const handlePointerMove = (event: PointerEvent) => {
			if (!pointerStart || didDrag) {
				return;
			}

			const dx = event.clientX - pointerStart.x;
			const dy = event.clientY - pointerStart.y;

			if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
				didDrag = true;
			}
		};

		const handleClick = (event: MouseEvent) => {
			const target = event.target;

			if (!(target instanceof Element)) {
				return;
			}

			if (didDrag) {
				// Came from a drag, not a click. Leave the selection alone and let
				// the board finish; detectMove picks the drop up from the DOM.
				didDrag = false;
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

		observeQuerySelector("#kanban", (kanban) => {
			paint();

			let settle: ReturnType<typeof setTimeout> | null = null;

			const observer = new MutationObserver(() => {
				// The board mutates continuously while a card is in flight, so
				// read the layout only once it has stopped moving.
				if (settle !== null) {
					clearTimeout(settle);
				}

				settle = setTimeout(() => {
					settle = null;
					paint();
					detectMove();
				}, SETTLE_MS);
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
				baseline.clear();
			};
		});

		addEventListener(document, "click", handleClick, { capture: true });
		addEventListener(document, "pointerdown", handlePointerDown, {
			capture: true,
		});
		addEventListener(document, "pointermove", handlePointerMove, {
			capture: true,
		});
		addEventListener(document, "keydown", handleKeydown);
	},
});
