import type { IssueData } from "./extract-issue-data";

const COLOR_RED = "#E65050";
const COLOR_BLUE = "#4B91FA";
const COLOR_GREEN = "#69C955";

const TITLE_CONTAINER_WIDTH = 236;
const TITLE_LINE_HEIGHT = 20;
const TITLE_FONT = 'bold 14px "Open Sans", sans-serif';
const BASE_CARD_HEIGHT = 91;

export function resolveColor(type: string, priority: string): string {
	if (type === "バグ" || priority === "高") return COLOR_RED;
	if (priority === "低") return COLOR_GREEN;
	return COLOR_BLUE;
}

export function measureTitleHeight(text: string): number {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) return TITLE_LINE_HEIGHT;

	ctx.font = TITLE_FONT;

	let lines = 1;
	let currentWidth = 0;

	for (const segment of text.split(/(?<=\s)/)) {
		const segmentWidth = ctx.measureText(segment).width;

		if (segmentWidth > TITLE_CONTAINER_WIDTH) {
			// Handle words wider than container (overflow-wrap: break-word)
			for (const char of segment) {
				const charWidth = ctx.measureText(char).width;
				if (
					currentWidth + charWidth > TITLE_CONTAINER_WIDTH &&
					currentWidth > 0
				) {
					lines++;
					currentWidth = 0;
				}
				currentWidth += charWidth;
			}
		} else if (
			currentWidth + segmentWidth > TITLE_CONTAINER_WIDTH &&
			currentWidth > 0
		) {
			lines++;
			currentWidth = segmentWidth;
		} else {
			currentWidth += segmentWidth;
		}
	}

	return Math.min(lines, 2) * TITLE_LINE_HEIGHT;
}

export function buildCacooJson(issue: IssueData): string {
	const titleText = `${issue.key} ${issue.summary}`;
	const color = resolveColor(issue.type, issue.priority);
	const titleHeight = measureTitleHeight(titleText);
	const cardHeight = BASE_CARD_HEIGHT + titleHeight - TITLE_LINE_HEIGHT;

	const payload = {
		target: "shapes",
		sheetId: "generated",
		shapes: [
			{
				uid: crypto.randomUUID(),
				type: 12,
				keepAspectRatio: true,
				locked: false,
				bounds: {
					top: 3000,
					bottom: 3000 + cardHeight,
					left: 1100,
					right: 1360,
				},
				cardType: 0,
				cacoo: {
					title: {
						text: titleText,
						leading: 6,
						styles: [
							{
								index: 0,
								font: "Open Sans",
								size: 14,
								color: "2488fd",
								bold: true,
								underline: true,
							},
							{
								index: issue.key.length,
								font: "Open Sans",
								size: 14,
								color: "333333",
								bold: true,
							},
						],
						links: [
							{
								type: 1,
								to: issue.url,
								startIndex: 0,
								endIndex: issue.key.length - 1,
							},
						],
						height: titleHeight,
					},
					description: {
						text: "",
						leading: 6,
						styles: [
							{
								index: 0,
								font: "Open Sans",
								size: 12,
								color: "333333",
							},
						],
						links: [],
						height: 18,
					},
					expanded: false,
					primaryColor: color,
					secondaryColor: "#DCEBFF",
					dueDate: issue.dueDate ?? "",
					externalAccountId: "",
				},
			},
		],
	};

	return JSON.stringify(payload);
}
