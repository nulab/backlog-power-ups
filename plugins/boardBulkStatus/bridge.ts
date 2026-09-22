import {
	BRIDGE_SCRIPT,
	type MoveResult,
	PING_EVENT,
	READY_EVENT,
	REQUEST_EVENT,
	RESULT_EVENT,
} from "./protocol";

/**
 * Content-script half of the page-world bridge. See
 * `entrypoints/board-bulk-status-bridge.ts` for why the bridge exists and why
 * it is loaded as an extension file rather than an inline script.
 *
 * Injection can still fail -- a space with a stricter CSP, or the resource not
 * being web-accessible -- so readiness is confirmed rather than assumed, and
 * every call is bounded by a timeout. Nothing here hangs without saying why.
 */
const READY_TIMEOUT_MS = 2000;
const MOVE_TIMEOUT_MS = 10000;

export type { MoveResult };

const waitFor = (event: string, timeoutMs: number): Promise<Event | null> =>
	new Promise((resolve) => {
		const timer = window.setTimeout(() => {
			document.removeEventListener(event, onEvent);
			resolve(null);
		}, timeoutMs);

		const onEvent = (received: Event) => {
			window.clearTimeout(timer);
			document.removeEventListener(event, onEvent);
			resolve(received);
		};

		document.addEventListener(event, onEvent);
	});

/**
 * Injects the page-world bridge and resolves once it has announced itself, or
 * false if it never did.
 */
export const installBridge = async (): Promise<boolean> => {
	const ready = waitFor(READY_EVENT, READY_TIMEOUT_MS);

	const script = document.createElement("script");
	script.src = browser.runtime.getURL(`/${BRIDGE_SCRIPT}`);
	script.addEventListener("load", () => script.remove());
	document.documentElement.appendChild(script);

	// A bridge injected before a client-side navigation is still listening and
	// will only answer a ping, since it does not run twice.
	document.dispatchEvent(new CustomEvent(PING_EVENT));

	return (await ready) !== null;
};

/** Asks the page-world bridge to move `issueKeys` into `toStatusId`. */
export const requestMove = async (
	issueKeys: string[],
	toStatusId: string,
): Promise<MoveResult> => {
	const result = waitFor(RESULT_EVENT, MOVE_TIMEOUT_MS);

	document.dispatchEvent(
		new CustomEvent(REQUEST_EVENT, {
			detail: JSON.stringify({ issueKeys, toStatusId }),
		}),
	);

	const received = await result;

	if (received === null) {
		return {
			moved: [],
			failed: issueKeys,
			error: "page-world bridge did not answer",
		};
	}

	try {
		return JSON.parse((received as CustomEvent<string>).detail);
	} catch {
		return {
			moved: [],
			failed: issueKeys,
			error: "could not read the bridge result",
		};
	}
};
