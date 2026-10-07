export interface IssueData {
	key: string;
	summary: string;
	assignee: string;
	dueDate: string | null;
	type: string;
	priority: string;
	url: string;
}

/**
 * Backlog の課題ページから情報を取得する。
 *
 * セレクタは Backlog の現行 UI の data-testid 属性を使用している。
 * Classic UI には対応していない。
 */
export function extractIssueData(): IssueData {
	const key =
		document
			.querySelector<HTMLElement>("[data-testid='issueKey']")
			?.textContent?.trim() ?? "";

	const summary =
		document
			.querySelector<HTMLElement>("[data-testid='issueSummary']")
			?.textContent?.trim() ?? "";

	const assignee =
		document
			.querySelector<HTMLElement>("[data-testid='issueAssignee']")
			?.textContent?.trim() ?? "";

	const type =
		document
			.querySelector<HTMLElement>("[data-testid='issueType']")
			?.textContent?.trim() ?? "";

	const priority =
		document
			.querySelector<HTMLElement>("[data-testid='issuePriority']")
			?.textContent?.trim() ?? "";

	const dueDateEl = document.querySelector<HTMLElement>(
		"[data-testid='dueDate']",
	);
	const dueDate = extractDateValue(dueDateEl);

	const url = window.location.href;

	return { key, summary, assignee, dueDate, type, priority, url };
}

/**
 * Backlog の課題一覧テーブルの行から課題情報を取得する。
 *
 * 行内のリンク (`a[href*="/view/"]`) からキーと URL を、
 * リンクテキストが課題キーパターンに一致しないものをサマリとして取得する。
 */
export function extractIssueDataFromRow(row: HTMLTableRowElement): IssueData {
	const links = row.querySelectorAll<HTMLAnchorElement>('a[href*="/view/"]');

	let key = "";
	let summary = "";
	let url = window.location.href;

	for (const link of links) {
		const href = link.getAttribute("href") ?? "";
		const text = link.textContent?.trim() ?? "";

		if (/^[A-Z][A-Z_0-9]+-\d+$/.test(text)) {
			key = text;
			url = new URL(href, window.location.origin).href;
		} else if (!summary) {
			summary = text;
		}
	}

	return {
		key,
		summary,
		assignee: "",
		dueDate: null,
		type: "",
		priority: "",
		url,
	};
}

/**
 * 日付要素から日付値を取得する。
 *
 * Backlog の日付要素は `<span data-testid="dueDate"><span>期限日</span>2025/12/16</span>` の
 * 構造になっており、ラベル部分を除いた日付テキストを取得する。
 */
function extractDateValue(el: HTMLElement | null): string | null {
	if (!el) return null;
	const label = el.querySelector("span")?.textContent ?? "";
	const fullText = el.textContent?.trim() ?? "";
	const value = fullText.replace(label, "").trim();
	return value && value !== "-" ? value : null;
}
