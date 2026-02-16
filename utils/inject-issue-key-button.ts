const ISSUE_KEY_BUTTON_CONTAINER_CLASS = "ticket__key-copy";
const ISSUE_KEY_BUTTON_MAX = 5;
const ISSUE_KEY_BUTTON_DATA_ATTR = "data-power-ups-key";

/**
 * 課題キーの横にボタンを追加するユーティリティ。
 *
 * `#copyKey-help` の後に `.ticket__key-copy` ラッパーでボタンを挿入する。
 * 同じ `key` のボタンが既に存在する場合は追加しない。
 * 最大 {@link ISSUE_KEY_BUTTON_MAX} 件まで追加できる。
 *
 * CSS 側で各ボタンの位置は `:nth-child(n of .ticket__key-copy)` の
 * `translateX` で自動的にずらされる。
 *
 * @param anchor - `#copyKey-help` 要素
 * @param key - ボタンの一意識別子（重複チェックに使用）
 * @param button - 挿入するボタン要素
 * @returns 挿入できた場合 `true`
 */
export const injectIssueKeyButton = (
	anchor: Element,
	key: string,
	button: HTMLButtonElement,
): boolean => {
	const container = anchor.parentElement;
	if (!container) return false;

	// 重複チェック
	if (container.querySelector(`[${ISSUE_KEY_BUTTON_DATA_ATTR}='${key}']`)) {
		return false;
	}

	// 上限チェック（#copyKey-help 自体を除いた .ticket__key-copy の数）
	const existing = container.querySelectorAll(
		`.${ISSUE_KEY_BUTTON_CONTAINER_CLASS}:not(#copyKey-help)`,
	);
	if (existing.length >= ISSUE_KEY_BUTTON_MAX) {
		return false;
	}

	const wrapper = document.createElement("span");
	wrapper.className = `copy-key-btn ${ISSUE_KEY_BUTTON_CONTAINER_CLASS}`;
	wrapper.setAttribute(ISSUE_KEY_BUTTON_DATA_ATTR, key);
	wrapper.appendChild(button);

	// 既存の追加ボタンの末尾、または #copyKey-help の直後に挿入
	const lastCopy = container.querySelector(
		`.${ISSUE_KEY_BUTTON_CONTAINER_CLASS}:not(#copyKey-help):last-of-type`,
	);
	if (lastCopy) {
		lastCopy.insertAdjacentElement("afterend", wrapper);
	} else {
		anchor.insertAdjacentElement("afterend", wrapper);
	}

	return true;
};
