import "./inject-issue-key-button.css";
import type { PowerUpsPluginContext } from "@/helpers/plugin/context";

const ISSUE_KEY_BUTTON_CONTAINER_CLASS = "ticket__key-copy";
const ISSUE_KEY_BUTTON_MAX = 5;
const ISSUE_KEY_BUTTON_DATA_ATTR = "data-power-ups-key";

interface IssueButtonOptions<T = void> {
	/** ボタンの一意識別子（重複チェックに使用） */
	key: string;
	/** ツールチップテキスト */
	tooltip: string;
	/** アイコンの SVG 文字列（`<svg>...</svg>`） */
	svg: string;
	/** 課題詳細ページのボタンがクリックされたときのハンドラ */
	onClick: () => T;
	/** 課題一覧ページのボタンがクリックされたときのハンドラ。引数に行要素を受け取る */
	onListClick: (row: HTMLTableRowElement) => T;
	/** 一覧ボタンに追加する CSS クラス */
	listButtonClass?: string;
}

/**
 * 課題の詳細ページと一覧ページの両方にボタンを挿入するユーティリティ。
 *
 * `observeQuerySelector` を使って `#copyKey-help`（詳細）と
 * `.cell-hover-actions`（一覧）を監視し、それぞれにボタンを挿入する。
 */
export const injectIssueButton = <T = void>(
	observeQuerySelector: PowerUpsPluginContext["observeQuerySelector"],
	options: IssueButtonOptions<T>,
): void => {
	// 課題詳細ページ: #copyKey-help の横にボタンを挿入
	observeQuerySelector("#copyKey-help", (anchor) => {
		const button = createButton(
			html`
				<button
					type="button"
					class="icon-button icon-button--default | simptip-position-right simptip-movable simptip-smooth"
					data-tooltip=${options.tooltip}
				>
					<span class="copy-trigger">${options.svg}</span>
				</button>
			`,
			{
				click: () => options.onClick(),
			},
		);

		injectIssueKeyButton(anchor, options.key, button);
	});

	// 課題一覧ページ: 各行の cell-hover-actions にボタンを挿入
	observeQuerySelector(".cell-hover-actions", (hoverActions) => {
		const row = hoverActions.closest<HTMLTableRowElement>("tr");
		if (!row) return;

		const classes = [
			options.listButtonClass,
			"simptip-position-top simptip-movable simptip-smooth",
		]
			.filter(Boolean)
			.join(" | ");

		const button = createButton(
			html`
				<button
					type="button"
					class=${classes}
					data-tooltip=${options.tooltip}
				>
					${options.svg}
				</button>
			`,
			{
				click: (e) => {
					e.preventDefault();
					e.stopPropagation();
					options.onListClick(row);
				},
			},
		);

		injectIssueListButton(hoverActions, options.key, button);
	});
};

/**
 * 課題キーの横にボタンを追加する。
 *
 * `#copyKey-help` の後に `.ticket__key-copy` ラッパーでボタンを挿入する。
 * 同じ `key` のボタンが既に存在する場合は追加しない。
 * 最大 {@link ISSUE_KEY_BUTTON_MAX} 件まで追加できる。
 *
 * CSS 側で各ボタンの位置は `:nth-child(n of .ticket__key-copy)` の
 * `translateX` で自動的にずらされる。
 */
const injectIssueKeyButton = (
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

/**
 * 課題一覧の `.cell-hover-actions` にボタンを追加する。
 *
 * 同じ `key` のボタンが既に存在する場合は追加しない。
 * `mousedown` の伝播を止めて親の `<a>` タグが発火しないようにする。
 */
const injectIssueListButton = (
	hoverActions: Element,
	key: string,
	button: HTMLButtonElement,
): boolean => {
	// 重複チェック
	if (hoverActions.querySelector(`[${ISSUE_KEY_BUTTON_DATA_ATTR}='${key}']`)) {
		return false;
	}

	button.setAttribute(ISSUE_KEY_BUTTON_DATA_ATTR, key);

	button.addEventListener("mousedown", (e) => {
		e.preventDefault();
		e.stopPropagation();
	});

	hoverActions.appendChild(button);

	return true;
};
