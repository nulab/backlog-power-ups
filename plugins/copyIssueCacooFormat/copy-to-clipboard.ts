/**
 * copy イベントを利用してカスタム MIME タイプでクリップボードにデータを書き込む。
 *
 * navigator.clipboard.write() は標準 MIME タイプ（text/plain, text/html, image/png）
 * のみ許可しており、cacoo/shape のような非標準 MIME タイプは書き込めない。
 * 確実に動作する document.execCommand('copy') + copy イベントハンドラ方式を採用する。
 */
export function copyToClipboard(cacooJson: string, plainText: string): void {
	const handler = (e: Event) => {
		if (!(e instanceof ClipboardEvent)) return;
		e.preventDefault();
		e.clipboardData?.setData("cacoo/shape", cacooJson);
		e.clipboardData?.setData("text/plain", plainText);
	};

	document.addEventListener("copy", handler);
	document.execCommand("copy");
	document.removeEventListener("copy", handler);
}
