/**
 * The board is a react-beautiful-dnd surface. Rather than reimplementing the
 * status update -- which would mean reverse engineering Backlog's own POST and
 * its CSRF handling -- the extra cards are moved by replaying the board's own
 * `onDragEnd` handler. Backlog then persists them through exactly the same code
 * path as a manual drag, so permissions, validation and optimistic UI all stay
 * its responsibility.
 *
 * Reaching the handler means walking the React fiber, which is private API. The
 * walk is deliberately defensive: every accessor returns null instead of
 * throwing, and the caller treats null as "do nothing", so a React upgrade
 * degrades this plugin to plain single-card dragging rather than breaking the
 * board.
 */

type DropResult = {
	draggableId: string;
	type: string;
	source: { droppableId: string; index: number };
	destination: { droppableId: string; index: number };
	reason: "DROP";
	mode: "FLUID";
	combine: null;
};

type Fiber = {
	memoizedProps?: Record<string, unknown> | null;
	return?: Fiber | null;
};

const MAX_FIBER_DEPTH = 60;

const getFiber = (element: Element): Fiber | null => {
	const key = Object.keys(element).find((k) => k.startsWith("__reactFiber$"));

	// @ts-expect-error -- indexing the element by React's generated fiber key
	return key ? ((element[key] as Fiber) ?? null) : null;
};

/**
 * Walks up from `element` and returns the first fiber whose props satisfy
 * `predicate`.
 */
const findInAncestors = <T>(
	element: Element,
	predicate: (props: Record<string, unknown>) => T | null,
): T | null => {
	let fiber = getFiber(element);

	for (let i = 0; i < MAX_FIBER_DEPTH && fiber; i += 1) {
		const props = fiber.memoizedProps;

		if (props && typeof props === "object") {
			const result = predicate(props);

			if (result !== null) {
				return result;
			}
		}

		fiber = fiber.return ?? null;
	}

	return null;
};

/** The board's own drag handler, as passed to rbd's `DragDropContext`. */
export const getOnDragEnd = (
	card: Element,
): ((result: DropResult) => void) | null =>
	findInAncestors(card, (props) =>
		typeof props.onDragEnd === "function"
			? (props.onDragEnd as (result: DropResult) => void)
			: null,
	);

/**
 * rbd identifies a card by the board's internal card id, which is not rendered
 * as an attribute -- only the issue key is. It has to come off the fiber.
 */
export const getDraggableId = (card: Element): string | null =>
	findInAncestors(card, (props) =>
		typeof props.draggableId === "string" ? props.draggableId : null,
	);

export const buildDropResult = (
	draggableId: string,
	from: { statusId: string; index: number },
	toStatusId: string,
): DropResult => ({
	draggableId,
	type: "DEFAULT",
	source: { droppableId: from.statusId, index: from.index },
	// Appended to the end of the target column; the board reorders on reload.
	destination: { droppableId: toStatusId, index: 0 },
	reason: "DROP",
	mode: "FLUID",
	combine: null,
});
