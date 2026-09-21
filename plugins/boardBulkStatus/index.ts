import styles from "./index.module.css";
import { updateIssueStatus } from "./update-status";

/**
 * The board renders with emotion, so every visual class name is hashed
 * (`css-o6r3xa-col`) and unusable as a selector. These are the stable hooks:
 *
 * - `#kanban section[role="group"]` is a status column, `aria-label` is its name.
 * - `li.card` is a card, and is also the react-beautiful-dnd drag handle.
 * - `a.card-label[href="/view/KEY-1"]` carries the issue key.
 */
const COLUMN_SELECTOR = '#kanban section[role="group"]';
const CARD_SELECTOR = "li.card";
const CARD_LINK_SELECTOR = "a.card-label";

type Column = {
	element: HTMLElement;
	name: string;
	statusId: number;
};

type SelectedCard = {
	element: HTMLElement;
	issueKey: string;
};

const getIssueKey = (card: Element): string | null => {
	const href = card.querySelector(CARD_LINK_SELECTOR)?.getAttribute("href");

	return href?.match(/\/view\/([A-Z0-9_]+-\d+)/)?.[1] ?? null;
};

/**
 * Status ids are not present anywhere in the board's markup -- `aria-label`
 * only gives the display name, and projects can define custom statuses, so the
 * built-in 1..4 ids cannot be assumed. The id is read off the React fiber the
 * board already keeps on the column element. If React's internals ever move,
 * this returns null and the plugin stays inert rather than guessing an id and
 * moving issues to the wrong status.
 */
const getStatusId = (column: Element): number | null => {
	const fiberKey = Object.keys(column).find((key) =>
		key.startsWith("__reactFiber$"),
	);

	if (!fiberKey) {
		return null;
	}

	const seen = new WeakSet<object>();

	const findStatusId = (value: unknown, depth: number): number | null => {
		if (depth > 12 || typeof value !== "object" || value === null) {
			return null;
		}

		if (seen.has(value)) {
			return null;
		}

		seen.add(value);

		for (const [key, child] of Object.entries(value)) {
			if (
				key === "status" &&
				typeof child === "object" &&
				child !== null &&
				typeof (child as { id?: unknown }).id === "number"
			) {
				return (child as { id: number }).id;
			}

			const nested = findStatusId(child, depth + 1);

			if (nested !== null) {
				return nested;
			}
		}

		return null;
	};

	// @ts-expect-error -- indexing the React fiber by its generated key
	let fiber = column[fiberKey];

	for (let i = 0; i < 12 && fiber; i += 1) {
		const fromProps = findStatusId(fiber.memoizedProps, 0);

		if (fromProps !== null) {
			return fromProps;
		}

		fiber = fiber.return;
	}

	return null;
};

const getColumns = (): Column[] =>
	Array.from(document.querySelectorAll(COLUMN_SELECTOR))
		.filter((column) => column instanceof HTMLElement)
		.flatMap((column) => {
			const name = column.getAttribute("aria-label");
			const statusId = getStatusId(column);

			if (!name || statusId === null) {
				return [];
			}

			return [{ element: column, name, statusId }];
		});

const getCsrfToken = (): string | null =>
	document.querySelector<HTMLInputElement>(
		'#csrfTokenForm input[name="csrf-token"]',
	)?.value ?? null;

