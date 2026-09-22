/**
 * Wire format between the content script and the page-world bridge.
 *
 * `detail` is a JSON string in both directions rather than an object: the two
 * sides live in different JavaScript worlds, and a string needs no structured
 * cloning to survive the boundary.
 */
export const REQUEST_EVENT = "powerups-board-bulk-status-move";
export const RESULT_EVENT = "powerups-board-bulk-status-moved";
export const READY_EVENT = "powerups-board-bulk-status-ready";
export const PING_EVENT = "powerups-board-bulk-status-ping";

/** Built to match the file name wxt emits for the unlisted script. */
export const BRIDGE_SCRIPT = "board-bulk-status-bridge.js";

export type MoveRequest = {
	issueKeys: string[];
	toStatusId: string;
};

export type MoveResult = {
	moved: string[];
	failed: string[];
	/** Set when the page-world bridge could not do the work, or never answered. */
	error?: string;
};
