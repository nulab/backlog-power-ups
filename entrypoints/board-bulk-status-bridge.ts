import {
	type MoveRequest,
	type MoveResult,
	PING_EVENT,
	READY_EVENT,
	REQUEST_EVENT,
	RESULT_EVENT,
} from "@/plugins/boardBulkStatus/protocol";

/**
 * Runs in the page's own JavaScript world, injected by the boardBulkStatus
 * plugin.
 *
 * It exists only because of world isolation. Moving a card means replaying the
 * board's `onDragEnd`, which is reachable only through React's fiber, and
 * `__reactFiber$…` is an expando the page sets on the DOM node -- expandos are
 * not shared with a content script, only the nodes themselves are. So the
 * fiber work has to happen on this side.
 *
 * It is loaded as an extension file rather than an inline script because
 * Backlog's CSP is `script-src 'self' … chrome-extension://<id>/`: inline is
 * refused, the extension's own origin is allowed.
 */
const CARD_SELECTOR = "li.card";
const CARD_LINK_SELECTOR = "a.card-label";
const COLUMN_SELECTOR = "#kanban ul[data-statusid]";

const MAX_FIBER_DEPTH = 60;

type Fiber = {
	memoizedProps?: Record<string, unknown> | null;
	return?: Fiber | null;
};

const findCard = (issueKey: string): HTMLElement | null => {
	const link = document.querySelector(
		`#kanban ${CARD_SELECTOR} ${CARD_LINK_SELECTOR}[href$="/view/${issueKey}"]`,
	);
	const card = link?.closest(CARD_SELECTOR);

	return card instanceof HTMLElement ? card : null;
};

/** Walks up the fiber from `element`, returning the first non-null pick. */
const fiberPick = <T>(
	element: Element,
	pick: (props: Record<string, unknown>) => T | null,
): T | null => {
	const key = Object.keys(element).find((k) => k.startsWith("__reactFiber$"));

	if (!key) {
		return null;
	}

	// @ts-expect-error -- indexing the element by React's generated fiber key
	let fiber: Fiber | null = element[key] as Fiber;

	for (let i = 0; i < MAX_FIBER_DEPTH && fiber; i += 1) {
		const props = fiber.memoizedProps;

		if (props && typeof props === "object") {
			const found = pick(props);

			if (found !== null) {
				return found;
			}
		}

		fiber = fiber.return ?? null;
	}

	return null;
};

type DropResult = {
	draggableId: string;
	type: string;
	source: { droppableId: string; index: number };
	destination: { droppableId: string; index: number };
	reason: "DROP";
	mode: "FLUID";
	combine: null;
};

const getOnDragEnd = (card: Element) =>
	fiberPick(card, (props) =>
		typeof props.onDragEnd === "function"
			? (props.onDragEnd as (result: DropResult) => void)
			: null,
	);

const getDraggableId = (card: Element) =>
	fiberPick(card, (props) =>
		typeof props.draggableId === "string" ? props.draggableId : null,
	);

const move = (request: MoveRequest): MoveResult => {
	const moved: string[] = [];
	const failed: string[] = [];

	const probe = request.issueKeys
		.map((issueKey) => findCard(issueKey))
		.find((card) => card !== null);
	const onDragEnd = probe ? getOnDragEnd(probe) : null;

	if (!onDragEnd) {
		return {
			moved,
			failed: [...request.issueKeys],
			error: "onDragEnd not reachable on the board",
		};
	}

	for (const issueKey of request.issueKeys) {
		const card = findCard(issueKey);
		const column = card?.closest(COLUMN_SELECTOR);
		const statusId =
			column instanceof HTMLElement ? column.dataset.statusid : null;
		const draggableId = card ? getDraggableId(card) : null;

		if (!card || !column || !statusId || !draggableId) {
			failed.push(issueKey);
			continue;
		}

		if (statusId === request.toStatusId) {
			continue;
		}

		const siblings = Array.from(column.querySelectorAll(CARD_SELECTOR));

		onDragEnd({
			draggableId,
			type: "DEFAULT",
			source: { droppableId: statusId, index: siblings.indexOf(card) },
			destination: { droppableId: request.toStatusId, index: 0 },
			reason: "DROP",
			mode: "FLUID",
			combine: null,
		});

		moved.push(issueKey);
	}

	return { moved, failed };
};

const reply = (result: MoveResult) => {
	document.dispatchEvent(
		new CustomEvent(RESULT_EVENT, { detail: JSON.stringify(result) }),
	);
};

const announce = () => {
	document.dispatchEvent(new CustomEvent(READY_EVENT));
};

export default defineUnlistedScript(() => {
	document.addEventListener(PING_EVENT, announce);

	document.addEventListener(REQUEST_EVENT, (event) => {
		let request: MoveRequest;

		try {
			request = JSON.parse((event as CustomEvent<string>).detail);
		} catch {
			reply({
				moved: [],
				failed: [],
				error: "bridge could not read the request",
			});
			return;
		}

		reply(move(request));
	});

	announce();
});