export const boardBulkStatus = definePowerUpsPlugin({
	group: "board",
	allFrames: true,
	matches: ["/board/*"],
	main({ observeQuerySelector, addEventListener }) {
		const selection = new Map<string, SelectedCard>();
		let anchor: HTMLElement | null = null;
		let bar: HTMLElement | null = null;

		const getCardsInColumn = (column: Element): HTMLElement[] =>
			Array.from(column.querySelectorAll(CARD_SELECTOR)).filter(
				(card) => card instanceof HTMLElement,
			);

		const render = () => {
			for (const card of document.querySelectorAll(CARD_SELECTOR)) {
				const issueKey = getIssueKey(card);

				card.classList.toggle(
					styles.selected!,
					issueKey !== null && selection.has(issueKey),
				);
			}

			renderBar();
		};

		const clearSelection = () => {
			selection.clear();
			anchor = null;
			render();
		};

		const toggle = (card: HTMLElement) => {
			const issueKey = getIssueKey(card);

			if (!issueKey) {
				return;
			}

			if (selection.has(issueKey)) {
				selection.delete(issueKey);
			} else {
				selection.set(issueKey, { element: card, issueKey });
			}

			anchor = card;
		};

		const selectRange = (card: HTMLElement) => {
			const column = card.closest(COLUMN_SELECTOR);

			if (!column || !anchor || !column.contains(anchor)) {
				toggle(card);
				return;
			}

			const cards = getCardsInColumn(column);
			const from = cards.indexOf(anchor);
			const to = cards.indexOf(card);

			if (from === -1 || to === -1) {
				toggle(card);
				return;
			}

			for (const inRange of cards.slice(
				Math.min(from, to),
				Math.max(from, to) + 1,
			)) {
				const issueKey = getIssueKey(inRange);

				if (issueKey) {
					selection.set(issueKey, { element: inRange, issueKey });
				}
			}
		};

		const handleClick = (event: MouseEvent) => {
			const target = event.target;

			if (!(target instanceof Element)) {
				return;
			}

			const card = target.closest(CARD_SELECTOR);

			if (!(card instanceof HTMLElement)) {
				// A click anywhere else on the page drops the selection.
				if (selection.size > 0 && !target.closest(`.${styles.bar}`)) {
					clearSelection();
				}

				return;
			}

			const isRange = event.shiftKey;
			const isToggle = event.ctrlKey || event.metaKey;

			// A plain click with nothing selected is left alone so the card's
			// link keeps working. Selection only starts from a modifier.
			if (!isRange && !isToggle && selection.size === 0) {
				return;
			}

			// Stop the card link from opening a tab, and stop Backlog's own
			// handler from treating this as "open the issue".
			event.preventDefault();
			event.stopPropagation();

			if (isRange) {
				selectRange(card);
			} else {
				toggle(card);
			}

			render();
		};

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && selection.size > 0) {
				clearSelection();
			}
		};

		const apply = async (statusId: number) => {
			const csrfToken = getCsrfToken();

			if (!csrfToken) {
				throw new Error("csrf token not found");
			}

			const issueKeys = Array.from(selection.keys());

			// Sequential on purpose: Backlog rejects concurrent writes to the
			// same project with a version conflict, and a partial failure is
			// easier to report when the order is known.
			for (const issueKey of issueKeys) {
				await updateIssueStatus(issueKey, statusId, csrfToken);
			}
		};

		function renderBar() {
			if (selection.size === 0) {
				bar?.remove();
				bar = null;
				return;
			}

			const columns = getColumns();

			if (!bar) {
				bar = document.createElement("div");
				bar.className = styles.bar!;
				document.body.appendChild(bar);
			}

			bar.textContent = "";

			const count = document.createElement("span");
			count.className = styles.count!;
			count.textContent = i18n.t("boardBulkStatus.selected", [
				String(selection.size),
			]);

			const select = document.createElement("select");
			select.className = styles.select!;

			for (const column of columns) {
				const option = document.createElement("option");
				option.value = String(column.statusId);
				option.textContent = column.name;
				select.appendChild(option);
			}

			const applyButton = document.createElement("button");
			applyButton.type = "button";
			applyButton.className = styles.apply!;
			applyButton.textContent = i18n.t("boardBulkStatus.apply");
			applyButton.addEventListener("click", async () => {
				applyButton.disabled = true;

				try {
					await apply(Number(select.value));
					clearSelection();
					location.reload();
				} catch (error) {
					logger.error(error);
					applyButton.disabled = false;

					const message = document.createElement("span");
					message.className = styles.error!;
					message.textContent = i18n.t("boardBulkStatus.failed");
					bar?.appendChild(message);
				}
			});

			const clearButton = document.createElement("button");
			clearButton.type = "button";
			clearButton.className = styles.clear!;
			clearButton.textContent = i18n.t("boardBulkStatus.clear");
			clearButton.addEventListener("click", clearSelection);

			bar.append(count, select, applyButton, clearButton);
		}

		observeQuerySelector("#kanban", (kanban) => {
			for (const card of kanban.querySelectorAll(CARD_SELECTOR)) {
				card.classList.add(styles.card!);
			}

			return () => {
				for (const card of document.querySelectorAll(`.${styles.card}`)) {
					card.classList.remove(styles.card!, styles.selected!);
				}

				bar?.remove();
				bar = null;
				selection.clear();
			};
		});

		addEventListener(document, "click", handleClick, { capture: true });
		addEventListener(document, "keydown", handleKeydown);
	},
});
