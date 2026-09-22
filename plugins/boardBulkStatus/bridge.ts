/**
 * The board is a react-beautiful-dnd surface, and the cleanest way to move a
 * card is to replay the board's own `onDragEnd` -- Backlog then persists the
 * change through exactly the same path as a manual drag, so permissions,
 * validation and optimistic UI all stay its responsibility.
 *
 * That handler is only reachable through React's fiber, which a content script
 * cannot see: `__reactFiber$…` is an expando the page sets on the DOM node, and
 * expandos are not shared across the isolated world boundary. So the fiber work
 * runs in a small script injected into the page's own world, and the content
 * script talks to it over CustomEvents.
 *
 * `detail` is a JSON string in both directions, to avoid relying on structured
 * cloning of objects across that boundary.
 */
const REQUEST_EVENT = "powerups-board-bulk-status-move";
const RESULT_EVENT = "powerups-board-bulk-status-moved";

export type MoveResult = {
	moved: string[];
	failed: string[];
};

/**
 * Runs in the page's world. Kept as a self-contained source string because it
 * cannot close over anything from the content script.
 */
const BRIDGE_SOURCE = `(() => {
	if (window.__powerUpsBoardBulkStatus) return;
	window.__powerUpsBoardBulkStatus = true;

	var CARD = "li.card";
	var LINK = "a.card-label";
	var COL = "#kanban ul[data-statusid]";

	function findCard(issueKey) {
		var link = document.querySelector(
			"#kanban " + CARD + " " + LINK + '[href$="/view/' + issueKey + '"]'
		);
		return link ? link.closest(CARD) : null;
	}

	function fiberPick(el, pick) {
		var key = Object.keys(el).find(function (k) {
			return k.indexOf("__reactFiber$") === 0;
		});
		if (!key) return null;
		var fiber = el[key];
		for (var i = 0; i < 60 && fiber; i += 1) {
			var props = fiber.memoizedProps;
			if (props && typeof props === "object") {
				var found = pick(props);
				if (found != null) return found;
			}
			fiber = fiber.return;
		}
		return null;
	}

	document.addEventListener("${REQUEST_EVENT}", function (event) {
		var moved = [];
		var failed = [];
		var request;

		try {
			request = JSON.parse(event.detail);
		} catch (e) {
			return;
		}

		var onDragEnd = null;
		for (var i = 0; i < request.issueKeys.length && !onDragEnd; i += 1) {
			var probe = findCard(request.issueKeys[i]);
			if (probe) {
				onDragEnd = fiberPick(probe, function (p) {
					return typeof p.onDragEnd === "function" ? p.onDragEnd : null;
				});
			}
		}

		if (onDragEnd) {
			request.issueKeys.forEach(function (issueKey) {
				var card = findCard(issueKey);
				var column = card ? card.closest(COL) : null;
				var statusId = column ? column.dataset.statusid : null;
				var draggableId = card
					? fiberPick(card, function (p) {
							return typeof p.draggableId === "string" ? p.draggableId : null;
						})
					: null;

				if (!card || !column || !statusId || !draggableId) {
					failed.push(issueKey);
					return;
				}

				if (statusId === request.toStatusId) return;

				var siblings = Array.prototype.slice.call(
					column.querySelectorAll(CARD)
				);

				onDragEnd({
					draggableId: draggableId,
					type: "DEFAULT",
					source: { droppableId: statusId, index: siblings.indexOf(card) },
					destination: { droppableId: request.toStatusId, index: 0 },
					reason: "DROP",
					mode: "FLUID",
					combine: null,
				});

				moved.push(issueKey);
			});
		} else {
			failed = request.issueKeys.slice();
		}

		document.dispatchEvent(
			new CustomEvent("${RESULT_EVENT}", {
				detail: JSON.stringify({ moved: moved, failed: failed }),
			})
		);
	});
})();`;

/** Injects the page-world bridge. Safe to call more than once. */
export const installBridge = (): void => {
	const script = document.createElement("script");
	script.textContent = BRIDGE_SOURCE;
	document.documentElement.appendChild(script);
	script.remove();
};

/** Asks the page-world bridge to move `issueKeys` into `toStatusId`. */
export const requestMove = (
	issueKeys: string[],
	toStatusId: string,
): Promise<MoveResult> =>
	new Promise((resolve) => {
		const onResult = (event: Event) => {
			document.removeEventListener(RESULT_EVENT, onResult);

			try {
				resolve(JSON.parse((event as CustomEvent<string>).detail));
			} catch {
				resolve({ moved: [], failed: issueKeys });
			}
		};

		document.addEventListener(RESULT_EVENT, onResult, { once: true });

		document.dispatchEvent(
			new CustomEvent(REQUEST_EVENT, {
				detail: JSON.stringify({ issueKeys, toStatusId }),
			}),
		);
	});
