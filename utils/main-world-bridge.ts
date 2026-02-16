const EVENT_PREFIX = "backlog-power-ups:main-world";

type ActionMap = {
	"show-status-message": string;
};

/**
 * isolated world から main world へアクションを送信する。
 *
 * content script は isolated world で動作するため、ページコンテキストの
 * グローバル変数（`Backlog` など）に直接アクセスできない。
 * このユーティリティは CustomEvent 経由で `main-world-bridge` entrypoint に
 * アクションをディスパッチする。
 */
export function dispatchMainWorld<K extends keyof ActionMap>(
	action: K,
	payload: ActionMap[K],
): void {
	window.dispatchEvent(
		new CustomEvent(`${EVENT_PREFIX}:${action}`, { detail: payload }),
	);
}

/**
 * Backlog の StatusBar にメッセージを表示する。
 */
export function showStatusMessage(text: string): void {
	dispatchMainWorld("show-status-message", text);
}
